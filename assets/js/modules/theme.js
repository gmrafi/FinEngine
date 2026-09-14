const STORAGE_KEY = 'site-theme-preference';
const LIGHT_THEME_COLOR = '#F8FBFF';
const DARK_THEME_COLOR = '#0B0F19';

export function initThemeToggle() {
  const button = document.querySelector('[data-theme-toggle]');
  const root = document.documentElement;
  const params = new URLSearchParams(window.location.search);
  const forcedTheme = params.get('theme');
  const saved = localStorage.getItem(STORAGE_KEY);
  const initial = (forcedTheme === 'light' || forcedTheme === 'dark')
    ? forcedTheme
    : (saved || 'light');

  root.dataset.theme = initial;
  syncThemeMeta(initial);
  updateLabel(button, initial);

  button?.addEventListener('click', () => {
    const next = root.dataset.theme === 'dark' ? 'light' : 'dark';
    root.dataset.theme = next;
    localStorage.setItem(STORAGE_KEY, next);
    syncThemeMeta(next);
    updateLabel(button, next);

    const nextUrl = new URL(window.location.href);
    nextUrl.searchParams.set('theme', next);
    window.history.replaceState({}, '', nextUrl.toString());
  });
}

function syncThemeMeta(theme) {
  const themeMeta = document.querySelector('meta[name="theme-color"]');
  if (!themeMeta) return;
  themeMeta.setAttribute('content', theme === 'light' ? LIGHT_THEME_COLOR : DARK_THEME_COLOR);
}

function updateLabel(button, theme) {
  if (!button) return;
  button.setAttribute('aria-pressed', String(theme === 'dark'));
  button.setAttribute('aria-label', theme === 'light' ? 'Light mode active' : 'Dark mode active');
  button.innerHTML = `
    <span class="theme-toggle-track" aria-hidden="true"><span class="theme-toggle-thumb"></span></span>
    <span class="theme-toggle-label">${theme === 'light' ? 'Light' : 'Dark'}</span>
  `;
}
