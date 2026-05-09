import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import ts from 'typescript';

async function importTypeScriptModule(path) {
  const source = await readFile(path, 'utf8');
  const { outputText } = ts.transpileModule(source, {
    compilerOptions: {
      module: ts.ModuleKind.ESNext,
      target: ts.ScriptTarget.ES2022,
    },
  });

  return import(`data:text/javascript;base64,${Buffer.from(outputText).toString('base64')}`);
}

test('calculateMetrics exposes explicit speed metrics and lowers net WPM on errors', async () => {
  const { calculateMetrics } = await importTypeScriptModule('src/core/metrics/metricsCalculator.ts');
  const startedAt = Date.UTC(2026, 0, 1, 0, 0, 0);
  const characters = [
    ...Array.from({ length: 50 }, () => ({ typed: 'a', status: 'correct' })),
    ...Array.from({ length: 10 }, () => ({ typed: 'x', status: 'incorrect' })),
  ];

  const metrics = calculateMetrics({
    exerciseId: 'exercise',
    targetText: 'a'.repeat(60),
    input: 'a'.repeat(60),
    characters,
    startedAt,
  }, startedAt + 60_000);

  assert.equal(metrics.keystrokesPerMinute, 60);
  assert.equal(metrics.grossWordsPerMinute, 12);
  assert.equal(metrics.netWordsPerMinute, 10);
  assert.equal(metrics.accuracy, 83);
  assert.equal(metrics.correctCharacters, 50);
  assert.equal(metrics.incorrectCharacters, 10);
  assert.equal('wordsPerMinute' in metrics, false);
});
