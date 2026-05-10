export interface FreeTimedTestMetrics {
  durationSeconds: number;
  textLength: number;
  accuracy: number;
  keystrokesPerMinute: number;
  grossWordsPerMinute: number;
  netWordsPerMinute: number;
}

const STANDARD_WORD_LENGTH = 5;

const roundMetric = (value: number): number => Math.round(value);

const countValidCharacters = (text: string): number =>
  Array.from(text).filter((character) => character !== '\u0000').length;

export const calculateFreeTimedTestMetrics = (
  input: string,
  durationSeconds: number
): FreeTimedTestMetrics => {
  const safeDurationSeconds = Math.max(durationSeconds, 1);
  const elapsedMinutes = safeDurationSeconds / 60;
  const textLength = countValidCharacters(input);

  return {
    durationSeconds: safeDurationSeconds,
    textLength,
    accuracy: textLength === 0 ? 100 : 100,
    keystrokesPerMinute: roundMetric(textLength / elapsedMinutes),
    grossWordsPerMinute: roundMetric(textLength / STANDARD_WORD_LENGTH / elapsedMinutes),
    netWordsPerMinute: roundMetric(textLength / STANDARD_WORD_LENGTH / elapsedMinutes)
  };
};
