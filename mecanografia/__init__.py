"""Herramientas para prácticas y evaluación de mecanografía."""

from .evaluacion_inicial import (
    EvaluacionInicial,
    NivelRecomendado,
    TEXTO_ESTANDAR,
    clasificar_nivel,
    evaluar_texto,
)

__all__ = [
    "EvaluacionInicial",
    "NivelRecomendado",
    "TEXTO_ESTANDAR",
    "clasificar_nivel",
    "evaluar_texto",
]
