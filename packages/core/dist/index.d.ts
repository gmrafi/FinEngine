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
export declare function createMoney(amount: number, currency?: SupportedCurrency): Money;
export declare function formatMoney(amount: number, currency?: SupportedCurrency, locale?: string): string;
export declare function validateLedgerEntry(entry: LedgerEntry): ValidationResult;
export declare function sumEntries(entries: LedgerEntry[]): Money;
