import fs from 'node:fs';
import { formatMoney, sumEntries, validateLedgerEntry } from '../packages/core/dist/index.js';
import { amortize, xirr } from '../packages/math/dist/index.js';
import { makeLearningCards, makeMoneyKpi, makeRepaymentSummary } from '../packages/ui/dist/index.js';

const entry = {
  reference: 'MFS-SETTLEMENT-01',
  currency: 'BDT',
  source: 'mfs',
  lines: [
    { account: '1010-Cash', side: 'debit', amount: 5000 },
    { account: '2100-Customer-Balance', side: 'credit', amount: 5000 },
  ],
};

const coreExample = {
  money: formatMoney(125000),
  validation: validateLedgerEntry(entry),
  total: sumEntries([entry]),
};

const mathPlan = amortize({ principal: 500000, annualRate: 13.5, months: 36 });
const mathExample = {
  monthlyPayment: mathPlan.monthlyPayment,
  totalInterest: mathPlan.totalInterest,
  totalPayable: mathPlan.totalPayable,
  firstMonth: mathPlan.schedule[0],
  xirr: xirr([
    { amount: -100000, date: '2026-01-01' },
    { amount: 25000, date: '2026-04-01' },
    { amount: 25000, date: '2026-07-01' },
    { amount: 70000, date: '2027-01-10' },
  ]),
};

const uiExample = {
  kpi: makeMoneyKpi('Monthly EMI', mathPlan.monthlyPayment, 'SME working capital'),
  summary: makeRepaymentSummary('SME working capital', mathPlan, 85000, 1.5),
  learningCards: makeLearningCards(),
};

const output = { coreExample, mathExample, uiExample };
fs.writeFileSync(new URL('../scripts/example-output.json', import.meta.url), JSON.stringify(output, null, 2));
console.log(JSON.stringify(output, null, 2));
