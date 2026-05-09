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
