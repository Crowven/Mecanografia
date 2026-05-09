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
