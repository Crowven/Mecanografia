import { renderExerciseSelector } from '../../components/ExerciseSelector';
import { renderHeader } from '../../components/Header';
import { renderProgressPanel } from '../progress/ProgressPanel';
import { renderTypingTrainer } from '../../components/TypingTrainer';
import { appConfig } from '../../config/appConfig';
import { calculateMetrics } from '../../core/metrics/metricsCalculator';
import { createTypingSession, resetTypingSession, updateTypingSession } from '../../core/typing/typingEngine';
import {
  exerciseBank,
  filterExercises,
  getExerciseById,
  getExerciseLevels,
  getExerciseTags,
  getExerciseTypes,
  type ExerciseFilters,
  type ExerciseLevel
} from '../../exercises/exerciseBank';
import { createLocalProgressRepository } from '../../storage/localProgressRepository';
import { getPlatformCapabilities } from '../../platform/platformAdapter';

export interface PracticeAppHandle {
  render(): void;
  destroy(): void;
}

export const mountPracticeApp = (container: HTMLElement): PracticeAppHandle => {
  const progressRepository = createLocalProgressRepository(appConfig.storageKey);
  let filters: ExerciseFilters = { level: 'todos', type: 'todos', tag: 'todos' };
  let filteredExercises = filterExercises(exerciseBank, filters);
  let selectedExercise = getExerciseById(appConfig.defaultExerciseId);
  let session = createTypingSession(selectedExercise.id, selectedExercise.text);
  let hasSavedCurrentCompletion = false;
  let abortController = new AbortController();

  const selectExercise = (exerciseId: string): void => {
    selectedExercise = getExerciseById(exerciseId);
    session = createTypingSession(selectedExercise.id, selectedExercise.text);
    hasSavedCurrentCompletion = false;
  };

  const syncSelectedExerciseWithFilters = (): void => {
    filteredExercises = filterExercises(exerciseBank, filters);

    if (!filteredExercises.some((exercise) => exercise.id === selectedExercise.id)) {
      selectedExercise = filteredExercises[0] ?? exerciseBank[0];
      session = createTypingSession(selectedExercise.id, selectedExercise.text);
      hasSavedCurrentCompletion = false;
    }
  };

  const bindEvents = (): void => {
    abortController.abort();
    abortController = new AbortController();
    const { signal } = abortController;

    const exerciseSelect = container.querySelector<HTMLSelectElement>('#exercise-select');
    const levelFilter = container.querySelector<HTMLSelectElement>('#exercise-level-filter');
    const typeFilter = container.querySelector<HTMLSelectElement>('#exercise-type-filter');
    const tagFilter = container.querySelector<HTMLSelectElement>('#exercise-tag-filter');
    const typingInput = container.querySelector<HTMLTextAreaElement>('#typing-input');
    const resetButton = container.querySelector<HTMLButtonElement>('#reset-session');
    const clearButton = container.querySelector<HTMLButtonElement>('#clear-progress');

    const updateFilters = (nextFilters: ExerciseFilters): void => {
      filters = nextFilters;
      syncSelectedExerciseWithFilters();
      render();
    };

    exerciseSelect?.addEventListener(
      'change',
      (event) => {
        selectExercise((event.target as HTMLSelectElement).value);
        render();
      },
      { signal }
    );

    levelFilter?.addEventListener(
      'change',
      (event) => {
        updateFilters({ ...filters, level: (event.target as HTMLSelectElement).value as ExerciseLevel | 'todos' });
      },
      { signal }
    );

    typeFilter?.addEventListener(
      'change',
      (event) => {
        updateFilters({ ...filters, type: (event.target as HTMLSelectElement).value });
      },
      { signal }
    );

    tagFilter?.addEventListener(
      'change',
      (event) => {
        updateFilters({ ...filters, tag: (event.target as HTMLSelectElement).value });
      },
      { signal }
    );

    typingInput?.addEventListener(
      'input',
      (event) => {
        session = updateTypingSession(session, (event.target as HTMLTextAreaElement).value);

        if (session.completedAt && !hasSavedCurrentCompletion) {
          progressRepository.save({
            exerciseId: session.exerciseId,
            completedAt: new Date(session.completedAt).toISOString(),
            metrics: calculateMetrics(session)
          });
          hasSavedCurrentCompletion = true;
        }

        render();
        container.querySelector<HTMLTextAreaElement>('#typing-input')?.focus();
      },
      { signal }
    );

    resetButton?.addEventListener(
      'click',
      () => {
        session = resetTypingSession(session);
        hasSavedCurrentCompletion = false;
        render();
      },
      { signal }
    );

    clearButton?.addEventListener(
      'click',
      () => {
        progressRepository.clear();
        render();
      },
      { signal }
    );
  };

  const render = (): void => {
    const metrics = calculateMetrics(session);
    const capabilities = getPlatformCapabilities(appConfig);
    syncSelectedExerciseWithFilters();

    container.innerHTML = `
      ${renderHeader(appConfig, capabilities)}
      <main class="layout">
        <section class="workspace">
          ${renderExerciseSelector(filteredExercises, selectedExercise.id, {
            levels: getExerciseLevels(exerciseBank),
            types: getExerciseTypes(exerciseBank),
            tags: getExerciseTags(exerciseBank),
            filters
          })}
          ${renderTypingTrainer(selectedExercise, session, metrics)}
        </section>
        ${renderProgressPanel(progressRepository.list())}
      </main>
    `;

    bindEvents();
  };

  render();

  return {
    render,
    destroy() {
      abortController.abort();
      container.innerHTML = '';
    }
  };
};
