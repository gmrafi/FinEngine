// One-click copy for code blocks + package-manager install tabs.
export function initCodeCopy() {
  document.querySelectorAll('pre.doc-code, pre > code, pre').forEach((pre) => {
    if (pre.dataset.codeCopyReady || pre.closest('.code-copy-wrap')) return;
    const block = pre.matches('pre') ? pre : pre.closest('pre');
    if (!block || block.dataset.codeCopyReady) return;
    const text = block.innerText.replace(/\n{3,}/g, '\n\n').trimEnd();

    const wrap = document.createElement('div');
    wrap.className = 'code-copy-wrap';
    block.before(wrap);
    wrap.appendChild(block);
    wrap.insertAdjacentHTML('beforeend', `<button type="button" class="code-copy-btn" aria-label="Copy code to clipboard">Copy</button>`);
    const btn = wrap.querySelector('.code-copy-btn');
    btn.addEventListener('click', async () => {
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
      setTimeout(() => { btn.textContent = 'Copy'; btn.classList.remove('is-copied'); }, 1000);
    });
    block.dataset.codeCopyReady = '1';
  });

  document.querySelectorAll('[data-install-tabs]').forEach((tabs) => {
    const buttons = Array.from(tabs.querySelectorAll('[data-install-tab]'));
    const panes = Array.from(tabs.querySelectorAll('[data-install-pane]'));
    buttons.forEach((btn) => {
      btn.addEventListener('click', () => {
        buttons.forEach((b) => b.classList.remove('is-active'));
        panes.forEach((p) => p.hidden = true);
        btn.classList.add('is-active');
        const pane = tabs.querySelector(`[data-install-pane="${btn.dataset.installTab}"]`);
        if (pane) pane.hidden = false;
      });
    });
  });
}
