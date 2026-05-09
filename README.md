# Mecanografia

## Evaluación inicial

El paquete incluye un módulo de evaluación inicial para medir una prueba de
mecanografía con un texto estándar. La función `evaluar_texto` devuelve:

- duración de la prueba;
- caracteres correctos;
- errores estimados por distancia de edición;
- PPM, entendido como pulsaciones por minuto;
- WPM bruto, calculado con palabras estándar de cinco caracteres;
- WPM neto, penalizado por errores;
- precisión;
- nivel recomendado.

```python
from mecanografia import TEXTO_ESTANDAR, evaluar_texto

resultado = evaluar_texto(
    texto_usuario=TEXTO_ESTANDAR,
    duracion_segundos=120,
)

print(resultado.precision, resultado.wpm_neto, resultado.nivel_recomendado)
```

La clasificación se realiza con `clasificar_nivel(precision, wpm_neto)` y prioriza
la precisión para recomendar uno de estos niveles: inicial, basico, intermedio,
avanzado o experto.
