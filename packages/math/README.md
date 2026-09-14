# @finengine/math

Financial math starter utilities for FinEngine.

## What it does
- EMI / monthly payment calculation
- Full amortization schedule generation
- XIRR estimation for uneven cashflows

## Bangladesh-oriented examples
- BDT-denominated loan examples for personal finance education
- SME installment planning and classroom demos
- Cashflow reasoning for local savings, investment, DSE-style return discussions, and repayment scenarios

## API
### monthlyPayment(principal, annualRate, months)
Returns the rounded monthly installment.

### amortize({ principal, annualRate, months })
Builds the payment schedule and totals.

### xirr(cashflows, guess?)
Estimates annualized return for irregular cashflows.

## Example
```ts
import { amortize, xirr } from '@finengine/math';

const plan = amortize({ principal: 500000, annualRate: 13.5, months: 36 });
console.log(plan.monthlyPayment);
// 16967.64

console.log(xirr([
  { amount: -100000, date: '2026-01-01' },
  { amount: 25000, date: '2026-04-01' },
  { amount: 25000, date: '2026-07-01' },
  { amount: 70000, date: '2027-01-10' }
]));
// 0.28
```
