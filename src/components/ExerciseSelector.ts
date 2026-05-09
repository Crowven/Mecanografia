import type { Exercise, ExerciseFilters, ExerciseLevel } from '../exercises/exerciseBank';

export interface ExerciseSelectorOptions {
  levels: ExerciseLevel[];
  types: string[];
  tags: string[];
  filters: ExerciseFilters;
}

const escapeHtml = (value: string): string =>
  value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');

const renderFilterOptions = (values: string[], selectedValue = 'todos'): string => `
  <option value="todos" ${selectedValue === 'todos' ? 'selected' : ''}>Todos</option>
  ${values
    .map(
      (value) => `
        <option value="${escapeHtml(value)}" ${value === selectedValue ? 'selected' : ''}>
          ${escapeHtml(value)}
        </option>`
    )
    .join('')}
`;

export const renderExerciseSelector = (
  exercises: Exercise[],
  selectedExerciseId: string,
  options: ExerciseSelectorOptions
): string => `
  <section class="exercise-selector" aria-label="Selector de ejercicios">
    <div class="exercise-selector__filters">
      <label class="field">
        <span>Nivel</span>
        <select id="exercise-level-filter">
          ${renderFilterOptions(options.levels, options.filters.level ?? 'todos')}
        </select>
      </label>

      <label class="field">
        <span>Tipo</span>
        <select id="exercise-type-filter">
          ${renderFilterOptions(options.types, options.filters.type ?? 'todos')}
        </select>
      </label>

      <label class="field">
        <span>Etiqueta</span>
        <select id="exercise-tag-filter">
          ${renderFilterOptions(options.tags, options.filters.tag ?? 'todos')}
        </select>
      </label>
    </div>

    <label class="field">
      <span>Banco de ejercicios (${exercises.length})</span>
      <select id="exercise-select">
        ${exercises
          .map(
            (exercise) => `
              <option value="${escapeHtml(exercise.id)}" ${exercise.id === selectedExerciseId ? 'selected' : ''}>
                ${escapeHtml(exercise.title)} · ${escapeHtml(exercise.level)} · ${escapeHtml(exercise.type)}
              </option>`
          )
          .join('')}
      </select>
    </label>
  </section>
`;
