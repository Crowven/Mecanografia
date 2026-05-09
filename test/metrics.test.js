import test from 'node:test';
import assert from 'node:assert/strict';
import {
  buildSegments,
  calculateWpm,
  compareTyping,
  expertExercises,
  summarizePerformance
} from '../src/core/expertMetrics.js';

test('expert exercises are long timed challenges with advanced content', () => {
  assert.equal(expertExercises.length, 3);
  for (const exercise of expertExercises) {
    assert.ok(exercise.durationMinutes >= 10 || exercise.id.includes('12') || exercise.id.includes('15'));
    assert.ok(exercise.text.length > 1200);
    assert.match(exercise.text, /[0-9]/);
    assert.match(exercise.text, /[€%#≈+\-]/);
    assert.match(exercise.text, /[;:()"—]/);
  }
});

test('typing comparison tracks accuracy and errors', () => {
  const result = compareTyping('abcdef', 'abcxef');
  assert.equal(result.correct, 5);
  assert.equal(result.errors, 1);
  assert.equal(Math.round(result.accuracy), 83);
});

test('WPM uses five correct characters per word', () => {
  assert.equal(calculateWpm(250, 60), 50);
  assert.equal(calculateWpm(0, 60), 0);
});

test('segments capture sustained precision and rhythm evolution', () => {
  const target = 'a'.repeat(300);
  const events = [
    { elapsedSeconds: 10, value: 'a'.repeat(50) },
    { elapsedSeconds: 35, value: 'a'.repeat(100) + 'x'.repeat(20) },
    { elapsedSeconds: 65, value: 'a'.repeat(190) + 'x'.repeat(20) }
  ];
  const segments = buildSegments(events, target, 30);
  assert.equal(segments.length, 3);
  assert.ok(segments[0].wpm > 0);
  assert.ok(segments[1].accuracy < 100);

  const summary = summarizePerformance({
    target,
    typed: events.at(-1).value,
    elapsedSeconds: 65,
    durationSeconds: 120,
    events
  });
  assert.ok(summary.sustainedAccuracy < 100);
  assert.ok(Number.isFinite(summary.paceEvolution));
  assert.ok(summary.endurance > 0);
});
