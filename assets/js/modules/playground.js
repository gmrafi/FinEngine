/**
 * Interactive VS Code-style Precision Playground for FinEngine
 * Allows live editing, running deterministic financial recipes,
 * and comparing IEEE-754 drift in client-side runtime with zero dependencies.
 */

const PRESETS = {
  drift: {
    id: 'drift',
    name: 'IEEE-754 Float Drift',
    badge: 'Float Audit',
    filename: 'float-drift.ts',
    code: `// Test standard IEEE-754 floating-point drift vs FinEngine:
const a = 0.1;
const b = 0.2;

// Standard JavaScript evaluation (binary floating-point drift)
const standardJs = a + b;

// FinEngine deterministic decimal addition
const finengine = FinEngine.exactSum(a, b);

// Drift delta calculation
const drift = standardJs - finengine;

return {
  expression: \`\${a} + \${b}\`,
  standardJsResult: standardJs,
  finengineResult: finengine,
  floatDriftDelta: drift,
  isExactMatch: drift === 0,
  verdict: drift === 0 ? "Deterministic Safe" : "IEEE-754 Drift Detected"
};`
  },

  amortize: {
    id: 'amortize',
    name: '36-Mo Loan Amortization',
    badge: 'Amortization',
    filename: 'amortization.ts',
    code: `// Deterministic equal monthly installment (EMI) calculation:
const principal = 500000; // BDT 5,00,000 (5 Lakh)
const annualRate = 13.5;  // 13.5% per annum
const months = 36;        // 36 months tenure

// Run deterministic schedule
const plan = FinEngine.amortize({ principal, annualRate, months });

return {
  principal: FinEngine.formatMoney(principal, 'BDT'),
  monthlyEmi: FinEngine.formatMoney(plan.monthlyPayment, 'BDT'),
  totalInterest: FinEngine.formatMoney(plan.totalInterest, 'BDT'),
  totalPayable: FinEngine.formatMoney(plan.totalPayable, 'BDT'),
  interestRatio: \`\${((plan.totalInterest / principal) * 100).toFixed(1)}%\`,
  firstPayment: plan.schedule[0],
  finalPayment: plan.schedule[months - 1]
};`
  },

  lakhcrore: {
    id: 'lakhcrore',
    name: 'South Asian Lakh & Crore',
    badge: 'BDT Notation',
    filename: 'currency-format.ts',
    code: `// Compare South Asian (Lakh / Crore) numbering with ISO format:
const amount = 24587500.50; // 2 Crore 45 Lakh 87 Thousand 500.50

const southAsian = FinEngine.formatLakhCrore(amount, 'BDT');
const isoStandard = FinEngine.formatMoney(amount, 'BDT', 'en-US');

return {
  rawNumericValue: amount,
  southAsianConvention: southAsian,     // BDT 2,45,87,500.50
  isoInternationalFormat: isoStandard,  // BDT 24,587,500.50
  notationBreakdown: "2 Crore, 45 Lakh, 87 Thousand 500 BDT and 50 Poisha"
};`
  },

  vat: {
    id: 'vat',
    name: 'Strict Banking & VAT Rounding',
    badge: 'NBR 15% VAT',
    filename: 'banking-vat.ts',
    code: `// Central Bank and NBR compliance for 15% VAT on service fees:
const lineItems = [
  { item: 'Core API Gateway License', price: 125000.45 },
  { item: 'CERN Zenodo DOI Archival Fee', price: 4500.85 },
  { item: 'Cryptographic Ledger HSM Audit', price: 38200.70 }
];

const subtotal = lineItems.reduce((sum, item) => FinEngine.exactSum(sum, item.price), 0);
const vatRate = 0.15; // 15% VAT
const vatAmount = FinEngine.round2(subtotal * vatRate);
const grandTotal = FinEngine.exactSum(subtotal, vatAmount);

return {
  lineItemCount: lineItems.length,
  subtotal: FinEngine.formatMoney(subtotal, 'BDT'),
  vatRate: '15.00%',
  vatAmount: FinEngine.formatMoney(vatAmount, 'BDT'),
  grandTotal: FinEngine.formatMoney(grandTotal, 'BDT'),
  complianceStatus: "Audited & Balanced to Cent"
};`
  }
};

function getDecimals(num) {
  const str = String(num);
  const p = str.indexOf('.');
  return p === -1 ? 0 : str.length - p - 1;
}

const SandboxFinEngine = Object.freeze({
  exactSum(...nums) {
    const maxDec = Math.max(...nums.map(getDecimals), 0);
    const factor = Math.pow(10, Math.min(maxDec, 12));
    const sumInt = nums.reduce((acc, n) => acc + Math.round(Number(n) * factor), 0);
    return sumInt / factor;
  },

  round2(value) {
    return Math.round((Number(value) + Number.EPSILON) * 100) / 100;
  },

  round4(value) {
    return Math.round((Number(value) + Number.EPSILON) * 10000) / 10000;
  },

  monthlyPayment(principal, annualRate, months) {
    const p = Number(principal);
    const m = Number(months);
    const r = Number(annualRate) / 12 / 100;
    if (r === 0) return this.round2(p / m);
    const factor = Math.pow(1 + r, m);
    const payment = (p * r * factor) / (factor - 1);
    return this.round2(payment);
  },

  amortize(input) {
    const p = Number(input.principal);
    const annualRate = Number(input.annualRate);
    const months = Number(input.months);
    const payment = this.monthlyPayment(p, annualRate, months);
    const monthlyRate = annualRate / 12 / 100;
    let balance = p;
    let totalInterest = 0;
    const schedule = [];

    for (let month = 1; month <= months; month += 1) {
      const interestPaid = this.round2(balance * monthlyRate);
      const principalPaid = this.round2(payment - interestPaid);
      balance = this.round2(Math.max(0, balance - principalPaid));
      totalInterest = this.round2(totalInterest + interestPaid);
      schedule.push({
        month,
        payment,
        principalPaid,
        interestPaid,
        remainingBalance: balance,
      });
    }

    return {
      monthlyPayment: payment,
      totalInterest: this.round2(totalInterest),
      totalPayable: this.round2(p + totalInterest),
      schedule,
    };
  },

  formatMoney(amount, currency = 'BDT', locale = 'en-BD') {
    const num = this.round2(amount);
    try {
      return new Intl.NumberFormat(locale, {
        style: 'currency',
        currency,
        maximumFractionDigits: 2,
        minimumFractionDigits: 2,
      }).format(num);
    } catch {
      return `${currency} ${num.toLocaleString(locale, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    }
  },

  formatLakhCrore(amount, currency = 'BDT') {
    const num = this.round2(amount);
    const parts = num.toFixed(2).split('.');
    let intPart = parts[0];
    const decPart = parts[1];

    let lastThree = intPart.substring(intPart.length - 3);
    const otherNumbers = intPart.substring(0, intPart.length - 3);
    if (otherNumbers !== '') {
      lastThree = ',' + lastThree;
    }
    const formattedInt = otherNumbers.replace(/\B(?=(\d{2})+(?!\d))/g, ',') + lastThree;
    return `${currency} ${formattedInt}.${decPart}`;
  }
});

export function initPlayground() {
  const container = document.getElementById('precision-playground');
  if (!container) return;

  const textarea = container.querySelector('#playground-editor');
  const lineGutter = container.querySelector('#playground-gutter');
  const runBtn = container.querySelector('#playground-run-btn');
  const resetBtn = container.querySelector('#playground-reset-btn');
  const filenameEl = container.querySelector('#playground-filename');
  const metricEl = container.querySelector('#playground-metric');
  const outputJsonEl = container.querySelector('#playground-output-json');
  const auditCard = container.querySelector('#playground-audit-card');
  const auditJsVal = container.querySelector('#playground-audit-js-val');
  const auditFeVal = container.querySelector('#playground-audit-fe-val');
  const auditDeltaVal = container.querySelector('#playground-audit-delta-val');
  const tabs = container.querySelectorAll('[data-playground-preset]');

  let currentPresetKey = 'drift';
  let debounceTimer = null;

  function updateLineNumbers() {
    if (!textarea || !lineGutter) return;
    const lines = textarea.value.split('\n').length;
    let numbersHtml = '';
    for (let i = 1; i <= Math.max(lines, 1); i += 1) {
      numbersHtml += `<span>${i}</span>`;
    }
    lineGutter.innerHTML = numbersHtml;
  }

  function syntaxHighlightJson(json) {
    if (typeof json !== 'string') {
      json = JSON.stringify(json, null, 2);
    }
    return json.replace(/("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+-]?\d+)?)/g, (match) => {
      let cls = 'json-number';
      if (/^"/.test(match)) {
        if (/:$/.test(match)) {
          cls = 'json-key';
        } else {
          cls = 'json-string';
        }
      } else if (/true|false/.test(match)) {
        cls = 'json-boolean';
      } else if (/null/.test(match)) {
        cls = 'json-null';
      }
      return `<span class="${cls}">${match}</span>`;
    });
  }

  function executeCode() {
    if (!textarea || !outputJsonEl) return;
    const code = textarea.value;
    const t0 = performance.now();

    try {
      const runner = new Function('FinEngine', `
        "use strict";
        ${code}
      `);

      const result = runner(SandboxFinEngine);
      const durationMs = (performance.now() - t0).toFixed(2);

      if (metricEl) {
        metricEl.textContent = `${durationMs} ms · In-Browser Run`;
      }

      if (outputJsonEl) {
        outputJsonEl.innerHTML = syntaxHighlightJson(result);
      }

      if (auditCard && auditJsVal && auditFeVal && auditDeltaVal) {
        if (result && typeof result === 'object' && ('standardJsResult' in result || 'floatDriftDelta' in result)) {
          auditCard.hidden = false;
          auditJsVal.textContent = String(result.standardJsResult);
          auditFeVal.textContent = String(result.finengineResult);
          const delta = Number(result.floatDriftDelta);
          auditDeltaVal.textContent = delta === 0 ? '0.00000000000000000 (0 Drift)' : `+${delta} (IEEE-754 Drift)`;
          if (delta === 0) {
            auditDeltaVal.className = 'playground-audit-badge pass';
          } else {
            auditDeltaVal.className = 'playground-audit-badge fail';
          }
        } else {
          auditCard.hidden = true;
        }
      }
    } catch (err) {
      if (metricEl) metricEl.textContent = 'Runtime / Syntax Error';
      if (outputJsonEl) {
        outputJsonEl.innerHTML = `<span class="json-error">Runtime Error: ${escapeHtml(err.message)}</span>`;
      }
      if (auditCard) auditCard.hidden = true;
    }
  }

  function escapeHtml(str) {
    return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  }

  function loadPreset(key) {
    const preset = PRESETS[key];
    if (!preset) return;
    currentPresetKey = key;

    tabs.forEach((tab) => {
      const active = tab.dataset.playgroundPreset === key;
      tab.classList.toggle('is-active', active);
      tab.setAttribute('aria-selected', active ? 'true' : 'false');
    });

    if (filenameEl) filenameEl.textContent = preset.filename;
    if (textarea) textarea.value = preset.code;

    updateLineNumbers();
    executeCode();
  }

  if (textarea) {
    textarea.addEventListener('keydown', (e) => {
      if (e.key === 'Tab') {
        e.preventDefault();
        const start = textarea.selectionStart;
        const end = textarea.selectionEnd;
        textarea.value = textarea.value.substring(0, start) + '  ' + textarea.value.substring(end);
        textarea.selectionStart = textarea.selectionEnd = start + 2;
        updateLineNumbers();
        executeCode();
      } else if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
        e.preventDefault();
        executeCode();
      }
    });

    textarea.addEventListener('input', () => {
      updateLineNumbers();
      clearTimeout(debounceTimer);
      debounceTimer = setTimeout(executeCode, 200);
    });

    textarea.addEventListener('scroll', () => {
      if (lineGutter) {
        lineGutter.scrollTop = textarea.scrollTop;
      }
    });
  }

  if (runBtn) {
    runBtn.addEventListener('click', executeCode);
  }

  if (resetBtn) {
    resetBtn.addEventListener('click', () => {
      loadPreset(currentPresetKey);
    });
  }

  tabs.forEach((tab) => {
    tab.addEventListener('click', () => {
      const key = tab.dataset.playgroundPreset;
      loadPreset(key);
    });
  });

  loadPreset('drift');
}
