export interface KpiCardModel {
    label: string;
    value: string;
    tone: 'neutral' | 'positive' | 'warning';
    helper?: string;
}
export declare function makeMoneyKpi(label: string, amount: number, helper?: string): KpiCardModel;
export declare function formatBurdenLabel(payment: number, income: number): string;
export declare function makeLearningBadge(topic: string, level: 'intro' | 'applied' | 'advanced'): string;
