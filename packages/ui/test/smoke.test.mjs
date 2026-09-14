import assert from 'node:assert/strict';
import { formatBurdenLabel, makeLearningBadge, makeMoneyKpi } from '../dist/index.js';

const kpi = makeMoneyKpi('Monthly EMI', 16967.64, '36-month SME example');
assert.equal(kpi.label, 'Monthly EMI');
assert.equal(kpi.tone, 'positive');
assert.equal(kpi.helper, '36-month SME example');
assert.ok(kpi.value.startsWith('BDT'));
assert.equal(formatBurdenLabel(16967.64, 85000), 'Healthy burden · 20% of income');
assert.equal(makeLearningBadge('EMI', 'intro'), 'EMI · intro');
console.log('ui smoke ok', kpi);
