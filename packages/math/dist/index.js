export function monthlyPayment(principal, annualRate, months) {
    const monthlyRate = annualRate / 12 / 100;
    const payment = principal * monthlyRate * Math.pow(1 + monthlyRate, months) / (Math.pow(1 + monthlyRate, months) - 1);
    return round2(payment);
}
export function amortize(input) {
    const payment = monthlyPayment(input.principal, input.annualRate, input.months);
    const monthlyRate = input.annualRate / 12 / 100;
    let balance = input.principal;
    let totalInterest = 0;
    const schedule = [];
    for (let month = 1; month <= input.months; month += 1) {
        const interestPaid = round2(balance * monthlyRate);
        const principalPaid = round2(payment - interestPaid);
        balance = round2(Math.max(0, balance - principalPaid));
        totalInterest = round2(totalInterest + interestPaid);
        schedule.push({
            month,
            payment,
            principalPaid,
            interestPaid,
            remainingBalance: balance,
        });
    }
    return {
        monthlyPayment: payment,
        totalInterest,
        totalPayable: round2(input.principal + totalInterest),
        schedule,
    };
}
export function xirr(cashflows, guess = 0.1) {
    if (cashflows.length < 2)
        throw new Error('At least two cashflows are required.');
    const normalized = cashflows.map((item) => ({ ...item, date: new Date(item.date) }));
    const origin = normalized[0].date.getTime();
    let rate = guess;
    for (let i = 0; i < 100; i += 1) {
        let f = 0;
        let df = 0;
        for (const flow of normalized) {
            const years = (flow.date.getTime() - origin) / (365 * 24 * 60 * 60 * 1000);
            const base = Math.pow(1 + rate, years);
            f += flow.amount / base;
            df += (-years * flow.amount) / (base * (1 + rate));
        }
        const next = rate - f / df;
        if (Math.abs(next - rate) < 1e-7)
            return round4(next);
        rate = next;
    }
    return round4(rate);
}
function round2(value) {
    return Math.round((value + Number.EPSILON) * 100) / 100;
}
function round4(value) {
    return Math.round((value + Number.EPSILON) * 10000) / 10000;
}
