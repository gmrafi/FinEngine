import assert from 'node:assert/strict';
import { createMoney, formatMoney, sumEntries, validateLedgerEntry } from '../dist/index.js';

const balanced = {
  reference: 'MFS-SETTLEMENT-01',
  currency: 'BDT',
  source: 'mfs',
  lines: [
    { account: '1010-Cash', side: 'debit', amount: 5000 },
    { account: '2100-Customer-Balance', side: 'credit', amount: 5000 },
  ],
};

assert.deepEqual(createMoney(100.126), { amount: 100.13, currency: 'BDT' });
assert.equal(formatMoney(125000), 'BDT 125,000.00');
const validation = validateLedgerEntry(balanced);
assert.equal(validation.valid, true);
assert.equal(validation.totalDebit, 5000);
assert.equal(validation.totalCredit, 5000);
assert.deepEqual(sumEntries([balanced]), { amount: 5000, currency: 'BDT' });
console.log('core smoke ok', validation);
