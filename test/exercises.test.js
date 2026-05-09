import test from 'node:test';
import assert from 'node:assert/strict';
import { createExerciseSession, ExerciseMode } from '../src/exercises.js';

function fixedClock() {
  let now = 0;

  return {
    clock: { now: () => now },
    advance: (ms) => { now += ms; },
  };
}

test('exact copy mode requires the input to match the target character by character', () => {
  const { clock, advance } = fixedClock();
  const session = createExerciseSession({ mode: ExerciseMode.EXACT_COPY, target: 'hola' }, { clock });

  advance(30_000);
  const partial = session.update('hila');

  assert.equal(partial.validation.isValidSoFar, false);
  assert.equal(partial.validation.errors, 1);
  assert.equal(partial.validation.isComplete, false);

  advance(30_000);
  const complete = session.update('hola');

  assert.equal(complete.validation.isComplete, true);
  assert.equal(complete.metrics.elapsedMs, 30_000);
  assert.equal(complete.metrics.wpm, 1.6);
});

test('word practice validates complete words while allowing the active word prefix', () => {
  const session = createExerciseSession({ mode: ExerciseMode.WORDS, words: ['casa', 'perro'] });

  const activePrefix = session.update('casa pe');

  assert.equal(activePrefix.validation.isValidSoFar, true);
  assert.equal(activePrefix.validation.segments[1].status, 'active');
  assert.equal(activePrefix.validation.progress, 0.7);

  const complete = session.update('casa perro');

  assert.equal(complete.validation.isComplete, true);
  assert.equal(complete.validation.errors, 0);
});

test('phrase practice normalizes whitespace but keeps punctuation significant', () => {
  const session = createExerciseSession({
    mode: ExerciseMode.PHRASES,
    phrases: ['Hola, mundo.', 'Otra frase.'],
  });

  const snapshot = session.update('Hola,   mundo. Otra frase.');

  assert.equal(snapshot.validation.isComplete, true);
  assert.equal(snapshot.validation.errors, 0);
});

test('full text mode preserves paragraph validation and normalizes line endings', () => {
  const session = createExerciseSession({
    mode: ExerciseMode.FULL_TEXT,
    text: 'Primer párrafo.\n\nSegundo párrafo.',
  });

  const snapshot = session.update('Primer párrafo.\r\n\r\nSegundo párrafo.');

  assert.equal(snapshot.validation.isComplete, true);
  assert.equal(snapshot.validation.segments.length, 2);
});

test('free writing has no target errors and uses optional goals for progress', () => {
  const session = createExerciseSession({
    mode: ExerciseMode.FREE_WRITING,
    goal: { minCharacters: 10 },
  });

  const partial = session.update('texto');
  assert.equal(partial.validation.errors, 0);
  assert.equal(partial.validation.isComplete, false);
  assert.equal(partial.validation.progress, 0.5);

  const complete = session.update('texto libre');
  assert.equal(complete.validation.isComplete, true);
  assert.equal(complete.metrics.correctCharacters, 11);
});
