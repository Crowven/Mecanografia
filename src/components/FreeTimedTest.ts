import type { FreeTimedTestMetrics } from '../domain/freeTimedTest';

export const FREE_TEST_DURATIONS = [15, 30, 60, 120, 300] as const;

export type FreeTestStatus = 'idle' | 'running' | 'finished';

export interface FreeTimedTestViewModel {
  durationSeconds: number;
  input: string;
  remainingSeconds: number;
  status: FreeTestStatus;
  result?: FreeTimedTestMetrics;
}

const escapeHtml = (value: string): string =>
  value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');

const formatNumber = (value: number): string =>
  new Intl.NumberFormat('es', { maximumFractionDigits: 2 }).format(value);

const formatDurationLabel = (seconds: number): string => {
  if (seconds < 60) return `${seconds} s`;
  const minutes = seconds / 60;
  return `${minutes} min`;
};

const formatTimer = (seconds: number): string => {
  const safeSeconds = Math.max(0, Math.ceil(seconds));
  const minutes = Math.floor(safeSeconds / 60);
  const remaining = safeSeconds % 60;
  return `${String(minutes).padStart(2, '0')}:${String(remaining).padStart(2, '0')}`;
};

export const renderFreeTimedTest = (viewModel: FreeTimedTestViewModel): string => {
  const isRunning = viewModel.status === 'running';
  const isFinished = viewModel.status === 'finished';

  return `
    <section class="free-test trainer" aria-labelledby="free-test-title">
      <div class="trainer__intro">
        <div>
          <p class="eyebrow">Prueba libre por tiempo</p>
          <h2 id="free-test-title">Escritura libre cronometrada</h2>
          <p>Elige una duración y escribe cualquier texto. El temporizador empieza con Iniciar o con la primera tecla válida.</p>
        </div>
        <button id="back-to-practice" type="button">Volver a ejercicios</button>
      </div>

      <label class="field" for="free-test-duration">
        <span>Duración</span>
        <select id="free-test-duration" ${isRunning ? 'disabled' : ''}>
          ${FREE_TEST_DURATIONS.map((duration) => `
            <option value="${duration}" ${duration === viewModel.durationSeconds ? 'selected' : ''}>${formatDurationLabel(duration)}</option>
          `).join('')}
        </select>
      </label>

      <div class="free-test__timer" role="timer" aria-live="polite">
        <span>Tiempo restante</span>
        <strong>${formatTimer(viewModel.remainingSeconds)}</strong>
      </div>

      <label class="field" for="free-test-input">
        <span>Área de escritura libre</span>
        <textarea id="free-test-input" spellcheck="false" autocomplete="off" autocapitalize="off" ${isFinished ? 'disabled' : ''}>${escapeHtml(viewModel.input)}</textarea>
      </label>

      <div class="assessment__actions">
        <button id="start-free-test" type="button" ${isRunning || isFinished ? 'disabled' : ''}>Iniciar</button>
        <button id="finish-free-test" type="button" ${isFinished || viewModel.input.length === 0 ? 'disabled' : ''}>Finalizar</button>
        <button id="reset-free-test" type="button">Reiniciar</button>
      </div>

      ${viewModel.result ? `
        <div class="assessment-result" aria-live="polite">
          <h3>Resultado final guardado</h3>
          <div class="metrics">
            <article><span>Duración</span><strong>${formatNumber(viewModel.result.durationSeconds)} s</strong></article>
            <article><span>PPM</span><strong>${formatNumber(viewModel.result.keystrokesPerMinute)}</strong></article>
            <article><span>WPM brutas</span><strong>${formatNumber(viewModel.result.grossWordsPerMinute)}</strong></article>
            <article><span>WPM netas</span><strong>${formatNumber(viewModel.result.netWordsPerMinute)}</strong></article>
            <article><span>Precisión</span><strong>${formatNumber(viewModel.result.accuracy)}%</strong></article>
            <article><span>Caracteres escritos</span><strong>${formatNumber(viewModel.result.textLength)}</strong></article>
          </div>
        </div>
      ` : ''}
    </section>
  `;
};
