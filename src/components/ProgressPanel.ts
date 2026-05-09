import type { ProgressRecord } from '../persistence/localProgressRepository';

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
        : `<ol class="history-list">${records
            .map(
              (record) => `
                <li>
                  <span>${new Date(record.completedAt).toLocaleString('es')}</span>
                  <strong>${record.metrics.wordsPerMinute} PPM · ${record.metrics.accuracy}%</strong>
                </li>`
            )
            .join('')}</ol>`
    }
  </section>
`;
