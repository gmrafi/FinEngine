import { applyBrand } from './brand.js';
import { initSharedLayout } from './shared-layout.js';
import { initThemeToggle } from './modules/theme.js';

document.addEventListener('DOMContentLoaded', () => {
  initSharedLayout();
  applyBrand();
  initThemeToggle();
});
