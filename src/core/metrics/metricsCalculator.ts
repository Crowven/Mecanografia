import type { TypingSession } from '../typing/typingEngine';

export interface TypingMetrics {
  elapsedSeconds: number;
  accuracy: number;
  keystrokesPerMinute: number;
  grossWordsPerMinute: number;
  netWordsPerMinute: number;
  correctCharacters: number;
  incorrectCharacters: number;
  progress: number;
}

const STANDARD_WORD_LENGTH = 5;

const calculateWordsPerMinute = (characters: number, elapsedMinutes: number): number => {
  if (elapsedMinutes === 0 || characters <= 0) {
    return 0;
  }

  return Math.round(characters / STANDARD_WORD_LENGTH / elapsedMinutes);
};

export const calculateMetrics = (session: TypingSession, now = Date.now()): TypingMetrics => {
  const typedCharacters = session.characters.filter((character) => character.typed !== undefined);
  const correctCharacters = typedCharacters.filter((character) => character.status === 'correct').length;
  const incorrectCharacters = typedCharacters.filter((character) => character.status === 'incorrect').length;
  const elapsedMs = session.startedAt ? Math.max((session.completedAt ?? now) - session.startedAt, 0) : 0;
  const elapsedMinutes = elapsedMs / 1000 / 60;

  return {
    elapsedSeconds: Math.round(elapsedMs / 1000),
    accuracy: typedCharacters.length === 0 ? 100 : Math.round((correctCharacters / typedCharacters.length) * 100),
    keystrokesPerMinute: elapsedMinutes === 0 ? 0 : Math.round(typedCharacters.length / elapsedMinutes),
    grossWordsPerMinute: calculateWordsPerMinute(typedCharacters.length, elapsedMinutes),
    netWordsPerMinute: calculateWordsPerMinute(correctCharacters, elapsedMinutes),
    correctCharacters,
    incorrectCharacters,
    progress: session.targetText.length === 0 ? 100 : Math.round((session.input.length / session.targetText.length) * 100)
  };
};
