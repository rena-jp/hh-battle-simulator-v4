export function truncateSoftly(value: number, digit: number = 0): string {
    return (Math.floor(Math.round(value * 10 ** (digit + 1)) / 10) / 10 ** digit).toLocaleString();
}

export function toRoundedNumber(value: number, digit: number = 0): string {
    return (Math.round(value * 10 ** digit) / 10 ** digit).toLocaleString();
}

export function toPercentage(value: number): string {
    const percentage = value * 100;
    if (percentage >= 100) return '100%';
    if (percentage >= 10) return `${truncateSoftly(percentage, 1)}%`; // 10%-99.9%
    if (percentage >= 0.01) return `${truncateSoftly(percentage, 2)}%`; // 0.01%-9.99%
    if (percentage >= 0) return `${truncateSoftly(percentage, 3)}%`; // 0% or 0.001%-0.009%
    return '0%';
}

export function toLeaguePointsPerFight(value: number): string {
    if (value >= 25) return '25';
    if (value > 24.9) return truncateSoftly(value, 3);
    return truncateSoftly(value, 2);
}

export function toPreciseLeaguePointsPerFight(value: number): string {
    if (value >= 25) return '25';
    if (value > 24.9) return (25 - parseFloat((25 - value).toPrecision(2))).toLocaleString();
    return truncateSoftly(value, 2);
}

export function capitalize(str: string): string {
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}
