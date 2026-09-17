import assert from 'node:assert/strict';
import {
  amortize,
  monthlyPayment,
  xirr,
  daysBetween,
  yearFraction,
  adjustBusinessDay,
  isWeekend
} from '../dist/index.js';

// 1. Standard EMI Math
const payment = monthlyPayment(500000, 13.5, 36);
assert.equal(payment, 16967.64);

const schedule = amortize({ principal: 500000, annualRate: 13.5, months: 36 });
assert.equal(schedule.monthlyPayment, 16967.64);
assert.equal(schedule.schedule.length, 36);
assert.equal(schedule.totalInterest, 110835.2);
assert.equal(schedule.totalPayable, 610835.2);

// 2. Grace Period / Moratorium (6 months grace + 30 months active amortizing)
const graceSchedule = amortize({
  principal: 500000,
  annualRate: 12.0,
  months: 36,
  gracePeriodMonths: 6,
  gracePeriodType: 'interest-only'
});
assert.equal(graceSchedule.schedule.length, 36);
assert.equal(graceSchedule.schedule[0].isGracePeriod, true);
assert.equal(graceSchedule.schedule[0].payment, 5000.00); // 500,000 * 1% = 5000
assert.equal(graceSchedule.schedule[6].isGracePeriod, false);

// 3. Day-Count Conventions
const d1 = '2026-01-01';
const d2 = '2026-07-01';
assert.equal(daysBetween(d1, d2, 'Actual/365'), 181);
assert.equal(daysBetween(d1, d2, '30/360'), 180);
assert.equal(Math.round(yearFraction(d1, d2, 'Actual/365') * 1000) / 1000, 0.496);
assert.equal(yearFraction(d1, d2, '30/360'), 0.5);

// 4. Business Day & Weekend Checks
assert.equal(isWeekend('2026-01-03'), true); // Saturday
assert.equal(isWeekend('2026-01-05'), false); // Monday
const rolledDate = adjustBusinessDay('2026-01-03', 'Following');
assert.equal(rolledDate.getUTCDay(), 1); // Rolls to Monday Jan 5

// 5. Hybrid XIRR Convergence
const irr = xirr([
  { amount: -100000, date: '2026-01-01' },
  { amount: 25000, date: '2026-04-01' },
  { amount: 25000, date: '2026-07-01' },
  { amount: 70000, date: '2027-01-10' }
]);
assert.equal(irr, 0.28);

console.log('math smoke ok', {
  payment,
  irr,
  totalInterest: schedule.totalInterest,
  graceMonths: 6,
  dayCount30_360: daysBetween(d1, d2, '30/360')
});
