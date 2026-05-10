import type { ProgressRecord } from '../../storage/localProgressRepository';
import type { FreeTestResultRecord } from '../../services/localStorageService';

const formatNumber = (value: number): string =>
  new Intl.NumberFormat('es', { maximumFractionDigits: 2 }).format(value);

const escapeHtml = (value: string): string =>
  value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('\"', '&quot;')
    .replaceAll("'", '&#039;');

export interface ProgressPanelOptions {
  importExportMessage?: string;
  freeTestResults?: FreeTestResultRecord[];
}

const renderProgressRows = (records: ProgressRecord[], freeTestResults: FreeTestResultRecord[]): string => {
  const rows = [
    ...records.map((record) => ({ completedAt: record.completedAt, kind: 'progress' as const, record })),
    ...freeTestResults.map((record) => ({ completedAt: record.completedAt, kind: 'free-test' as const, record }))
  ].sort((a, b) => b.completedAt.localeCompare(a.completedAt));

  return rows
    .map((entry) => {
      const date = new Date(entry.completedAt).toLocaleString('es');

      if (entry.kind === 'free-test') {
        return `
          <tr>
            <td>${date}</td>
            <td>${escapeHtml(entry.record.title)}</td>
            <td>${formatNumber(entry.record.durationSeconds)} s</td>
            <td>${formatNumber(entry.record.keystrokesPerMinute)}</td>
            <td>${formatNumber(entry.record.grossWordsPerMinute)}</td>
            <td>${formatNumber(entry.record.netWordsPerMinute)}</td>
            <td>${formatNumber(entry.record.accuracy)}%</td>
            <td>${formatNumber(entry.record.textLength)} caracteres</td>
          </tr>`;
      }

      if (entry.record.type === 'initial-assessment') {
        return `
          <tr>
            <td>${date}</td>
            <td>Evaluación inicial</td>
            <td>${formatNumber(entry.record.durationSeconds)} s</td>
            <td>${formatNumber(entry.record.keystrokesPerMinute)}</td>
            <td>${formatNumber(entry.record.grossWordsPerMinute)}</td>
            <td>${formatNumber(entry.record.netWordsPerMinute)}</td>
            <td>${formatNumber(entry.record.accuracy)}%</td>
            <td>${entry.record.recommendedLevel}</td>
          </tr>`;
      }

      return `
        <tr>
          <td>${date}</td>
          <td>Ejercicio</td>
          <td>${entry.record.metrics.elapsedSeconds} s</td>
          <td>${entry.record.metrics.keystrokesPerMinute}</td>
          <td>${entry.record.metrics.grossWordsPerMinute}</td>
          <td>${entry.record.metrics.netWordsPerMinute}</td>
          <td>${entry.record.metrics.accuracy}%</td>
          <td>—</td>
        </tr>`;
    })
    .join('');
};

export const renderProgressPanel = (records: ProgressRecord[], options: ProgressPanelOptions = {}): string => {
  const freeTestResults = options.freeTestResults ?? [];
  const hasRecords = records.length > 0 || freeTestResults.length > 0;

  return `
  <section class="progress-panel" aria-labelledby="progress-title">
    <div class="panel-heading">
      <div>
        <p class="eyebrow">Persistencia local</p>
        <h2 id="progress-title">Historial completo</h2>
        <p class="panel-description">Datos guardados con esquema JSON versionado en localStorage.</p>
      </div>
      <div class="persistence-actions">
        <button id="export-progress" type="button">Exportar JSON</button>
        <label class="import-button" for="import-progress-file">Importar JSON</label>
        <input id="import-progress-file" type="file" accept="application/json,.json" />
        <button id="clear-progress" type="button" ${!hasRecords ? 'disabled' : ''}>Limpiar</button>
      </div>
    </div>
    ${options.importExportMessage ? `<p class="persistence-message" role="status">${escapeHtml(options.importExportMessage)}</p>` : ''}
    ${
      !hasRecords
        ? '<p class="empty-state">Completa un ejercicio, una evaluación inicial o una prueba libre para guardar métricas en este dispositivo.</p>'
        : `<table class="history-table">
            <thead>
              <tr>
                <th scope="col">Fecha</th>
                <th scope="col">Tipo</th>
                <th scope="col">Duración</th>
                <th scope="col">PPM</th>
                <th scope="col">WPM brutas</th>
                <th scope="col">WPM netas</th>
                <th scope="col">Precisión</th>
                <th scope="col">Detalle</th>
              </tr>
            </thead>
            <tbody>
              ${renderProgressRows(records, freeTestResults)}
            </tbody>
          </table>`
    }
  </section>
`;
};
