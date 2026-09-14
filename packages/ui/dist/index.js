import { formatMoney } from '@finengine/core';
export function makeMoneyKpi(label, amount, helper) {
    return {
        label,
        value: formatMoney(amount),
        tone: amount >= 0 ? 'positive' : 'warning',
        helper,
    };
}
export function formatBurdenLabel(payment, income) {
    if (income <= 0)
        return 'Income not provided';
    const pct = Math.round((payment / income) * 1000) / 10;
    if (pct > 45)
        return `High burden · ${pct}% of income`;
    if (pct > 30)
        return `Watch burden · ${pct}% of income`;
    return `Healthy burden · ${pct}% of income`;
}
export function makeLearningBadge(topic, level) {
    return `${topic} · ${level}`;
}
