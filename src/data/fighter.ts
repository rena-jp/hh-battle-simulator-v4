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
import { HeroType } from './hero';

export const FighterCaracsKeys = ['damage', 'defense', 'ego', 'chance'] as const;

export type FighterCaracs = Caracs<typeof FighterCaracsKeys>;
export type FighterCaracsLike = CaracsLike<typeof FighterCaracsKeys>;

export class FighterCaracsCalculator extends CaracsCalculator<typeof FighterCaracsKeys> {
    constructor(initialValue: Partial<FighterCaracsLike> | (number | string)[] = {}) {
        super(FighterCaracsKeys, initialValue);
    }
}

export function toFighterCaracs(caracs: Partial<FighterCaracsLike> | (number | string)[]): FighterCaracs {
    return toCaracs(FighterCaracsKeys, caracs, 0);
}

export function toFighterCaracsBonus(caracs: Partial<FighterCaracsLike> | (number | string)[]): FighterCaracs {
    return toCaracs(FighterCaracsKeys, caracs, 1);
}

export function getFighterCaracsFromHero(hero: HeroType): FighterCaracs {
    const { caracs } = hero.infos;
    return {
        damage: caracs.primary_carac_amount,
        defense: caracs.secondary_caracs_sum * 0.25,
        ego: caracs.endurance,
        chance: caracs.chance,
    };
}

export function getFighterCaracsFromTeamPower(teamPower: number): FighterCaracs {
    return {
        damage: teamPower * 0.25,
        defense: teamPower * 0.12,
        ego: teamPower * 2,
        chance: 0,
    };
}

export function addFighterCaracs(x: FighterCaracs, y: FighterCaracs | number): FighterCaracs {
    return addCaracs(FighterCaracsKeys, x, y);
}

export function subtractFighterCaracs(minuend: FighterCaracs, subtrahend: FighterCaracs | number): FighterCaracs {
    return subtractCaracs(FighterCaracsKeys, minuend, subtrahend);
}

export function multiplyFighterCaracs(x: FighterCaracs, y: FighterCaracs | number): FighterCaracs {
    return multiplyCaracs(FighterCaracsKeys, x, y);
}

export function divideFighterCaracs(numerator: FighterCaracs, denominator: FighterCaracs): FighterCaracs {
    return divideCaracs(FighterCaracsKeys, numerator, denominator);
}

export function truncateFighterCaracs(caracs: FighterCaracs): FighterCaracs {
    return truncateCaracs(FighterCaracsKeys, caracs);
}

export function roundFighterCaracs(caracs: FighterCaracs): FighterCaracs {
    return roundCaracs(FighterCaracsKeys, caracs);
}
