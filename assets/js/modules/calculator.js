let chart;

export function initCalculator() {
  const form = document.querySelector('[data-calculator-form]');
  if (!form || typeof Chart === 'undefined') return;
  const amount = form.querySelector('[name="amount"]');
  const rate = form.querySelector('[name="rate"]');
  const months = form.querySelector('[name="months"]');
  const result = {
    emi: document.querySelector('[data-result="emi"]'),
    totalInterest: document.querySelector('[data-result="interest"]'),
    totalPayable: document.querySelector('[data-result="total"]'),
    generatedAt: document.querySelector('[data-result="generatedAt"]'),
    error: document.querySelector('[data-result="error"]'),
  };
  const canvas = document.querySelector('#amortization-chart');
  if (!canvas) return;

  const render = () => {
    const values = validate(amount.value, rate.value, months.value);
    if (!values.valid) {
      result.error.textContent = values.message;
      return;
    }
    result.error.textContent = '';
    const model = buildSchedule(values.amount, values.rate, values.months);
    result.emi.textContent = formatMoney(model.emi);
    result.totalInterest.textContent = formatMoney(model.totalInterest);
    result.totalPayable.textContent = formatMoney(model.totalPayable);
    result.generatedAt.textContent = dayjs().format('DD MMM YYYY');
    drawChart(canvas, model.schedule);
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

function validate(amount, rate, months) {
  const a = Number(amount);
  const r = Number(rate);
  const m = Number(months);
  if (!Number.isFinite(a) || a < 1000) return { valid: false, message: 'Loan amount must be at least 1,000.' };
  if (!Number.isFinite(r) || r <= 0 || r > 60) return { valid: false, message: 'Annual rate must be between 0 and 60.' };
  if (!Number.isFinite(m) || m < 3 || m > 120) return { valid: false, message: 'Term must be between 3 and 120 months.' };
  return { valid: true, amount: a, rate: r, months: m };
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
      balance,
      principalPaid,
      interest,
    });
  }
  return {
    emi,
    totalInterest,
    totalPayable: principal + totalInterest,
    schedule,
  };
}

function drawChart(canvas, schedule) {
  const labels = schedule.map((row) => `M${row.month}`);
  const balances = schedule.map((row) => Number(row.balance.toFixed(2)));
  const principals = schedule.map((row) => Number(row.principalPaid.toFixed(2)));
  const interests = schedule.map((row) => Number(row.interest.toFixed(2)));

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
        x: { ticks: { color: '#94A3B8', maxTicksLimit: 8 }, grid: { color: 'rgba(148,163,184,0.08)' } },
        y: { ticks: { color: '#94A3B8' }, grid: { color: 'rgba(148,163,184,0.08)' } },
      },
      plugins: {
        legend: { labels: { color: '#E5EDF5' } },
        tooltip: { callbacks: { label: (ctx) => `${ctx.dataset.label}: ${formatMoney(ctx.parsed.y)}` } },
      },
    },
  });
}

function formatMoney(value) {
  return new Intl.NumberFormat('en-BD', { style: 'currency', currency: 'BDT', maximumFractionDigits: 0 }).format(value);
}
