/**
 * Interactive loan repayment calculator for FinEngine homepage.
 * Updates EMI, Total Interest, Total Payable, and ratio breakdown live in the browser.
 */
export function initHomeSimulator() {
  const container = document.getElementById('interactive-simulator');
  if (!container) return;

  const principalRange = container.querySelector('#sim-principal-range');
  const rateInput = container.querySelector('#sim-rate-input');
  const tenureSelect = container.querySelector('#sim-tenure-select');
  const presetChips = container.querySelectorAll('[data-preset-amount]');

  const outEmi = container.querySelector('#sim-out-emi');
  const outInterest = container.querySelector('#sim-out-interest');
  const outTotal = container.querySelector('#sim-out-total');
  const outBurden = container.querySelector('#sim-out-burden');
  const outTenureLabel = container.querySelector('#sim-out-tenure-label');

  const barPrincipal = container.querySelector('#sim-bar-principal');
  const barInterest = container.querySelector('#sim-bar-interest');
  const legendPrincipal = container.querySelector('#sim-legend-principal');
  const legendInterest = container.querySelector('#sim-legend-interest');
  const pctPrincipal = container.querySelector('#sim-pct-principal');
  const pctInterest = container.querySelector('#sim-pct-interest');

  function calculate(principal, annualRate, months) {
    if (principal <= 0 || months <= 0) return { emi: 0, totalPayable: 0, totalInterest: 0 };
    const monthlyRate = annualRate / 12 / 100;
    if (monthlyRate === 0) {
      const emi = Math.round(principal / months);
      return { emi, totalPayable: principal, totalInterest: 0 };
    }
    const factor = Math.pow(1 + monthlyRate, months);
    const emi = Math.round((principal * monthlyRate * factor) / (factor - 1));
    const totalPayable = emi * months;
    const totalInterest = Math.max(0, totalPayable - principal);
    return { emi, totalPayable, totalInterest };
  }

  let currentEmi = 0;
  let currentInterest = 0;
  let currentTotal = 0;
  let animId = null;

  function formatBDT(amount) {
    return `BDT ${Math.round(amount).toLocaleString('en-US')}`;
  }

  function animateNumbers(targetEmi, targetInterest, targetTotal, duration = 220) {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      if (outEmi) outEmi.textContent = formatBDT(targetEmi);
      if (outInterest) outInterest.textContent = formatBDT(targetInterest);
      if (outTotal) outTotal.textContent = formatBDT(targetTotal);
      currentEmi = targetEmi;
      currentInterest = targetInterest;
      currentTotal = targetTotal;
      return;
    }

    const startEmi = currentEmi || targetEmi;
    const startInterest = currentInterest || targetInterest;
    const startTotal = currentTotal || targetTotal;
    const startTime = performance.now();

    if (animId) cancelAnimationFrame(animId);

    function step(now) {
      const elapsed = now - startTime;
      const progress = Math.min(1, elapsed / duration);
      // Ease-out quad curve for natural decelerating roll
      const ease = progress * (2 - progress);

      const valEmi = Math.round(startEmi + (targetEmi - startEmi) * ease);
      const valInterest = Math.round(startInterest + (targetInterest - startInterest) * ease);
      const valTotal = Math.round(startTotal + (targetTotal - startTotal) * ease);

      if (outEmi) outEmi.textContent = formatBDT(valEmi);
      if (outInterest) outInterest.textContent = formatBDT(valInterest);
      if (outTotal) outTotal.textContent = formatBDT(valTotal);

      currentEmi = valEmi;
      currentInterest = valInterest;
      currentTotal = valTotal;

      if (progress < 1) {
        animId = requestAnimationFrame(step);
      } else {
        animId = null;
      }
    }

    animId = requestAnimationFrame(step);
  }

  function update() {
    const principal = Number(principalRange?.value || 500000);
    const rate = Number(rateInput?.value || 13.5);
    const months = Number(tenureSelect?.value || 36);

    const { emi, totalPayable, totalInterest } = calculate(principal, rate, months);

    animateNumbers(emi, totalInterest, totalPayable);

    const burdenPct = principal > 0 ? ((totalInterest / principal) * 100).toFixed(1) : '0';
    if (outBurden) outBurden.textContent = `${burdenPct}% of principal`;
    if (outTenureLabel) outTenureLabel.textContent = `Over ${months} monthly installments`;

    const principalPct = totalPayable > 0 ? Math.round((principal / totalPayable) * 100) : 100;
    const interestPct = Math.max(0, 100 - principalPct);

    if (barPrincipal) barPrincipal.style.width = `${principalPct}%`;
    if (barInterest) barInterest.style.width = `${interestPct}%`;

    if (legendPrincipal) legendPrincipal.textContent = formatBDT(principal);
    if (legendInterest) legendInterest.textContent = formatBDT(totalInterest);

    if (pctPrincipal) pctPrincipal.textContent = `${principalPct}%`;
    if (pctInterest) pctInterest.textContent = `${interestPct}%`;

    presetChips.forEach((chip) => {
      const chipAmount = Number(chip.dataset.presetAmount);
      chip.classList.toggle('is-active', chipAmount === principal);
    });
  }

  if (principalRange) {
    principalRange.addEventListener('input', update);
  }

  if (rateInput) {
    rateInput.addEventListener('input', update);
  }

  if (tenureSelect) {
    tenureSelect.addEventListener('change', update);
  }

  presetChips.forEach((chip) => {
    chip.addEventListener('click', () => {
      const amount = Number(chip.dataset.presetAmount);
      if (principalRange) {
        principalRange.value = String(amount);
      }
      update();
    });
  });

  // Initial calculation
  update();
}
