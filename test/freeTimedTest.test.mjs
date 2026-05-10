import assert from 'node:assert/strict';
import test from 'node:test';
import { renderFreeTimedTest } from '../src/components/FreeTimedTest.ts';
import { renderProgressPanel } from '../src/features/progress/ProgressPanel.ts';
import { calculateFreeTimedTestMetrics } from '../src/domain/freeTimedTest.ts';
import { LocalPersistenceService } from '../src/services/localStorageService.ts';

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
}

test('calcula métricas de prueba libre por tiempo', () => {
  const metrics = calculateFreeTimedTestMetrics('a'.repeat(150), 30);

  assert.deepEqual(metrics, {
    durationSeconds: 30,
    textLength: 150,
    accuracy: 100,
    keystrokesPerMinute: 300,
    grossWordsPerMinute: 60,
    netWordsPerMinute: 60
  });
});

test('bloquea la entrada y muestra controles finales al terminar el tiempo', () => {
  const html = renderFreeTimedTest({
    durationSeconds: 15,
    input: 'texto final',
    remainingSeconds: 0,
    status: 'finished',
    result: calculateFreeTimedTestMetrics('texto final', 15)
  });

  assert.match(html, /id="free-test-input"[^>]*disabled/);
  assert.match(html, /id="start-free-test"[^>]*disabled/);
  assert.match(html, /Resultado final guardado/);
  assert.match(html, /Caracteres escritos/);
});

test('guarda resultados freeTestResults con PPM en localStorage', () => {
  const service = new LocalPersistenceService({ storage: new MemoryStorage(), storageKey: 'test:free-results' });

  service.addFreeTestResult({
    id: 'free-1',
    completedAt: '2026-05-10T00:00:00.000Z',
    title: 'Prueba libre',
    durationSeconds: 30,
    textLength: 150,
    accuracy: 100,
    keystrokesPerMinute: 300,
    grossWordsPerMinute: 60,
    netWordsPerMinute: 60
  });

  assert.deepEqual(service.exportData().freeTestResults.map((record) => ({
    id: record.id,
    keystrokesPerMinute: record.keystrokesPerMinute,
    textLength: record.textLength
  })), [{ id: 'free-1', keystrokesPerMinute: 300, textLength: 150 }]);
});

test('renderiza resultados de prueba libre en el panel de progreso', () => {
  const html = renderProgressPanel([], {
    freeTestResults: [{
      id: 'free-1',
      completedAt: '2026-05-10T00:00:00.000Z',
      title: 'Prueba libre',
      durationSeconds: 30,
      textLength: 150,
      accuracy: 100,
      keystrokesPerMinute: 300,
      grossWordsPerMinute: 60,
      netWordsPerMinute: 60
    }]
  });

  assert.match(html, /Prueba libre/);
  assert.match(html, /300/);
  assert.match(html, /150 caracteres/);
});
