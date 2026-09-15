import { SITE_BRAND, applyBrand } from './brand.js';
import { initSharedLayout } from './shared-layout.js?v=20260915i';
import { initThemeToggle } from './modules/theme.js';
import { initScrollSpy } from './modules/nav.js';
import { initReveal } from './modules/reveal.js';
import { initCounters } from './modules/counters.js';
import { initPackageExplorer } from './modules/packages.js';
import { initCalculator } from './modules/calculator.js';
import { initCopyButtons } from './modules/copy.js';
import { initCodeCopy } from './modules/code-copy.js';
import { initHeroTabs } from './modules/hero-tabs.js';

document.addEventListener('DOMContentLoaded', () => {
  initSharedLayout();
  applyBrand();
  initThemeToggle();
  initScrollSpy();
  initReveal();
  initCounters();
  initPackageExplorer();
  initCalculator();
  initCopyButtons();
  initCodeCopy();
  initHeroTabs();

  const generated = document.querySelector('[data-generated-year]');
  if (generated) generated.textContent = String(new Date().getFullYear());

  document.querySelectorAll('[data-install-scope]').forEach((node) => {
    node.textContent = `${SITE_BRAND.npmScope}/${node.dataset.installScope}`;
  });
});
