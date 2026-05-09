import test from 'node:test';
import assert from 'node:assert/strict';
import {
  classifyRecommendedLevel,
  evaluateInitialAssessment
} from '../src/domain/initialAssessment.ts';
import { defaultAssessmentText } from '../src/data/assessmentTexts.ts';

test('standard assessment text is available to the TypeScript app', () => {
  assert.equal(
    defaultAssessmentText.text,
    'La mecanografía mejora con práctica constante, postura cómoda y atención al ritmo. Escribe cada palabra con calma, corrige los hábitos poco a poco y busca mantener precisión antes de aumentar la velocidad.'
  );
});

test('perfect initial assessment calculates metrics and recommended level', () => {
  const result = evaluateInitialAssessment('abcde', 12, 'abcde');

  assert.equal(result.correctCharacters, 5);
  assert.equal(result.errors, 0);
  assert.equal(result.keystrokesPerMinute, 25);
  assert.equal(result.grossWordsPerMinute, 5);
  assert.equal(result.netWordsPerMinute, 5);
  assert.equal(result.accuracy, 100);
  assert.equal(result.recommendedLevel, 'inicial');
});

test('initial assessment counts substitutions, insertions and omissions', () => {
  const result = evaluateInitialAssessment('abXdeZ', 60, 'abcde');

  assert.equal(result.correctCharacters, 4);
  assert.equal(result.errors, 2);
  assert.equal(result.keystrokesPerMinute, 6);
  assert.equal(result.grossWordsPerMinute, 1.2);
  assert.equal(result.netWordsPerMinute, 0.8);
  assert.equal(result.accuracy, 66.67);
});

test('initial assessment validates input', () => {
  assert.throws(() => evaluateInitialAssessment('abc', 0, 'abc'), /duración/);
  assert.throws(() => evaluateInitialAssessment('abc', 10, ''), /objetivo/);
});

const classificationCases = [
  [84.99, 80, 'inicial'],
  [89.99, 25, 'basico'],
  [94.99, 40, 'intermedio'],
  [97.99, 55, 'avanzado'],
  [99, 55, 'experto']
];

for (const [accuracy, netWordsPerMinute, expectedLevel] of classificationCases) {
  test(`classification prioritizes accuracy and net WPM for ${expectedLevel}`, () => {
    assert.equal(classifyRecommendedLevel(accuracy, netWordsPerMinute), expectedLevel);
  });
}
