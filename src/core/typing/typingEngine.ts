export type CharacterStatus = 'pending' | 'current' | 'correct' | 'incorrect';

export interface CharacterState {
  expected: string;
  typed?: string;
  status: CharacterStatus;
}

export interface TypingSession {
  exerciseId: string;
  targetText: string;
  input: string;
  startedAt?: number;
  completedAt?: number;
  characters: CharacterState[];
}

export const createTypingSession = (exerciseId: string, targetText: string): TypingSession => ({
  exerciseId,
  targetText,
  input: '',
  characters: targetText.split('').map((expected, index) => ({
    expected,
    status: index === 0 ? 'current' : 'pending'
  }))
});

export const updateTypingSession = (
  session: TypingSession,
  input: string,
  now = Date.now()
): TypingSession => {
  const boundedInput = input.slice(0, session.targetText.length);
  const startedAt = session.startedAt ?? (boundedInput.length > 0 ? now : undefined);
  const completedAt = boundedInput.length === session.targetText.length ? now : undefined;

  return {
    ...session,
    input: boundedInput,
    startedAt,
    completedAt,
    characters: session.targetText.split('').map((expected, index) => {
      const typed = boundedInput[index];
      const status: CharacterStatus =
        typed === undefined
          ? index === boundedInput.length
            ? 'current'
            : 'pending'
          : typed === expected
            ? 'correct'
            : 'incorrect';

      return { expected, typed, status };
    })
  };
};

export const resetTypingSession = (session: TypingSession): TypingSession =>
  createTypingSession(session.exerciseId, session.targetText);
