function clamp(value: number, min: number, max: number): number {
    return value <= min ? min : value >= max ? max : value;
}

function getGammaCorrectedValue(value: number): number {
    return Math.round(255 * Math.sqrt(clamp(value, 0, 1)));
}

function getRatingColor(rate: number): string {
    const red = getGammaCorrectedValue(2 - 2 * rate);
    const green = getGammaCorrectedValue(2 * rate);
    return `rgb(${red}, ${green}, 0)`;
}

export function getChanceColor(chance: number): string {
    const rate = clamp(chance, 0, 1) ** 3;
    return getRatingColor(rate);
}

export function getMojoColor(mojo: number): string {
    let rate = clamp(mojo + 10, 0, 40) / 40;
    rate = 0.5 - 0.5 * Math.cos(rate ** 2 * Math.PI);
    return getRatingColor(rate);
}

export function getPointsColor(points: number): string {
    const rate = ((clamp(points, 3, 25) - 3) / 22) ** 3;
    return getRatingColor(rate);
}
