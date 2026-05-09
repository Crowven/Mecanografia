"""Módulo de evaluación inicial de mecanografía.

El módulo expone un texto estándar, una función para evaluar el texto escrito por
el usuario y una función de clasificación para recomendar el nivel inicial según
precisión y velocidad neta.
"""

from __future__ import annotations

from dataclasses import dataclass
from enum import Enum


TEXTO_ESTANDAR = (
    "La mecanografía mejora con práctica constante, postura cómoda y atención "
    "al ritmo. Escribe cada palabra con calma, corrige los hábitos poco a poco "
    "y busca mantener precisión antes de aumentar la velocidad."
)


class NivelRecomendado(str, Enum):
    """Niveles disponibles para ubicar al usuario tras la evaluación."""

    INICIAL = "inicial"
    BASICO = "basico"
    INTERMEDIO = "intermedio"
    AVANZADO = "avanzado"
    EXPERTO = "experto"


@dataclass(frozen=True)
class EvaluacionInicial:
    """Resultado de una evaluación inicial de mecanografía.

    Attributes:
        texto_objetivo: Texto usado como referencia para la prueba.
        texto_usuario: Texto escrito por el usuario.
        duracion_segundos: Tiempo total empleado en segundos.
        caracteres_correctos: Caracteres coincidentes con el texto objetivo tras
            alinear ambas cadenas.
        errores: Número mínimo estimado de inserciones, eliminaciones o
            sustituciones necesarias para igualar el texto objetivo.
        ppm: Pulsaciones por minuto; caracteres escritos por minuto.
        wpm: Palabras por minuto brutas usando el estándar de 5 caracteres por
            palabra.
        wpm_neto: Palabras por minuto netas penalizando errores.
        precision: Porcentaje de precisión entre 0 y 100.
        nivel_recomendado: Nivel recomendado según precisión y WPM neto.
    """

    texto_objetivo: str
    texto_usuario: str
    duracion_segundos: float
    caracteres_correctos: int
    errores: int
    ppm: float
    wpm: float
    wpm_neto: float
    precision: float
    nivel_recomendado: NivelRecomendado


def _alinear_textos(texto_objetivo: str, texto_usuario: str) -> tuple[int, int]:
    """Devuelve caracteres correctos y distancia de edición entre dos textos.

    La matriz de programación dinámica prioriza la menor cantidad de errores y,
    ante empates, la mayor cantidad de caracteres correctos. Así se evita que una
    omisión al inicio marque como incorrecto todo el resto del texto.
    """

    filas = len(texto_objetivo) + 1
    columnas = len(texto_usuario) + 1
    matriz = [[(0, 0) for _ in range(columnas)] for _ in range(filas)]

    for fila in range(1, filas):
        matriz[fila][0] = (fila, 0)
    for columna in range(1, columnas):
        matriz[0][columna] = (columna, 0)

    def mejor(*candidatos: tuple[int, int]) -> tuple[int, int]:
        return min(candidatos, key=lambda item: (item[0], -item[1]))

    for fila in range(1, filas):
        for columna in range(1, columnas):
            objetivo = texto_objetivo[fila - 1]
            escrito = texto_usuario[columna - 1]
            reemplazo = matriz[fila - 1][columna - 1]

            if objetivo == escrito:
                diagonal = (reemplazo[0], reemplazo[1] + 1)
            else:
                diagonal = (reemplazo[0] + 1, reemplazo[1])

            eliminacion = (
                matriz[fila - 1][columna][0] + 1,
                matriz[fila - 1][columna][1],
            )
            insercion = (
                matriz[fila][columna - 1][0] + 1,
                matriz[fila][columna - 1][1],
            )
            matriz[fila][columna] = mejor(diagonal, eliminacion, insercion)

    errores, caracteres_correctos = matriz[-1][-1]
    return caracteres_correctos, errores


def clasificar_nivel(precision: float, wpm_neto: float) -> NivelRecomendado:
    """Recomienda un nivel según precisión y velocidad neta.

    La precisión tiene prioridad sobre la velocidad para favorecer buenos hábitos
    desde el inicio. Una velocidad alta con baja precisión se clasifica en un
    nivel menor hasta estabilizar la exactitud.
    """

    if precision < 85 or wpm_neto < 10:
        return NivelRecomendado.INICIAL
    if precision < 90 or wpm_neto < 20:
        return NivelRecomendado.BASICO
    if precision < 95 or wpm_neto < 35:
        return NivelRecomendado.INTERMEDIO
    if precision < 98 or wpm_neto < 50:
        return NivelRecomendado.AVANZADO
    return NivelRecomendado.EXPERTO


def evaluar_texto(
    texto_usuario: str,
    duracion_segundos: float,
    texto_objetivo: str = TEXTO_ESTANDAR,
) -> EvaluacionInicial:
    """Evalúa una prueba inicial de mecanografía.

    Args:
        texto_usuario: Texto capturado durante la prueba.
        duracion_segundos: Duración total de la prueba en segundos. Debe ser
            mayor que cero.
        texto_objetivo: Texto de referencia que debía copiarse.

    Returns:
        Un objeto :class:`EvaluacionInicial` con métricas y nivel recomendado.

    Raises:
        ValueError: Si la duración no es positiva o si el texto objetivo está
            vacío.
    """

    if duracion_segundos <= 0:
        raise ValueError("La duración debe ser mayor que cero segundos.")
    if not texto_objetivo:
        raise ValueError("El texto objetivo no puede estar vacío.")

    caracteres_correctos, errores = _alinear_textos(texto_objetivo, texto_usuario)
    minutos = duracion_segundos / 60
    caracteres_escritos = len(texto_usuario)

    ppm = caracteres_escritos / minutos
    wpm = caracteres_escritos / 5 / minutos
    wpm_neto = max((caracteres_escritos - errores) / 5 / minutos, 0)
    precision = (
        caracteres_correctos / max(len(texto_objetivo), caracteres_escritos) * 100
    )
    nivel_recomendado = clasificar_nivel(precision, wpm_neto)

    return EvaluacionInicial(
        texto_objetivo=texto_objetivo,
        texto_usuario=texto_usuario,
        duracion_segundos=duracion_segundos,
        caracteres_correctos=caracteres_correctos,
        errores=errores,
        ppm=round(ppm, 2),
        wpm=round(wpm, 2),
        wpm_neto=round(wpm_neto, 2),
        precision=round(precision, 2),
        nivel_recomendado=nivel_recomendado,
    )
