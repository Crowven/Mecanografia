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
