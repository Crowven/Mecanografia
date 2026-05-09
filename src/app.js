export const SEGMENT_SECONDS = 30;

export const expertExercises = [
  {
    id: 'auditoria-operativa-12',
    title: 'Auditoría operativa multinacional',
    durationMinutes: 12,
    description:
      'Texto corporativo extenso con cifras, porcentajes, siglas, guiones largos, paréntesis y puntuación avanzada.',
    text: `El comité de auditoría revisó, entre las 07:45 y las 18:30, 42 expedientes de compras internacionales; el objetivo era confirmar que cada orden —incluidas las de emergencia— respetara el umbral de 99.950,75 € y la política ISO-27001. La directora financiera escribió: "No basta con cuadrar importes; debemos explicar por qué un proveedor cambia de riesgo B+ a A- en menos de 90 días". Después, el equipo comparó facturas #INV-2026-00418, #INV-2026-00419 y #INV-2026-00420 con contratos marco, anexos técnicos, notas de crédito y correos archivados.

Durante la segunda fase aparecieron variaciones pequeñas, aunque persistentes: +0,8 % en transporte, -1,3 % en almacenamiento y +2,1 % en licencias de software. Nadie las consideró dramáticas por separado; sin embargo, al proyectarlas sobre 1.250.000 unidades, el impacto anual superaba 314.000 €. La analista principal pidió reconstruir la cadena de aprobación: solicitud inicial, validación jurídica, visto bueno de ciberseguridad, firma electrónica y registro contable. Cada paso debía contener fecha, hora, usuario, dirección IP y una justificación legible.

El informe final incluyó recomendaciones precisas: (1) bloquear pagos sin doble factor; (2) separar roles de compra, recepción y conciliación; (3) generar alertas cuando un descuento sea mayor del 17,5 %; y (4) revisar proveedores inactivos antes del cierre trimestral. La conclusión fue sobria pero contundente: la organización no sufría fraude sistémico, aunque sí una acumulación de excepciones manuales que, si continuaban durante seis meses, degradarían la trazabilidad, la confianza y la capacidad de negociación.`
  },
  {
    id: 'cronica-cientifica-15',
    title: 'Crónica científica de campo',
    durationMinutes: 15,
    description:
      'Prueba larga con vocabulario técnico, coordenadas, unidades, símbolos matemáticos y frases de longitud variable.',
    text: `A las 05:12, cuando la temperatura era de -3,7 °C y el viento soplaba a 24 km/h desde el noreste, el equipo instaló sensores en las coordenadas 41.40338, 2.17403. La hipótesis de trabajo era simple de formular y difícil de demostrar: si la humedad relativa permanecía por encima del 82 % durante más de 180 minutos, entonces la película superficial del material compuesto perdería rigidez elástica (E≈4,2 GPa) y aumentaría su coeficiente de fricción. Para evitar sesgos, cada muestra recibió un código ciego: ALFA-07, BETA-11, GAMMA-23 y DELTA-31.

La bitácora registró observaciones minuciosas: microfisuras con forma de abanico; depósitos salinos en bordes irregulares; ruido intermitente en el canal 3; y una desviación de 0,004 V que no coincidía con la calibración nocturna. "Repitan la medición, pero no borren el dato anómalo", indicó la responsable del laboratorio. Más tarde, el modelo estadístico combinó medianas robustas, intervalos de confianza al 95 %, pruebas U de Mann-Whitney y una corrección de Holm-Bonferroni. El resultado no fue espectacular, pero sí útil: el tratamiento térmico redujo la variabilidad entre lotes del 12,6 % al 5,4 %.

Al redactar la crónica, se evitó la tentación de exagerar. La ciencia avanza también cuando confirma límites: qué instrumento satura, qué muestra se contamina, qué ecuación deja de describir la realidad y qué palabra —"probable", "posible", "compatible"— expresa mejor la incertidumbre. Por eso el documento terminó con una lista de tareas: ampliar la serie temporal a 30 días, automatizar la captura cada 15 s, publicar datos en formato CSV/JSON y preparar una réplica independiente antes del 31/10/2026.`
  },
  {
    id: 'ensayo-juridico-tecnico-10',
    title: 'Ensayo jurídico-técnico',
    durationMinutes: 10,
    description:
      'Contenido denso con incisos, citas, numeración legal, símbolos y cambios frecuentes de ritmo lingüístico.',
    text: `El artículo 14.2 del borrador establecía que ningún sistema automatizado podría tomar decisiones irreversibles sin una explicación "clara, suficiente y verificable"; esa frase, aparentemente inocua, provocó 27 comentarios en la mesa técnica. Un representante preguntó si "verificable" significaba reproducible byte a byte, auditable por un tercero o comprensible para una persona no experta. La diferencia importaba: una red neuronal puede conservar registros, pesos y métricas sin ofrecer, por ello, una narración causal convincente.

La propuesta revisada añadió tres garantías: trazabilidad de datos de entrada, registro de cambios del modelo y derecho a revisión humana en menos de 72 horas. También incorporó excepciones estrictas para emergencias médicas, seguridad pública y prevención de daños ambientales; aun así, cada excepción debía documentarse con identificador único, finalidad, base jurídica, responsable y fecha de caducidad. En el margen, alguien escribió: "la urgencia no debe convertirse en arquitectura permanente".

El debate terminó con una fórmula de compromiso: evaluación previa de impacto, controles proporcionales al riesgo y sanciones graduadas entre 5.000 € y 2.000.000 €, salvo reincidencia dolosa. La versión final no agradó por completo a nadie, lo cual suele indicar que una norma ha empezado a equilibrar intereses reales: innovación, transparencia, seguridad, competencia, privacidad y reparación efectiva.`
  }
];

export function compareTyping(target, typed) {
  let correct = 0;
  for (let index = 0; index < typed.length; index += 1) {
    if (typed[index] === target[index]) correct += 1;
  }
  const total = typed.length;
  const errors = Math.max(0, total - correct);
  const accuracy = total === 0 ? 100 : (correct / total) * 100;
  return { correct, total, errors, accuracy };
}

export function calculateWpm(correctCharacters, elapsedSeconds) {
  if (elapsedSeconds <= 0) return 0;
  return (correctCharacters / 5) / (elapsedSeconds / 60);
}

export function buildSegments(events, target, segmentSeconds = SEGMENT_SECONDS) {
  if (events.length === 0) return [];
  const maxSegment = Math.max(...events.map((event) => Math.floor(event.elapsedSeconds / segmentSeconds)));
  const segments = [];

  for (let segmentIndex = 0; segmentIndex <= maxSegment; segmentIndex += 1) {
    const endTime = (segmentIndex + 1) * segmentSeconds;
    const previousEndTime = segmentIndex * segmentSeconds;
    const endEvent = [...events].reverse().find((event) => event.elapsedSeconds <= endTime) ?? events[0];
    const previousEvent = [...events].reverse().find((event) => event.elapsedSeconds <= previousEndTime);
    const endComparison = compareTyping(target, endEvent.value);
    const previousComparison = previousEvent ? compareTyping(target, previousEvent.value) : { correct: 0, total: 0 };
    const correctDelta = Math.max(0, endComparison.correct - previousComparison.correct);
    const typedDelta = Math.max(0, endComparison.total - previousComparison.total);
    const accuracy = typedDelta === 0 ? 100 : (correctDelta / typedDelta) * 100;

    segments.push({
      index: segmentIndex + 1,
      startSeconds: previousEndTime,
      endSeconds: endTime,
      wpm: calculateWpm(correctDelta, segmentSeconds),
      accuracy,
      typedCharacters: typedDelta,
      correctCharacters: correctDelta
    });
  }

  return segments;
}

export function summarizePerformance({ target, typed, elapsedSeconds, durationSeconds, events }) {
  const comparison = compareTyping(target, typed);
  const wpm = calculateWpm(comparison.correct, elapsedSeconds);
  const completion = Math.min(100, (typed.length / target.length) * 100);
  const segments = buildSegments(events, target);
  const activeSegments = segments.filter((segment) => segment.typedCharacters > 0);
  const sustainedAccuracy = activeSegments.length === 0
    ? comparison.accuracy
    : activeSegments.reduce((sum, segment) => sum + segment.accuracy, 0) / activeSegments.length;
  const wpms = activeSegments.map((segment) => segment.wpm);
  const averageSegmentWpm = wpms.length === 0 ? 0 : wpms.reduce((sum, value) => sum + value, 0) / wpms.length;
  const volatility = wpms.length <= 1
    ? 0
    : Math.sqrt(wpms.reduce((sum, value) => sum + (value - averageSegmentWpm) ** 2, 0) / wpms.length);
  const firstHalf = wpms.slice(0, Math.ceil(wpms.length / 2));
  const secondHalf = wpms.slice(Math.ceil(wpms.length / 2));
  const firstAverage = firstHalf.length === 0 ? 0 : firstHalf.reduce((sum, value) => sum + value, 0) / firstHalf.length;
  const secondAverage = secondHalf.length === 0 ? firstAverage : secondHalf.reduce((sum, value) => sum + value, 0) / secondHalf.length;
  const paceEvolution = secondAverage - firstAverage;
  const durationCoverage = Math.min(100, (elapsedSeconds / durationSeconds) * 100);
  const consistencyScore = averageSegmentWpm === 0 ? 0 : Math.max(0, 100 - (volatility / averageSegmentWpm) * 100);
  const endurance = Math.round((durationCoverage * 0.35) + (sustainedAccuracy * 0.35) + (consistencyScore * 0.2) + (completion * 0.1));

  return {
    ...comparison,
    wpm,
    completion,
    segments,
    sustainedAccuracy,
    paceEvolution,
    volatility,
    endurance
  };
}

function formatTime(seconds) {
  const minutes = Math.floor(seconds / 60).toString().padStart(2, '0');
  const remainingSeconds = Math.floor(seconds % 60).toString().padStart(2, '0');
  return `${minutes}:${remainingSeconds}`;
}

function renderText(targetElement, target, typed) {
  targetElement.innerHTML = '';
  const fragment = document.createDocumentFragment();
  for (let index = 0; index < target.length; index += 1) {
    const span = document.createElement('span');
    span.textContent = target[index];
    if (index < typed.length) span.className = typed[index] === target[index] ? 'correct' : 'incorrect';
    if (index === typed.length) span.classList.add('cursor');
    fragment.appendChild(span);
  }
  targetElement.appendChild(fragment);
}

function drawChart(canvas, segments) {
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
  context.fillStyle = '#1d4ed8';
  segments.forEach((segment, index) => {
    const x = 40 + index * xStep;
    const y = height - 30 - (segment.wpm / maxWpm) * (height - 70);
    context.beginPath();
    context.arc(x, y, 4, 0, Math.PI * 2);
    context.fill();
  });
}

function initApp() {
  const select = document.querySelector('#exercise-select');
  const startButton = document.querySelector('#start-button');
  const resetButton = document.querySelector('#reset-button');
  const title = document.querySelector('#exercise-title');
  const duration = document.querySelector('#exercise-duration');
  const description = document.querySelector('#exercise-description');
  const targetText = document.querySelector('#target-text');
  const input = document.querySelector('#typing-input');
  const timeLeft = document.querySelector('#time-left');
  const wpm = document.querySelector('#wpm');
  const accuracy = document.querySelector('#accuracy');
  const endurance = document.querySelector('#endurance');
  const feedback = document.querySelector('#feedback');
  const summary = document.querySelector('#results-summary');
  const chart = document.querySelector('#pace-chart');

  let exercise = expertExercises[0];
  let startedAt = null;
  let timer = null;
  let events = [];

  expertExercises.forEach((item) => {
    const option = document.createElement('option');
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
    renderText(targetText, exercise.text, '');
    drawChart(chart, []);
  }

  function finishTest(message = 'Prueba finalizada.') {
    clearInterval(timer);
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
    drawChart(chart, report.segments);
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
    drawChart(chart, report.segments);
    if (remaining <= 0 || input.value.length >= exercise.text.length) finishTest('Prueba finalizada automáticamente.');
  }

  select.addEventListener('change', () => selectExercise(select.value));
  startButton.addEventListener('click', () => {
    input.disabled = false;
    input.focus();
    input.value = '';
    events = [];
    startedAt = Date.now();
    startButton.disabled = true;
    feedback.textContent = 'Prueba en curso: mantén precisión y ritmo estable hasta el final.';
    renderText(targetText, exercise.text, '');
    timer = setInterval(tick, 1000);
    tick();
  });
  resetButton.addEventListener('click', () => {
    clearInterval(timer);
    input.disabled = true;
    startButton.disabled = false;
    selectExercise(exercise.id);
  });
  input.addEventListener('input', () => {
    const elapsedSeconds = startedAt ? (Date.now() - startedAt) / 1000 : 0;
    events.push({ elapsedSeconds, value: input.value });
    renderText(targetText, exercise.text, input.value);
    tick();
  });

  selectExercise(exercise.id);
}

if (typeof document !== 'undefined') initApp();
const practiceSessions = [
  {
    date: '2026-04-01',
    level: 'Inicial',
    mode: 'Texto guiado',
    durationMinutes: 4,
    ppm: 142,
    wpm: 28,
    accuracy: 91,
    streak: 86,
    errors: { a: 4, s: 2, ñ: 1, ' ': 5 },
  },
  {
    date: '2026-04-04',
    level: 'Inicial',
    mode: 'Contrarreloj',
    durationMinutes: 6,
    ppm: 158,
    wpm: 32,
    accuracy: 92,
    streak: 104,
    errors: { a: 2, l: 3, ' ': 4, q: 1 },
  },
  {
    date: '2026-04-08',
    level: 'Intermedio',
    mode: 'Texto guiado',
    durationMinutes: 8,
    ppm: 176,
    wpm: 35,
    accuracy: 94,
    streak: 137,
    errors: { j: 3, k: 2, ñ: 3, ' ': 2 },
  },
  {
    date: '2026-04-11',
    level: 'Intermedio',
    mode: 'Precisión',
    durationMinutes: 12,
    ppm: 169,
    wpm: 34,
    accuracy: 97,
    streak: 181,
    errors: { b: 1, v: 2, n: 1, ' ': 1 },
  },
  {
    date: '2026-04-17',
    level: 'Avanzado',
    mode: 'Contrarreloj',
    durationMinutes: 15,
    ppm: 194,
    wpm: 39,
    accuracy: 95,
    streak: 164,
    errors: { ';': 3, p: 2, q: 2, ' ': 3 },
  },
  {
    date: '2026-04-22',
    level: 'Avanzado',
    mode: 'Código',
    durationMinutes: 18,
    ppm: 205,
    wpm: 41,
    accuracy: 93,
    streak: 158,
    errors: { '{': 4, '}': 3, ';': 5, '=': 2 },
  },
  {
    date: '2026-04-28',
    level: 'Intermedio',
    mode: 'Precisión',
    durationMinutes: 10,
    ppm: 188,
    wpm: 38,
    accuracy: 98,
    streak: 214,
    errors: { m: 1, n: 1, ' ': 1, '.': 2 },
  },
  {
    date: '2026-05-03',
    level: 'Avanzado',
    mode: 'Texto guiado',
    durationMinutes: 16,
    ppm: 216,
    wpm: 43,
    accuracy: 96,
    streak: 231,
    errors: { z: 2, x: 2, c: 1, ' ': 4 },
  },
  {
    date: '2026-05-07',
    level: 'Avanzado',
    mode: 'Código',
    durationMinutes: 20,
    ppm: 223,
    wpm: 45,
    accuracy: 95,
    streak: 247,
    errors: { '{': 3, '}': 2, ';': 4, ':': 2 },
  },
];

const elements = {
  totalPracticeTime: document.querySelector('#totalPracticeTime'),
  sessionCount: document.querySelector('#sessionCount'),
  levelFilter: document.querySelector('#levelFilter'),
  modeFilter: document.querySelector('#modeFilter'),
  fromDateFilter: document.querySelector('#fromDateFilter'),
  toDateFilter: document.querySelector('#toDateFilter'),
  durationFilter: document.querySelector('#durationFilter'),
  filtersForm: document.querySelector('#progressFilters'),
  bestPpm: document.querySelector('#bestPpm'),
  bestPpmMeta: document.querySelector('#bestPpmMeta'),
  bestWpm: document.querySelector('#bestWpm'),
  bestWpmMeta: document.querySelector('#bestWpmMeta'),
  averageAccuracy: document.querySelector('#averageAccuracy'),
  accuracyTrend: document.querySelector('#accuracyTrend'),
  bestStreak: document.querySelector('#bestStreak'),
  speedChart: document.querySelector('#speedChart'),
  frequentErrorsList: document.querySelector('#frequentErrorsList'),
  historyTableBody: document.querySelector('#historyTableBody'),
  historySummary: document.querySelector('#historySummary'),
};

const dateFormatter = new Intl.DateTimeFormat('es', {
  day: '2-digit',
  month: 'short',
  year: 'numeric',
});

function getUniqueValues(key) {
  return [...new Set(practiceSessions.map((session) => session[key]))].sort();
}

function fillSelect(select, values) {
  values.forEach((value) => {
    const option = document.createElement('option');
    option.value = value;
    option.textContent = value;
    select.append(option);
  });
}

function durationMatches(sessionDuration, selectedDuration) {
  if (selectedDuration === 'short') {
    return sessionDuration <= 5;
  }

  if (selectedDuration === 'medium') {
    return sessionDuration >= 6 && sessionDuration <= 15;
  }

  if (selectedDuration === 'long') {
    return sessionDuration > 15;
  }

  return true;
}

function getFilteredSessions() {
  const filters = {
    level: elements.levelFilter.value,
    mode: elements.modeFilter.value,
    fromDate: elements.fromDateFilter.value,
    toDate: elements.toDateFilter.value,
    duration: elements.durationFilter.value,
  };

  return practiceSessions.filter((session) => {
    const matchesLevel = filters.level === 'all' || session.level === filters.level;
    const matchesMode = filters.mode === 'all' || session.mode === filters.mode;
    const matchesFromDate = !filters.fromDate || session.date >= filters.fromDate;
    const matchesToDate = !filters.toDate || session.date <= filters.toDate;
    const matchesDuration = durationMatches(session.durationMinutes, filters.duration);

    return matchesLevel && matchesMode && matchesFromDate && matchesToDate && matchesDuration;
  });
}

function formatDate(date) {
  return dateFormatter.format(new Date(`${date}T00:00:00`));
}

function getBestSession(sessions, metric) {
  return sessions.reduce((best, current) => (current[metric] > best[metric] ? current : best), sessions[0]);
}

function updateMetricCards(sessions) {
  if (!sessions.length) {
    elements.bestPpm.textContent = '0';
    elements.bestPpmMeta.textContent = 'Sin datos';
    elements.bestWpm.textContent = '0';
    elements.bestWpmMeta.textContent = 'Sin datos';
    elements.averageAccuracy.textContent = '0%';
    elements.accuracyTrend.textContent = 'Ajusta los filtros';
    elements.bestStreak.textContent = '0';
    elements.totalPracticeTime.textContent = '0 min';
    elements.sessionCount.textContent = '0 sesiones';
    return;
  }

  const totalMinutes = sessions.reduce((total, session) => total + session.durationMinutes, 0);
  const averageAccuracy = sessions.reduce((total, session) => total + session.accuracy, 0) / sessions.length;
  const bestPpmSession = getBestSession(sessions, 'ppm');
  const bestWpmSession = getBestSession(sessions, 'wpm');
  const bestStreakSession = getBestSession(sessions, 'streak');

  elements.totalPracticeTime.textContent = `${totalMinutes} min`;
  elements.sessionCount.textContent = `${sessions.length} ${sessions.length === 1 ? 'sesión' : 'sesiones'}`;
  elements.bestPpm.textContent = bestPpmSession.ppm;
  elements.bestPpmMeta.textContent = `${bestPpmSession.level} · ${formatDate(bestPpmSession.date)}`;
  elements.bestWpm.textContent = bestWpmSession.wpm;
  elements.bestWpmMeta.textContent = `${bestWpmSession.mode} · ${formatDate(bestWpmSession.date)}`;
  elements.averageAccuracy.textContent = `${averageAccuracy.toFixed(1)}%`;
  elements.accuracyTrend.textContent = `${sessions.length} prácticas filtradas`;
  elements.bestStreak.textContent = bestStreakSession.streak;
}

function getFrequentErrors(sessions) {
  const totals = sessions.reduce((accumulator, session) => {
    Object.entries(session.errors).forEach(([key, count]) => {
      accumulator[key] = (accumulator[key] ?? 0) + count;
    });
    return accumulator;
  }, {});

  return Object.entries(totals)
    .map(([key, count]) => ({ key, count }))
    .sort((first, second) => second.count - first.count)
    .slice(0, 5);
}

function renderFrequentErrors(sessions) {
  const errors = getFrequentErrors(sessions);
  elements.frequentErrorsList.innerHTML = '';

  if (!errors.length) {
    elements.frequentErrorsList.innerHTML = '<p class="empty-state">No hay errores para los filtros seleccionados.</p>';
    return;
  }

  const maxCount = errors[0].count;
  errors.forEach((error) => {
    const row = document.createElement('div');
    row.className = 'error-row';
    row.innerHTML = `
      <span class="error-row__key">${error.key === ' ' ? 'Espacio' : error.key}</span>
      <div class="error-row__bar" aria-hidden="true"><span style="width: ${(error.count / maxCount) * 100}%"></span></div>
      <strong>${error.count}</strong>
    `;
    elements.frequentErrorsList.append(row);
  });
}

function renderHistory(sessions) {
  const sortedSessions = [...sessions].sort((first, second) => second.date.localeCompare(first.date));
  elements.historyTableBody.innerHTML = '';
  elements.historySummary.textContent = `${sessions.length} ${sessions.length === 1 ? 'resultado' : 'resultados'}`;

  if (!sessions.length) {
    elements.historyTableBody.innerHTML = '<tr><td colspan="8" class="empty-state">No hay prácticas que coincidan con los filtros.</td></tr>';
    return;
  }

  sortedSessions.forEach((session) => {
    const row = document.createElement('tr');
    row.innerHTML = `
      <td>${formatDate(session.date)}</td>
      <td><span class="tag">${session.level}</span></td>
      <td>${session.mode}</td>
      <td>${session.durationMinutes} min</td>
      <td>${session.ppm}</td>
      <td>${session.wpm}</td>
      <td>${session.accuracy}%</td>
      <td>${Object.values(session.errors).reduce((total, count) => total + count, 0)}</td>
    `;
    elements.historyTableBody.append(row);
  });
}

function drawChart(sessions) {
  const canvas = elements.speedChart;
  const context = canvas.getContext('2d');
  const { width, height } = canvas;
  const padding = 54;
  const chartWidth = width - padding * 2;
  const chartHeight = height - padding * 2;

  context.clearRect(0, 0, width, height);
  context.fillStyle = '#f8fafc';
  context.fillRect(0, 0, width, height);

  if (!sessions.length) {
    context.fillStyle = '#64748b';
    context.font = '24px Inter, sans-serif';
    context.textAlign = 'center';
    context.fillText('Sin datos para mostrar', width / 2, height / 2);
    return;
  }

  const sortedSessions = [...sessions].sort((first, second) => first.date.localeCompare(second.date));
  const maxValue = Math.max(...sortedSessions.flatMap((session) => [session.ppm, session.wpm])) + 20;
  const minValue = Math.max(0, Math.min(...sortedSessions.flatMap((session) => [session.ppm, session.wpm])) - 20);
  const range = maxValue - minValue || 1;

  context.strokeStyle = '#e2e8f0';
  context.lineWidth = 1;
  context.font = '18px Inter, sans-serif';
  context.fillStyle = '#64748b';
  context.textAlign = 'right';

  for (let index = 0; index <= 4; index += 1) {
    const y = padding + (chartHeight / 4) * index;
    const value = Math.round(maxValue - (range / 4) * index);
    context.beginPath();
    context.moveTo(padding, y);
    context.lineTo(width - padding, y);
    context.stroke();
    context.fillText(value, padding - 12, y + 6);
  }

  function getPoint(session, index, metric) {
    const x = padding + (sortedSessions.length === 1 ? chartWidth / 2 : (chartWidth / (sortedSessions.length - 1)) * index);
    const y = padding + chartHeight - ((session[metric] - minValue) / range) * chartHeight;
    return { x, y };
  }

  function drawLine(metric, color) {
    context.strokeStyle = color;
    context.fillStyle = color;
    context.lineWidth = 4;
    context.beginPath();
    sortedSessions.forEach((session, index) => {
      const point = getPoint(session, index, metric);
      if (index === 0) {
        context.moveTo(point.x, point.y);
      } else {
        context.lineTo(point.x, point.y);
      }
    });
    context.stroke();

    sortedSessions.forEach((session, index) => {
      const point = getPoint(session, index, metric);
      context.beginPath();
      context.arc(point.x, point.y, 6, 0, Math.PI * 2);
      context.fill();
    });
  }

  drawLine('ppm', '#2563eb');
  drawLine('wpm', '#f97316');

  context.fillStyle = '#475569';
  context.textAlign = 'center';
  sortedSessions.forEach((session, index) => {
    const point = getPoint(session, index, 'wpm');
    context.fillText(formatDate(session.date).replace('2026', ''), point.x, height - 18);
  });
}

function renderDashboard() {
  const filteredSessions = getFilteredSessions();
  updateMetricCards(filteredSessions);
  drawChart(filteredSessions);
  renderFrequentErrors(filteredSessions);
  renderHistory(filteredSessions);
}

function resetFilters() {
  window.requestAnimationFrame(renderDashboard);
}

fillSelect(elements.levelFilter, getUniqueValues('level'));
fillSelect(elements.modeFilter, getUniqueValues('mode'));
elements.filtersForm.addEventListener('input', renderDashboard);
elements.filtersForm.addEventListener('reset', resetFilters);
renderDashboard();
