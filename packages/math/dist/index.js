/**
 * Calculates standard monthly EMI (Equated Monthly Installment) using compound annuity math.
 */
export function monthlyPayment(principal, annualRate, months) {
    if (principal <= 0 || months <= 0)
        return 0;
    if (annualRate <= 0)
        return round2(principal / months);
    const monthlyRate = annualRate / 12 / 100;
    const factor = Math.pow(1 + monthlyRate, months);
    const payment = (principal * monthlyRate * factor) / (factor - 1);
    return round2(payment);
}
/**
 * Calculates number of days between two dates based on international financial day-count conventions.
 */
export function daysBetween(startDate, endDate, convention = 'Actual/365') {
    const d1 = new Date(startDate);
    const d2 = new Date(endDate);
    if (convention === '30/360') {
        const y1 = d1.getUTCFullYear();
        const m1 = d1.getUTCMonth();
        let day1 = d1.getUTCDate();
        const y2 = d2.getUTCFullYear();
        const m2 = d2.getUTCMonth();
        let day2 = d2.getUTCDate();
        if (day1 === 31)
            day1 = 30;
        if (day2 === 31 && day1 >= 30)
            day2 = 30;
        return (y2 - y1) * 360 + (m2 - m1) * 30 + (day2 - day1);
    }
    const msDiff = d2.getTime() - d1.getTime();
    return Math.round(msDiff / (1000 * 60 * 60 * 24));
}
/**
 * Calculates the exact year fraction between two dates under the specified day-count convention.
 */
export function yearFraction(startDate, endDate, convention = 'Actual/365') {
    const days = daysBetween(startDate, endDate, convention);
    switch (convention) {
        case 'Actual/360':
            return days / 360;
        case '30/360':
            return days / 360;
        case 'Actual/Actual': {
            const d1 = new Date(startDate);
            const d2 = new Date(endDate);
            const y1 = d1.getUTCFullYear();
            const y2 = d2.getUTCFullYear();
            if (y1 === y2) {
                const isLeap = (y1 % 4 === 0 && y1 % 100 !== 0) || y1 % 400 === 0;
                return days / (isLeap ? 366 : 365);
            }
            return days / 365.2425;
        }
        case 'Actual/365':
        default:
            return days / 365;
    }
}
/**
 * Checks if a date falls on a weekend (Saturday / Sunday by default).
 */
export function isWeekend(date) {
    const d = new Date(date);
    const day = d.getUTCDay();
    return day === 0 || day === 6; // Sunday = 0, Saturday = 6
}
/**
 * Adjusts a cash flow date according to banking business day conventions and holiday lists.
 */
export function adjustBusinessDay(date, convention = 'Following', holidays = []) {
    if (convention === 'Unadjusted')
        return new Date(date);
    const holidayTimestamps = new Set(holidays.map((h) => {
        const d = new Date(h);
        return Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate());
    }));
    const isNonBusiness = (d) => {
        const day = d.getUTCDay();
        const isWk = day === 0 || day === 6;
        const ts = Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate());
        return isWk || holidayTimestamps.has(ts);
    };
    const current = new Date(date);
    if (!isNonBusiness(current))
        return current;
    if (convention === 'Following') {
        while (isNonBusiness(current)) {
            current.setUTCDate(current.getUTCDate() + 1);
        }
        return current;
    }
    if (convention === 'Preceding') {
        while (isNonBusiness(current)) {
            current.setUTCDate(current.getUTCDate() - 1);
        }
        return current;
    }
    if (convention === 'ModifiedFollowing') {
        const origMonth = current.getUTCMonth();
        const forward = new Date(current);
        while (isNonBusiness(forward)) {
            forward.setUTCDate(forward.getUTCDate() + 1);
        }
        if (forward.getUTCMonth() === origMonth) {
            return forward;
        }
        const backward = new Date(current);
        while (isNonBusiness(backward)) {
            backward.setUTCDate(backward.getUTCDate() - 1);
        }
        return backward;
    }
    return current;
}
/**
 * Generates an actuarial amortization schedule supporting grace periods (moratoriums),
 * custom day-count conventions, and final residual penny balancing.
 */
export function amortize(input) {
    const { principal, annualRate, months, startDate, gracePeriodMonths = 0, gracePeriodType = 'interest-only', balloonPayment = 0, } = input;
    if (principal <= 0 || months <= 0) {
        return { monthlyPayment: 0, totalInterest: 0, totalPayable: 0, schedule: [] };
    }
    const monthlyRate = annualRate / 12 / 100;
    let balance = principal;
    let totalInterest = 0;
    const schedule = [];
    const baseDate = startDate ? new Date(startDate) : new Date();
    // Phase 1: Grace Period / Moratorium
    for (let g = 1; g <= gracePeriodMonths; g += 1) {
        const interestAccrued = round2(balance * monthlyRate);
        totalInterest = round2(totalInterest + interestAccrued);
        const currentDate = new Date(baseDate);
        currentDate.setUTCMonth(currentDate.getUTCMonth() + g);
        if (gracePeriodType === 'capitalized') {
            balance = round2(balance + interestAccrued);
            schedule.push({
                month: g,
                date: currentDate.toISOString().slice(0, 10),
                payment: 0,
                principalPaid: 0,
                interestPaid: interestAccrued,
                remainingBalance: balance,
                isGracePeriod: true,
            });
        }
        else {
            // Interest-only servicing
            schedule.push({
                month: g,
                date: currentDate.toISOString().slice(0, 10),
                payment: interestAccrued,
                principalPaid: 0,
                interestPaid: interestAccrued,
                remainingBalance: balance,
                isGracePeriod: true,
            });
        }
    }
    // Phase 2: Amortization for remaining active months
    const activeMonths = months - gracePeriodMonths;
    let basePayment = 0;
    if (activeMonths > 0) {
        if (annualRate <= 0) {
            basePayment = round2((balance - balloonPayment) / activeMonths);
        }
        else {
            const factor = Math.pow(1 + monthlyRate, activeMonths);
            basePayment = round2(((balance - balloonPayment / factor) * monthlyRate * factor) / (factor - 1));
        }
        for (let m = 1; m <= activeMonths; m += 1) {
            const currentMonthIndex = gracePeriodMonths + m;
            const interestPaid = round2(balance * monthlyRate);
            let principalPaid = round2(basePayment - interestPaid);
            let currentPayment = basePayment;
            // Final month adjustment
            if (m === activeMonths) {
                principalPaid = round2(balance - balloonPayment);
                currentPayment = round2(principalPaid + interestPaid);
                balance = balloonPayment;
            }
            else {
                balance = round2(Math.max(0, balance - principalPaid));
            }
            totalInterest = round2(totalInterest + interestPaid);
            const currentDate = new Date(baseDate);
            currentDate.setUTCMonth(currentDate.getUTCMonth() + currentMonthIndex);
            schedule.push({
                month: currentMonthIndex,
                date: currentDate.toISOString().slice(0, 10),
                payment: currentPayment,
                principalPaid,
                interestPaid,
                remainingBalance: balance,
                isGracePeriod: false,
            });
        }
    }
    const standardPayment = activeMonths > 0 ? basePayment : round2(balance * monthlyRate);
    const totalPayable = round2(principal + totalInterest + balloonPayment);
    return {
        monthlyPayment: standardPayment,
        totalInterest,
        totalPayable,
        schedule,
    };
}
/**
 * Calculates the Extended Internal Rate of Return (XIRR) for irregular cash flows.
 * Uses a hybrid algorithm: fast Newton-Raphson with an automatic fallback to bounded Bisection
 * to guarantee convergence even in volatile or non-standard cash-flow streams.
 */
export function xirr(cashflows, guess = 0.1) {
    if (cashflows.length < 2) {
        throw new Error('At least two cashflows are required for XIRR calculation.');
    }
    let hasPositive = false;
    let hasNegative = false;
    for (const cf of cashflows) {
        if (cf.amount > 0)
            hasPositive = true;
        if (cf.amount < 0)
            hasNegative = true;
    }
    if (!hasPositive || !hasNegative) {
        throw new Error('XIRR requires at least one positive cash inflow and one negative cash outflow.');
    }
    const normalized = cashflows.map((item) => ({
        amount: item.amount,
        date: new Date(item.date),
    }));
    normalized.sort((a, b) => a.date.getTime() - b.date.getTime());
    const originTime = normalized[0].date.getTime();
    const calcNPV = (rate) => {
        let npv = 0;
        for (const flow of normalized) {
            const years = (flow.date.getTime() - originTime) / (365 * 24 * 60 * 60 * 1000);
            if (rate <= -1.0)
                return Number.NEGATIVE_INFINITY;
            npv += flow.amount / Math.pow(1 + rate, years);
        }
        return npv;
    };
    const calcDNPV = (rate) => {
        let dnpv = 0;
        for (const flow of normalized) {
            const years = (flow.date.getTime() - originTime) / (365 * 24 * 60 * 60 * 1000);
            const base = Math.pow(1 + rate, years);
            dnpv += (-years * flow.amount) / (base * (1 + rate));
        }
        return dnpv;
    };
    let rate = guess;
    const MAX_NEWTON_ITER = 100;
    const TOLERANCE = 1e-7;
    for (let i = 0; i < MAX_NEWTON_ITER; i += 1) {
        const f = calcNPV(rate);
        const df = calcDNPV(rate);
        if (Math.abs(f) < TOLERANCE) {
            return round4(rate);
        }
        if (Math.abs(df) < 1e-12 || !Number.isFinite(df)) {
            break;
        }
        const step = f / df;
        const nextRate = rate - step;
        if (nextRate <= -0.9999 || nextRate > 100 || !Number.isFinite(nextRate)) {
            break;
        }
        if (Math.abs(nextRate - rate) < TOLERANCE) {
            return round4(nextRate);
        }
        rate = nextRate;
    }
    let low = -0.9999;
    let high = 10.0;
    let npvLow = calcNPV(low);
    let npvHigh = calcNPV(high);
    if (npvLow * npvHigh > 0) {
        high = 100.0;
        npvHigh = calcNPV(high);
    }
    if (npvLow * npvHigh <= 0) {
        for (let j = 0; j < 120; j += 1) {
            const mid = (low + high) / 2;
            const npvMid = calcNPV(mid);
            if (Math.abs(npvMid) < TOLERANCE || (high - low) / 2 < TOLERANCE) {
                return round4(mid);
            }
            if (npvLow * npvMid <= 0) {
                high = mid;
                npvHigh = npvMid;
            }
            else {
                low = mid;
                npvLow = npvMid;
            }
        }
        return round4((low + high) / 2);
    }
    return round4(rate);
}
function round2(value) {
    return Math.round((value + Number.EPSILON) * 100) / 100;
}
function round4(value) {
    return Math.round((value + Number.EPSILON) * 10000) / 10000;
}
