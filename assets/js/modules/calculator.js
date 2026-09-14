let chart;

const PRESETS = {
  student: { scenario: 'Student laptop plan', amount: 85000, rate: 11.5, months: 18, income: 18000, startFee: 1.0 },
  bike: { scenario: 'Motorbike loan', amount: 220000, rate: 12.9, months: 30, income: 42000, startFee: 1.2 },
  sme: { scenario: 'SME working capital', amount: 500000, rate: 13.5, months: 36, income: 85000, startFee: 1.5 },
  merchant: { scenario: 'Merchant float', amount: 150000, rate: 14.2, months: 12, income: 60000, startFee: 0.8 },
};

export function initCalculator() {
  const form = document.querySelector('[data-calculator-form]');
  if (!form || typeof Chart === 'undefined') return;

  const fields = {
    scenario: form.querySelector('[name="scenario"]'),
    amount: form.querySelector('[name="amount"]'),
    rate: form.querySelector('[name="rate"]'),
    months: form.querySelector('[name="months"]'),
    income: form.querySelector('[name="income"]'),
    startFee: form.querySelector('[name="startFee"]'),
  };
  const result = {
    emi: document.querySelector('[data-result="emi"]'),
    totalInterest: document.querySelector('[data-result="interest"]'),
    totalPayable: document.querySelector('[data-result="total"]'),
    burden: document.querySelector('[data-result="burden"]'),
    fee: document.querySelector('[data-result="fee"]'),
    signal: document.querySelector('[data-result="signal"]'),
    scenarioTitle: document.querySelector('[data-result="scenarioTitle"]'),
    interestShare: document.querySelector('[data-result="interestShare"]'),
    principalShare: document.querySelector('[data-result="principalShare"]'),
    closingBalance: document.querySelector('[data-result="closingBalance"]'),
    generatedAt: document.querySelector('[data-result="generatedAt"]'),
    error: document.querySelector('[data-result="error"]'),
    schedule: document.querySelector('[data-schedule-preview]'),
  };
  const canvas = document.querySelector('#amortization-chart');
  if (!canvas) return;

  document.querySelectorAll('[data-preset]').forEach((button) => {
    button.addEventListener('click', () => {
      const preset = PRESETS[button.dataset.preset];
      if (!preset) return;
      fields.scenario.value = preset.scenario;
      fields.amount.value = String(preset.amount);
      fields.rate.value = String(preset.rate);
      fields.months.value = String(preset.months);
      fields.income.value = String(preset.income);
      fields.startFee.value = String(preset.startFee);
      render();
    });
  });

  const render = () => {
    const values = validate(fields);
    if (!values.valid) {
      result.error.textContent = values.message;
      clearPreview(result);
      return;
    }

    result.error.textContent = '';
    const model = buildSchedule(values.amount, values.rate, values.months);
    const upfrontFee = round2(values.amount * (values.startFee / 100));
    const burdenPct = values.income > 0 ? round2((model.emi / values.income) * 100) : null;
    const signal = burdenPct === null ? 'Income not set' : burdenPct > 45 ? 'High' : burdenPct > 30 ? 'Watch' : 'Healthy';

    result.emi.textContent = formatMoney(model.emi);
    result.totalInterest.textContent = formatMoney(model.totalInterest);
    result.totalPayable.textContent = formatMoney(model.totalPayable + upfrontFee);
    result.burden.textContent = burdenPct === null ? '—' : `${burdenPct}%`;
    result.fee.textContent = formatMoney(upfrontFee);
    result.signal.textContent = signal;
    result.scenarioTitle.textContent = values.scenario || 'Custom scenario';
    result.generatedAt.textContent = dayjs().format('DD MMM YYYY');
    result.interestShare.textContent = `Interest share: ${round2((model.totalInterest / model.totalPayable) * 100)}%`;
    result.principalShare.textContent = `Principal share: ${round2((values.amount / model.totalPayable) * 100)}%`;
    result.closingBalance.textContent = `Closing balance: ${formatMoney(model.schedule.at(-1)?.balance || 0)}`;
    drawChart(canvas, model.schedule);
    renderSchedulePreview(result.schedule, model.schedule);
  };

  ['input', 'change'].forEach((eventName) => {
    form.addEventListener(eventName, render);
  });
  form.addEventListener('submit', (event) => {
    event.preventDefault();
    render();
  });
  render();
}

function validate(fields) {
  const amount = Number(fields.amount.value);
  const rate = Number(fields.rate.value);
  const months = Number(fields.months.value);
  const income = Number(fields.income.value || 0);
  const startFee = Number(fields.startFee.value || 0);
  const scenario = fields.scenario.value.trim();
  if (!Number.isFinite(amount) || amount < 1000) return { valid: false, message: 'Loan amount must be at least 1,000.' };
  if (!Number.isFinite(rate) || rate <= 0 || rate > 60) return { valid: false, message: 'Annual rate must be between 0 and 60.' };
  if (!Number.isFinite(months) || months < 3 || months > 120) return { valid: false, message: 'Term must be between 3 and 120 months.' };
  if (!Number.isFinite(income) || income < 0) return { valid: false, message: 'Monthly income cannot be negative.' };
  if (!Number.isFinite(startFee) || startFee < 0 || startFee > 20) return { valid: false, message: 'Processing fee must be between 0 and 20%.' };
  return { valid: true, scenario, amount, rate, months, income, startFee };
}

function buildSchedule(principal, annualRate, months) {
  const monthlyRate = annualRate / 12 / 100;
  const emi = principal * monthlyRate * Math.pow(1 + monthlyRate, months) / (Math.pow(1 + monthlyRate, months) - 1);
  let balance = principal;
  let totalInterest = 0;
  const schedule = [];
  for (let month = 1; month <= months; month += 1) {
    const interest = balance * monthlyRate;
    const principalPaid = emi - interest;
    balance = Math.max(0, balance - principalPaid);
    totalInterest += interest;
    schedule.push({
      month,
      balance: round2(balance),
      principalPaid: round2(principalPaid),
      interest: round2(interest),
    });
  }
  return {
    emi: round2(emi),
    totalInterest: round2(totalInterest),
    totalPayable: round2(principal + totalInterest),
    schedule,
  };
}

function renderSchedulePreview(tbody, schedule) {
  if (!tbody) return;
  const previewRows = [schedule[0], schedule[1], schedule[Math.max(0, schedule.length - 2)], schedule[schedule.length - 1]].filter(Boolean);
  tbody.innerHTML = previewRows.map((row) => `
    <tr>
      <td>M${row.month}</td>
      <td>${formatMoney(row.principalPaid)}</td>
      <td>${formatMoney(row.interest)}</td>
      <td>${formatMoney(row.balance)}</td>
    </tr>`).join('');
}

function clearPreview(result) {
  if (result.schedule) result.schedule.innerHTML = '';
  if (result.emi) result.emi.textContent = '—';
  if (result.totalInterest) result.totalInterest.textContent = '—';
  if (result.totalPayable) result.totalPayable.textContent = '—';
  if (result.burden) result.burden.textContent = '—';
  if (result.fee) result.fee.textContent = '—';
  if (result.signal) result.signal.textContent = 'Needs input';
  if (result.scenarioTitle) result.scenarioTitle.textContent = 'Waiting for valid values';
  if (result.interestShare) result.interestShare.textContent = 'Interest share: —';
  if (result.principalShare) result.principalShare.textContent = 'Principal share: —';
  if (result.closingBalance) result.closingBalance.textContent = 'Closing balance: —';
}

function drawChart(canvas, schedule) {
  const labels = schedule.map((row) => `M${row.month}`);
  const balances = schedule.map((row) => row.balance);
  const principals = schedule.map((row) => row.principalPaid);
  const interests = schedule.map((row) => row.interest);

  if (chart) chart.destroy();
  chart = new Chart(canvas, {
    type: 'line',
    data: {
      labels,
      datasets: [
        { label: 'Outstanding balance', data: balances, borderColor: '#06B6D4', backgroundColor: 'rgba(6,182,212,0.12)', fill: true, tension: 0.25 },
        { label: 'Principal paid', data: principals, borderColor: '#10B981', backgroundColor: 'rgba(16,185,129,0.08)', fill: false, tension: 0.2 },
        { label: 'Interest paid', data: interests, borderColor: '#F59E0B', backgroundColor: 'rgba(245,158,11,0.08)', fill: false, tension: 0.2 },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      interaction: { mode: 'index', intersect: false },
      scales: {
        x: { ticks: { color: '#64748B', maxTicksLimit: 8 }, grid: { color: 'rgba(148,163,184,0.12)' } },
        y: { ticks: { color: '#64748B' }, grid: { color: 'rgba(148,163,184,0.12)' } },
      },
      plugins: {
        legend: { labels: { color: getComputedStyle(document.documentElement).getPropertyValue('--text').trim() || '#E5EDF5' } },
        tooltip: { callbacks: { label: (ctx) => `${ctx.dataset.label}: ${formatMoney(ctx.parsed.y)}` } },
      },
    },
  });
}

function formatMoney(value) {
  return new Intl.NumberFormat('en-BD', { style: 'currency', currency: 'BDT', maximumFractionDigits: 0 }).format(value);
}

function round2(value) {
  return Math.round((value + Number.EPSILON) * 100) / 100;
}
