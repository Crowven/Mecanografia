# Mecanografía

Aplicación web estática para practicar mecanografía con ejercicios de copia.

## Funcionalidades

- Validación carácter por carácter mientras se escribe.
- Resaltado visual de caracteres correctos, incorrectos y pendientes.
- Aviso sonoro configurable para cada error detectado.
- Registro detallado de errores usado para calcular la precisión final.

## Uso local

Abre `index.html` directamente en el navegador o sirve la carpeta con cualquier servidor estático, por ejemplo:

```bash
python3 -m http.server 8000
```

Después visita `http://localhost:8000`.

## Pruebas

```bash
node --test typingExercise.test.js
```
