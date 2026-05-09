import type { TypingSession } from '../typing/typingEngine';

export interface TypingMetrics {
  elapsedSeconds: number;
  accuracy: number;
  wordsPerMinute: number;
  correctCharacters: number;
  incorrectCharacters: number;
  progress: number;
}

const STANDARD_WORD_LENGTH = 5;

export const calculateMetrics = (session: TypingSession, now = Date.now()): TypingMetrics => {
  const typedCharacters = session.characters.filter((character) => character.typed !== undefined);
  const correctCharacters = typedCharacters.filter((character) => character.status === 'correct').length;
  const incorrectCharacters = typedCharacters.filter((character) => character.status === 'incorrect').length;
  const elapsedMs = session.startedAt ? Math.max((session.completedAt ?? now) - session.startedAt, 0) : 0;
  const elapsedMinutes = elapsedMs / 1000 / 60;

  return {
    elapsedSeconds: Math.round(elapsedMs / 1000),
    accuracy: typedCharacters.length === 0 ? 100 : Math.round((correctCharacters / typedCharacters.length) * 100),
    wordsPerMinute: elapsedMinutes === 0 ? 0 : Math.round(correctCharacters / STANDARD_WORD_LENGTH / elapsedMinutes),
    correctCharacters,
    incorrectCharacters,
    progress: Math.round((session.input.length / session.targetText.length) * 100)
  };
};
