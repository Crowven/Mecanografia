import './styles/app.css';
import { renderExerciseSelector } from './components/ExerciseSelector';
import { renderHeader } from './components/Header';
import { renderProgressPanel } from './components/ProgressPanel';
import { renderTypingTrainer } from './components/TypingTrainer';
import { appConfig } from './config/appConfig';
import { calculateMetrics } from './core/metrics/metricsCalculator';
import { createTypingSession, resetTypingSession, updateTypingSession } from './core/typing/typingEngine';
import { exerciseBank, getExerciseById } from './exercises/exerciseBank';
import { createLocalProgressRepository } from './persistence/localProgressRepository';
import { getPlatformCapabilities } from './platform/platformAdapter';

const app = document.querySelector<HTMLDivElement>('#app');

if (!app) {
  throw new Error('No se encontró el contenedor principal de la aplicación.');
}

const progressRepository = createLocalProgressRepository(appConfig.storageKey);
let selectedExercise = getExerciseById(appConfig.defaultExerciseId);
let session = createTypingSession(selectedExercise.id, selectedExercise.text);
let hasSavedCurrentCompletion = false;

const render = (): void => {
  const metrics = calculateMetrics(session);
  const capabilities = getPlatformCapabilities(appConfig);

  app.innerHTML = `
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

const bindEvents = (): void => {
  const exerciseSelect = document.querySelector<HTMLSelectElement>('#exercise-select');
  const typingInput = document.querySelector<HTMLTextAreaElement>('#typing-input');
  const resetButton = document.querySelector<HTMLButtonElement>('#reset-session');
  const clearButton = document.querySelector<HTMLButtonElement>('#clear-progress');

  exerciseSelect?.addEventListener('change', (event) => {
    const exerciseId = (event.target as HTMLSelectElement).value;
    selectedExercise = getExerciseById(exerciseId);
    session = createTypingSession(selectedExercise.id, selectedExercise.text);
    hasSavedCurrentCompletion = false;
    render();
  });

  typingInput?.addEventListener('input', (event) => {
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
    document.querySelector<HTMLTextAreaElement>('#typing-input')?.focus();
  });

  resetButton?.addEventListener('click', () => {
    session = resetTypingSession(session);
    hasSavedCurrentCompletion = false;
    render();
  });

  clearButton?.addEventListener('click', () => {
    progressRepository.clear();
    render();
  });
};

render();
