import assert from 'node:assert/strict';
import test from 'node:test';
import { LocalPersistenceService, LocalStorageHistoryStore } from '../src/services/localStorageService.js';

class MemoryStorage {
  constructor() {
    this.map = new Map();
  }
  getItem(key) {
    return this.map.has(key) ? this.map.get(key) : null;
  }
  setItem(key, value) {
    this.map.set(key, String(value));
  }
  removeItem(key) {
    this.map.delete(key);
  }
  clear() {
    this.map.clear();
  }
}

function createService() {
  const storage = new MemoryStorage();
  return new LocalPersistenceService({
    storage,
    historyStore: new LocalStorageHistoryStore(storage, 'history:test-results'),
  });
}

test('guarda perfil, configuración y progreso en almacenamiento clave-valor', () => {
  const service = createService();

  const profile = service.saveProfile({ name: 'Ada' });
  const config = service.updateConfig({ theme: 'dark', soundEnabled: false });
  const progress = service.saveProgress({ currentLessonId: 'home-row', streakDays: 3 });

  assert.equal(profile.name, 'Ada');
  assert.ok(profile.id);
  assert.equal(config.theme, 'dark');
  assert.equal(config.soundEnabled, false);
  assert.equal(progress.currentLessonId, 'home-row');
  assert.equal(service.getProgress().streakDays, 3);
});

test('registra y consulta resultados de pruebas ordenados por fecha', async () => {
  const service = createService();

  await service.addTestResult({ id: 'old', createdAt: '2026-01-01T00:00:00.000Z', exerciseId: 'a', wpm: 30 });
  await service.addTestResult({ id: 'new', createdAt: '2026-02-01T00:00:00.000Z', exerciseId: 'b', wpm: 45 });

  const results = await service.listTestResults({ limit: 1 });
  const filtered = await service.listTestResults({ exerciseId: 'a' });

  assert.deepEqual(results.map((item) => item.id), ['new']);
  assert.deepEqual(filtered.map((item) => item.id), ['old']);
});

test('exporta e importa un respaldo JSON reemplazando o fusionando historial', async () => {
  const service = createService();
  service.saveProfile({ id: 'profile-1', name: 'Ada' });
  service.saveConfig({ language: 'es', difficulty: 'hard' });
  service.saveProgress({ completedLessons: ['intro'] });
  await service.addTestResult({ id: 'r1', createdAt: '2026-01-01T00:00:00.000Z', wpm: 20 });

  const json = await service.exportJSON();
  const restored = createService();
  await restored.importJSON(json);

  assert.equal(restored.getProfile().name, 'Ada');
  assert.equal(restored.getConfig().difficulty, 'hard');
  assert.deepEqual(restored.getProgress().completedLessons, ['intro']);
  assert.deepEqual((await restored.listTestResults()).map((item) => item.id), ['r1']);

  await restored.importData({ testResults: [{ id: 'r2', createdAt: '2026-03-01T00:00:00.000Z', wpm: 50 }] }, { merge: true });
  assert.deepEqual((await restored.listTestResults()).map((item) => item.id), ['r2', 'r1']);
});
