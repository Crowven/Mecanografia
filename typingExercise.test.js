const assert = require("node:assert/strict");
const test = require("node:test");

const {
  calculateFinalAccuracy,
  createInitialState,
  updateStateWithInput,
  validateCopy,
} = require("./typingExercise");

test("validateCopy marks correct, incorrect and pending characters", () => {
  const result = validateCopy("casa", "cosa");

  assert.deepEqual(
    result.characters.map((character) => character.status),
    ["correct", "incorrect", "correct", "correct"],
  );
  assert.equal(result.correctCount, 3);
  assert.equal(result.currentIncorrectCount, 1);
  assert.equal(result.pendingCount, 0);
  assert.equal(result.isComplete, false);
});

test("validateCopy keeps untouched characters pending", () => {
  const result = validateCopy("teclado", "tec");

  assert.equal(result.correctCount, 3);
  assert.equal(result.pendingCount, 4);
  assert.equal(result.characters[3].status, "pending");
});

test("updateStateWithInput records every new incorrect keystroke", () => {
  const initialState = createInitialState("abc");
  const first = updateStateWithInput(initialState, "ax", 1000).state;
  const second = updateStateWithInput(first, "axz", 1600).state;

  assert.equal(second.errorLog.length, 2);
  assert.deepEqual(
    second.errorLog.map((error) => ({ index: error.index, expected: error.expected, actual: error.actual })),
    [
      { index: 1, expected: "b", actual: "x" },
      { index: 2, expected: "c", actual: "z" },
    ],
  );
});


test("updateStateWithInput records replacements that introduce new errors", () => {
  const initialState = createInitialState("abc");
  const correct = updateStateWithInput(initialState, "abc", 1000).state;
  const replaced = updateStateWithInput(correct, "axc", 1300).state;

  assert.equal(replaced.errorLog.length, 1);
  assert.deepEqual(
    {
      index: replaced.errorLog[0].index,
      expected: replaced.errorLog[0].expected,
      actual: replaced.errorLog[0].actual,
    },
    { index: 1, expected: "b", actual: "x" },
  );
});

test("calculateFinalAccuracy includes registered errors in the final calculation", () => {
  assert.equal(calculateFinalAccuracy(8, 2), 80);
  assert.equal(calculateFinalAccuracy(0, 0), 100);
});
