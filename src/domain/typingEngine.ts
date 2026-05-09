export type CharacterStatus = 'correct' | 'incorrect' | 'missing' | 'extra';

export interface CharacterComparison {
  /** Zero-based position in the aligned comparison. */
  index: number;
  /** Character expected at this position, if any. */
  expected?: string;
  /** Character typed by the user at this position, if any. */
  actual?: string;
  /** Result of comparing the typed character with the target character. */
  status: CharacterStatus;
}

export interface TypingComparison {
  targetText: string;
  inputText: string;
  characters: CharacterComparison[];
  correctCharacters: number;
  incorrectCharacters: number;
  missingCharacters: number;
  extraCharacters: number;
  totalErrors: number;
  completedCharacters: number;
  isComplete: boolean;
}

/**
 * Compares user input against a target text one character at a time.
 *
 * Characters are compared by their position. If the input is shorter than the
 * target, the remaining target characters are marked as missing. If the input
 * is longer than the target, the remaining input characters are marked as
 * extra.
 */
export function compareTypingInput(inputText: string, targetText: string): TypingComparison {
  const maxLength = Math.max(inputText.length, targetText.length);
  const characters: CharacterComparison[] = [];

  let correctCharacters = 0;
  let incorrectCharacters = 0;
  let missingCharacters = 0;
  let extraCharacters = 0;

  for (let index = 0; index < maxLength; index += 1) {
    const expected = targetText[index];
    const actual = inputText[index];

    if (expected === undefined) {
      extraCharacters += 1;
      characters.push({ index, actual, status: 'extra' });
      continue;
    }

    if (actual === undefined) {
      missingCharacters += 1;
      characters.push({ index, expected, status: 'missing' });
      continue;
    }

    if (actual === expected) {
      correctCharacters += 1;
      characters.push({ index, expected, actual, status: 'correct' });
      continue;
    }

    incorrectCharacters += 1;
    characters.push({ index, expected, actual, status: 'incorrect' });
  }

  const totalErrors = incorrectCharacters + missingCharacters + extraCharacters;

  return {
    targetText,
    inputText,
    characters,
    correctCharacters,
    incorrectCharacters,
    missingCharacters,
    extraCharacters,
    totalErrors,
    completedCharacters: Math.min(inputText.length, targetText.length),
    isComplete: inputText.length >= targetText.length && missingCharacters === 0,
  };
}
