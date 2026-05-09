/**
 * Shared exercise architecture for typing lessons.
 *
 * Every mode uses the same session, timer and metrics pipeline. Only the
 * validator changes, allowing exact-copy, word, phrase, full-text and free
 * writing exercises to adapt their correctness rules without duplicating
 * timing or scoring logic.
 */
export const ExerciseMode = Object.freeze({
  EXACT_COPY: 'exact-copy',
  WORDS: 'words',
  PHRASES: 'phrases',
  FULL_TEXT: 'full-text',
  FREE_WRITING: 'free-writing',
});

export class TimerEngine {
  constructor({ now = () => Date.now() } = {}) {
    this.now = now;
    this.startedAt = null;
    this.finishedAt = null;
  }

  start() {
    if (this.startedAt === null) {
      this.startedAt = this.now();
    }
  }

  finish() {
    this.start();
    if (this.finishedAt === null) {
      this.finishedAt = this.now();
    }
  }

  get elapsedMs() {
    if (this.startedAt === null) {
      return 0;
    }

    return (this.finishedAt ?? this.now()) - this.startedAt;
  }
}

export class ExerciseSession {
  constructor({ definition, validator, timer = new TimerEngine() }) {
    this.definition = definition;
    this.validator = validator;
    this.timer = timer;
    this.input = '';
    this.lastResult = this.validator.validate('');
  }

  update(nextInput) {
    this.timer.start();
    this.input = nextInput;
    this.lastResult = this.validator.validate(nextInput);

    if (this.lastResult.isComplete) {
      this.timer.finish();
    }

    return this.snapshot();
  }

  finish() {
    this.timer.finish();
    return this.snapshot({ forced: true });
  }

  snapshot(extra = {}) {
    const elapsedMs = this.timer.elapsedMs;

    return {
      ...extra,
      mode: this.definition.mode,
      input: this.input,
      target: this.validator.target,
      validation: this.lastResult,
      metrics: calculateMetrics({ input: this.input, elapsedMs, validation: this.lastResult }),
    };
  }
}

export function createExerciseSession(definition, options = {}) {
  const normalizedDefinition = normalizeDefinition(definition);

  return new ExerciseSession({
    definition: normalizedDefinition,
    validator: createValidator(normalizedDefinition),
    timer: options.timer ?? new TimerEngine(options.clock),
  });
}

export function createValidator(definition) {
  switch (definition.mode) {
    case ExerciseMode.EXACT_COPY:
      return new ExactCopyValidator(definition.target);
    case ExerciseMode.WORDS:
      return new WordPracticeValidator(definition.words);
    case ExerciseMode.PHRASES:
      return new PhrasePracticeValidator(definition.phrases);
    case ExerciseMode.FULL_TEXT:
      return new FullTextValidator(definition.text);
    case ExerciseMode.FREE_WRITING:
      return new FreeWritingValidator(definition.goal);
    default:
      throw new Error(`Unsupported exercise mode: ${definition.mode}`);
  }
}

export function normalizeDefinition(definition) {
  if (!definition?.mode) {
    throw new Error('Exercise definition requires a mode.');
  }

  if (definition.mode === ExerciseMode.EXACT_COPY) {
    return { ...definition, target: requiredText(definition.target, 'target') };
  }

  if (definition.mode === ExerciseMode.WORDS) {
    const words = Array.isArray(definition.words)
      ? definition.words
      : requiredText(definition.target ?? definition.words, 'words').trim().split(/\s+/);
    return { ...definition, words };
  }

  if (definition.mode === ExerciseMode.PHRASES) {
    const phrases = Array.isArray(definition.phrases)
      ? definition.phrases
      : requiredText(definition.target ?? definition.phrases, 'phrases')
          .split(/(?<=[.!?])\s+/)
          .filter(Boolean);
    return { ...definition, phrases };
  }

  if (definition.mode === ExerciseMode.FULL_TEXT) {
    return { ...definition, text: requiredText(definition.text ?? definition.target, 'text') };
  }

  if (definition.mode === ExerciseMode.FREE_WRITING) {
    return { ...definition, goal: definition.goal ?? {} };
  }

  return definition;
}

export function calculateMetrics({ input, elapsedMs, validation }) {
  const elapsedMinutes = elapsedMs / 60000;
  const typedCharacters = input.length;
  const correctCharacters = Math.max(0, validation.correctCharacters ?? 0);
  const errors = Math.max(0, validation.errors ?? 0);
  const accuracy = typedCharacters === 0 ? 1 : correctCharacters / typedCharacters;
  const safeMinutes = elapsedMinutes > 0 ? elapsedMinutes : 0;

  return {
    elapsedMs,
    typedCharacters,
    correctCharacters,
    errors,
    accuracy,
    cpm: safeMinutes === 0 ? 0 : correctCharacters / safeMinutes,
    wpm: safeMinutes === 0 ? 0 : correctCharacters / 5 / safeMinutes,
    progress: validation.progress ?? 0,
  };
}

class ExactCopyValidator {
  constructor(target) {
    this.target = target;
  }

  validate(input) {
    const result = compareByCharacter(input, this.target);

    return {
      ...result,
      isValidSoFar: result.errors === 0,
      isComplete: input === this.target,
      progress: boundedProgress(input.length, this.target.length),
      segments: characterSegments(input, this.target),
    };
  }
}

class WordPracticeValidator {
  constructor(words) {
    this.words = words;
    this.target = words.join(' ');
  }

  validate(input) {
    const typedWords = input.trim().length === 0 ? [] : input.trim().split(/\s+/);
    const comparison = compareByCharacter(typedWords.join(' '), this.target);
    const currentWordIndex = Math.max(0, typedWords.length - 1);
    const currentWord = typedWords[currentWordIndex] ?? '';
    const expectedCurrentWord = this.words[currentWordIndex] ?? '';
    const completedWordsMatch = typedWords
      .slice(0, -1)
      .every((word, index) => word === this.words[index]);
    const isCurrentPrefix = expectedCurrentWord.startsWith(currentWord);

    return {
      ...comparison,
      isValidSoFar: completedWordsMatch && isCurrentPrefix,
      isComplete: typedWords.length === this.words.length && typedWords.join(' ') === this.target,
      progress: boundedProgress(typedWords.join(' ').length, this.target.length),
      segments: this.words.map((word, index) => ({
        expected: word,
        actual: typedWords[index] ?? '',
        status: wordStatus(typedWords[index], word, index === currentWordIndex),
      })),
    };
  }
}

class PhrasePracticeValidator {
  constructor(phrases) {
    this.phrases = phrases;
    this.target = phrases.join(' ');
  }

  validate(input) {
    const normalizedInput = normalizeInlineWhitespace(input);
    const comparison = compareByCharacter(normalizedInput, this.target);

    return {
      ...comparison,
      isValidSoFar: comparison.errors === 0,
      isComplete: normalizedInput === this.target,
      progress: boundedProgress(normalizedInput.length, this.target.length),
      segments: phraseSegments(normalizedInput, this.phrases),
    };
  }
}

class FullTextValidator {
  constructor(text) {
    this.target = normalizeLineEndings(text);
  }

  validate(input) {
    const normalizedInput = normalizeLineEndings(input);
    const comparison = compareByCharacter(normalizedInput, this.target);

    return {
      ...comparison,
      isValidSoFar: comparison.errors === 0,
      isComplete: normalizedInput === this.target,
      progress: boundedProgress(normalizedInput.length, this.target.length),
      segments: paragraphSegments(normalizedInput, this.target),
    };
  }
}

class FreeWritingValidator {
  constructor(goal = {}) {
    this.goal = goal;
    this.target = null;
  }

  validate(input) {
    const meetsCharacters = !this.goal.minCharacters || input.length >= this.goal.minCharacters;

    return {
      correctCharacters: input.length,
      errors: 0,
      isValidSoFar: true,
      isComplete: meetsCharacters,
      progress: this.goal.minCharacters ? boundedProgress(input.length, this.goal.minCharacters) : 0,
      segments: [{ actual: input, status: 'free' }],
    };
  }
}

function requiredText(value, fieldName) {
  if (typeof value !== 'string' || value.length === 0) {
    throw new Error(`Exercise definition requires non-empty ${fieldName}.`);
  }

  return value;
}

function compareByCharacter(input, target) {
  let correctCharacters = 0;
  let errors = 0;
  const longest = Math.max(input.length, target.length);

  const comparableLength = Math.min(input.length, target.length);

  for (let index = 0; index < comparableLength; index += 1) {
    if (input[index] === target[index]) {
      correctCharacters += 1;
    } else {
      errors += 1;
    }
  }

  if (input.length > target.length) {
    errors += input.length - target.length;
  }

  return {
    correctCharacters,
    errors,
    remainingCharacters: Math.max(0, target.length - input.length),
    totalCharacters: longest,
  };
}

function characterSegments(input, target) {
  return [...target].map((expected, index) => ({
    expected,
    actual: input[index] ?? '',
    status: input[index] === undefined ? 'pending' : input[index] === expected ? 'correct' : 'error',
  }));
}

function phraseSegments(input, phrases) {
  let cursor = 0;

  return phrases.map((phrase) => {
    const actual = input.slice(cursor, cursor + phrase.length);
    cursor += phrase.length + 1;

    return {
      expected: phrase,
      actual,
      status: actual.length === 0 ? 'pending' : actual === phrase ? 'correct' : 'active',
    };
  });
}

function paragraphSegments(input, target) {
  const expectedParagraphs = target.split('\n\n');
  const actualParagraphs = input.split('\n\n');

  return expectedParagraphs.map((expected, index) => ({
    expected,
    actual: actualParagraphs[index] ?? '',
    status: (actualParagraphs[index] ?? '').length === 0
      ? 'pending'
      : actualParagraphs[index] === expected
        ? 'correct'
        : 'active',
  }));
}

function wordStatus(actual, expected, isCurrent) {
  if (actual === undefined) {
    return 'pending';
  }

  if (actual === expected) {
    return 'correct';
  }

  if (isCurrent && expected.startsWith(actual)) {
    return 'active';
  }

  return 'error';
}

function normalizeLineEndings(text) {
  return text.replace(/\r\n?/g, '\n');
}

function normalizeInlineWhitespace(text) {
  return text.trim().replace(/\s+/g, ' ');
}

function boundedProgress(done, total) {
  if (total <= 0) {
    return 0;
  }

  return Math.min(1, Math.max(0, done / total));
}
