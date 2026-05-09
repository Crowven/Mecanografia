import { isInitialAssessmentRecord, type ProgressRecord } from '../../storage/localProgressRepository';

const formatNumber = (value: number): string =>
  new Intl.NumberFormat('es', { maximumFractionDigits: 2 }).format(value);

export const renderProgressPanel = (records: ProgressRecord[]): string => `
  <section class="progress-panel" aria-labelledby="progress-title">
    <div class="panel-heading">
      <div>
        <p class="eyebrow">Persistencia local</p>
        <h2 id="progress-title">Últimos resultados</h2>
      </div>
      <button id="clear-progress" type="button" ${records.length === 0 ? 'disabled' : ''}>Limpiar</button>
    </div>
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
