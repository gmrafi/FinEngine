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

  function formatBDT(amount) {
    return `BDT ${Math.round(amount).toLocaleString('en-US')}`;
  }

  function update() {
    const principal = Number(principalRange?.value || 500000);
    const rate = Number(rateInput?.value || 13.5);
    const months = Number(tenureSelect?.value || 36);

    const { emi, totalPayable, totalInterest } = calculate(principal, rate, months);

    if (outEmi) outEmi.textContent = formatBDT(emi);
    if (outInterest) outInterest.textContent = formatBDT(totalInterest);
    if (outTotal) outTotal.textContent = formatBDT(totalPayable);

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
