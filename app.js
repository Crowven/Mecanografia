const textBank = {
  paragraph: {
    easy: 'La práctica constante ayuda a escribir con calma, ritmo y precisión cada día.',
    medium:
      'Cada sesión de mecanografía fortalece la memoria muscular y permite mantener la concentración durante textos más largos.',
    hard:
      'La velocidad sostenible aparece cuando los dedos anticipan patrones complejos sin sacrificar exactitud, puntuación ni respiración visual.',
  },
  words: {
    easy: 'casa mesa gato luna mano foco tren sol papel taza',
    medium: 'teclado enfoque progreso ventana lectura silencio columna energía método ajuste',
    hard: 'sincronización arquitectura resiliencia productividad interpolación criptografía excepcional',
  },
  quote: {
    easy: 'Escribir bien es pensar con claridad y avanzar sin prisa.',
    medium: 'La disciplina convierte cada minuto de práctica en una mejora visible.',
    hard: 'Quien domina el teclado transforma ideas veloces en acciones precisas y medibles.',
  },
};

const modeSelect = document.querySelector('#mode');
const levelSelect = document.querySelector('#level');
const durationSelect = document.querySelector('#duration');
const restartButton = document.querySelector('#restart');
const targetText = document.querySelector('#target-text');
const typingInput = document.querySelector('#typing-input');
const wpmMetric = document.querySelector('#wpm');
const accuracyMetric = document.querySelector('#accuracy');
const errorsMetric = document.querySelector('#errors');
const timerMetric = document.querySelector('#timer');
const statusPill = document.querySelector('#status');

let currentText = '';
let startedAt = null;
let timerId = null;
let remainingSeconds = Number(durationSelect.value);

function formatTime(totalSeconds) {
  const minutes = Math.floor(totalSeconds / 60).toString().padStart(2, '0');
  const seconds = (totalSeconds % 60).toString().padStart(2, '0');
  return `${minutes}:${seconds}`;
}

function getSelectedText() {
  return textBank[modeSelect.value][levelSelect.value];
}

function renderTarget(input = '') {
  targetText.innerHTML = currentText
    .split('')
    .map((character, index) => {
      const typed = input[index];
      const classes = [];

      if (typed !== undefined) {
        classes.push(typed === character ? 'correct' : 'incorrect');
      }

      if (index === input.length) {
        classes.push('current');
      }

      return `<span class="${classes.join(' ')}">${character === ' ' ? '&nbsp;' : character}</span>`;
    })
    .join('');
}

function calculateStats(input) {
  const elapsedMinutes = startedAt ? Math.max((Date.now() - startedAt) / 60000, 1 / 60) : 0;
  const correctCharacters = input
    .split('')
    .filter((character, index) => character === currentText[index]).length;
  const errors = input
    .split('')
    .filter((character, index) => character !== currentText[index]).length;
  const accuracy = input.length === 0 ? 100 : Math.round((correctCharacters / input.length) * 100);
  const words = correctCharacters / 5;
  const wpm = elapsedMinutes === 0 ? 0 : Math.round(words / elapsedMinutes);

  wpmMetric.textContent = wpm;
  accuracyMetric.textContent = `${accuracy}%`;
  errorsMetric.textContent = errors;
}

function finishSession(message = 'Finalizado') {
  clearInterval(timerId);
  timerId = null;
  typingInput.disabled = true;
  statusPill.textContent = message;
  statusPill.classList.add('finished');
}

function startTimer() {
  if (timerId) return;

  startedAt = Date.now();
  statusPill.textContent = 'En curso';
  statusPill.classList.remove('finished');

  timerId = setInterval(() => {
    remainingSeconds -= 1;
    timerMetric.textContent = formatTime(remainingSeconds);

    if (remainingSeconds <= 0) {
      finishSession('Tiempo agotado');
    }
  }, 1000);
}

function resetSession() {
  clearInterval(timerId);
  currentText = getSelectedText();
  startedAt = null;
  timerId = null;
  remainingSeconds = Number(durationSelect.value);
  typingInput.value = '';
  typingInput.disabled = false;
  timerMetric.textContent = formatTime(remainingSeconds);
  wpmMetric.textContent = '0';
  accuracyMetric.textContent = '100%';
  errorsMetric.textContent = '0';
  statusPill.textContent = 'Listo';
  statusPill.classList.remove('finished');
  renderTarget();
}

typingInput.addEventListener('input', (event) => {
  const input = event.target.value;
  if (input.length > 0) startTimer();

  renderTarget(input);
  calculateStats(input);

  if (input.length >= currentText.length && input === currentText) {
    finishSession('Completado');
  }
});

[modeSelect, levelSelect, durationSelect].forEach((control) => {
  control.addEventListener('change', resetSession);
});

restartButton.addEventListener('click', () => {
  resetSession();
  typingInput.focus();
});

resetSession();
