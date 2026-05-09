export type RecommendedLevel = 'inicial' | 'basico' | 'intermedio' | 'avanzado' | 'experto';

export interface InitialAssessmentResult {
  targetText: string;
  userText: string;
  durationSeconds: number;
  correctCharacters: number;
  errors: number;
  keystrokesPerMinute: number;
  grossWordsPerMinute: number;
  netWordsPerMinute: number;
  accuracy: number;
  recommendedLevel: RecommendedLevel;
}

const STANDARD_WORD_LENGTH = 5;

const roundToTwo = (value: number): number => Math.round(value * 100) / 100;

type AlignmentScore = readonly [errors: number, correctCharacters: number];

const pickBestAlignment = (...candidates: AlignmentScore[]): AlignmentScore =>
  candidates.reduce((best, candidate) => {
    if (candidate[0] < best[0]) {
      return candidate;
    }

    if (candidate[0] === best[0] && candidate[1] > best[1]) {
      return candidate;
    }

    return best;
  });

export const alignTexts = (targetText: string, userText: string): { correctCharacters: number; errors: number } => {
  const rows = targetText.length + 1;
  const columns = userText.length + 1;
  const matrix: AlignmentScore[][] = Array.from({ length: rows }, () =>
    Array.from({ length: columns }, () => [0, 0] as const)
  );

  for (let row = 1; row < rows; row += 1) {
    matrix[row][0] = [row, 0];
  }

  for (let column = 1; column < columns; column += 1) {
    matrix[0][column] = [column, 0];
  }

  for (let row = 1; row < rows; row += 1) {
    for (let column = 1; column < columns; column += 1) {
      const replacement = matrix[row - 1][column - 1];
      const diagonal: AlignmentScore =
        targetText[row - 1] === userText[column - 1]
          ? [replacement[0], replacement[1] + 1]
          : [replacement[0] + 1, replacement[1]];
      const deletion: AlignmentScore = [matrix[row - 1][column][0] + 1, matrix[row - 1][column][1]];
      const insertion: AlignmentScore = [matrix[row][column - 1][0] + 1, matrix[row][column - 1][1]];

      matrix[row][column] = pickBestAlignment(diagonal, deletion, insertion);
    }
  }

  const [errors, correctCharacters] = matrix[rows - 1][columns - 1];
  return { correctCharacters, errors };
};

export const classifyRecommendedLevel = (accuracy: number, netWordsPerMinute: number): RecommendedLevel => {
  if (accuracy < 85 || netWordsPerMinute < 10) {
    return 'inicial';
  }

  if (accuracy < 90 || netWordsPerMinute < 20) {
    return 'basico';
  }

  if (accuracy < 95 || netWordsPerMinute < 35) {
    return 'intermedio';
  }

  if (accuracy < 98 || netWordsPerMinute < 50) {
    return 'avanzado';
  }

  return 'experto';
};

export const evaluateInitialAssessment = (
  userText: string,
  durationSeconds: number,
  targetText: string
): InitialAssessmentResult => {
  if (durationSeconds <= 0) {
    throw new Error('La duración debe ser mayor que cero segundos.');
  }

  if (!targetText) {
    throw new Error('El texto objetivo no puede estar vacío.');
  }

  const { correctCharacters, errors } = alignTexts(targetText, userText);
  const minutes = durationSeconds / 60;
  const typedCharacters = userText.length;
  const keystrokesPerMinute = typedCharacters / minutes;
  const grossWordsPerMinute = typedCharacters / STANDARD_WORD_LENGTH / minutes;
  const netWordsPerMinute = Math.max((typedCharacters - errors) / STANDARD_WORD_LENGTH / minutes, 0);
  const accuracy = (correctCharacters / Math.max(targetText.length, typedCharacters)) * 100;
  const roundedNetWordsPerMinute = roundToTwo(netWordsPerMinute);

  return {
    targetText,
    userText,
    durationSeconds,
    correctCharacters,
    errors,
    keystrokesPerMinute: roundToTwo(keystrokesPerMinute),
    grossWordsPerMinute: roundToTwo(grossWordsPerMinute),
    netWordsPerMinute: roundedNetWordsPerMinute,
    accuracy: roundToTwo(accuracy),
    recommendedLevel: classifyRecommendedLevel(roundToTwo(accuracy), roundedNetWordsPerMinute)
  };
};
