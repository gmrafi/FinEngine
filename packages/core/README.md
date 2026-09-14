# @finengine/core

Core money primitives and ledger validation helpers for FinEngine.

## What it does
- Create and format money values
- Validate balanced journal entries
- Sum debit-side ledger totals for quick reporting

## Bangladesh-oriented examples
- BDT-first formatting for loan, MFS, or SME accounting flows
- Ledger validation for merchant settlements and cash-to-bank transfers
- Beginner-friendly examples for finance learners moving from spreadsheets to code, including Bangla-first teaching notes

## API
### createMoney(amount, currency?)
Returns a rounded money object.

### formatMoney(amount, currency?, locale?)
Formats an amount using `Intl.NumberFormat`.

### validateLedgerEntry(entry)
Checks whether the entry is balanced and structurally valid.

### sumEntries(entries)
Sums debit totals across entries and returns a Money object.

## Example
```ts
import { formatMoney, validateLedgerEntry } from '@finengine/core';

console.log(formatMoney(125000));
// BDT 125,000.00

const result = validateLedgerEntry({
  reference: 'MFS-SETTLEMENT-01',
  currency: 'BDT',
  lines: [
    { account: '1010-Cash', side: 'debit', amount: 5000 },
    { account: '2100-Customer-Balance', side: 'credit', amount: 5000 }
  ]
});

console.log(result.valid, result.totalDebit, result.totalCredit);
// true 5000 5000
```
