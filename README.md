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

```bash
python3 -m http.server 8000
```

Después visita `http://localhost:8000`.

## Pruebas

```bash
npm test
```
