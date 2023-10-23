import { FighterCaracs, FighterCaracsCalculator, toFighterCaracs } from './fighter';

export interface Booster {
    item: {
        identifier: string;
        rarity: string;
        damage: string;
        ego: string;
        chance: string;
    };
    lifetime: string;
    usages_remaining: string;
}

export interface BoosterBonus {
    multiplier: FighterCaracs;
    addend: FighterCaracs;
}

export interface MythicBoosterBonus {
    leagues?: number;
    seasons?: number;
    trolls?: number;
    pantheon?: number;
    [key: string]: number | undefined;
}

const MythicBoosterMap: Record<string, MythicBoosterBonus | undefined> = {
    MB2: {
        // AME
        leagues: 1.15,
        seasons: 1.15,
    },
    MB3: {
        // Headband
        trolls: 1.25,
        pantheon: 1.25,
    },
    MB8: {
        // LME
        leagues: 1.15,
        seasons: 1,
    },
    MB9: {
        // SME
        leagues: 1,
        seasons: 1.15,
    },
};

export function getBoosterData(boosters: Booster[]) {
    const multiplier = new FighterCaracsCalculator();
    const addend = new FighterCaracsCalculator();
    let mythic = {} as MythicBoosterBonus;
    boosters
        .map(e => e.item)
        .forEach(e => {
            switch (e.rarity) {
                case 'common':
                case 'rare':
                case 'epic':
                    addend.add(toFighterCaracs(e));
                    break;
                case 'legendary':
                    multiplier.add(toFighterCaracs(e));
                    break;
                case 'mythic':
                    const mythicBonus = MythicBoosterMap[e.identifier];
                    if (mythicBonus != null) {
                        mythic = { ...mythic, ...mythicBonus };
                    }
                    break;
            }
        });
    const normal = {
        multiplier: multiplier.divide(100).add(1).result(),
        addend: addend.result(),
    };
    return { normal, mythic };
}
