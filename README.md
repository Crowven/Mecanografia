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
