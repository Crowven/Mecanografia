import assert from 'node:assert/strict';
import test from 'node:test';
import { LocalPersistenceService, PERSISTENCE_SCHEMA_VERSION } from '../src/services/localStorageService.ts';

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
  return new LocalPersistenceService({ storage, storageKey: 'test:persistence:v1' });
}

const metrics = {
  elapsedSeconds: 60,
  accuracy: 98,
  keystrokesPerMinute: 250,
  grossWordsPerMinute: 50,
  netWordsPerMinute: 48,
  correctCharacters: 245,
  incorrectCharacters: 5,
  progress: 100
};

test('guarda perfil, configuración y esquema versionado en el servicio principal localStorage', () => {
  const service = createService();

  const profile = service.saveProfile({ displayName: 'Ada' });
  const settings = service.saveSettings({ theme: 'dark', soundEnabled: false });
  const data = service.exportData();

  assert.equal(data.schemaVersion, PERSISTENCE_SCHEMA_VERSION);
  assert.equal(profile.displayName, 'Ada');
  assert.ok(profile.id);
  assert.equal(settings.theme, 'dark');
  assert.equal(settings.soundEnabled, false);
  assert.deepEqual(Object.keys(data.levelProgress), ['inicial', 'basico', 'intermedio', 'avanzado', 'experto']);
});

test('registra y consulta historial completo sin limitarlo a 25 por defecto', () => {
  const service = createService();

  Array.from({ length: 30 }, (_, index) => index + 1).forEach((index) => {
    service.addProgressRecord({
      id: `record-${index}`,
      type: 'exercise',
      exerciseId: 'PRI-001',
      completedAt: `2026-01-${String(index).padStart(2, '0')}T00:00:00.000Z`,
      metrics
    });
  });

  const records = service.listProgressRecords();

  assert.equal(records.length, 30);
  assert.equal(records[0].id, 'record-30');
  assert.equal(records.at(-1).id, 'record-1');
  assert.equal(service.exportData().levelProgress.inicial.attempts, 30);
  assert.deepEqual(service.exportData().levelProgress.inicial.completedExercises, ['PRI-001']);
});

test('respeta un límite configurable de historial cuando el usuario lo define', () => {
  const service = createService();
  service.saveSettings({ maxHistoryItems: 2 });

  ['old', 'middle', 'new'].forEach((id, index) => {
    service.addProgressRecord({
      id,
      type: 'exercise',
      exerciseId: 'PRI-001',
      completedAt: `2026-02-0${index + 1}T00:00:00.000Z`,
      metrics
    });
  });

  assert.deepEqual(service.listProgressRecords().map((record) => record.id), ['new', 'middle']);
});

test('exporta e importa un respaldo JSON fusionando evaluación, ejercicios y pruebas libres', () => {
  const service = createService();
  service.saveProfile({ id: 'profile-1', displayName: 'Ada' });
  service.saveSettings({ difficulty: 'precision' });
  service.addProgressRecord({
    id: 'assessment-1',
    type: 'initial-assessment',
    completedAt: '2026-01-01T00:00:00.000Z',
    durationSeconds: 60,
    accuracy: 95,
    keystrokesPerMinute: 240,
    grossWordsPerMinute: 48,
    netWordsPerMinute: 45,
    recommendedLevel: 'intermedio'
  });
  service.addProgressRecord({
    id: 'exercise-1',
    type: 'exercise',
    exerciseId: 'INT-001',
    completedAt: '2026-01-02T00:00:00.000Z',
    metrics
  });
  service.addFreeTestResult({
    id: 'free-1',
    completedAt: '2026-01-03T00:00:00.000Z',
    title: 'Libre',
    durationSeconds: 120,
    textLength: 400,
    accuracy: 97,
    grossWordsPerMinute: 40,
    netWordsPerMinute: 38
  });

  const restored = createService();
  restored.importJson(service.exportJson());

  assert.equal(restored.getProfile()?.displayName, 'Ada');
  assert.equal(restored.getSettings().difficulty, 'precision');
  assert.deepEqual(restored.listProgressRecords().map((record) => record.id), ['exercise-1', 'assessment-1']);
  assert.deepEqual(restored.exportData().freeTestResults.map((record) => record.id), ['free-1']);

  restored.importData({
    schemaVersion: 1,
    profile: null,
    settings: { maxHistoryItems: null },
    initialAssessment: null,
    exerciseHistory: [{ id: 'exercise-2', type: 'exercise', exerciseId: 'AVA-001', completedAt: '2026-03-01T00:00:00.000Z', metrics }],
    freeTestResults: [],
    levelProgress: {},
    updatedAt: '2026-03-01T00:00:00.000Z'
  }, { merge: true });

  assert.deepEqual(restored.listProgressRecords().map((record) => record.id), ['exercise-2', 'exercise-1', 'assessment-1']);
});
