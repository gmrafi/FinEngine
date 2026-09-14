export interface AmortizeInput {
    principal: number;
    annualRate: number;
    months: number;
}
export interface ScheduleRow {
    month: number;
    payment: number;
    principalPaid: number;
    interestPaid: number;
    remainingBalance: number;
}
export interface AmortizeResult {
    monthlyPayment: number;
    totalInterest: number;
    totalPayable: number;
    schedule: ScheduleRow[];
}
export interface CashflowPoint {
    amount: number;
    date: string | Date;
}
export declare function monthlyPayment(principal: number, annualRate: number, months: number): number;
export declare function amortize(input: AmortizeInput): AmortizeResult;
export declare function xirr(cashflows: CashflowPoint[], guess?: number): number;
