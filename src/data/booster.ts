import { FighterCaracs, toFighterCaracs } from './fighter';

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

export interface NormalBooster {
    multiplier?: FighterCaracs;
    addend?: FighterCaracs;
    lifetime: number;
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
    const normals: NormalBooster[] = [];
    let mythic = {} as MythicBoosterBonus;
    boosters.forEach(e => {
        const { item } = e;
        switch (item.rarity) {
            case 'common':
            case 'rare':
            case 'epic':
                normals.push({
                    addend: toFighterCaracs(item),
                    lifetime: +e.lifetime,
                });
                break;
            case 'legendary':
                normals.push({
                    multiplier: toFighterCaracs(item),
                    lifetime: +e.lifetime,
                });
                break;
            case 'mythic':
                const mythicBonus = MythicBoosterMap[item.identifier];
                if (mythicBonus != null) {
                    mythic = { ...mythic, ...mythicBonus };
                }
                break;
        }
    });
    return { normals, mythic };
}
