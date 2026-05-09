const themeToggle = document.querySelector('#themeToggle');
const themeLabel = themeToggle.querySelector('.theme-toggle__label');
const themeIcon = themeToggle.querySelector('.theme-toggle__icon');
const root = document.documentElement;

function setTheme(theme) {
  root.dataset.theme = theme;
  const isDark = theme === 'dark';
  themeLabel.textContent = isDark ? 'Modo claro' : 'Modo oscuro';
  themeIcon.textContent = isDark ? '☼' : '☾';
}

themeToggle.addEventListener('click', () => {
  const nextTheme = root.dataset.theme === 'dark' ? 'light' : 'dark';
  setTheme(nextTheme);
});

setTheme('light');
