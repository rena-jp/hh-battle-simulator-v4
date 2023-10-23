import {
    Caracs,
    CaracsCalculator,
    CaracsLike,
    addCaracs,
    divideCaracs,
    multiplyCaracs,
    roundCaracs,
    subtractCaracs,
    toCaracs,
    truncateCaracs,
} from './caracs';

export const ClubUpgradesKeys = [
    'hardcore_stats',
    'charm_stats',
    'know_how_stats',
    'endurance_stats',
    'harmony_stats',
] as const;

export interface HeroType {
    infos: {
        class: number;
        caracs: Record<(typeof HeroCaracsKeys)[number], number> & {
            primary_carac_amount: number;
            secondary_caracs_sum: number;
        };
        harem_endurance: number;
        carac1: number;
        carac2: number;
        carac3: number;
        level: number;
        id: number;
    };
    club: {
        upgrades_data: Record<(typeof ClubUpgradesKeys)[number], { level: number }>;
    };
    updates?: Function;
}

export const HeroCaracsKeys = ['carac1', 'carac2', 'carac3', 'endurance', 'chance'] as const;

export type HeroCaracs = Caracs<typeof HeroCaracsKeys>;
export type HeroCaracsLike = CaracsLike<typeof HeroCaracsKeys>;

export function toHeroCaracs(caracs: Partial<HeroCaracsLike> | (number | string)[]): HeroCaracs {
    return toCaracs(HeroCaracsKeys, caracs, 0);
}

export function toHeroCaracsBonus(caracs: Partial<HeroCaracsLike> | (number | string)[]): HeroCaracs {
    return toCaracs(HeroCaracsKeys, caracs, 1);
}

export function addHeroCaracs(x: HeroCaracs, y: HeroCaracs | number): HeroCaracs {
    return addCaracs(HeroCaracsKeys, x, y);
}

export function subtractHeroCaracs(minuend: HeroCaracs, subtrahend: HeroCaracs | number): HeroCaracs {
    return subtractCaracs(HeroCaracsKeys, minuend, subtrahend);
}

export function multiplyHeroCaracs(x: HeroCaracs, y: HeroCaracs | number): HeroCaracs {
    return multiplyCaracs(HeroCaracsKeys, x, y);
}

export function divideHeroCaracs(numerator: HeroCaracs, denominator: HeroCaracs): HeroCaracs {
    return divideCaracs(HeroCaracsKeys, numerator, denominator);
}

export function truncateHeroCaracs(caracs: HeroCaracs): HeroCaracs {
    return truncateCaracs(HeroCaracsKeys, caracs);
}

export function roundHeroCaracs(caracs: HeroCaracs): HeroCaracs {
    return roundCaracs(HeroCaracsKeys, caracs);
}

export class HeroCaracsCalculator extends CaracsCalculator<typeof HeroCaracsKeys> {
    constructor(initialValue: Partial<HeroCaracsLike> | (number | string)[] = {}) {
        super(HeroCaracsKeys, initialValue);
    }
}
