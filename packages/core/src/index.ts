export type SupportedCurrency = 'BDT' | 'USD';

export interface Money {
  amount: number;
  currency: SupportedCurrency;
}

export interface LedgerLine {
  account: string;
  side: 'debit' | 'credit';
  amount: number;
  narrative?: string;
}

export interface LedgerEntry {
  reference: string;
  currency: SupportedCurrency;
  lines: LedgerLine[];
  source?: 'mfs' | 'bank' | 'card' | 'cash' | 'manual';
}

export interface ValidationResult {
  valid: boolean;
  totalDebit: number;
  totalCredit: number;
  errors: string[];
}

export function createMoney(amount: number, currency: SupportedCurrency = 'BDT'): Money {
  return { amount: round2(amount), currency };
}

export function formatMoney(amount: number, currency: SupportedCurrency = 'BDT', locale = 'en-BD'): string {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
    maximumFractionDigits: 2,
    minimumFractionDigits: 2,
  }).format(round2(amount));
}

export function validateLedgerEntry(entry: LedgerEntry): ValidationResult {
  const errors: string[] = [];
  if (!entry.reference.trim()) errors.push('Reference is required.');
  if (!entry.lines.length) errors.push('At least one ledger line is required.');
  const totalDebit = round2(sumLines(entry.lines, 'debit'));
  const totalCredit = round2(sumLines(entry.lines, 'credit'));
  if (totalDebit <= 0 || totalCredit <= 0) errors.push('Both debit and credit totals must be positive.');
  if (Math.abs(totalDebit - totalCredit) > 0.005) errors.push('Entry is not balanced.');
  entry.lines.forEach((line, index) => {
    if (!line.account.trim()) errors.push(`Line ${index + 1} is missing an account code.`);
    if (!(line.amount > 0)) errors.push(`Line ${index + 1} amount must be greater than zero.`);
  });
  return {
    valid: errors.length === 0,
    totalDebit,
    totalCredit,
    errors,
  };
}

export function sumEntries(entries: LedgerEntry[]): Money {
  const currency = entries[0]?.currency ?? 'BDT';
  const amount = entries.reduce((total, entry) => total + sumLines(entry.lines, 'debit'), 0);
  return createMoney(amount, currency);
}

function sumLines(lines: LedgerLine[], side: LedgerLine['side']): number {
  return lines.filter((line) => line.side === side).reduce((total, line) => total + line.amount, 0);
}

function round2(value: number): number {
  return Math.round((value + Number.EPSILON) * 100) / 100;
}
