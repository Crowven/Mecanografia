const DEFAULT_PREFIX = 'mecanografia';
const DB_NAME = 'mecanografia-storage';
const DB_VERSION = 1;
const TEST_RESULTS_STORE = 'testResults';

const DEFAULT_CONFIG = Object.freeze({
  theme: 'system',
  language: 'es',
  soundEnabled: true,
  showKeyboard: true,
  difficulty: 'normal',
});

function nowIso() {
  return new Date().toISOString();
}

function createId(prefix = 'id') {
  const random = typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function'
    ? crypto.randomUUID()
    : `${Date.now()}-${Math.random().toString(36).slice(2)}`;
  return `${prefix}_${random}`;
}

function getBrowserLocalStorage() {
  if (typeof globalThis !== 'undefined' && globalThis.localStorage) {
    return globalThis.localStorage;
  }
  return undefined;
}

function parseStoredJson(value, fallback) {
  if (value == null || value === '') return fallback;
  try {
    return JSON.parse(value);
  } catch {
    return fallback;
  }
}

function assertPlainObject(value, name) {
  if (value == null || typeof value !== 'object' || Array.isArray(value)) {
    throw new TypeError(`${name} debe ser un objeto JSON.`);
  }
}

function normalizeResult(result) {
  assertPlainObject(result, 'El resultado de prueba');
  const timestamp = result.createdAt || nowIso();
  return {
    id: result.id || createId('result'),
    createdAt: timestamp,
    updatedAt: result.updatedAt || timestamp,
    exerciseId: result.exerciseId || null,
    mode: result.mode || 'practice',
    durationMs: Number(result.durationMs || 0),
    charactersTyped: Number(result.charactersTyped || 0),
    correctCharacters: Number(result.correctCharacters || 0),
    errors: Number(result.errors || 0),
    wpm: Number(result.wpm || 0),
    accuracy: Number(result.accuracy || 0),
    raw: result.raw || null,
  };
}

function requestToPromise(request) {
  return new Promise((resolve, reject) => {
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error || new Error('Error en IndexedDB'));
  });
}

function transactionDone(transaction) {
  return new Promise((resolve, reject) => {
    transaction.oncomplete = () => resolve();
    transaction.onerror = () => reject(transaction.error || new Error('Transacción IndexedDB fallida'));
    transaction.onabort = () => reject(transaction.error || new Error('Transacción IndexedDB abortada'));
  });
}

export class IndexedDBHistoryStore {
  constructor({ dbName = DB_NAME, version = DB_VERSION } = {}) {
    this.dbName = dbName;
    this.version = version;
    this.dbPromise = null;
  }

  isSupported() {
    return typeof globalThis !== 'undefined' && !!globalThis.indexedDB;
  }

  async open() {
    if (!this.isSupported()) {
      throw new Error('IndexedDB no está disponible en este entorno.');
    }
    if (this.dbPromise) return this.dbPromise;

    this.dbPromise = new Promise((resolve, reject) => {
      const request = globalThis.indexedDB.open(this.dbName, this.version);
      request.onupgradeneeded = () => {
        const db = request.result;
        if (!db.objectStoreNames.contains(TEST_RESULTS_STORE)) {
          const store = db.createObjectStore(TEST_RESULTS_STORE, { keyPath: 'id' });
          store.createIndex('createdAt', 'createdAt', { unique: false });
          store.createIndex('exerciseId', 'exerciseId', { unique: false });
        }
      };
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error || new Error('No se pudo abrir IndexedDB'));
    });

    return this.dbPromise;
  }

  async add(result) {
    const db = await this.open();
    const normalized = normalizeResult(result);
    const transaction = db.transaction(TEST_RESULTS_STORE, 'readwrite');
    transaction.objectStore(TEST_RESULTS_STORE).put(normalized);
    await transactionDone(transaction);
    return normalized;
  }

  async list({ limit, exerciseId } = {}) {
    const db = await this.open();
    const transaction = db.transaction(TEST_RESULTS_STORE, 'readonly');
    const store = transaction.objectStore(TEST_RESULTS_STORE);
    const values = await requestToPromise(store.getAll());
    await transactionDone(transaction);
    let results = values.sort((a, b) => String(b.createdAt).localeCompare(String(a.createdAt)));
    if (exerciseId) results = results.filter((item) => item.exerciseId === exerciseId);
    if (Number.isFinite(limit)) results = results.slice(0, Number(limit));
    return results;
  }

  async clear() {
    const db = await this.open();
    const transaction = db.transaction(TEST_RESULTS_STORE, 'readwrite');
    transaction.objectStore(TEST_RESULTS_STORE).clear();
    await transactionDone(transaction);
  }

  async bulkPut(results = []) {
    const db = await this.open();
    const transaction = db.transaction(TEST_RESULTS_STORE, 'readwrite');
    const store = transaction.objectStore(TEST_RESULTS_STORE);
    results.map(normalizeResult).forEach((result) => store.put(result));
    await transactionDone(transaction);
  }
}

export class LocalStorageHistoryStore {
  constructor(storage = getBrowserLocalStorage(), key = `${DEFAULT_PREFIX}:testResults`) {
    if (!storage) throw new Error('localStorage no está disponible.');
    this.storage = storage;
    this.key = key;
  }

  readAll() {
    return parseStoredJson(this.storage.getItem(this.key), []);
  }

  writeAll(results) {
    this.storage.setItem(this.key, JSON.stringify(results));
  }

  async add(result) {
    const normalized = normalizeResult(result);
    const results = this.readAll().filter((item) => item.id !== normalized.id);
    results.push(normalized);
    this.writeAll(results);
    return normalized;
  }

  async list({ limit, exerciseId } = {}) {
    let results = this.readAll().sort((a, b) => String(b.createdAt).localeCompare(String(a.createdAt)));
    if (exerciseId) results = results.filter((item) => item.exerciseId === exerciseId);
    if (Number.isFinite(limit)) results = results.slice(0, Number(limit));
    return results;
  }

  async clear() {
    this.writeAll([]);
  }

  async bulkPut(results = []) {
    this.writeAll(results.map(normalizeResult));
  }
}

export function createDefaultHistoryStore(options = {}) {
  const indexedDbStore = new IndexedDBHistoryStore(options.indexedDB);
  if (indexedDbStore.isSupported()) return indexedDbStore;
  return new LocalStorageHistoryStore(options.storage, options.localStorageKey);
}

export class LocalPersistenceService {
  constructor({ storage = getBrowserLocalStorage(), historyStore, prefix = DEFAULT_PREFIX } = {}) {
    if (!storage) throw new Error('localStorage no está disponible. Inyecta un adaptador compatible para pruebas o SSR.');
    this.storage = storage;
    this.prefix = prefix;
    this.historyStore = historyStore || createDefaultHistoryStore({ storage });
  }

  key(name) {
    return `${this.prefix}:${name}`;
  }

  read(name, fallback = null) {
    return parseStoredJson(this.storage.getItem(this.key(name)), fallback);
  }

  write(name, value) {
    this.storage.setItem(this.key(name), JSON.stringify(value));
    return value;
  }

  remove(name) {
    this.storage.removeItem(this.key(name));
  }

  getProfile() {
    return this.read('profile', null);
  }

  saveProfile(profile) {
    assertPlainObject(profile, 'El perfil');
    const previous = this.getProfile() || {};
    const savedAt = nowIso();
    return this.write('profile', {
      ...previous,
      ...profile,
      id: profile.id || previous.id || createId('profile'),
      updatedAt: savedAt,
      createdAt: previous.createdAt || profile.createdAt || savedAt,
    });
  }

  clearProfile() {
    this.remove('profile');
  }

  getConfig() {
    return { ...DEFAULT_CONFIG, ...this.read('config', {}) };
  }

  saveConfig(config) {
    assertPlainObject(config, 'La configuración');
    return this.write('config', { ...DEFAULT_CONFIG, ...config, updatedAt: nowIso() });
  }

  updateConfig(partialConfig) {
    assertPlainObject(partialConfig, 'La configuración parcial');
    return this.saveConfig({ ...this.getConfig(), ...partialConfig });
  }

  getProgress() {
    return this.read('progress', {
      completedLessons: [],
      currentLessonId: null,
      streakDays: 0,
      totalPracticeMs: 0,
      updatedAt: null,
    });
  }

  saveProgress(progress) {
    assertPlainObject(progress, 'El progreso');
    const current = this.getProgress();
    return this.write('progress', { ...current, ...progress, updatedAt: nowIso() });
  }

  async addTestResult(result) {
    return this.historyStore.add(result);
  }

  async listTestResults(options = {}) {
    return this.historyStore.list(options);
  }

  async clearTestResults() {
    await this.historyStore.clear();
  }

  async exportData() {
    return {
      schemaVersion: 1,
      exportedAt: nowIso(),
      profile: this.getProfile(),
      config: this.getConfig(),
      progress: this.getProgress(),
      testResults: await this.listTestResults(),
    };
  }

  async exportJSON(space = 2) {
    return JSON.stringify(await this.exportData(), null, space);
  }

  async importData(data, { merge = false } = {}) {
    assertPlainObject(data, 'Los datos importados');
    const profile = data.profile ?? null;
    const config = data.config ?? null;
    const progress = data.progress ?? null;
    const testResults = Array.isArray(data.testResults) ? data.testResults : [];

    if (!merge) {
      this.clearProfile();
      this.remove('config');
      this.remove('progress');
      await this.clearTestResults();
    }

    if (profile) this.saveProfile(profile);
    if (config) this.saveConfig(merge ? { ...this.getConfig(), ...config } : config);
    if (progress) this.saveProgress(merge ? { ...this.getProgress(), ...progress } : progress);

    if (merge) {
      const existing = await this.listTestResults();
      const byId = new Map(existing.map((item) => [item.id, item]));
      testResults.map(normalizeResult).forEach((item) => byId.set(item.id, item));
      await this.historyStore.bulkPut([...byId.values()]);
    } else {
      await this.historyStore.bulkPut(testResults);
    }

    return this.exportData();
  }

  async importJSON(json, options) {
    if (typeof json !== 'string') throw new TypeError('El JSON importado debe ser una cadena.');
    return this.importData(JSON.parse(json), options);
  }

  async clearAll() {
    this.clearProfile();
    this.remove('config');
    this.remove('progress');
    await this.clearTestResults();
  }
}

export default LocalPersistenceService;
