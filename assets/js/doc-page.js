import { applyBrand } from './brand.js';
import { initSharedLayout } from './shared-layout.js?v=20260915c';
import { initThemeToggle } from './modules/theme.js';
import { initCodeCopy } from './modules/code-copy.js';

document.addEventListener('DOMContentLoaded', () => {
  initSharedLayout();
  applyBrand();
  initThemeToggle();
  initCodeCopy();
});
