# Mecanografía experta

Aplicación web estática para practicar mecanografía avanzada en español. Incluye ejercicios expertos con textos extensos, pruebas cronometradas largas y contenido diseñado para entrenar números, símbolos, puntuación avanzada y vocabulario variado.

## Funcionalidades

- Catálogo de pruebas expertas de 10, 12 y 15 minutos.
- Textos extensos con cifras, porcentajes, coordenadas, divisas, símbolos técnicos, siglas, incisos, comillas y guiones largos.
- Comparación carácter a carácter con resaltado de aciertos y errores.
- Métricas en tiempo real de tiempo restante, palabras por minuto, precisión y resistencia.
- Registro por tramos de 30 segundos para analizar precisión sostenida, variabilidad y evolución del ritmo durante toda la prueba.
- Gráfico de ritmo para observar caídas, mejoras o estabilidad entre tramos.

## Uso

Abre `index.html` en un navegador moderno o sirve el directorio con cualquier servidor estático.
# Mecanografia

Repositorio de recursos para ejercicios de mecanografía.

## Textos disponibles

- `data/textos_avanzados.json`: colección de textos avanzados en español para práctica de mecanografía, organizada por temáticas narrativas, técnicas, administrativas, educativas y de uso cotidiano. Cada entrada incluye metadatos de dificultad, longitud en caracteres, número de palabras, presencia de cifras, puntuación y símbolos especiales.
# Mecanografía

Colección de ejercicios para practicar mecanografía en español, con foco en progresión, precisión y ritmo.

## Ejercicios intermedios

Los ejercicios intermedios están diseñados para personas que ya dominan el teclado básico y quieren practicar textos más naturales. Incluyen frases completas, mayúsculas, comas, puntos, acentos y textos breves.

### Objetivos

- Escribir frases completas sin perder precisión.
- Practicar mayúsculas al inicio de oración y en nombres propios.
- Usar correctamente comas, puntos y signos de puntuación frecuentes.
- Reforzar vocales acentuadas y palabras con ñ.
- Mantener un ritmo estable durante textos breves.

### Ejercicio 1: Frases con mayúsculas y punto

Escribe cada frase respetando mayúsculas, espacios y punto final.

```text
Ana prepara café antes de salir.
Luis revisa su cuaderno azul.
Marta camina rápido por la plaza.
El tren llegó temprano a Sevilla.
Carlos ordena los libros de historia.
```

### Ejercicio 2: Comas en frases completas

Escribe las frases cuidando las pausas marcadas por comas.

```text
Por la mañana, Elena abre la ventana.
Si estudias con calma, mejorarás cada día.
El perro corre, salta y vuelve al jardín.
Después de clase, iremos al parque central.
La receta lleva harina, azúcar, leche y limón.
```

### Ejercicio 3: Acentos y palabras frecuentes

Concéntrate en escribir correctamente las tildes.

```text
El camión cruzó la avenida sin dificultad.
Mi hermano encontró una canción antigua.
La próxima lección será más difícil.
Todavía queda café en la taza pequeña.
Álvaro explicó la solución con claridad.
```

### Ejercicio 4: Texto breve con puntuación

Copia el texto completo sin omitir signos de puntuación.

```text
Clara llegó temprano a la biblioteca. Saludó a Tomás, buscó una mesa libre y abrió su cuaderno. Quería terminar el resumen antes del mediodía, porque después tendría una reunión importante.
```

### Ejercicio 5: Texto breve con ritmo constante

Mantén una velocidad cómoda y evita acelerar al inicio si eso reduce tu precisión.

```text
Durante la tarde, el viento movía las hojas del patio. Inés escuchaba música suave mientras escribía una carta para su abuela. Cada línea debía quedar clara, ordenada y sin errores.
```

## Evaluación del desempeño

Cada práctica debe evaluarse con métricas que midan velocidad, precisión y regularidad. La evaluación recomendada combina precisión, PPM, WPM, errores no corregidos y estabilidad del ritmo de escritura.

### Métricas

| Métrica | Qué mide | Fórmula o criterio |
| --- | --- | --- |
| Precisión | Porcentaje de caracteres escritos correctamente. | `(caracteres correctos / caracteres totales) × 100` |
| PPM | Pulsaciones por minuto, incluyendo letras, espacios y signos. | `caracteres escritos / minutos` |
| WPM | Palabras por minuto usando el estándar de 5 caracteres por palabra. | `(caracteres escritos / 5) / minutos` |
| Errores no corregidos | Errores que permanecen en el texto final. | Conteo de sustituciones, omisiones, adiciones y signos incorrectos. |
| Estabilidad del ritmo | Variación de velocidad entre intervalos de escritura. | Comparar PPM por bloques de 10 segundos; menor variación indica mayor estabilidad. |

### Rúbrica sugerida para nivel intermedio

| Resultado | Precisión | WPM | Errores no corregidos | Ritmo |
| --- | --- | --- | --- | --- |
| Excelente | 97% o más | 45 o más | 0-1 | Muy estable |
| Bueno | 94%-96% | 35-44 | 2-3 | Estable |
| En progreso | 90%-93% | 25-34 | 4-6 | Variable |
| Reforzar | Menos de 90% | Menos de 25 | 7 o más | Irregular |

### Recomendaciones de uso

1. Realiza primero un ejercicio corto de calentamiento.
2. Escribe un ejercicio intermedio completo sin mirar el teclado.
3. Corrige al terminar, no durante la escritura, si quieres medir errores no corregidos.
4. Registra precisión, PPM, WPM y errores no corregidos.
5. Repite el mismo texto e intenta mejorar la estabilidad del ritmo antes de buscar más velocidad.
# Mecanografia

Repositorio de contenidos para prácticas de mecanografía en español.

## Ejercicios disponibles

Los ejercicios básicos combinan fila superior, fila guía e inferior e incluyen:

- Palabras frecuentes para practicar precisión inicial.
- Frases breves con vocabulario cotidiano.
- Puntuación sencilla con coma, punto, interrogación y exclamación.
- Metadatos por ejercicio: nivel, tipo, duración estimada, dificultad y objetivos técnicos.

El catálogo está disponible en [`data/ejercicios-basicos.json`](data/ejercicios-basicos.json).

## Formato de metadatos

Cada ejercicio contiene los siguientes campos:

- `id`: identificador único del ejercicio.
- `titulo`: nombre visible de la práctica.
- `nivel`: nivel pedagógico del ejercicio.
- `tipo`: categoría del contenido, por ejemplo `palabras frecuentes`, `frases breves`, `puntuacion sencilla` o `repaso mixto`.
- `duracion_estimada`: tiempo recomendado para completar la práctica.
- `dificultad`: escala numérica de 1 a 3 para este nivel básico.
- `objetivos_tecnicos`: lista de habilidades técnicas a reforzar.
- `contenido`: palabras, frases o secuencias que debe escribir el estudiante.
# Mecanografía

Aplicación web estática para practicar mecanografía en español con un modo de autoevaluación cronometrada.

## Funcionalidades

- Selección de duración de la evaluación.
- Selección de nivel de dificultad.
- Selección de tipo de texto.
- Evaluación con temporizador, cálculo de PPM, precisión, errores y caracteres correctos.
- Historial persistente por usuario en `localStorage`.
- Comparativa automática frente a la evaluación anterior equivalente.
- Panel de evolución con promedio, mejor PPM, mejor precisión y tendencia reciente.

## Uso

Abre `index.html` en un navegador moderno. No requiere instalación ni servidor.
Aplicación web estática para practicar mecanografía con ejercicios de copia.

## Funcionalidades

- Validación carácter por carácter mientras se escribe.
- Resaltado visual de caracteres correctos, incorrectos y pendientes.
- Aviso sonoro configurable para cada error detectado.
- Registro detallado de errores usado para calcular la precisión final.

## Uso local

Abre `index.html` directamente en el navegador o sirve la carpeta con cualquier servidor estático, por ejemplo:
## Servicio de almacenamiento local

El proyecto incluye un servicio de persistencia local en `src/services/localStorageService.js` para guardar datos del usuario sin depender de un backend:

- Perfil, configuración básica y progreso se almacenan en `localStorage` con claves prefijadas por `mecanografia:`.
- El historial extenso de resultados de pruebas usa IndexedDB cuando está disponible.
- En entornos sin IndexedDB se puede usar `LocalStorageHistoryStore` como abstracción compatible o inyectar otro adaptador con los métodos `add`, `list`, `clear` y `bulkPut`.
- El servicio permite exportar e importar respaldos completos en JSON.

```js
import LocalPersistenceService from './src/services/localStorageService.js';

const storage = new LocalPersistenceService();

storage.saveProfile({ name: 'Ada' });
storage.updateConfig({ theme: 'dark' });
storage.saveProgress({ currentLessonId: 'home-row' });
await storage.addTestResult({ exerciseId: 'home-row', wpm: 48, accuracy: 97 });

const backup = await storage.exportJSON();
await storage.importJSON(backup, { merge: true });
```
Pantalla principal responsive para practicar mecanografía en navegador web.

## Ejecutar localmente

Abre `index.html` directamente en el navegador o sirve el proyecto con:

```bash
python3 -m http.server 4173
```

Luego visita `http://localhost:4173`.
# Mecanografiawork

Maqueta estática de una pantalla principal para practicar mecanografía.

## Abrir la maqueta

Abre `index.html` directamente en el navegador o levanta un servidor local:

```bash
python3 -m http.server 8000
```

Después visita `http://localhost:8000`.

## Pruebas

```bash
npm test
```
node --test typingExercise.test.js
```
Luego visita <http://localhost:8000>.

## Incluye

- Panel superior con texto de referencia.
- Área inferior de escritura con estado visual de error.
- Barra de métricas para velocidad, precisión, errores y tiempo.
- Selector de nivel y selector de modo.
- Botones de control para iniciar, pausar y reiniciar.
- Tema claro/oscuro con tarjetas, bordes redondeados y diseño adaptable.
# Mecanografía

Entrenador modular de mecanografía en español preparado para ejecutarse como aplicación web, PWA instalable o aplicación local con Electron/Tauri.

## Objetivos de arquitectura

La aplicación se organiza en módulos pequeños y reemplazables para facilitar el crecimiento del producto:

| Módulo | Ruta | Responsabilidad |
| --- | --- | --- |
| Componentes visuales | `src/components` | Renderizado de cabecera, selector de ejercicios, entrenador y panel de progreso. |
| Motor de mecanografía | `src/core/typing` | Estado de sesión, comparación carácter a carácter y reinicio. |
| Cálculo de métricas | `src/core/metrics` | PPM, precisión, progreso, tiempo y errores. |
| Banco de ejercicios | `src/exercises` | Catálogo inicial de prácticas y búsqueda por identificador. |
| Persistencia local | `src/persistence` | Repositorio basado en `localStorage` para guardar resultados recientes. |
| Configuración | `src/config` | Configuración de la app y detección de runtime. |
| Plataforma | `src/platform` | Adaptadores para capacidades web, PWA, Electron y Tauri. |

## Comandos

```bash
npm install
npm run dev
npm run build
npm run preview
```

## PWA

La integración PWA se define en `vite.config.ts` mediante `vite-plugin-pwa`. El manifiesto, los colores de tema y los assets quedan preparados para instalación en navegadores compatibles.

## Electron

La base de Electron se encuentra en `electron/` y expone un preload mínimo para detectar el runtime de escritorio.

```bash
npm run electron:dev
```

Para empaquetado final se recomienda agregar `electron-builder`, `electron-forge` o la herramienta de distribución elegida por plataforma.

## Tauri

La base de Tauri 2 se encuentra en `src-tauri/` con configuración para reutilizar el build de Vite. Instala la CLI de Tauri en el entorno local antes de usar los comandos `tauri:*`.

```bash
npm run tauri:dev
npm run tauri:build
```

Antes de publicar instaladores de escritorio, genera los iconos nativos de Tauri a partir de `public/favicon.svg` o del arte final de marca con la herramienta de iconos de Tauri. No se versiona un PNG provisional para mantener el repositorio compatible con revisiones que no admiten binarios.
# Mecanografia

Banco inicial de ejercicios para una aplicación o curso de mecanografía en español.

## Banco de ejercicios

El archivo [`data/ejercicios.json`](data/ejercicios.json) contiene 300 ejercicios estructurados para práctica progresiva. Están repartidos de forma equilibrada en cinco niveles:

| Nivel | Ejercicios |
| --- | ---: |
| `principiante` | 60 |
| `basico` | 60 |
| `intermedio` | 60 |
| `avanzado` | 60 |
| `experto` | 60 |

También se distribuyen en 15 tipos, con 20 ejercicios por tipo:

- `fila_guia`
- `precision`
- `palabras`
- `fila_superior`
- `fila_inferior`
- `puntuacion`
- `acentos`
- `numeros`
- `frases`
- `simbolos`
- `velocidad`
- `mayusculas`
- `mixto`
- `codigo`
- `dictado_tecnico`

Cada ejercicio incluye los siguientes campos:

| Campo | Descripción |
| --- | --- |
| `id` | Identificador estable del ejercicio. |
| `titulo` | Nombre legible para mostrar en la interfaz. |
| `nivel` | Dificultad progresiva del ejercicio. |
| `tipo` | Categoría técnica principal. |
| `texto` | Texto que debe copiar o practicar la persona usuaria. |
| `duracion_sugerida_segundos` | Tiempo recomendado para la sesión. |
| `objetivos_tecnicos` | Lista de habilidades que se entrenan. |
| `etiquetas` | Marcadores de contenido como `acentos`, `numeros`, `simbolos`, `puntuacion` o `mayusculas`. |
