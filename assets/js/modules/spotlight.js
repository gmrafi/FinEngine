export function initBlueprintSpotlight() {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  const overlay = document.createElement('div');
  overlay.className = 'blueprint-overlay';
  overlay.setAttribute('aria-hidden', 'true');
  document.body.appendChild(overlay);

  let rafId = null;
  let mouseX = window.innerWidth / 2;
  let mouseY = window.innerHeight / 2;

  document.documentElement.style.setProperty('--mouse-x', `${mouseX}px`);
  document.documentElement.style.setProperty('--mouse-y', `${mouseY}px`);

  document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    if (rafId) return;
    rafId = requestAnimationFrame(() => {
      document.documentElement.style.setProperty('--mouse-x', `${mouseX}px`);
      document.documentElement.style.setProperty('--mouse-y', `${mouseY}px`);
      rafId = null;
    });
  });
}
