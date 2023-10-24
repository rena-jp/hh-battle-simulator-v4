import { FighterCaracsCalculator, toFighterCaracsBonus } from '../data/fighter';
import {
    ClubUpgradesKeys,
    HeroCaracs,
    HeroCaracsCalculator,
    HeroCaracsKeys,
    HeroType,
    addHeroCaracs,
    toHeroCaracs,
    truncateHeroCaracs,
} from '../data/hero';
import { loadGinsengCaracs } from '../store/hero';
import { loadTeamParams } from '../store/team';
import { simulateFromTeams } from './battle';
import { calcCounterBonus } from './team';

export function calcMythicBoosterMultiplierFromFighters(playerFighter: Fighter, opponentFighter: Fighter) {
    const counterBonus = calcCounterBonus(playerFighter.team, opponentFighter.team);
    const percentage = Math.round((100 * playerFighter.damage) / playerFighter.team.caracs.damage / counterBonus);
    return percentage / 100;
}

export function simulateGinsengCaracs(hero: HeroType, armorCaracs: HeroCaracs) {
    const heroClass = hero.infos.class;
    const haremEndurance = hero.infos.harem_endurance;
    const primaryKey = HeroCaracsKeys[(heroClass + 2) % 3];
    const secondaryKey = HeroCaracsKeys[(heroClass + 1) % 3];
    const tertialyKey = HeroCaracsKeys[(heroClass + 0) % 3];
    const getPrimary = (caracs: HeroCaracs) => caracs[primaryKey];
    const getSecondarySum = (caracs: HeroCaracs) => caracs[secondaryKey] + caracs[tertialyKey];

    return [...Array(5)].map((_, ginseng) => {
        const clubBonus = getClubBonus(hero);
        const ginsengBonus = toHeroCaracs(Array(3).fill(0.06 * ginseng));
        const bonus = addHeroCaracs(clubBonus, ginsengBonus);
        const levelCaracs = getLevelBasedCaracs(hero);
        const marketCaracs = getMarketBoughtCaracs(hero);
        const baseCaracs = addHeroCaracs(levelCaracs, marketCaracs);
        const sumCaracs = addHeroCaracs(baseCaracs, armorCaracs);
        const bonusCaracs = new HeroCaracsCalculator(sumCaracs).multiply(bonus).truncate().result();
        const adjustedCaracs = addHeroCaracs(armorCaracs, bonusCaracs);

        let endurance = (getPrimary(baseCaracs) * 4 + armorCaracs.endurance + haremEndurance) * (1 + bonus.endurance);
        endurance += getPrimary(adjustedCaracs) * 4;
        endurance = Math.floor(endurance);

        let harmony = (getSecondarySum(baseCaracs) / 2 + armorCaracs.chance) * (1 + bonus.chance);
        harmony += getSecondarySum(adjustedCaracs) / 2;
        harmony = Math.round(harmony);

        const totalCaracs = addHeroCaracs(sumCaracs, bonusCaracs);
        totalCaracs.endurance = endurance;
        totalCaracs.chance = harmony;

        const finalCaracs = truncateHeroCaracs(totalCaracs);
        return {
            damage: getPrimary(finalCaracs),
            defense: getSecondarySum(finalCaracs) * 0.25,
            ego: finalCaracs.endurance,
            chance: finalCaracs.chance,
        };
    });
}

function getLevelBasedCaracs(hero: HeroType): HeroCaracs {
    const infos = hero.infos;
    const level = infos.level;
    const heroClass = infos.class;
    const perLevel = [5, 7, 9, 5, 7];
    return toHeroCaracs([
        level * perLevel[3 - heroClass], // Hardcore
        level * perLevel[4 - heroClass], // Charm
        level * perLevel[5 - heroClass], // Know-how
    ]);
}

function getMarketBoughtCaracs(hero: HeroType): HeroCaracs {
    return toHeroCaracs(hero.infos);
}

function getClubBonus(hero: HeroType): HeroCaracs {
    const clubUpgrades = hero.club?.upgrades_data;
    if (clubUpgrades == null) return toHeroCaracs({});
    return toHeroCaracs(ClubUpgradesKeys.map(key => clubUpgrades[key].level / 200));
}

export interface BoosterCounts {
    ginseng: number;
    chlorella: number;
    cordyceps: number;
    mythic: number;
}

export interface BoosterSimulationResult {
    boosterCounts: BoosterCounts;
    result: number;
}

function simulateBoosterCombination(
    f: (boosterCounts: BoosterCounts) => Promise<number>,
): Promise<BoosterSimulationResult[]> {
    return Promise.all(
        [...Array(2)].flatMap((_, mythic) =>
            [...Array(5)].flatMap((_, cordyceps) =>
                [...Array(5 - cordyceps)].map((_, chlorella) => {
                    const ginseng = 4 - cordyceps - chlorella;
                    const boosterCounts = { ginseng, chlorella, cordyceps, mythic };
                    return f(boosterCounts).then(result => ({ boosterCounts, result }));
                }),
            ),
        ),
    );
}

export function simulateBoosterCombinationMinimized(
    f: (boosterCounts: BoosterCounts) => Promise<number>,
): Promise<BoosterSimulationResult[]> {
    return Promise.all(
        [...Array(2)].flatMap((_, mythic) =>
            [...Array(5)].flatMap((_, cordyceps) =>
                Promise.all(
                    [...Array(5 - cordyceps)].map((_, chlorella) => {
                        const ginseng = 4 - cordyceps - chlorella;
                        const boosterCounts = { ginseng, chlorella, cordyceps, mythic };
                        return f(boosterCounts).then(result => ({ boosterCounts, result }));
                    }),
                ).then(results => results.reduce((p, c) => (p.result > c.result ? p : c))),
            ),
        ),
    );
}

export async function simulateBoosterCombinationWithHeadband(
    playerTeam: Team,
    opponentTeam: Team,
): Promise<BoosterSimulationResult[]> {
    const ginsengCaracs = loadGinsengCaracs();
    if (ginsengCaracs == null) return [];
    const teamParamsList = loadTeamParams();
    const teamParams = teamParamsList.find(e => playerTeam.id_team != null && e.teamId === +playerTeam.id_team);
    if (teamParams == null) return [];
    return simulateBoosterCombination(async (boosterCounts: BoosterCounts) => {
        const { ginseng, chlorella, cordyceps, mythic } = boosterCounts;
        const heroCaracs = ginsengCaracs[ginseng];
        const caracs = new FighterCaracsCalculator(heroCaracs)
            .multiply(teamParams.multiplier)
            .add(teamParams.addend)
            .multiply(
                toFighterCaracsBonus({
                    damage: 1 + 0.1 * cordyceps,
                    ego: 1 + 0.1 * chlorella,
                }),
            )
            .round()
            .result();
        const calculatedTeam = { ...playerTeam, caracs };
        return simulateFromTeams(
            'FastChance',
            calculatedTeam,
            opponentTeam,
            1 + 0.25 * mythic, // Headband
        );
    });
}

export function simulateBoosterCombinationWithAME(playerTeam: Team, opponentTeam: Team) {
    const ginsengCaracs = loadGinsengCaracs();
    if (ginsengCaracs == null) return [];
    const teamParamsList = loadTeamParams();
    const teamParams = teamParamsList.find(e => playerTeam.id_team != null && e.teamId === +playerTeam.id_team);
    if (teamParams == null) return [];
    return simulateBoosterCombination(async (boosterCounts: BoosterCounts) => {
        const { ginseng, chlorella, cordyceps, mythic } = boosterCounts;
        const heroCaracs = ginsengCaracs[ginseng];
        const caracs = new FighterCaracsCalculator(heroCaracs)
            .multiply(teamParams.multiplier)
            .add(teamParams.addend)
            .multiply(
                toFighterCaracsBonus({
                    damage: 1 + 0.1 * cordyceps,
                    ego: 1 + 0.1 * chlorella,
                }),
            )
            .round()
            .result();
        const calculatedTeam = { ...playerTeam, caracs };
        return simulateFromTeams(
            'FastPoints',
            calculatedTeam,
            opponentTeam,
            1 + 0.15 * mythic, // AME
        );
    });
}
