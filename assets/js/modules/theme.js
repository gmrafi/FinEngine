const STORAGE_KEY = 'site-theme-preference';

export function initThemeToggle() {
  const button = document.querySelector('[data-theme-toggle]');
  const root = document.documentElement;
  const saved = localStorage.getItem(STORAGE_KEY);
  const preferredDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  const initial = saved || (preferredDark ? 'dark' : 'dark');
  root.dataset.theme = initial;
  updateLabel(button, initial);

  button?.addEventListener('click', () => {
    const next = root.dataset.theme === 'dark' ? 'light' : 'dark';
    root.dataset.theme = next;
    localStorage.setItem(STORAGE_KEY, next);
    updateLabel(button, next);
  });
}

function updateLabel(button, theme) {
  if (!button) return;
  button.setAttribute('aria-pressed', String(theme === 'dark'));
  button.textContent = theme === 'dark' ? 'Switch to light' : 'Switch to dark';
}
