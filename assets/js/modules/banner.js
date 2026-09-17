export function initBanner() {
  const banner = document.getElementById('finengine-banner');
  const closeBtn = document.getElementById('close-banner-btn');
  if (!banner || !closeBtn) return;

  if (localStorage.getItem('finengine-banner-dismissed') === 'true') {
    banner.classList.add('is-hidden');
    return;
  }

  closeBtn.addEventListener('click', () => {
    banner.classList.add('is-hidden');
    localStorage.setItem('finengine-banner-dismissed', 'true');
  });
}
