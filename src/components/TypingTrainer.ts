import type { TypingMetrics } from '../core/metrics/metricsCalculator';
import type { TypingSession } from '../core/typing/typingEngine';
import type { Exercise } from '../exercises/exerciseBank';

const statusLabel = (status: string): string => `character character--${status}`;

const escapeHtml = (value: string): string =>
  value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('\"', '&quot;')
    .replaceAll("'", '&#39;');

const formatDuration = (seconds?: number): string => {
  if (!seconds) {
    return 'Sin duración sugerida';
  }

  const minutes = Math.round(seconds / 60);
  return minutes >= 1 ? `${minutes} min sugeridos` : `${seconds} s sugeridos`;
};

export const renderTypingTrainer = (
  exercise: Exercise,
  session: TypingSession,
  metrics: TypingMetrics
): string => `
  <section class="trainer" aria-labelledby="trainer-title">
    <div class="trainer__intro">
      <div>
        <p class="eyebrow">${escapeHtml(exercise.level)} · ${escapeHtml(exercise.type)}</p>
        <h2 id="trainer-title">${escapeHtml(exercise.title)}</h2>
        <p>${escapeHtml(exercise.description)}</p>
      </div>
      <button id="reset-session" type="button">Reiniciar</button>
    </div>

    <div class="text-display" aria-label="Texto objetivo">
      ${session.characters
        .map((character) => `<span class="${statusLabel(character.status)}">${character.expected === ' ' ? '&nbsp;' : escapeHtml(character.expected)}</span>`)
        .join('')}
    </div>

    <div class="exercise-details" aria-label="Detalles del ejercicio">
      <span>${formatDuration(exercise.suggestedDurationSeconds)}</span>
      <span>${exercise.technicalObjectives.map(escapeHtml).join(' · ')}</span>
      <span>${exercise.tags.map((tag) => `#${escapeHtml(tag)}`).join(' ')}</span>
    </div>

    <textarea id="typing-input" spellcheck="false" autocomplete="off" autocapitalize="off" aria-label="Escribe el texto objetivo">${escapeHtml(session.input)}</textarea>

    <div class="metrics" aria-label="Métricas de práctica">
      <article><span>PPM</span><strong>${metrics.wordsPerMinute}</strong></article>
      <article><span>Precisión</span><strong>${metrics.accuracy}%</strong></article>
      <article><span>Progreso</span><strong>${metrics.progress}%</strong></article>
      <article><span>Errores</span><strong>${metrics.incorrectCharacters}</strong></article>
    </div>
  </section>
`;
