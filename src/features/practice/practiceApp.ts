import { renderExerciseSelector } from '../../components/ExerciseSelector';
import { renderHeader } from '../../components/Header';
import { renderProgressPanel } from '../progress/ProgressPanel';
import { renderTypingTrainer } from '../../components/TypingTrainer';
import { appConfig } from '../../config/appConfig';
import { calculateMetrics } from '../../core/metrics/metricsCalculator';
import { createTypingSession, resetTypingSession, updateTypingSession } from '../../core/typing/typingEngine';
import { exerciseBank, getExerciseById } from '../../exercises/exerciseBank';
import { createLocalProgressRepository } from '../../storage/localProgressRepository';
import { getPlatformCapabilities } from '../../platform/platformAdapter';

export interface PracticeAppHandle {
  render(): void;
  destroy(): void;
}

export const mountPracticeApp = (container: HTMLElement): PracticeAppHandle => {
  const progressRepository = createLocalProgressRepository(appConfig.storageKey);
  let selectedExercise = getExerciseById(appConfig.defaultExerciseId);
  let session = createTypingSession(selectedExercise.id, selectedExercise.text);
  let hasSavedCurrentCompletion = false;
  let abortController = new AbortController();

  const bindEvents = (): void => {
    abortController.abort();
    abortController = new AbortController();
    const { signal } = abortController;

    const exerciseSelect = container.querySelector<HTMLSelectElement>('#exercise-select');
    const typingInput = container.querySelector<HTMLTextAreaElement>('#typing-input');
    const resetButton = container.querySelector<HTMLButtonElement>('#reset-session');
    const clearButton = container.querySelector<HTMLButtonElement>('#clear-progress');

    exerciseSelect?.addEventListener(
      'change',
      (event) => {
        const exerciseId = (event.target as HTMLSelectElement).value;
        selectedExercise = getExerciseById(exerciseId);
        session = createTypingSession(selectedExercise.id, selectedExercise.text);
        hasSavedCurrentCompletion = false;
        render();
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

    container.innerHTML = `
      ${renderHeader(appConfig, capabilities)}
      <main class="layout">
        <section class="workspace">
          ${renderExerciseSelector(exerciseBank, selectedExercise.id)}
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
