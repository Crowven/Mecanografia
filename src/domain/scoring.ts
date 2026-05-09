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
  keystrokesPerMinute: number;
  grossWordsPerMinute: number;
  netWordsPerMinute: number;
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

function calculateRatePerMinute(characters: number, elapsedSeconds: number): number {
  const minutes = minutesFromSeconds(elapsedSeconds);

  if (minutes === 0 || characters <= 0) {
    return 0;
  }

  return roundTo(characters / minutes);
}

/** Calculates pulsaciones por minuto (PPM) from typed characters and elapsed time. */
export function calculatePPM(typedCharacters: number, elapsedSeconds: number): number {
  return calculateRatePerMinute(typedCharacters, elapsedSeconds);
}

/** Calculates gross words per minute (WPM), using all typed characters and the standard 5-character word. */
export function calculateGrossWPM(typedCharacters: number, elapsedSeconds: number): number {
  return roundTo(calculateRatePerMinute(typedCharacters, elapsedSeconds) / CHARACTERS_PER_WORD);
}

/** Calculates words per minute (WPM), using the standard 5 characters per word. */
export function calculateWPM(typedCharacters: number, elapsedSeconds: number): number {
  return calculateGrossWPM(typedCharacters, elapsedSeconds);
}

/** Calculates net words per minute after subtracting uncorrected errors from correct characters. */
export function calculateNetWPM(correctCharacters: number, netErrors: number, elapsedSeconds: number): number {
  const netCharacters = Math.max(correctCharacters - Math.max(netErrors, 0), 0);

  return roundTo(calculateRatePerMinute(netCharacters, elapsedSeconds) / CHARACTERS_PER_WORD);
}

/** Calculates accuracy as the percentage of denominator characters that are correct. */
export function calculateAccuracy(correctCharacters: number, denominatorCharacters: number): number {
  if (denominatorCharacters <= 0 || correctCharacters <= 0) {
    return 0;
  }

  return roundTo((correctCharacters / denominatorCharacters) * 100);
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

/** Classifies the final result from net speed and accuracy thresholds. */
export function classifyFinalResult(netWordsPerMinute: number, accuracy: number): FinalClassification {
  if (accuracy >= 98 && netWordsPerMinute >= 60) {
    return 'excellent';
  }

  if (accuracy >= 95 && netWordsPerMinute >= 40) {
    return 'good';
  }

  if (accuracy >= 90 && netWordsPerMinute >= 25) {
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
  const expectedCharacters = Math.max(
    input.correctCharacters + input.incorrectCharacters + input.missingCharacters,
    0,
  );
  const accuracyDenominator = Math.max(input.typedCharacters, expectedCharacters);
  const keystrokesPerMinute = calculatePPM(input.typedCharacters, input.elapsedSeconds);
  const grossWordsPerMinute = calculateGrossWPM(input.typedCharacters, input.elapsedSeconds);
  const netWordsPerMinute = calculateNetWPM(input.correctCharacters, netErrors, input.elapsedSeconds);
  const accuracy = calculateAccuracy(input.correctCharacters, accuracyDenominator);

  return {
    keystrokesPerMinute,
    grossWordsPerMinute,
    netWordsPerMinute,
    accuracy,
    grossErrors,
    netErrors,
    finalClassification: classifyFinalResult(netWordsPerMinute, accuracy),
  };
}
