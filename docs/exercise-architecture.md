# Arquitectura de ejercicios

La arquitectura separa el flujo común de una práctica de mecanografía de las
reglas concretas de validación de cada ejercicio. El objetivo es que todos los
modos compartan el motor de tiempo y métricas, mientras que cada modo decide qué
significa que una entrada sea correcta, esté en progreso o haya terminado.

## Componentes

- `ExerciseSession`: coordina la definición del ejercicio, el validador activo,
  el temporizador y la generación de snapshots para la interfaz.
- `TimerEngine`: inicia el conteo en la primera entrada, conserva el tiempo al
  completar el ejercicio y también permite finalizar una práctica manualmente.
- `calculateMetrics`: calcula caracteres escritos, caracteres correctos,
  errores, precisión, CPM, WPM y progreso usando el resultado del validador.
- `createValidator`: funciona como fábrica para seleccionar el validador de
  acuerdo con el modo del ejercicio.

## Modos soportados

| Modo | Validación | Uso esperado |
| --- | --- | --- |
| `exact-copy` | Comparación carácter por carácter contra un objetivo único. | Copia exacta de líneas cortas o ejercicios de precisión. |
| `words` | Comparación por palabras, permitiendo que la palabra activa sea un prefijo válido. | Práctica de vocabulario o secuencias de palabras. |
| `phrases` | Normaliza espacios internos y conserva puntuación significativa. | Frases breves donde el espaciado accidental no debe penalizar tanto como el texto. |
| `full-text` | Comparación de texto completo con normalización de saltos de línea y segmentos por párrafo. | Transcripción de textos largos. |
| `free-writing` | No tiene objetivo textual; todo carácter cuenta como correcto y se puede completar por meta opcional. | Redacción libre, calentamientos o retos creativos. |

## Contrato de integración

La UI debe crear una sesión con `createExerciseSession(definition)`, enviar cada
cambio de texto mediante `session.update(input)` y pintar el snapshot devuelto.
El snapshot siempre tiene la misma forma:

```js
{
  mode,
  input,
  target,
  validation: {
    correctCharacters,
    errors,
    isValidSoFar,
    isComplete,
    progress,
    segments
  },
  metrics: {
    elapsedMs,
    typedCharacters,
    correctCharacters,
    errors,
    accuracy,
    cpm,
    wpm,
    progress
  }
}
```

Esta estructura permite añadir nuevos modos creando otro validador con el mismo
contrato sin cambiar el temporizador, las métricas ni los componentes de alto
nivel.
