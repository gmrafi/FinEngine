export type DayCountConvention = 'Actual/365' | 'Actual/360' | '30/360' | 'Actual/Actual';
export type BusinessDayConvention = 'Following' | 'ModifiedFollowing' | 'Preceding' | 'Unadjusted';
export interface CashflowPoint {
    amount: number;
    date: string | Date;
}
export interface AmortizeInput {
    principal: number;
    annualRate: number;
    months: number;
    /** Optional start date of the loan. Defaults to current date if omitted. */
    startDate?: string | Date;
    /** Optional grace period / moratorium in months before principal amortizing begins. */
    gracePeriodMonths?: number;
    /** Grace period interest treatment: 'interest-only' (serviced monthly) or 'capitalized' (added to principal). Defaults to 'interest-only'. */
    gracePeriodType?: 'interest-only' | 'capitalized';
    /** Optional day-count convention for accrued interest. Defaults to standard 30/360 equal-month amortization. */
    dayCountConvention?: DayCountConvention;
    /** Optional balloon payment due at maturity. Defaults to 0. */
    balloonPayment?: number;
}
export interface ScheduleRow {
    month: number;
    date?: string;
    payment: number;
    principalPaid: number;
    interestPaid: number;
    remainingBalance: number;
    isGracePeriod?: boolean;
}
export interface AmortizeResult {
    monthlyPayment: number;
    totalInterest: number;
    totalPayable: number;
    effectiveRate?: number;
    schedule: ScheduleRow[];
}
/**
 * Calculates standard monthly EMI (Equated Monthly Installment) using compound annuity math.
 */
export declare function monthlyPayment(principal: number, annualRate: number, months: number): number;
/**
 * Calculates number of days between two dates based on international financial day-count conventions.
 */
export declare function daysBetween(startDate: string | Date, endDate: string | Date, convention?: DayCountConvention): number;
/**
 * Calculates the exact year fraction between two dates under the specified day-count convention.
 */
export declare function yearFraction(startDate: string | Date, endDate: string | Date, convention?: DayCountConvention): number;
/**
 * Checks if a date falls on a weekend (Saturday / Sunday by default).
 */
export declare function isWeekend(date: string | Date): boolean;
/**
 * Adjusts a cash flow date according to banking business day conventions and holiday lists.
 */
export declare function adjustBusinessDay(date: string | Date, convention?: BusinessDayConvention, holidays?: (string | Date)[]): Date;
/**
 * Generates an actuarial amortization schedule supporting grace periods (moratoriums),
 * custom day-count conventions, and final residual penny balancing.
 */
export declare function amortize(input: AmortizeInput): AmortizeResult;
/**
 * Calculates the Extended Internal Rate of Return (XIRR) for irregular cash flows.
 * Uses a hybrid algorithm: fast Newton-Raphson with an automatic fallback to bounded Bisection
 * to guarantee convergence even in volatile or non-standard cash-flow streams.
 */
export declare function xirr(cashflows: CashflowPoint[], guess?: number): number;
