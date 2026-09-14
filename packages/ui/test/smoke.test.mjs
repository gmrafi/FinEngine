import assert from 'node:assert/strict';
import { amortize } from '@finengine/math';
import {
  formatBurdenLabel,
  makeLearningBadge,
  makeLearningCards,
  makeMoneyKpi,
  makeRepaymentSummary,
  makeSchedulePreview,
} from '../dist/index.js';

const kpi = makeMoneyKpi('Monthly EMI', 16967.64, '36-month SME example');
assert.equal(kpi.label, 'Monthly EMI');
assert.equal(kpi.tone, 'positive');
assert.equal(kpi.helper, '36-month SME example');
assert.ok(kpi.value.startsWith('BDT'));
assert.equal(formatBurdenLabel(16967.64, 85000), 'Healthy burden · 20% of income');
assert.equal(makeLearningBadge('EMI', 'intro'), 'EMI · intro');

const plan = amortize({ principal: 500000, annualRate: 13.5, months: 36 });
const preview = makeSchedulePreview(plan.schedule, 2);
assert.equal(preview.length, 2);
assert.equal(preview[0].month, 1);
assert.ok(preview[0].principal.startsWith('BDT'));

const summary = makeRepaymentSummary('SME working capital', plan, 85000, 1.5);
assert.equal(summary.scenario, 'SME working capital');
assert.equal(summary.burdenTone, 'healthy');
assert.equal(summary.burdenPct, 20);
assert.equal(summary.schedulePreview.length, 4);
assert.ok(summary.processingFee.startsWith('BDT'));

const cards = makeLearningCards();
assert.equal(cards.length, 3);
assert.equal(cards[0].title, 'BDT money basics');
console.log('ui smoke ok', { kpi, preview, summary, cards });
