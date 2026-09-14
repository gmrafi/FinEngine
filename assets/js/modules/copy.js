export function initCopyButtons() {
  document.querySelectorAll('[data-copy]').forEach((button) => {
    button.addEventListener('click', async () => {
      const selector = button.dataset.copy;
      const source = selector ? document.querySelector(selector) : null;
      if (!source) return;
      const text = source.textContent.trim();
      try {
        await navigator.clipboard.writeText(text);
        const original = button.textContent;
        button.textContent = 'Copied';
        setTimeout(() => { button.textContent = original; }, 1300);
      } catch (_) {
        button.textContent = 'Copy failed';
      }
    });
  });
}
