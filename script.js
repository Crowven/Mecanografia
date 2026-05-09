/**
 * Prototipo legado de cambio de tema.
 *
 * Este archivo ya no es un punto de entrada de la aplicación. Si se reutiliza
 * desde un prototipo HTML, debe invocarse explícitamente con el contenedor que
 * posee el control `#themeToggle`.
 */
export function initialiseThemePrototype(container = document) {
  const themeToggle = container.querySelector('#themeToggle');

  if (!themeToggle) {
    throw new Error('No se encontró #themeToggle en el contenedor del prototipo.');
  }

  const themeLabel = themeToggle.querySelector('.theme-toggle__label');
  const themeIcon = themeToggle.querySelector('.theme-toggle__icon');
  const root = document.documentElement;

  function setTheme(theme) {
    root.dataset.theme = theme;
    const isDark = theme === 'dark';
    themeLabel.textContent = isDark ? 'Modo claro' : 'Modo oscuro';
    themeIcon.textContent = isDark ? '☼' : '☾';
  }

  const abortController = new AbortController();
  themeToggle.addEventListener(
    'click',
    () => {
      const nextTheme = root.dataset.theme === 'dark' ? 'light' : 'dark';
      setTheme(nextTheme);
    },
    { signal: abortController.signal },
  );

  setTheme('light');

  return {
    setTheme,
    destroy: () => abortController.abort(),
  };
}
