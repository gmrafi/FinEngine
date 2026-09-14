import assert from 'node:assert/strict';
import { amortize, monthlyPayment, xirr } from '../dist/index.js';

const payment = monthlyPayment(500000, 13.5, 36);
assert.equal(payment, 16967.64);

const schedule = amortize({ principal: 500000, annualRate: 13.5, months: 36 });
assert.equal(schedule.monthlyPayment, 16967.64);
assert.equal(schedule.schedule.length, 36);
assert.equal(schedule.totalInterest, 110835.2);
assert.equal(schedule.totalPayable, 610835.2);

const irr = xirr([
  { amount: -100000, date: '2026-01-01' },
  { amount: 25000, date: '2026-04-01' },
  { amount: 25000, date: '2026-07-01' },
  { amount: 70000, date: '2027-01-10' }
]);
assert.equal(irr, 0.28);
console.log('math smoke ok', { payment, irr, totalInterest: schedule.totalInterest });
