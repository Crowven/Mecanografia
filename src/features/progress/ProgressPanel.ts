import { isInitialAssessmentRecord, type ProgressRecord } from '../../storage/localProgressRepository';

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
}

export const renderProgressPanel = (records: ProgressRecord[], options: ProgressPanelOptions = {}): string => `
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
        <button id="clear-progress" type="button" ${records.length === 0 ? 'disabled' : ''}>Limpiar</button>
      </div>
    </div>
    ${options.importExportMessage ? `<p class="persistence-message" role="status">${escapeHtml(options.importExportMessage)}</p>` : ''}
    ${
      records.length === 0
        ? '<p class="empty-state">Completa un ejercicio o una evaluación inicial para guardar métricas en este dispositivo.</p>'
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
                <th scope="col">Nivel</th>
              </tr>
            </thead>
            <tbody>
              ${records
                .map((record) => {
                  const date = new Date(record.completedAt).toLocaleString('es');

                  if (isInitialAssessmentRecord(record)) {
                    return `
                      <tr>
                        <td>${date}</td>
                        <td>Evaluación inicial</td>
                        <td>${formatNumber(record.durationSeconds)} s</td>
                        <td>${formatNumber(record.keystrokesPerMinute)}</td>
                        <td>${formatNumber(record.grossWordsPerMinute)}</td>
                        <td>${formatNumber(record.netWordsPerMinute)}</td>
                        <td>${formatNumber(record.accuracy)}%</td>
                        <td>${record.recommendedLevel}</td>
                      </tr>`;
                  }

                  return `
                    <tr>
                      <td>${date}</td>
                      <td>Ejercicio</td>
                      <td>${record.metrics.elapsedSeconds} s</td>
                      <td>${record.metrics.keystrokesPerMinute}</td>
                      <td>${record.metrics.grossWordsPerMinute}</td>
                      <td>${record.metrics.netWordsPerMinute}</td>
                      <td>${record.metrics.accuracy}%</td>
                      <td>—</td>
                    </tr>`;
                })
                .join('')}
            </tbody>
          </table>`
    }
  </section>
`;
