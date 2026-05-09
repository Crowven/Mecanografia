# Prototipos legados

La aplicación principal se consolida sobre Vite y se inicia únicamente desde `src/main.ts`.

Los scripts históricos quedan fuera del arranque automático:

- `app.js`: marcador documental. La lógica reutilizable se trasladó a módulos bajo `src/`.
- `script.js`: prototipo de cambio de tema que debe inicializarse explícitamente con `initialiseThemePrototype(container)`.
- `typingExercise.js`: fachada sin efectos secundarios que reexporta el ejercicio de copia desde `src/features/practice/copyExercise.js`.

Cualquier prototipo HTML que quiera reutilizar estas piezas debe importar el módulo correspondiente y pasar de forma explícita el contenedor donde se renderiza o donde se buscan sus controles.
