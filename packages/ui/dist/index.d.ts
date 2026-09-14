import type { AmortizeResult, ScheduleRow } from '@finengine/math';
export type KpiTone = 'neutral' | 'positive' | 'warning';
export type LearningLevel = 'intro' | 'applied' | 'advanced';
export type BurdenTone = 'healthy' | 'watch' | 'high' | 'unknown';
export interface KpiCardModel {
    label: string;
    value: string;
    tone: KpiTone;
    helper?: string;
}
export interface SchedulePreviewRow {
    month: number;
    principal: string;
    interest: string;
    balance: string;
}
export interface RepaymentSummaryModel {
    scenario: string;
    monthlyPayment: string;
    totalInterest: string;
    totalPayable: string;
    processingFee: string;
    burdenLabel: string;
    burdenTone: BurdenTone;
    burdenPct: number | null;
    schedulePreview: SchedulePreviewRow[];
}
export interface LearningCardModel {
    title: string;
    badge: string;
    audience: string;
    outcome: string;
}
export declare function makeMoneyKpi(label: string, amount: number, helper?: string): KpiCardModel;
export declare function formatBurdenLabel(payment: number, income: number): string;
export declare function makeLearningBadge(topic: string, level: LearningLevel): string;
export declare function makeSchedulePreview(schedule: ScheduleRow[], limit?: number): SchedulePreviewRow[];
export declare function makeRepaymentSummary(scenario: string, plan: AmortizeResult, monthlyIncome?: number, processingFeePct?: number): RepaymentSummaryModel;
export declare function makeLearningCards(): LearningCardModel[];
