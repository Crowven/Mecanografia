# Especificación funcional inicial — Mecanografía

## 1. Objetivo del producto

Mecanografía es una aplicación de práctica y evaluación diseñada para mejorar la velocidad, precisión y constancia al escribir en teclado. El sistema debe ofrecer ejercicios guiados, pruebas libres cronometradas y una evaluación inicial que permita asignar un nivel de usuario y recomendar prácticas adecuadas.

## 2. Alcance inicial

La primera versión funcional debe cubrir:

- Registro local del progreso del usuario.
- Evaluación inicial de nivel.
- Modos de práctica estructurada.
- Pruebas libres cronometradas.
- Medición de velocidad, precisión y errores.
- Historial básico de resultados.
- Recomendaciones de ejercicios según desempeño.

Quedan fuera del alcance inicial las funciones multijugador, sincronización en la nube, rankings globales, gestión avanzada de cuentas y analíticas comparativas entre usuarios.

## 3. Niveles de usuario

El sistema clasificará al usuario en niveles según su rendimiento, principalmente por palabras por minuto netas, precisión y consistencia.

| Nivel | Descripción | Criterios orientativos |
| --- | --- | --- |
| Inicial | Usuario que está aprendiendo ubicación de teclas y ritmo básico. | Menos de 20 WPM netas o precisión inferior al 85 %. |
| Básico | Usuario capaz de completar textos simples con errores frecuentes. | 20–35 WPM netas y precisión mínima del 85 %. |
| Intermedio | Usuario con ritmo estable y errores moderados. | 36–55 WPM netas y precisión mínima del 90 %. |
| Avanzado | Usuario rápido, preciso y consistente. | 56–75 WPM netas y precisión mínima del 94 %. |
| Experto | Usuario con alta velocidad y control de errores. | Más de 75 WPM netas y precisión mínima del 96 %. |

El nivel debe recalcularse después de la evaluación inicial y podrá actualizarse con evaluaciones posteriores o con un promedio ponderado de pruebas recientes.

## 4. Tipos de ejercicios

### 4.1 Ejercicios por filas del teclado

Prácticas centradas en zonas específicas:

- Fila guía.
- Fila superior.
- Fila inferior.
- Combinaciones entre filas.
- Números y símbolos.

### 4.2 Ejercicios por caracteres problemáticos

El sistema debe detectar caracteres, combinaciones o patrones con mayor tasa de error y generar ejercicios específicos para reforzarlos.

### 4.3 Ejercicios de palabras

Prácticas basadas en listas de palabras:

- Palabras cortas.
- Palabras frecuentes.
- Palabras con acentos o caracteres especiales.
- Palabras con combinaciones difíciles.

### 4.4 Ejercicios de frases y textos

Prácticas con contenido de mayor longitud:

- Frases breves.
- Párrafos simples.
- Textos largos.
- Textos con puntuación y mayúsculas.

### 4.5 Ejercicios de precisión

Modo enfocado en reducir errores antes de aumentar velocidad. Puede penalizar fuertemente las correcciones y recomendar repetir el ejercicio cuando la precisión sea baja.

### 4.6 Ejercicios de velocidad

Modo enfocado en aumentar el ritmo de escritura con límites de tiempo o metas de PPM o WPM. Debe mantener un umbral mínimo de precisión para evitar reforzar malos hábitos.

## 5. Métricas de evaluación

El sistema debe calcular y mostrar métricas durante o al finalizar cada ejercicio, según corresponda.

### 5.1 Métricas principales

- **PPM / pulsaciones por minuto (`keystrokesPerMinute` o `ppm`):** caracteres escritos por minuto; incluye caracteres correctos, incorrectos y extra.
- **WPM brutas (`grossWpm` / `grossWordsPerMinute`):** palabras estándar por minuto sin descontar errores; se calcula con todos los caracteres escritos.
- **WPM netas (`netWpm` / `netWordsPerMinute`):** palabras estándar por minuto con caracteres correctos o penalizados por errores no corregidos, según el contexto de evaluación.
- **Precisión (`accuracy`):** porcentaje de caracteres correctos; en práctica en vivo y escritura libre se calcula sobre caracteres escritos, y en puntuación final con texto objetivo sobre el denominador esperado por el modo.
- **Errores totales:** cantidad de caracteres incorrectos.
- **Errores corregidos:** errores que el usuario corrigió antes de finalizar.
- **Errores no corregidos:** errores presentes al finalizar.
- **Tiempo transcurrido:** duración total del ejercicio.
- **Progreso del texto:** porcentaje completado.

### 5.2 Métricas secundarias

- Ritmo promedio por tramo.
- Mejor racha sin errores.
- Caracteres más fallados.
- Palabras con mayor dificultad.
- Consistencia entre intentos.
- Uso de retroceso o correcciones.

### 5.3 Cálculo orientativo

- Una palabra estándar equivale a 5 caracteres.
- `keystrokesPerMinute` / `ppm = caracteres escritos / minutos transcurridos`.
- `grossWpm = (caracteres escritos / 5) / minutos transcurridos`.
- `netWpm = (caracteres netos / 5) / minutos transcurridos`.
- En métricas en vivo, `caracteres netos = caracteres correctos` porque cada error ya queda excluido del numerador neto.
- En puntuación final con errores no corregidos, `caracteres netos = max(caracteres correctos - errores no corregidos, 0)` para que sustituciones, omisiones y caracteres extra reduzcan la velocidad neta.
- En práctica en vivo y escritura libre, `accuracy = caracteres correctos / caracteres escritos * 100`; si no hay validación de errores, la precisión será 100 % mientras todos los caracteres se acepten como correctos.
- En puntuación final con texto objetivo, `accuracy = caracteres correctos / max(caracteres esperados, caracteres escritos) * 100` para que omisiones y caracteres extra no inflen la precisión.

Estas fórmulas son la semántica única de la aplicación: PPM siempre significa caracteres por minuto, mientras que las palabras por minuto se muestran como WPM brutas o WPM netas.

## 6. Sistema de guardado

### 6.1 Datos a guardar

El sistema debe almacenar, como mínimo:

- Perfil local del usuario.
- Nivel actual.
- Fecha de creación del perfil.
- Resultados de la evaluación inicial.
- Historial de ejercicios completados.
- Métricas principales por intento.
- Configuración de práctica preferida.
- Caracteres o patrones problemáticos detectados.

### 6.2 Persistencia inicial

Para la primera versión, el guardado puede implementarse de forma local, por ejemplo mediante almacenamiento del navegador, archivo local o base de datos embebida, según la plataforma final del proyecto.

### 6.3 Requisitos del guardado

- Guardar automáticamente al finalizar cada ejercicio.
- Evitar pérdida de progreso ante cierre accidental cuando sea viable.
- Permitir reiniciar el progreso del usuario con confirmación explícita.
- Mantener compatibilidad razonable ante cambios menores del formato de datos.
- Incluir versión del esquema de guardado para futuras migraciones.

## 7. Modos de práctica

### 7.1 Práctica guiada

El sistema recomienda ejercicios según nivel, historial y errores frecuentes. Es el modo principal para usuarios nuevos.

### 7.2 Práctica por objetivo

El usuario selecciona un objetivo específico:

- Mejorar precisión.
- Mejorar velocidad.
- Practicar símbolos.
- Practicar palabras frecuentes.
- Practicar textos largos.

### 7.3 Práctica personalizada

El usuario puede configurar:

- Duración.
- Longitud del texto.
- Tipo de contenido.
- Nivel de dificultad.
- Uso de mayúsculas, números, acentos o símbolos.

### 7.4 Repetición de ejercicios

El usuario puede repetir ejercicios anteriores para comparar resultados y medir mejora.

## 8. Modo de evaluación inicial

Al iniciar por primera vez, la aplicación debe ofrecer una evaluación inicial para estimar el nivel del usuario.

### 8.1 Flujo requerido

1. Explicar el objetivo de la evaluación.
2. Presentar una prueba breve de calentamiento opcional.
3. Ejecutar una prueba principal con texto equilibrado.
4. Medir PPM, WPM netas, precisión, errores y consistencia.
5. Asignar nivel inicial.
6. Recomendar el primer plan de práctica.

### 8.2 Características de la evaluación

- Duración sugerida: entre 1 y 3 minutos.
- Texto con variedad moderada de letras, espacios y puntuación básica.
- Umbral mínimo de texto escrito para validar el resultado.
- Posibilidad de repetir la evaluación.
- Resultado marcado como evaluación para diferenciarlo de prácticas normales.

### 8.3 Resultado esperado

Al finalizar, se debe mostrar:

- Nivel asignado.
- PPM, WPM brutas y WPM netas.
- Precisión.
- Errores más frecuentes.
- Recomendación de modo de práctica.

## 9. Pruebas libres cronometradas

Las pruebas libres cronometradas permiten medir rendimiento sin seguir un plan guiado.

### 9.1 Duraciones iniciales

El sistema debe ofrecer duraciones predefinidas:

- 15 segundos.
- 30 segundos.
- 1 minuto.
- 2 minutos.
- 5 minutos.

También puede permitir una duración personalizada si la interfaz lo soporta.

### 9.2 Requisitos funcionales

- El temporizador inicia con la primera tecla válida o con una cuenta regresiva configurable.
- El texto puede generarse por palabras, frases o párrafos.
- Al terminar el tiempo, la entrada se bloquea y se calculan resultados.
- Los resultados se guardan en el historial si el usuario no está en modo invitado.
- El usuario puede repetir la misma prueba o generar una nueva.

### 9.3 Resultados de prueba libre

Al finalizar, se debe mostrar:

- Duración seleccionada.
- PPM.
- WPM brutas.
- WPM netas.
- Precisión.
- Errores totales.
- Comparación con mejores resultados del mismo rango de tiempo.

## 10. Requisitos principales

### 10.1 Funcionales

- Crear o usar un perfil local de usuario.
- Ejecutar evaluación inicial.
- Asignar nivel automáticamente.
- Mostrar ejercicios recomendados por nivel.
- Ejecutar prácticas guiadas, por objetivo y personalizadas.
- Ejecutar pruebas libres cronometradas.
- Calcular métricas de desempeño.
- Guardar historial de resultados.
- Mostrar progreso básico del usuario.
- Permitir reiniciar o repetir ejercicios.

### 10.2 No funcionales

- La interfaz debe responder de forma inmediata a la escritura.
- El cálculo de métricas debe ser consistente y reproducible.
- El sistema debe funcionar sin conexión si la plataforma lo permite.
- Los datos locales deben ser fáciles de exportar o migrar en versiones futuras.
- La experiencia debe ser clara para usuarios principiantes.
- Los textos de práctica deben evitar contenido ofensivo o ambiguo.

## 11. Criterios de aceptación iniciales

- Un usuario nuevo puede completar una evaluación inicial y recibir un nivel.
- Un usuario puede iniciar una práctica guiada recomendada para su nivel.
- Un usuario puede ejecutar una prueba libre de 1 minuto y ver sus métricas.
- El historial conserva al menos las métricas principales de ejercicios finalizados.
- La aplicación identifica al menos los caracteres con mayor tasa de error.
- El usuario puede reiniciar su progreso mediante una acción confirmada.

## 12. Preguntas abiertas

- ¿La aplicación será web, escritorio, móvil o multiplataforma?
- ¿Se requerirá autenticación de usuarios en versiones futuras?
- ¿Qué distribución de teclado será prioritaria: QWERTY español, QWERTY latinoamericano u otra?
- ¿Los textos de práctica serán estáticos, generados dinámicamente o importables?
- ¿Se permitirá crear perfiles múltiples en el mismo dispositivo?
