import type { AssessmentText } from '../data/assessmentTexts';
import type { InitialAssessmentResult } from '../domain/initialAssessment';

const escapeHtml = (value: string): string =>
  value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');

const formatNumber = (value: number): string =>
  new Intl.NumberFormat('es', { maximumFractionDigits: 2 }).format(value);

export const renderInitialAssessment = (
  assessmentText: AssessmentText,
  userText: string,
  result?: InitialAssessmentResult
): string => `
  <section class="assessment" aria-labelledby="assessment-title">
    <div class="assessment__intro">
      <div>
        <p class="eyebrow">Evaluación inicial</p>
        <h2 id="assessment-title">${escapeHtml(assessmentText.title)}</h2>
        <p>${escapeHtml(assessmentText.description)}</p>
      </div>
      <button id="back-to-practice" type="button">Volver a ejercicios</button>
    </div>

    <div class="assessment__target" aria-label="Texto estándar de evaluación">
      ${escapeHtml(assessmentText.text)}
    </div>

    <label class="assessment__input field">
      <span>Escribe el texto anterior. El cronómetro empieza con la primera tecla.</span>
      <textarea id="assessment-input" spellcheck="false" autocomplete="off" autocapitalize="off">${escapeHtml(userText)}</textarea>
    </label>

    <div class="assessment__actions">
      <button id="finish-assessment" type="button" ${userText.length === 0 ? 'disabled' : ''}>Finalizar y recomendar nivel</button>
      <button id="reset-assessment" type="button">Reiniciar evaluación</button>
    </div>

    ${
      result
        ? `<div class="assessment-result" aria-live="polite">
            <h3>Resultado guardado</h3>
            <div class="metrics">
              <article><span>Duración</span><strong>${formatNumber(result.durationSeconds)} s</strong></article>
              <article><span>PPM</span><strong>${formatNumber(result.keystrokesPerMinute)}</strong></article>
              <article><span>WPM brutas</span><strong>${formatNumber(result.grossWordsPerMinute)}</strong></article>
              <article><span>WPM netas</span><strong>${formatNumber(result.netWordsPerMinute)}</strong></article>
              <article><span>Precisión</span><strong>${formatNumber(result.accuracy)}%</strong></article>
              <article><span>Nivel recomendado</span><strong>${escapeHtml(result.recommendedLevel)}</strong></article>
            </div>
            <p class="empty-state">El selector de ejercicios se ajustó al nivel recomendado.</p>
          </div>`
        : ''
    }
  </section>
`;
