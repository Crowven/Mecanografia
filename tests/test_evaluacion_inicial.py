import pytest

from mecanografia import NivelRecomendado, clasificar_nivel, evaluar_texto


def test_evaluar_texto_perfecto_calcula_metricas_y_nivel():
    resultado = evaluar_texto("abcde", duracion_segundos=12, texto_objetivo="abcde")

    assert resultado.caracteres_correctos == 5
    assert resultado.errores == 0
    assert resultado.ppm == 25
    assert resultado.wpm == 5
    assert resultado.wpm_neto == 5
    assert resultado.precision == 100
    assert resultado.nivel_recomendado == NivelRecomendado.INICIAL


def test_evaluar_texto_cuenta_sustituciones_inserciones_y_omisiones():
    resultado = evaluar_texto("abXdeZ", duracion_segundos=60, texto_objetivo="abcde")

    assert resultado.caracteres_correctos == 4
    assert resultado.errores == 2
    assert resultado.ppm == 6
    assert resultado.wpm == 1.2
    assert resultado.wpm_neto == 0.8
    assert resultado.precision == 66.67


def test_evaluar_texto_valida_entrada():
    with pytest.raises(ValueError, match="duración"):
        evaluar_texto("abc", duracion_segundos=0, texto_objetivo="abc")

    with pytest.raises(ValueError, match="objetivo"):
        evaluar_texto("abc", duracion_segundos=10, texto_objetivo="")


@pytest.mark.parametrize(
    ("precision", "wpm_neto", "nivel"),
    [
        (84.99, 80, NivelRecomendado.INICIAL),
        (89.99, 25, NivelRecomendado.BASICO),
        (94.99, 40, NivelRecomendado.INTERMEDIO),
        (97.99, 55, NivelRecomendado.AVANZADO),
        (99, 55, NivelRecomendado.EXPERTO),
    ],
)
def test_clasificar_nivel_prioriza_precision_y_velocidad_neta(
    precision, wpm_neto, nivel
):
    assert clasificar_nivel(precision, wpm_neto) == nivel
