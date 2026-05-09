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

test('calculateScore reports distinct PPM, gross WPM and net WPM for perfect typing', async () => {
  const { calculateScore } = await importTypeScriptModule('src/domain/scoring.ts');

  const score = calculateScore({
    typedCharacters: 300,
    correctCharacters: 300,
    incorrectCharacters: 0,
    missingCharacters: 0,
    extraCharacters: 0,
    elapsedSeconds: 60,
  });

  assert.equal(score.keystrokesPerMinute, 300);
  assert.equal(score.grossWordsPerMinute, 60);
  assert.equal(score.netWordsPerMinute, 60);
  assert.equal(score.accuracy, 100);
});

test('calculateScore lowers net WPM without inflating speed when errors remain', async () => {
  const { calculateScore } = await importTypeScriptModule('src/domain/scoring.ts');

  const score = calculateScore({
    typedCharacters: 300,
    correctCharacters: 270,
    incorrectCharacters: 20,
    missingCharacters: 5,
    extraCharacters: 5,
    elapsedSeconds: 60,
  });

  assert.equal(score.keystrokesPerMinute, 300);
  assert.equal(score.grossWordsPerMinute, 60);
  assert.equal(score.grossErrors, 30);
  assert.equal(score.netErrors, 30);
  assert.equal(score.netWordsPerMinute, 48);
  assert.equal(score.accuracy, 90);
  assert.ok(score.netWordsPerMinute < score.grossWordsPerMinute);
});

test('calculateScore only penalizes net WPM for uncorrected errors', async () => {
  const { calculateScore } = await importTypeScriptModule('src/domain/scoring.ts');

  const score = calculateScore({
    typedCharacters: 300,
    correctCharacters: 270,
    incorrectCharacters: 20,
    missingCharacters: 5,
    extraCharacters: 5,
    correctedErrors: 10,
    elapsedSeconds: 60,
  });

  assert.equal(score.grossWordsPerMinute, 60);
  assert.equal(score.grossErrors, 30);
  assert.equal(score.netErrors, 20);
  assert.equal(score.netWordsPerMinute, 50);
});


test('calculateScore accuracy uses the expected target denominator when omissions remain', async () => {
  const { calculateScore } = await importTypeScriptModule('src/domain/scoring.ts');

  const score = calculateScore({
    typedCharacters: 80,
    correctCharacters: 80,
    incorrectCharacters: 0,
    missingCharacters: 20,
    extraCharacters: 0,
    elapsedSeconds: 60,
  });

  assert.equal(score.accuracy, 80);
  assert.equal(score.grossWordsPerMinute, 16);
  assert.equal(score.netWordsPerMinute, 12);
});
