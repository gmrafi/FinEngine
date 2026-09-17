const charts = new WeakMap();

function renderFieldErrors(fields, errors) {
  Object.entries(fields).forEach(([key, el]) => {
    if (!el) return;
    let hint = el.parentElement?.querySelector(".field-error");
    const msg = errors?.[key];
    if (msg) {
      if (!hint) {
        hint = document.createElement("span");
        hint.className = "field-error";
        hint.setAttribute("role", "alert");
        el.insertAdjacentElement("afterend", hint);
      }
      hint.textContent = msg;
    } else if (hint) {
      hint.remove();
    }
  });
}

const PRESETS = {
  student: {
    scenario: "Student laptop plan",
    amount: 85000,
    rate: 11.5,
    months: 18,
    income: 18000,
    startFee: 1.0,
  },
  bike: {
    scenario: "Motorbike loan",
    amount: 220000,
    rate: 12.9,
    months: 30,
    income: 42000,
    startFee: 1.2,
  },
  sme: {
    scenario: "SME working capital",
    amount: 500000,
    rate: 13.5,
    months: 36,
    income: 85000,
    startFee: 1.5,
  },
  merchant: {
    scenario: "Merchant float",
    amount: 150000,
    rate: 14.2,
    months: 12,
    income: 60000,
    startFee: 0.8,
  },
  agri: {
    scenario: "Agri equipment plan",
    amount: 340000,
    rate: 10.8,
    months: 24,
    income: 52000,
    startFee: 0.9,
  },
  clinic: {
    scenario: "Clinic device financing",
    amount: 680000,
    rate: 12.1,
    months: 48,
    income: 145000,
    startFee: 1.1,
  },
};

export function initCalculator() {
  const scopedRoots = Array.from(
    document.querySelectorAll("[data-simulation]"),
  );
  if (scopedRoots.length) {
    scopedRoots.forEach((root) => initSimulation(root));
    return;
  }

  const fallbackForm = document.querySelector("[data-calculator-form]");
  if (fallbackForm) initSimulation(document.body);
}

function initSimulation(root) {
  const form = root.querySelector("[data-calculator-form]");
  if (!form) return;

  const fields = {
    scenario: form.querySelector('[name="scenario"]'),
    amount: form.querySelector('[name="amount"]'),
    rate: form.querySelector('[name="rate"]'),
    months: form.querySelector('[name="months"]'),
    income: form.querySelector('[name="income"]'),
    startFee: form.querySelector('[name="startFee"]'),
  };

  const result = {
    emi: root.querySelector('[data-result="emi"]'),
    totalInterest: root.querySelector('[data-result="interest"]'),
    totalPayable: root.querySelector('[data-result="total"]'),
    burden: root.querySelector('[data-result="burden"]'),
    fee: root.querySelector('[data-result="fee"]'),
    signal: root.querySelector('[data-result="signal"]'),
    scenarioTitle: root.querySelector('[data-result="scenarioTitle"]'),
    interestShare: root.querySelector('[data-result="interestShare"]'),
    principalShare: root.querySelector('[data-result="principalShare"]'),
    closingBalance: root.querySelector('[data-result="closingBalance"]'),
    generatedAt: root.querySelector('[data-result="generatedAt"]'),
    error: root.querySelector('[data-result="error"]'),
    schedule: root.querySelector("[data-schedule-preview]"),
    exportStatus: root.querySelector("[data-export-status]"),
  };

  const canvas = root.querySelector("[data-amortization-chart]");
  const exportButtons = Array.from(root.querySelectorAll("[data-export]"));
  const presetButtons = Array.from(root.querySelectorAll("[data-preset]"));
  const expandBtn = root.querySelector("[data-schedule-expand]");
  const state = { schedule: [], scenario: "Custom scenario", expanded: false };

  presetButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const preset = PRESETS[button.dataset.preset];
      if (!preset) return;
      if (fields.scenario) fields.scenario.value = preset.scenario;
      if (fields.amount) fields.amount.value = String(preset.amount);
      if (fields.rate) fields.rate.value = String(preset.rate);
      if (fields.months) fields.months.value = String(preset.months);
      if (fields.income) fields.income.value = String(preset.income);
      if (fields.startFee) fields.startFee.value = String(preset.startFee);
      presetButtons.forEach((b) => b.classList.remove("is-active"));
      button.classList.add("is-active");
      state.preset = preset.scenario;
      render();
    });
  });

  exportButtons.forEach((button) => {
    button.addEventListener("click", async () => {
      if (!state.schedule.length) {
        setExportStatus(
          result,
          "Generate a valid schedule before exporting.",
          "error",
        );
        return;
      }
      if (button.dataset.export === "json") {
        await copyScheduleJson(state, result);
        return;
      }
      if (button.dataset.export === "python") {
        await copySchedulePython(state, result);
        return;
      }
      if (button.dataset.export === "csv") {
        downloadScheduleCsv(state, result);
      }
    });
  });

  const render = () => {
    const values = validate(fields);
    renderFieldErrors(fields, values.errors);
    if (!values.valid) {
      if (result.error) result.error.textContent = values.message;
      clearPreview(root, result, exportButtons);
      state.schedule = [];
      state.scenario = "Custom scenario";
      return;
    }

    if (result.error) result.error.textContent = "";
    setExportStatus(result, "", "neutral");
    const model = buildSchedule(values.amount, values.rate, values.months);
    const upfrontFee = round2(values.amount * (values.startFee / 100));
    const burdenPct =
      values.income > 0 ? round2((model.emi / values.income) * 100) : null;
    const signal =
      burdenPct === null
        ? "Income not set"
        : burdenPct > 45
          ? "High"
          : burdenPct > 30
            ? "Watch"
            : "Healthy";

    state.schedule = model.schedule;
    state.scenario = values.scenario || "Custom scenario";

    setText(result.emi, formatMoney(model.emi));
    setText(result.totalInterest, formatMoney(model.totalInterest));
    setText(result.totalPayable, formatMoney(model.totalPayable + upfrontFee));
    setText(result.burden, burdenPct === null ? " - " : `${burdenPct}%`);
    setText(result.fee, formatMoney(upfrontFee));
    setText(result.signal, signal);
    setText(result.scenarioTitle, state.scenario);
    setText(result.generatedAt, formatGeneratedAt());
    setText(
      result.interestShare,
      `Interest share: ${round2((model.totalInterest / model.totalPayable) * 100)}%`,
    );
    setText(
      result.principalShare,
      `Principal share: ${round2((values.amount / model.totalPayable) * 100)}%`,
    );
    setText(
      result.closingBalance,
      `Closing balance: ${formatMoney(model.schedule.at(-1)?.balance || 0)}`,
    );

    if (canvas && typeof Chart !== "undefined") {
      drawChart(root, canvas, model.schedule);
    } else {
      destroyChart(root);
    }
    renderSchedulePreview(result.schedule, model.schedule);
    setExportButtonsDisabled(exportButtons, false);
  };

  ["input", "change"].forEach((eventName) => {
    form.addEventListener(eventName, render);
  });
  form.addEventListener("submit", (event) => {
    event.preventDefault();
    render();
  });

  if (expandBtn) {
    expandBtn.addEventListener("click", () => {
      state.expanded = !state.expanded;
      if (state.expanded && state.schedule.length) {
        if (result.schedule)
          result.schedule.innerHTML = state.schedule.map(scheduleRow).join("");
        expandBtn.textContent = "Collapse schedule";
      } else {
        renderSchedulePreview(result.schedule, state.schedule);
        expandBtn.textContent =
          state.schedule.length > 6
            ? `View full ${state.schedule.length}-month schedule`
            : "Schedule (≤ 6 months)";
      }
    });
  }

  render();
}

function validate(fields) {
  const num = (name, fallback = 0) => {
    const el = fields[name];
    if (!el || el.value === "") return Number.NaN;
    const n = Number(el.value);
    return Number.isFinite(n) ? n : Number.NaN;
  };
  const amount = num("amount", NaN);
  const rate = num("rate", NaN);
  const months = num("months", NaN);
  const income = num("income", 0);
  const startFee = num("startFee", 0);
  const scenario = fields.scenario?.value?.trim() || "";
  const errors = {};
  if (Number.isNaN(amount) || amount < 1000)
    errors.amount = "Loan amount must be at least 1,000.";
  if (Number.isNaN(rate) || rate <= 0)
    errors.rate = "Interest rate must be greater than 0%.";
  else if (rate > 60) errors.rate = "Annual rate cannot exceed 60%.";
  if (Number.isNaN(months) || months <= 0)
    errors.months = "Term must be greater than 0 months.";
  else if (months > 120) errors.months = "Term cannot exceed 120 months.";
  if (Number.isNaN(income) || income < 0)
    errors.income = "Monthly income cannot be negative.";
  if (Number.isNaN(startFee) || startFee < 0)
    errors.startFee = "Processing fee cannot be negative.";
  else if (startFee > 20) errors.startFee = "Processing fee cannot exceed 20%.";
  const message = Object.values(errors)[0] || "";
  return {
    valid: Object.keys(errors).length === 0,
    errors,
    message,
    scenario,
    amount,
    rate,
    months,
    income,
    startFee,
  };
}

function buildSchedule(principal, annualRate, months) {
  const monthlyRate = annualRate / 12 / 100;
  const emi =
    (principal * monthlyRate * Math.pow(1 + monthlyRate, months)) /
    (Math.pow(1 + monthlyRate, months) - 1);
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
      payment: round2(emi),
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

function scheduleRow(row) {
  return `
    <tr>
      <td>M${row.month}</td>
      <td>${formatMoney(row.principalPaid)}</td>
      <td>${formatMoney(row.interest)}</td>
      <td>${formatMoney(row.balance)}</td>
    </tr>`;
}

function renderSchedulePreview(tbody, schedule) {
  if (!tbody) return;
  if (!schedule.length) {
    tbody.innerHTML = "";
    return;
  }
  if (schedule.length <= 6) {
    tbody.innerHTML = schedule.map(scheduleRow).join("");
    return;
  }
  const head = schedule.slice(0, 2).map(scheduleRow).join("");
  const tail = schedule.slice(-2).map(scheduleRow).join("");
  const hidden = schedule.length - 4;
  const collapsedRow = `<tr class="schedule-row--collapsed"><td colspan="4">… ${hidden} intermediate month${hidden === 1 ? "" : "s"} hidden - click "View full schedule" to expand …</td></tr>`;
  tbody.innerHTML = `${head}${collapsedRow}${tail}`;
}

function clearPreview(root, result, exportButtons) {
  if (result.schedule) result.schedule.innerHTML = "";
  setText(result.emi, " - ");
  setText(result.totalInterest, " - ");
  setText(result.totalPayable, " - ");
  setText(result.burden, " - ");
  setText(result.fee, " - ");
  setText(result.signal, "Needs input");
  setText(result.scenarioTitle, "Waiting for valid values");
  setText(result.interestShare, "Interest share:  - ");
  setText(result.principalShare, "Principal share:  - ");
  setText(result.closingBalance, "Closing balance:  - ");
  setText(result.generatedAt, " - ");
  setExportStatus(result, "", "neutral");
  setExportButtonsDisabled(exportButtons, true);
  destroyChart(root);
}

function destroyChart(root) {
  const existing = charts.get(root);
  if (existing) {
    existing.destroy();
    charts.delete(root);
  }
}

async function copyScheduleJson(state, result) {
  const payload = {
    scenario: state.scenario,
    schedule: state.schedule,
  };
  try {
    await navigator.clipboard.writeText(JSON.stringify(payload, null, 2));
    announceToast("✓ Schedule copied to clipboard");
    setExportStatus(result, "✓ Schedule copied to clipboard", "success");
  } catch {
    setExportStatus(
      result,
      "Clipboard copy failed in this browser. Try Export CSV instead.",
      "error",
    );
  }
}

async function copySchedulePython(state, result) {
  const code = `"""
FinEngine Quantitative Simulation Export
Scenario: ${state.scenario}
Generated: ${new Date().toISOString()}

Install FinEngine Python SDK:
  pip install finengine pandas tabulate
"""

from finengine import amortize, format_money
import pandas as pd

# 1. Execute deterministic loan amortization
# Note: FinEngine uses exact integer sub-unit Poisha arithmetic to eliminate IEEE-754 drift
schedule_data = ${JSON.stringify(state.schedule, null, 2)}

# 2. Load into Pandas DataFrame for statistical & quant analysis
df = pd.DataFrame(schedule_data)

print(f"--- Scenario: ${state.scenario} ---")
print(f"Total Tenor: {len(df)} months")
if not df.empty:
    total_interest = df['interest'].sum()
    print(f"Total Interest: BDT {total_interest:,.2f}")
    print(f"Final Closing Balance: BDT {df.iloc[-1]['balance']:,.2f} (Guaranteed Zero Closure)")
    print("\\nFirst 5 Months Repayment Breakdown:")
    print(df.head())
`;
  try {
    await navigator.clipboard.writeText(code);
    announceToast("✓ Python script copied to clipboard");
    setExportStatus(result, "✓ Python script copied to clipboard", "success");
  } catch {
    setExportStatus(
      result,
      "Clipboard copy failed. Try Export CSV instead.",
      "error",
    );
  }
}

function downloadScheduleCsv(state, result) {
  const header = [
    "month",
    "payment",
    "principalPaid",
    "interestPaid",
    "remainingBalance",
  ];
  const rows = state.schedule.map((row) => [
    row.month,
    row.payment,
    row.principalPaid,
    row.interest,
    row.balance,
  ]);
  const csv = [header, ...rows].map((cols) => cols.join(",")).join("\n");
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `finengine-${slugify(state.scenario)}-schedule.csv`;
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
  announceToast(`✓ Exported ${link.download}`);
  setExportStatus(result, `✓ Downloaded ${link.download}`, "success");
}

let toastTimer = null;
function announceToast(message) {
  let el = document.getElementById("finengine-toast");
  if (!el) {
    el = document.createElement("div");
    el.id = "finengine-toast";
    el.className = "finengine-toast";
    el.setAttribute("role", "status");
    el.setAttribute("aria-live", "polite");
    document.body.appendChild(el);
  }
  el.textContent = message;
  el.classList.add("is-visible");
  if (toastTimer) clearTimeout(toastTimer);
  toastTimer = setTimeout(() => el.classList.remove("is-visible"), 2600);
}

function setExportButtonsDisabled(buttons, disabled) {
  buttons.forEach((button) => {
    button.disabled = disabled;
    button.setAttribute("aria-disabled", String(disabled));
  });
}

function setExportStatus(result, message, tone) {
  if (!result.exportStatus) return;
  result.exportStatus.textContent = message;
  result.exportStatus.classList.remove("is-success", "is-error");
  if (tone === "success") result.exportStatus.classList.add("is-success");
  if (tone === "error") result.exportStatus.classList.add("is-error");
}

function drawChart(root, canvas, schedule) {
  const labels = schedule.map((row) => `M${row.month}`);
  const balances = schedule.map((row) => row.balance);
  const principals = schedule.map((row) => row.principalPaid);
  const interests = schedule.map((row) => row.interest);
  const theme = getComputedStyle(document.documentElement);
  const textColor = theme.getPropertyValue("--text").trim() || "#E5EDF5";
  const mutedColor = theme.getPropertyValue("--muted").trim() || "#64748B";
  const gridColor =
    theme.getPropertyValue("--line").trim() || "rgba(148,163,184,0.12)";
  const cyan = theme.getPropertyValue("--cyan").trim() || "#06B6D4";
  const emerald = theme.getPropertyValue("--emerald").trim() || "#10B981";
  const blue = theme.getPropertyValue("--blue").trim() || "#2563EB";

  destroyChart(root);
  const chart = new Chart(canvas, {
    type: "line",
    data: {
      labels,
      datasets: [
        {
          label: "Outstanding balance",
          data: balances,
          borderColor: blue,
          backgroundColor: "rgba(37,99,235,0.12)",
          fill: true,
          tension: 0.25,
        },
        {
          label: "Principal paid",
          data: principals,
          borderColor: emerald,
          backgroundColor: "rgba(16,185,129,0.08)",
          fill: false,
          tension: 0.2,
        },
        {
          label: "Interest paid",
          data: interests,
          borderColor: cyan,
          backgroundColor: "rgba(6,182,212,0.08)",
          fill: false,
          tension: 0.2,
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      interaction: { mode: "index", intersect: false },
      scales: {
        x: {
          ticks: { color: mutedColor, maxTicksLimit: 8 },
          grid: { color: gridColor },
        },
        y: { ticks: { color: mutedColor }, grid: { color: gridColor } },
      },
      plugins: {
        legend: { labels: { color: textColor } },
        tooltip: {
          callbacks: {
            label: (ctx) =>
              `${ctx.dataset.label}: ${formatMoney(ctx.parsed.y)}`,
          },
        },
      },
    },
  });
  charts.set(root, chart);
}

function setText(node, value) {
  if (node) node.textContent = value;
}

function formatGeneratedAt() {
  if (typeof dayjs === "function") return dayjs().format("DD MMM YYYY");
  return new Intl.DateTimeFormat("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(new Date());
}

function formatMoney(value) {
  return new Intl.NumberFormat("en-BD", {
    style: "currency",
    currency: "BDT",
    maximumFractionDigits: 0,
  }).format(value);
}

function round2(value) {
  return Math.round((value + Number.EPSILON) * 100) / 100;
}

function slugify(value) {
  return (
    (value || "finengine")
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "") || "finengine"
  );
}
