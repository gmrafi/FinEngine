const STORAGE_KEY = 'site-theme-preference';

export function initThemeToggle() {
  const button = document.querySelector('[data-theme-toggle]');
  const root = document.documentElement;
  const params = new URLSearchParams(window.location.search);
  const forcedTheme = params.get('theme');
  const saved = localStorage.getItem(STORAGE_KEY);
  const preferredDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  const initial = (forcedTheme === 'light' || forcedTheme === 'dark')
    ? forcedTheme
    : (saved || (preferredDark ? 'dark' : 'dark'));

  root.dataset.theme = initial;
  updateLabel(button, initial);

  button?.addEventListener('click', () => {
    const next = root.dataset.theme === 'dark' ? 'light' : 'dark';
    root.dataset.theme = next;
    localStorage.setItem(STORAGE_KEY, next);
    updateLabel(button, next);

    const nextUrl = new URL(window.location.href);
    nextUrl.searchParams.set('theme', next);
    window.history.replaceState({}, '', nextUrl.toString());
  });
}

function updateLabel(button, theme) {
  if (!button) return;
  button.setAttribute('aria-pressed', String(theme === 'dark'));
  button.textContent = theme === 'dark' ? 'Switch to light' : 'Switch to dark';
}
