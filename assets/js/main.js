import { SITE_BRAND, applyBrand } from './brand.js';
import { initThemeToggle } from './modules/theme.js';
import { initScrollSpy } from './modules/nav.js';
import { initReveal } from './modules/reveal.js';
import { initCounters } from './modules/counters.js';
import { initPackageExplorer } from './modules/packages.js';
import { initCalculator } from './modules/calculator.js';
import { initCopyButtons } from './modules/copy.js';
import { initFormValidation } from './modules/form.js';

document.addEventListener('DOMContentLoaded', () => {
  applyBrand();
  initThemeToggle();
  initScrollSpy();
  initReveal();
  initCounters();
  initPackageExplorer();
  initCalculator();
  initCopyButtons();
  initFormValidation();

  const generated = document.querySelector('[data-generated-year]');
  if (generated) generated.textContent = String(new Date().getFullYear());

  document.querySelectorAll('[data-install-scope]').forEach((node) => {
    node.textContent = `${SITE_BRAND.npmScope}/${node.dataset.installScope}`;
  });
});
