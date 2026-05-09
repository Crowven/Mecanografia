const TEXT_BANK = {
  principiante: {
    palabras: [
      'casa mesa luna sol mapa dedo silla nube perro gato amigo verde claro dulce camino escuela mañana calma libro puerta ventana',
      'planta fruta playa bosque campo ritmo simple rápido lento suave limpio orden papel clase teclado mirada'
    ],
    frases: [
      'La práctica diaria mejora la velocidad y la confianza al escribir.',
      'Respira con calma, mira la pantalla y mantén los dedos sobre la fila guía.'
    ],
    codigo: [
      'let suma = 0;\nfor (let numero of lista) {\n  suma += numero;\n}\nconsole.log(suma);',
      'const mensaje = "hola";\nfunction saludar(nombre) {\n  return `${mensaje}, ${nombre}`;\n}'
    ]
  },
  intermedio: {
    palabras: [
      'concentración equilibrio biblioteca aprendizaje constancia precisión cronómetro evaluación resultado progreso historial rendimiento',
      'mecanografía disciplina estrategia exactitud experiencia intervalo objetivo práctica autonomía seguimiento mejora'
    ],
    frases: [
      'Un buen resultado combina velocidad constante, pocos errores y correcciones oportunas durante toda la prueba.',
      'Cuando compares tus evaluaciones, observa la tendencia general y no solo una marca aislada.'
    ],
    codigo: [
      'const usuarios = datos.filter((item) => item.activo);\nconst promedio = usuarios.reduce((total, item) => total + item.ppm, 0) / usuarios.length;',
      'function calcularPrecision(correctos, total) {\n  if (total === 0) return 0;\n  return Math.round((correctos / total) * 100);\n}'
    ]
  },
  avanzado: {
    palabras: [
      'sincronización meticulosidad interoperabilidad retrospectiva parametrización estandarización vulnerabilidad contextualización',
      'transversalidad microinteracciones reproducibilidad institucionalización desambiguación paralelización trazabilidad'
    ],
    frases: [
      'La autoevaluación cronometrada permite detectar variaciones de rendimiento según la dificultad, la duración y la naturaleza del texto.',
      'Una evolución sostenible aparece cuando la precisión permanece estable mientras aumenta gradualmente la cantidad de palabras correctas por minuto.'
    ],
    codigo: [
      'export function normalizarResultados(historial) {\n  return historial.map(({ ppm, precision, fecha }) => ({\n    fecha: new Date(fecha).toISOString(),\n    rendimiento: Number((ppm * precision / 100).toFixed(2))\n  }));\n}',
      'const resumen = historial.reduce((acc, prueba) => ({\n  total: acc.total + 1,\n  mejorPpm: Math.max(acc.mejorPpm, prueba.ppm),\n  precision: acc.precision + prueba.precision\n}), { total: 0, mejorPpm: 0, precision: 0 });'
    ]
  }
};

const STORAGE_KEY = 'mecanografia.assessments.v1';
const state = {
  active: false,
  startedAt: null,
  duration: 60,
  timerId: null,
  currentPrompt: ''
};

const elements = {
  form: document.querySelector('#assessmentForm'),
  userName: document.querySelector('#userName'),
  duration: document.querySelector('#duration'),
  level: document.querySelector('#level'),
  textType: document.querySelector('#textType'),
  startButton: document.querySelector('#startButton'),
  finishButton: document.querySelector('#finishButton'),
  resetButton: document.querySelector('#resetButton'),
  clearHistoryButton: document.querySelector('#clearHistoryButton'),
  timeRemaining: document.querySelector('#timeRemaining'),
  promptText: document.querySelector('#promptText'),
  typingInput: document.querySelector('#typingInput'),
  testDescriptor: document.querySelector('#testDescriptor'),
  wpmMetric: document.querySelector('#wpmMetric'),
  accuracyMetric: document.querySelector('#accuracyMetric'),
  errorsMetric: document.querySelector('#errorsMetric'),
  correctMetric: document.querySelector('#correctMetric'),
  comparison: document.querySelector('#comparison'),
  summary: document.querySelector('#summary'),
  historyTable: document.querySelector('#historyTable')
};

function getHistory() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY)) ?? [];
  } catch {
    return [];
  }
}

function saveHistory(history) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(history));
}

function selectPrompt(level, textType) {
  const options = TEXT_BANK[level][textType];
  const index = Math.floor(Math.random() * options.length);
  return options[index];
}

function formatTime(totalSeconds) {
  const minutes = Math.floor(totalSeconds / 60).toString().padStart(2, '0');
  const seconds = Math.max(0, totalSeconds % 60).toString().padStart(2, '0');
  return `${minutes}:${seconds}`;
}

function calculateMetrics(prompt, typed, elapsedSeconds) {
  const totalTyped = typed.length;
  let correctCharacters = 0;
  let errors = 0;

  for (let index = 0; index < totalTyped; index += 1) {
    if (typed[index] === prompt[index]) {
      correctCharacters += 1;
    } else {
      errors += 1;
    }
  }

  const minutes = Math.max(elapsedSeconds / 60, 1 / 60);
  const wpm = Math.round(correctCharacters / 5 / minutes);
  const accuracy = totalTyped === 0 ? 0 : Math.round((correctCharacters / totalTyped) * 100);

  return { wpm, accuracy, errors, correctCharacters, totalTyped };
}

function updateMetrics() {
  const elapsedSeconds = state.active ? Math.round((Date.now() - state.startedAt) / 1000) : state.duration;
  const metrics = calculateMetrics(state.currentPrompt, elements.typingInput.value, elapsedSeconds);
  elements.wpmMetric.textContent = metrics.wpm;
  elements.accuracyMetric.textContent = `${metrics.accuracy}%`;
  elements.errorsMetric.textContent = metrics.errors;
  elements.correctMetric.textContent = metrics.correctCharacters;
  return metrics;
}

function findPreviousComparable(history, result) {
  return history.find((item) => item.userName === result.userName && item.duration === result.duration && item.level === result.level && item.textType === result.textType);
}

function comparisonText(current, previous) {
  if (!previous) {
    return 'Primera evaluación con esta configuración. Se usará como línea base para futuras comparaciones.';
  }

  const wpmDiff = current.wpm - previous.wpm;
  const accuracyDiff = current.accuracy - previous.accuracy;
  const wpmClass = wpmDiff >= 0 ? 'positive' : 'negative';
  const accuracyClass = accuracyDiff >= 0 ? 'positive' : 'negative';
  return `Frente a la evaluación comparable anterior: <span class="${wpmClass}">${signed(wpmDiff)} PPM</span> y <span class="${accuracyClass}">${signed(accuracyDiff)} puntos de precisión</span>.`;
}

function signed(value) {
  return value > 0 ? `+${value}` : `${value}`;
}

function finishAssessment() {
  if (!state.active) return;

  clearInterval(state.timerId);
  state.active = false;
  elements.typingInput.disabled = true;
  elements.finishButton.disabled = true;
  elements.startButton.disabled = false;

  const elapsedSeconds = Math.min(state.duration, Math.round((Date.now() - state.startedAt) / 1000));
  const metrics = calculateMetrics(state.currentPrompt, elements.typingInput.value, elapsedSeconds);
  const result = {
    id: crypto.randomUUID(),
    date: new Date().toISOString(),
    userName: normalizeUserName(elements.userName.value),
    duration: state.duration,
    level: elements.level.value,
    textType: elements.textType.value,
    prompt: state.currentPrompt,
    typed: elements.typingInput.value,
    elapsedSeconds,
    ...metrics
  };

  const history = getHistory();
  const previous = findPreviousComparable(history, result);
  saveHistory([result, ...history]);
  elements.comparison.classList.remove('empty');
  elements.comparison.innerHTML = comparisonText(result, previous);
  renderHistory();
  updateMetrics();
}

function normalizeUserName(value) {
  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : 'Invitado';
}

function startAssessment(event) {
  event.preventDefault();
  state.duration = Number(elements.duration.value);
  state.currentPrompt = selectPrompt(elements.level.value, elements.textType.value);
  state.startedAt = Date.now();
  state.active = true;

  elements.promptText.textContent = state.currentPrompt;
  elements.typingInput.value = '';
  elements.typingInput.disabled = false;
  elements.typingInput.focus();
  elements.finishButton.disabled = false;
  elements.startButton.disabled = true;
  elements.testDescriptor.textContent = `${labelFor(elements.level)} · ${labelFor(elements.textType)} · ${formatTime(state.duration)}`;
  elements.comparison.className = 'comparison empty';
  elements.comparison.textContent = 'Evaluación en curso. La comparativa se mostrará al finalizar.';

  tickTimer();
  clearInterval(state.timerId);
  state.timerId = setInterval(tickTimer, 500);
  updateMetrics();
}

function tickTimer() {
  const elapsedSeconds = Math.floor((Date.now() - state.startedAt) / 1000);
  const remainingSeconds = Math.max(0, state.duration - elapsedSeconds);
  elements.timeRemaining.textContent = formatTime(remainingSeconds);
  updateMetrics();

  if (remainingSeconds <= 0) {
    finishAssessment();
  }
}

function resetAssessment() {
  clearInterval(state.timerId);
  state.active = false;
  state.currentPrompt = '';
  elements.timeRemaining.textContent = '--:--';
  elements.promptText.textContent = 'Configura la evaluación y pulsa iniciar para generar el texto.';
  elements.typingInput.value = '';
  elements.typingInput.disabled = true;
  elements.finishButton.disabled = true;
  elements.startButton.disabled = false;
  elements.testDescriptor.textContent = 'Sin iniciar';
  elements.comparison.className = 'comparison empty';
  elements.comparison.textContent = 'Completa una evaluación para ver tu evolución.';
  updateMetrics();
}

function labelFor(value) {
  const labels = {
    principiante: 'Principiante',
    intermedio: 'Intermedio',
    avanzado: 'Avanzado',
    palabras: 'Palabras',
    frases: 'Frases',
    codigo: 'Código'
  };
  return labels[value] ?? value;
}

function renderHistory() {
  const history = getHistory();
  renderSummary(history);

  if (history.length === 0) {
    elements.historyTable.innerHTML = '<tr><td colspan="6">Aún no hay evaluaciones guardadas.</td></tr>';
    return;
  }

  elements.historyTable.innerHTML = history.map((item, index) => {
    const previous = history.slice(index + 1).find((candidate) => candidate.userName === item.userName && candidate.duration === item.duration && candidate.level === item.level && candidate.textType === item.textType);
    const evolution = previous ? `${signed(item.wpm - previous.wpm)} PPM / ${signed(item.accuracy - previous.accuracy)}%` : 'Línea base';
    return `
      <tr>
        <td>${new Date(item.date).toLocaleString('es-ES')}</td>
        <td>${escapeHtml(item.userName)}</td>
        <td>${formatTime(item.duration)} · ${labelFor(item.level)} · ${labelFor(item.textType)}</td>
        <td>${item.wpm}</td>
        <td>${item.accuracy}%</td>
        <td>${evolution}</td>
      </tr>
    `;
  }).join('');
}

function renderSummary(history) {
  if (history.length === 0) {
    elements.summary.innerHTML = summaryCard('Evaluaciones', '0') + summaryCard('Mejor PPM', '0') + summaryCard('Mejor precisión', '0%') + summaryCard('Tendencia', 'Sin datos');
    return;
  }

  const bestWpm = Math.max(...history.map((item) => item.wpm));
  const bestAccuracy = Math.max(...history.map((item) => item.accuracy));
  const averageWpm = Math.round(history.reduce((total, item) => total + item.wpm, 0) / history.length);
  const recent = history.slice(0, Math.min(3, history.length));
  const older = history.slice(3, 6);
  const trend = older.length === 0
    ? `Media ${averageWpm} PPM`
    : `${signed(Math.round(average(recent.map((item) => item.wpm)) - average(older.map((item) => item.wpm))))} PPM recientes`;

  elements.summary.innerHTML = [
    summaryCard('Evaluaciones', history.length),
    summaryCard('Mejor PPM', bestWpm),
    summaryCard('Mejor precisión', `${bestAccuracy}%`),
    summaryCard('Tendencia', trend)
  ].join('');
}

function summaryCard(label, value) {
  return `<div class="summary-card"><span>${label}</span><strong>${value}</strong></div>`;
}

function average(values) {
  return values.reduce((total, value) => total + value, 0) / values.length;
}

function escapeHtml(value) {
  return value.replace(/[&<>'"]/g, (character) => ({
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    "'": '&#039;',
    '"': '&quot;'
  }[character]));
}

elements.form.addEventListener('submit', startAssessment);
elements.typingInput.addEventListener('input', updateMetrics);
elements.finishButton.addEventListener('click', finishAssessment);
elements.resetButton.addEventListener('click', resetAssessment);
elements.clearHistoryButton.addEventListener('click', () => {
  saveHistory([]);
  renderHistory();
  elements.comparison.className = 'comparison empty';
  elements.comparison.textContent = 'Historial borrado. Completa una evaluación para ver tu evolución.';
});

resetAssessment();
renderHistory();
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
