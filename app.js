/**
 * Prototipo legado.
 *
 * La aplicación consolidada carga exclusivamente `/src/main.ts` desde Vite.
 * La lógica reutilizable que antes vivía aquí se movió a:
 * - `src/domain/assessmentMetrics.js` para métricas y ejercicios expertos.
 * - `src/features/assessment/expertAssessmentPrototype.js` para la pantalla experimental de evaluación.
 * - `src/features/practice/practiceApp.ts` para la aplicación principal.
 *
 * Este archivo se conserva solo como marcador documental para evitar que HTML
 * antiguos lo traten como punto de entrada. Importarlo no registra listeners ni
 * toca el DOM.
 */
export {};
