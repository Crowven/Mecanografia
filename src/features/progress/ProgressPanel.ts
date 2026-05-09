import type { ProgressRecord } from '../../storage/localProgressRepository';

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
        ? '<p class="empty-state">Completa un ejercicio para guardar métricas en este dispositivo.</p>'
        : `<table class="history-table">
            <thead>
              <tr>
                <th scope="col">Fecha</th>
                <th scope="col">PPM</th>
                <th scope="col">WPM netas</th>
                <th scope="col">Precisión</th>
              </tr>
            </thead>
            <tbody>
              ${records
                .map(
                  (record) => `
                    <tr>
                      <td>${new Date(record.completedAt).toLocaleString('es')}</td>
                      <td>${record.metrics.keystrokesPerMinute}</td>
                      <td>${record.metrics.netWordsPerMinute}</td>
                      <td>${record.metrics.accuracy}%</td>
                    </tr>`
                )
                .join('')}
            </tbody>
          </table>`
    }
  </section>
`;
