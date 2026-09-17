export function initTerminalMorph() {
  const tabs = Array.from(document.querySelectorAll('[data-hero-tab]'));
  const panes = Array.from(document.querySelectorAll('[data-hero-pane]'));
  if (!tabs.length || !panes.length) return;

  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)');

  function delay(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  function assignLineDelays(pane) {
    const children = Array.from(pane.querySelectorAll('.hero-terminal-pre code > *'));
    if (!children.length) return;

    const lines = [];
    let currentLineEls = [];
    let currentLineY = null;

    children.forEach((el) => {
      const top = el.offsetTop;
      if (currentLineY === null || Math.abs(top - currentLineY) > 2) {
        if (currentLineEls.length > 0) lines.push(currentLineEls);
        currentLineEls = [el];
        currentLineY = top;
      } else {
        currentLineEls.push(el);
      }
    });
    if (currentLineEls.length > 0) lines.push(currentLineEls);

    lines.forEach((lineEls, lineIdx) => {
      lineEls.forEach((el) => {
        el.style.setProperty('--line-delay', `${lineIdx * 0.1}s`);
      });
    });
  }

  panes.forEach(assignLineDelays);

  let isAnimating = false;

  tabs.forEach((tab) => {
    tab.addEventListener('click', async (e) => {
      if (isAnimating) return;
      e.stopImmediatePropagation();

      const targetKey = tab.dataset.heroTab;
      const targetPane = panes.find((p) => p.dataset.heroPane === targetKey);
      if (!targetPane || targetPane.classList.contains('is-active')) return;

      isAnimating = true;

      tabs.forEach((t) => {
        const active = t === tab;
        t.classList.toggle('is-active', active);
        t.setAttribute('aria-selected', String(active));
      });

      panes.forEach((p) => {
        p.classList.remove('is-active', 'is-typing');
      });

      await delay(prefersReduced.matches ? 0 : 300);

      panes.forEach((p) => {
        if (p !== targetPane) p.hidden = true;
      });

      targetPane.hidden = false;
      targetPane.offsetHeight;
      targetPane.classList.add('is-active');

      const pre = targetPane.querySelector('.hero-terminal-pre');
      if (!pre) { isAnimating = false; return; }

      if (!prefersReduced.matches) {
        const overlay = document.createElement('div');
        overlay.className = 'hero-terminal-running-overlay';
        overlay.setAttribute('aria-hidden', 'true');
        overlay.innerHTML = '<span class="hero-terminal-running-text">Running</span><span class="hero-terminal-running-dots"><span></span><span></span><span></span></span>';
        targetPane.appendChild(overlay);

        await delay(450);
        overlay.remove();

        targetPane.classList.add('is-typing');

        const lineCount = targetPane.querySelectorAll('.hero-terminal-pre code > *').length;
        const typingDuration = lineCount * 100 + 250;
        await delay(typingDuration);

        const cursor = document.createElement('span');
        cursor.className = 'hero-terminal-cursor';
        cursor.setAttribute('aria-hidden', 'true');
        const codeEl = targetPane.querySelector('.hero-terminal-pre code');
        if (codeEl) codeEl.appendChild(cursor);
      } else {
        targetPane.classList.add('is-typing');
      }

      isAnimating = false;
    });
  });
}
