// Tabs inside the flagship homepage terminal card (shell / js / cdn)
export function initHeroTabs() {
  const buttons = Array.from(document.querySelectorAll('[data-hero-tab]'));
  const panes = Array.from(document.querySelectorAll('[data-hero-pane]'));
  if (!buttons.length || !panes.length) return;
  buttons.forEach((btn) => {
    btn.addEventListener('click', () => {
      const target = btn.dataset.heroTab;
      buttons.forEach((b) => {
        const active = b === btn;
        b.classList.toggle('is-active', active);
        b.setAttribute('aria-selected', String(active));
      });
      panes.forEach((p) => { p.hidden = p.dataset.heroPane !== target; });
    });
  });

  document.querySelectorAll('[data-hero-copy]').forEach((btn) => {
    btn.addEventListener('click', async () => {
      const id = btn.dataset.copyTarget;
      const code = document.getElementById(id);
      if (!code) return;
      const text = code.innerText.replace(/\n{3,}/g, '\n\n').trimEnd();
      const restore = btn.textContent;
      try {
        await navigator.clipboard.writeText(text);
      } catch {
        const ta = document.createElement('textarea');
        ta.value = text;
        document.body.appendChild(ta);
        ta.select();
        document.execCommand('copy');
        ta.remove();
      }
      btn.textContent = 'Copied! ✓';
      btn.classList.add('is-copied');
      setTimeout(() => { btn.textContent = restore; btn.classList.remove('is-copied'); }, 1100);
    });
  });
}
