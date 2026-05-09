import type { Exercise } from '../exercises/exerciseBank';

export const renderExerciseSelector = (exercises: Exercise[], selectedExerciseId: string): string => `
  <label class="field">
    <span>Banco de ejercicios</span>
    <select id="exercise-select">
      ${exercises
        .map(
          (exercise) => `
            <option value="${exercise.id}" ${exercise.id === selectedExerciseId ? 'selected' : ''}>
              ${exercise.title} · ${exercise.level}
            </option>`
        )
        .join('')}
    </select>
  </label>
`;
