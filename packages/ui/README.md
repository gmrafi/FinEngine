# @finengine/ui

UI-friendly formatting helpers and finance-aware view-model builders for FinEngine.

## What it does
- Builds KPI card models from money amounts
- Labels repayment burden in learner-friendly language
- Generates schedule preview rows for tables and docs
- Produces Bangladesh-oriented learning cards for finance education UI

## Bangladesh-oriented examples
- BDT-first KPI labels for dashboards and finance teaching cards
- EMI burden labels for students, households, and SME founders
- MFS and ledger-learning cards for bilingual product surfaces

## Example
```ts
import { amortize } from '@finengine/math';
import {
  makeLearningCards,
  makeMoneyKpi,
  makeRepaymentSummary,
} from '@finengine/ui';

const plan = amortize({ principal: 500000, annualRate: 13.5, months: 36 });

makeMoneyKpi('Monthly EMI', plan.monthlyPayment, 'SME working capital');
// { label: 'Monthly EMI', value: 'BDT 16,967.64', tone: 'positive', helper: 'SME working capital' }

makeRepaymentSummary('SME working capital', plan, 85000, 1.5);
// { burdenLabel: 'Healthy burden · 20% of income', processingFee: 'BDT 7,500.00', ... }

makeLearningCards();
// [{ title: 'BDT money basics', ... }, ...]
```
