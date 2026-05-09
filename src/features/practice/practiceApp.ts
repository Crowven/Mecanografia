import { renderExerciseSelector } from '../../components/ExerciseSelector';
import { renderHeader } from '../../components/Header';
import { renderInitialAssessment } from '../../components/InitialAssessment';
import { renderProgressPanel } from '../progress/ProgressPanel';
import { renderTypingTrainer } from '../../components/TypingTrainer';
import { appConfig } from '../../config/appConfig';
import { calculateMetrics } from '../../core/metrics/metricsCalculator';
import { createTypingSession, resetTypingSession, updateTypingSession } from '../../core/typing/typingEngine';
import { defaultAssessmentText } from '../../data/assessmentTexts';
import {
  evaluateInitialAssessment,
  type InitialAssessmentResult,
  type RecommendedLevel
} from '../../domain/initialAssessment';
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
import {
  createLocalProgressRepository,
  getLatestInitialAssessmentRecord
} from '../../storage/localProgressRepository';
import { getPlatformCapabilities } from '../../platform/platformAdapter';

export interface PracticeAppHandle {
  render(): void;
  destroy(): void;
}

type AppMode = 'practice' | 'initial-assessment';

const recommendedLevelToExerciseLevel = (recommendedLevel: RecommendedLevel): ExerciseLevel =>
  recommendedLevel === 'inicial' ? 'principiante' : recommendedLevel;

export const mountPracticeApp = (container: HTMLElement): PracticeAppHandle => {
  const progressRepository = createLocalProgressRepository(appConfig.storageKey);
  const latestAssessment = getLatestInitialAssessmentRecord(progressRepository.list());
  let mode: AppMode = 'practice';
  let filters: ExerciseFilters = {
    level: latestAssessment ? recommendedLevelToExerciseLevel(latestAssessment.recommendedLevel) : 'todos',
    type: 'todos',
    tag: 'todos'
  };
  let filteredExercises = filterExercises(exerciseBank, filters);
  let selectedExercise = filteredExercises[0] ?? getExerciseById(appConfig.defaultExerciseId);
  let session = createTypingSession(selectedExercise.id, selectedExercise.text);
  let hasSavedCurrentCompletion = false;
  let assessmentInput = '';
  let assessmentStartedAt: number | undefined;
  let assessmentResult: InitialAssessmentResult | undefined;
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

  const applyRecommendedLevel = (recommendedLevel: RecommendedLevel): void => {
    filters = {
      ...filters,
      level: recommendedLevelToExerciseLevel(recommendedLevel),
      type: 'todos',
      tag: 'todos'
    };
    syncSelectedExerciseWithFilters();
  };

  const bindEvents = (): void => {
    abortController.abort();
    abortController = new AbortController();
    const { signal } = abortController;

    const openAssessmentButton = container.querySelector<HTMLButtonElement>('#open-assessment');
    const backToPracticeButton = container.querySelector<HTMLButtonElement>('#back-to-practice');
    const exerciseSelect = container.querySelector<HTMLSelectElement>('#exercise-select');
    const levelFilter = container.querySelector<HTMLSelectElement>('#exercise-level-filter');
    const typeFilter = container.querySelector<HTMLSelectElement>('#exercise-type-filter');
    const tagFilter = container.querySelector<HTMLSelectElement>('#exercise-tag-filter');
    const typingInput = container.querySelector<HTMLTextAreaElement>('#typing-input');
    const resetButton = container.querySelector<HTMLButtonElement>('#reset-session');
    const clearButton = container.querySelector<HTMLButtonElement>('#clear-progress');
    const assessmentTextArea = container.querySelector<HTMLTextAreaElement>('#assessment-input');
    const finishAssessmentButton = container.querySelector<HTMLButtonElement>('#finish-assessment');
    const resetAssessmentButton = container.querySelector<HTMLButtonElement>('#reset-assessment');

    const updateFilters = (nextFilters: ExerciseFilters): void => {
      filters = nextFilters;
      syncSelectedExerciseWithFilters();
      render();
    };

    openAssessmentButton?.addEventListener(
      'click',
      () => {
        mode = 'initial-assessment';
        render();
      },
      { signal }
    );

    backToPracticeButton?.addEventListener(
      'click',
      () => {
        mode = 'practice';
        render();
      },
      { signal }
    );

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
            type: 'exercise',
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

    assessmentTextArea?.addEventListener(
      'input',
      (event) => {
        if (!assessmentStartedAt) {
          assessmentStartedAt = Date.now();
        }

        assessmentInput = (event.target as HTMLTextAreaElement).value;
        assessmentResult = undefined;
        render();
        container.querySelector<HTMLTextAreaElement>('#assessment-input')?.focus();
      },
      { signal }
    );

    finishAssessmentButton?.addEventListener(
      'click',
      () => {
        const durationSeconds = Math.max(((Date.now() - (assessmentStartedAt ?? Date.now())) / 1000), 1);
        assessmentResult = evaluateInitialAssessment(assessmentInput, durationSeconds, defaultAssessmentText.text);
        progressRepository.save({
          type: 'initial-assessment',
          completedAt: new Date().toISOString(),
          durationSeconds: assessmentResult.durationSeconds,
          accuracy: assessmentResult.accuracy,
          keystrokesPerMinute: assessmentResult.keystrokesPerMinute,
          grossWordsPerMinute: assessmentResult.grossWordsPerMinute,
          netWordsPerMinute: assessmentResult.netWordsPerMinute,
          recommendedLevel: assessmentResult.recommendedLevel
        });
        applyRecommendedLevel(assessmentResult.recommendedLevel);
        render();
      },
      { signal }
    );

    resetAssessmentButton?.addEventListener(
      'click',
      () => {
        assessmentInput = '';
        assessmentStartedAt = undefined;
        assessmentResult = undefined;
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
          ${
            mode === 'initial-assessment'
              ? renderInitialAssessment(defaultAssessmentText, assessmentInput, assessmentResult)
              : `${renderExerciseSelector(filteredExercises, selectedExercise.id, {
                  levels: getExerciseLevels(exerciseBank),
                  types: getExerciseTypes(exerciseBank),
                  tags: getExerciseTags(exerciseBank),
                  filters
                })}
                ${renderTypingTrainer(selectedExercise, session, metrics)}`
          }
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
