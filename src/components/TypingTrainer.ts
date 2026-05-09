import type { TypingMetrics } from '../core/metrics/metricsCalculator';
import type { TypingSession } from '../core/typing/typingEngine';
import type { Exercise } from '../exercises/exerciseBank';

const statusLabel = (status: string): string => `character character--${status}`;

export const renderTypingTrainer = (
  exercise: Exercise,
  session: TypingSession,
  metrics: TypingMetrics
): string => `
  <section class="trainer" aria-labelledby="trainer-title">
    <div class="trainer__intro">
      <div>
        <p class="eyebrow">${exercise.level}</p>
        <h2 id="trainer-title">${exercise.title}</h2>
        <p>${exercise.description}</p>
      </div>
      <button id="reset-session" type="button">Reiniciar</button>
    </div>

    <div class="text-display" aria-label="Texto objetivo">
      ${session.characters
        .map((character) => `<span class="${statusLabel(character.status)}">${character.expected === ' ' ? '&nbsp;' : character.expected}</span>`)
        .join('')}
    </div>

    <textarea id="typing-input" spellcheck="false" autocomplete="off" autocapitalize="off" aria-label="Escribe el texto objetivo">${session.input}</textarea>

    <div class="metrics" aria-label="Métricas de práctica">
      <article><span>PPM</span><strong>${metrics.wordsPerMinute}</strong></article>
      <article><span>Precisión</span><strong>${metrics.accuracy}%</strong></article>
      <article><span>Progreso</span><strong>${metrics.progress}%</strong></article>
      <article><span>Errores</span><strong>${metrics.incorrectCharacters}</strong></article>
    </div>
  </section>
`;
