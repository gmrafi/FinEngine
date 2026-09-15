import { applyBrand } from './brand.js';
import { initSharedLayout } from './shared-layout.js?v=20260915b';
import { initThemeToggle } from './modules/theme.js';

document.addEventListener('DOMContentLoaded', () => {
  initSharedLayout();
  applyBrand();
  initThemeToggle();
});
