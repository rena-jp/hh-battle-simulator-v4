import { FighterCaracs, FighterCaracsCalculator, equalsFighterCaracs, toFighterCaracsBonus } from '../data/fighter';
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
import { getConfig } from '../interop/hh-plus-plus-config';
import { fetchTeamParams } from '../page/edit-team';
import { loadGinsengCaracs } from '../store/hero';
import { TeamParams, loadTeamParams } from '../store/team';
import { capitalize } from '../utils/string';
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

async function getTeamParams(team: Team) {
    if (team.id_team == null) return;
    const teamId = team.id_team;
    const teamParamsList = loadTeamParams();
    const teamParams = teamParamsList.find(e => e.teamId === +teamId);
    if (teamParams?.caracs != null && equalsFighterCaracs(teamParams.caracs, team.caracs)) {
        return teamParams;
    }
    if (window.Hero == null) return;
    return await fetchTeamParams(teamId, window.Hero as HeroType);
}

export const BoosterKeys = ['ginseng', 'jujubes', 'chlorella', 'cordyceps', 'mythic'] as const;
export type BoosterCounts = Record<(typeof BoosterKeys)[number], number>;

function calcBoostedTeam(
    baseTeam: Team,
    teamParams: TeamParams,
    ginsengCaracs: FighterCaracs[],
    boosterCounts: BoosterCounts,
) {
    const { ginseng, jujubes, chlorella, cordyceps } = boosterCounts;
    const heroCaracs = ginsengCaracs[ginseng];
    const caracs = new FighterCaracsCalculator(heroCaracs)
        .multiply(teamParams.multiplier)
        .add(teamParams.addend)
        .multiply(
            toFighterCaracsBonus({
                damage: 1 + 0.1 * cordyceps,
                ego: 1 + 0.1 * chlorella,
                chance: 1 + 0.2 * jujubes,
            }),
        )
        .round()
        .result();
    return {
        ...baseTeam,
        caracs,
    };
}

interface CalculatedSkill {
    id_skill: string;
    level: string;
    skill: {
        id_skill: number;
        level: number;
        percentage_value: number;
        display_value_text: string;
        skill_type: string;
    };
}

function calcSkilledTeam(baseTeam: Team, skill: CalculatedSkill) {
    const skills = { ...baseTeam.girls[0].skills };
    [11, 12, 13, 14].forEach(e => {
        delete skills[e];
    });
    skills[skill.skill.id_skill] = skill;

    const girls = [...baseTeam.girls];
    girls[0] = { ...baseTeam.girls[0], skills };
    return { ...baseTeam, girls };
}

export interface BoosterSimulationResult {
    boosterCounts: BoosterCounts;
    result: number;
}

async function simulateBoosterCombination(
    f: (boosterCounts: BoosterCounts) => Promise<number>,
): Promise<BoosterSimulationResult[]> {
    const { simulateGinseng, simulateJujubes, simulateChlorella, simulateCordyceps } = getConfig();
    if (!(simulateGinseng || simulateJujubes || simulateChlorella || simulateCordyceps)) return [];
    return Promise.all(
        [...Array(2)].flatMap((_, mythic) =>
            [...Array(simulateCordyceps ? 5 : 1)].flatMap((_, cordyceps) =>
                [...Array(simulateChlorella ? 5 - cordyceps : 1)].flatMap((_, chlorella) =>
                    [...Array(simulateJujubes ? 5 - cordyceps - chlorella : 1)].flatMap((_, jujubes) => {
                        const ginseng = 4 - cordyceps - chlorella - jujubes;
                        if (!simulateGinseng && ginseng > 0) return [];
                        const boosterCounts = { ginseng, jujubes, chlorella, cordyceps, mythic };
                        return f(boosterCounts).then(result => ({ boosterCounts, result }));
                    }),
                ),
            ),
        ),
    );
}
/*
function simulateBoosterCombinationMinimized(
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
*/
export async function simulateBoosterCombinationWithHeadband(
    playerTeam: Team,
    opponentTeam: Team,
): Promise<BoosterSimulationResult[]> {
    const ginsengCaracs = loadGinsengCaracs();
    if (ginsengCaracs == null) throw new Error('Market data not found');
    const teamParams = await getTeamParams(playerTeam);
    if (teamParams == null) throw new Error('Team data not found');
    return simulateBoosterCombination(async (boosterCounts: BoosterCounts) => {
        const calculatedTeam = calcBoostedTeam(playerTeam, teamParams, ginsengCaracs, boosterCounts);
        const mythicBoosterMultiplier = 1 + 0.25 * boosterCounts.mythic; // Headband
        return simulateFromTeams('FastChance', calculatedTeam, opponentTeam, mythicBoosterMultiplier);
    });
}

export async function simulateBoosterCombinationWithAME(playerTeam: Team, opponentTeam: Team) {
    const ginsengCaracs = loadGinsengCaracs();
    if (ginsengCaracs == null) throw new Error('Market data not found');
    const teamParams = await getTeamParams(playerTeam);
    if (teamParams == null) throw new Error('Team data not found');
    return simulateBoosterCombination(async (boosterCounts: BoosterCounts) => {
        const calculatedTeam = calcBoostedTeam(playerTeam, teamParams, ginsengCaracs, boosterCounts);
        const mythicBoosterMultiplier = 1 + 0.15 * boosterCounts.mythic; // AME
        return simulateFromTeams('FastPoints', calculatedTeam, opponentTeam, mythicBoosterMultiplier);
    });
}

export interface SkillSimulationResult {
    skillName: string;
    results: {
        level: number;
        results: BoosterSimulationResult[];
    }[];
}

function simulateSkillCombination(
    f: (boosterCounts: BoosterCounts, skill: CalculatedSkill) => Promise<number>,
): Promise<SkillSimulationResult[]> {
    const skillMap = {
        11: { skillType: 'stun', levelPercentage: 7 },
        12: { skillType: 'shield', levelPercentage: 8 },
        13: { skillType: 'reflect', levelPercentage: 20 },
        14: { skillType: 'execute', levelPercentage: 6 },
    } as Record<number, { skillType: string; levelPercentage: number }>;
    const create5thSkill = (id: number, level: number) => {
        const { skillType, levelPercentage } = skillMap[id];
        const percentage = level * levelPercentage;
        return {
            id_skill: id.toString(),
            level: level.toString(),
            skill: {
                id_skill: id,
                level,
                percentage_value: percentage,
                display_value_text: `${percentage}%`,
                skill_type: skillType,
            },
        };
    };
    return Promise.all(
        [11, 12, 13, 14].map(async skillId => {
            const results = await Promise.all(
                [5, 4, 3, 2, 1].map(async level => {
                    const skill = create5thSkill(skillId, level);
                    const results = await simulateBoosterCombination(async (boosterCounts: BoosterCounts) => {
                        return f(boosterCounts, skill);
                    });
                    return { level, results };
                }),
            );
            const skillName = capitalize(skillMap[skillId].skillType);
            return { skillName, results };
        }),
    );
}

export async function simulateSkillCombinationWithHeadband(
    playerTeam: Team,
    opponentTeam: Team,
): Promise<SkillSimulationResult[]> {
    const ginsengCaracs = loadGinsengCaracs();
    if (ginsengCaracs == null) return [];
    const teamParams = await getTeamParams(playerTeam);
    if (teamParams == null) return [];
    return simulateSkillCombination(async (boosterCounts: BoosterCounts, skill: CalculatedSkill) => {
        const boostedTeam = calcBoostedTeam(playerTeam, teamParams, ginsengCaracs, boosterCounts);
        const skilledTeam = calcSkilledTeam(boostedTeam, skill);
        const mythicBoosterMultiplier = 1 + 0.25 * boosterCounts.mythic; // Headband
        return simulateFromTeams('FastChance', skilledTeam, opponentTeam, mythicBoosterMultiplier);
    });
}

export async function simulateSkillCombinationWithAME(
    playerTeam: Team,
    opponentTeam: Team,
): Promise<SkillSimulationResult[]> {
    const ginsengCaracs = loadGinsengCaracs();
    if (ginsengCaracs == null) return [];
    const teamParams = await getTeamParams(playerTeam);
    if (teamParams == null) return [];
    return simulateSkillCombination(async (boosterCounts: BoosterCounts, skill: CalculatedSkill) => {
        const boostedTeam = calcBoostedTeam(playerTeam, teamParams, ginsengCaracs, boosterCounts);
        const skilledTeam = calcSkilledTeam(boostedTeam, skill);
        const mythicBoosterMultiplier = 1 + 0.15 * boosterCounts.mythic; // AME
        return simulateFromTeams('FastPoints', skilledTeam, opponentTeam, mythicBoosterMultiplier);
    });
}
