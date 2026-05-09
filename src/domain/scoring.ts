export type FinalClassification = 'excellent' | 'good' | 'average' | 'needs_practice';

export interface ScoringInput {
  /** Total characters typed by the user, including incorrect and extra characters. */
  typedCharacters: number;
  /** Correctly typed characters. */
  correctCharacters: number;
  /** Incorrect substitutions at aligned target positions. */
  incorrectCharacters: number;
  /** Target characters that were not typed. */
  missingCharacters: number;
  /** Characters typed after the target text ended. */
  extraCharacters: number;
  /** Elapsed typing time in seconds. */
  elapsedSeconds: number;
  /** Mistakes corrected before the final answer, if correction tracking is available. */
  correctedErrors?: number;
}

export interface ScoringResult {
  ppm: number;
  wpm: number;
  accuracy: number;
  grossErrors: number;
  netErrors: number;
  finalClassification: FinalClassification;
}

const CHARACTERS_PER_WORD = 5;
const SECONDS_PER_MINUTE = 60;

function roundTo(value: number, decimalPlaces = 2): number {
  const factor = 10 ** decimalPlaces;
  return Math.round(value * factor) / factor;
}

function minutesFromSeconds(elapsedSeconds: number): number {
  return Math.max(elapsedSeconds / SECONDS_PER_MINUTE, 0);
}

/** Calculates pulsaciones por minuto (PPM) from typed characters and elapsed time. */
export function calculatePPM(typedCharacters: number, elapsedSeconds: number): number {
  const minutes = minutesFromSeconds(elapsedSeconds);

  if (minutes === 0 || typedCharacters <= 0) {
    return 0;
  }

  return roundTo(typedCharacters / minutes);
}

/** Calculates words per minute (WPM), using the standard 5 characters per word. */
export function calculateWPM(typedCharacters: number, elapsedSeconds: number): number {
  return roundTo(calculatePPM(typedCharacters, elapsedSeconds) / CHARACTERS_PER_WORD);
}

/** Calculates accuracy as the percentage of typed characters that are correct. */
export function calculateAccuracy(correctCharacters: number, typedCharacters: number): number {
  if (typedCharacters <= 0 || correctCharacters <= 0) {
    return 0;
  }

  return roundTo((correctCharacters / typedCharacters) * 100);
}

/** Counts all visible mistakes: substitutions, omissions and extra characters. */
export function calculateGrossErrors(
  incorrectCharacters: number,
  missingCharacters: number,
  extraCharacters: number,
): number {
  return Math.max(incorrectCharacters, 0) + Math.max(missingCharacters, 0) + Math.max(extraCharacters, 0);
}

/**
 * Calculates net errors as mistakes that remain after subtracting corrected errors.
 *
 * If the application does not track corrections separately, pass only the gross
 * error count and the net error count will match it. The value never goes below
 * zero, which keeps final scoring stable for short texts or perfect attempts.
 */
export function calculateNetErrors(grossErrors: number, correctedErrors = 0): number {
  return Math.max(grossErrors - Math.max(correctedErrors, 0), 0);
}

/** Classifies the final result from speed and accuracy thresholds. */
export function classifyFinalResult(wpm: number, accuracy: number): FinalClassification {
  if (accuracy >= 98 && wpm >= 60) {
    return 'excellent';
  }

  if (accuracy >= 95 && wpm >= 40) {
    return 'good';
  }

  if (accuracy >= 90 && wpm >= 25) {
    return 'average';
  }

  return 'needs_practice';
}

/** Calculates the complete typing score in one call. */
export function calculateScore(input: ScoringInput): ScoringResult {
  const grossErrors = calculateGrossErrors(
    input.incorrectCharacters,
    input.missingCharacters,
    input.extraCharacters,
  );
  const netErrors = calculateNetErrors(grossErrors, input.correctedErrors);
  const ppm = calculatePPM(input.typedCharacters, input.elapsedSeconds);
  const wpm = calculateWPM(input.typedCharacters, input.elapsedSeconds);
  const accuracy = calculateAccuracy(input.correctCharacters, input.typedCharacters);

  return {
    ppm,
    wpm,
    accuracy,
    grossErrors,
    netErrors,
    finalClassification: classifyFinalResult(wpm, accuracy),
  };
}
