import {
  expertExercises,
  summarizePerformance
} from '../../core/expertMetrics.js';

const formatTime = (seconds) => {
  const minutes = Math.floor(seconds / 60).toString().padStart(2, '0');
  const remainingSeconds = Math.floor(seconds % 60).toString().padStart(2, '0');
  return `${minutes}:${remainingSeconds}`;
};

const renderText = (documentRef, targetElement, target, typed) => {
  targetElement.innerHTML = '';
  const fragment = documentRef.createDocumentFragment();
  for (let index = 0; index < target.length; index += 1) {
    const span = documentRef.createElement('span');
    span.textContent = target[index];
    if (index < typed.length) span.className = typed[index] === target[index] ? 'correct' : 'incorrect';
    if (index === typed.length) span.classList.add('cursor');
    fragment.appendChild(span);
  }
  targetElement.appendChild(fragment);
};

const drawPaceChart = (canvas, segments) => {
  const context = canvas.getContext('2d');
  const { width, height } = canvas;
  context.clearRect(0, 0, width, height);
  context.fillStyle = '#f8fafc';
  context.fillRect(0, 0, width, height);
  context.strokeStyle = '#cbd5e1';
  context.lineWidth = 1;
  for (let y = 40; y < height; y += 45) {
    context.beginPath();
    context.moveTo(40, y);
    context.lineTo(width - 20, y);
    context.stroke();
  }
  if (segments.length === 0) return;
  const maxWpm = Math.max(20, ...segments.map((segment) => segment.wpm));
  const xStep = (width - 80) / Math.max(1, segments.length - 1);
  context.strokeStyle = '#2563eb';
  context.lineWidth = 3;
  context.beginPath();
  segments.forEach((segment, index) => {
    const x = 40 + index * xStep;
    const y = height - 30 - (segment.wpm / maxWpm) * (height - 70);
    if (index === 0) context.moveTo(x, y);
    else context.lineTo(x, y);
  });
  context.stroke();
};

export function initExpertPracticePage(container, options = {}) {
  const documentRef = options.documentRef ?? container.ownerDocument ?? document;
  const windowRef = options.windowRef ?? documentRef.defaultView ?? window;
  const select = container.querySelector('#exercise-select');
  const startButton = container.querySelector('#start-button');
  const resetButton = container.querySelector('#reset-button');
  const title = container.querySelector('#exercise-title');
  const duration = container.querySelector('#exercise-duration');
  const description = container.querySelector('#exercise-description');
  const targetText = container.querySelector('#target-text');
  const input = container.querySelector('#typing-input');
  const timeLeft = container.querySelector('#time-left');
  const wpm = container.querySelector('#wpm');
  const accuracy = container.querySelector('#accuracy');
  const endurance = container.querySelector('#endurance');
  const feedback = container.querySelector('#feedback');
  const summary = container.querySelector('#results-summary');
  const chart = container.querySelector('#pace-chart');
  const abortController = new AbortController();
  const { signal } = abortController;

  let exercise = expertExercises[0];
  let startedAt = null;
  let timer = null;
  let events = [];

  expertExercises.forEach((item) => {
    const option = documentRef.createElement('option');
    option.value = item.id;
    option.textContent = `${item.title} (${item.durationMinutes} min)`;
    select.appendChild(option);
  });

  function selectExercise(id) {
    exercise = expertExercises.find((item) => item.id === id) ?? expertExercises[0];
    title.textContent = exercise.title;
    duration.textContent = `${exercise.durationMinutes} min`;
    description.textContent = exercise.description;
    input.value = '';
    events = [];
    startedAt = null;
    timeLeft.textContent = formatTime(exercise.durationMinutes * 60);
    wpm.textContent = '0';
    accuracy.textContent = '100%';
    endurance.textContent = '0';
    summary.innerHTML = '';
    feedback.textContent = 'La prueba registrará tu ritmo cada 30 segundos.';
    renderText(documentRef, targetText, exercise.text, '');
    drawPaceChart(chart, []);
  }

  function finishTest(message = 'Prueba finalizada.') {
    windowRef.clearInterval(timer);
    input.disabled = true;
    startButton.disabled = false;
    const elapsedSeconds = startedAt ? Math.min((Date.now() - startedAt) / 1000, exercise.durationMinutes * 60) : 0;
    const report = summarizePerformance({
      target: exercise.text,
      typed: input.value,
      elapsedSeconds,
      durationSeconds: exercise.durationMinutes * 60,
      events
    });
    feedback.textContent = message;
    summary.innerHTML = `
      <article><strong>${report.endurance}</strong><span>resistencia</span></article>
      <article><strong>${report.sustainedAccuracy.toFixed(1)}%</strong><span>precisión sostenida</span></article>
      <article><strong>${report.paceEvolution >= 0 ? '+' : ''}${report.paceEvolution.toFixed(1)}</strong><span>evolución PPM</span></article>
      <article><strong>${report.volatility.toFixed(1)}</strong><span>variabilidad del ritmo</span></article>
      <article><strong>${report.completion.toFixed(1)}%</strong><span>texto cubierto</span></article>
    `;
    drawPaceChart(chart, report.segments);
  }

  function tick() {
    if (!startedAt) return;
    const elapsedSeconds = (Date.now() - startedAt) / 1000;
    const remaining = Math.max(0, exercise.durationMinutes * 60 - elapsedSeconds);
    const report = summarizePerformance({
      target: exercise.text,
      typed: input.value,
      elapsedSeconds: Math.max(1, elapsedSeconds),
      durationSeconds: exercise.durationMinutes * 60,
      events
    });
    timeLeft.textContent = formatTime(remaining);
    wpm.textContent = report.wpm.toFixed(0);
    accuracy.textContent = `${report.accuracy.toFixed(1)}%`;
    endurance.textContent = report.endurance.toString();
    drawPaceChart(chart, report.segments);
    if (remaining <= 0 || input.value.length >= exercise.text.length) finishTest('Prueba finalizada automáticamente.');
  }

  select.addEventListener('change', () => selectExercise(select.value), { signal });
  startButton.addEventListener('click', () => {
    input.disabled = false;
    input.focus();
    input.value = '';
    events = [];
    startedAt = Date.now();
    startButton.disabled = true;
    feedback.textContent = 'Prueba en curso: mantén precisión y ritmo estable hasta el final.';
    renderText(documentRef, targetText, exercise.text, '');
    timer = windowRef.setInterval(tick, 1000);
    tick();
  }, { signal });
  resetButton.addEventListener('click', () => {
    windowRef.clearInterval(timer);
    input.disabled = true;
    startButton.disabled = false;
    selectExercise(exercise.id);
  }, { signal });
  input.addEventListener('input', () => {
    const elapsedSeconds = startedAt ? (Date.now() - startedAt) / 1000 : 0;
    events.push({ elapsedSeconds, value: input.value });
    renderText(documentRef, targetText, exercise.text, input.value);
    tick();
  }, { signal });

  selectExercise(exercise.id);

  return {
    destroy() {
      abortController.abort();
      windowRef.clearInterval(timer);
    }
  };
}
