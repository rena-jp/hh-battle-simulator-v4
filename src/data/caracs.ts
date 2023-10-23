export type Caracs<T extends readonly string[]> = Record<T[number], number>;

export type CaracsLike<T extends readonly string[]> = Record<T[number], number | string>;

function toNumber(value: any, defaultValue: number) {
    return value != null ? +value : defaultValue;
}

export function toCaracs<T extends readonly string[]>(
    keys: T,
    caracs: Partial<CaracsLike<T>> | (number | string)[],
    defaultValue: number,
): Caracs<T> {
    if (Array.isArray(caracs)) {
        return keys.reduce((newCaracs, key: T[number], i: number) => {
            newCaracs[key] = toNumber(caracs[i], defaultValue);
            return newCaracs;
        }, {} as Caracs<T>);
    } else {
        return keys.reduce((newCaracs, key: T[number]) => {
            newCaracs[key] = toNumber(caracs[key], defaultValue);
            return newCaracs;
        }, {} as Caracs<T>);
    }
}

function calcCaracs<T extends readonly string[]>(
    keys: T,
    x: Caracs<T>,
    y: Caracs<T> | number,
    f: (x: number, y: number) => number,
): Caracs<T> {
    if (typeof y === 'number') {
        return keys.reduce((newCaracs, key: T[number]) => {
            newCaracs[key] = f(x[key], y);
            return newCaracs;
        }, {} as Caracs<T>);
    } else {
        return keys.reduce((newCaracs, key: T[number]) => {
            newCaracs[key] = f(x[key], y[key]);
            return newCaracs;
        }, {} as Caracs<T>);
    }
}

export function addCaracs<T extends readonly string[]>(keys: T, x: Caracs<T>, y: Caracs<T> | number): Caracs<T> {
    return calcCaracs(keys, x, y, (x, y) => x + y);
}

export function subtractCaracs<T extends readonly string[]>(keys: T, x: Caracs<T>, y: Caracs<T> | number): Caracs<T> {
    return calcCaracs(keys, x, y, (x, y) => x - y);
}

export function multiplyCaracs<T extends readonly string[]>(keys: T, x: Caracs<T>, y: Caracs<T> | number): Caracs<T> {
    return calcCaracs(keys, x, y, (x, y) => x * y);
}

export function divideCaracs<T extends readonly string[]>(keys: T, x: Caracs<T>, y: Caracs<T> | number): Caracs<T> {
    return calcCaracs(keys, x, y, (x, y) => x / y);
}

export function truncateCaracs<T extends readonly string[]>(keys: T, caracs: Caracs<T>): Caracs<T> {
    return keys.reduce((newCaracs, key: T[number]) => {
        newCaracs[key] = Math.floor(caracs[key]);
        return newCaracs;
    }, {} as Caracs<T>);
}

export function roundCaracs<T extends readonly string[]>(keys: T, caracs: Caracs<T>): Caracs<T> {
    return keys.reduce((newCaracs, key: T[number]) => {
        newCaracs[key] = Math.round(caracs[key]);
        return newCaracs;
    }, {} as Caracs<T>);
}

export class CaracsCalculator<T extends readonly string[]> {
    protected value: Caracs<T>;
    constructor(protected readonly keys: T, initialValue: Partial<CaracsLike<T>> | (number | string)[] = {}) {
        this.value = toCaracs(keys, initialValue, 0);
    }
    add(addend: Caracs<T> | number) {
        this.value = addCaracs(this.keys, this.value, addend);
        return this;
    }
    subtract(subtrahend: Caracs<T> | number) {
        this.value = subtractCaracs(this.keys, this.value, subtrahend);
        return this;
    }
    multiply(multiplier: Caracs<T> | number) {
        this.value = multiplyCaracs(this.keys, this.value, multiplier);
        return this;
    }
    divide(denominator: Caracs<T> | number) {
        this.value = divideCaracs(this.keys, this.value, denominator);
        return this;
    }
    truncate() {
        this.value = truncateCaracs(this.keys, this.value);
        return this;
    }
    round() {
        this.value = roundCaracs(this.keys, this.value);
        return this;
    }
    result(): Caracs<T> {
        return this.value;
    }
}
