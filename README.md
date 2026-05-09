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
