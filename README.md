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
