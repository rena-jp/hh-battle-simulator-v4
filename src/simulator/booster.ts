import { Booster, getBoosterData } from '../data/booster';
import {
    FighterCaracs,
    FighterCaracsCalculator,
    addFighterCaracs,
    equalsFighterCaracs,
    toFighterCaracs,
    toFighterCaracsBonus,
} from '../data/fighter';
import {
    ClubUpgradesKeys,
    HeroCaracs,
    HeroCaracsKeys,
    HeroType,
    addHeroCaracs,
    multiplyHeroCaracs,
    toHeroCaracs,
    truncateHeroCaracs,
} from '../data/hero';
import { getConfig } from '../interop/hh-plus-plus-config';
import { getHero } from '../migration';
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

    const clubBonus = getClubBonus(hero);
    const levelCaracs = getLevelBasedCaracs(hero);
    const marketCaracs = getMarketBoughtCaracs(hero);
    const baseCaracs = addHeroCaracs(levelCaracs, marketCaracs);
    const sumCaracs = addHeroCaracs(baseCaracs, armorCaracs);

    const xClubBonus = addHeroCaracs(clubBonus, 1);
    const bonusedBaseCaracs = multiplyHeroCaracs(baseCaracs, xClubBonus);
    const bonusedArmorCaracs = multiplyHeroCaracs(armorCaracs, xClubBonus);

    return [...Array(5)].map((_, ginseng) => {
        const ginsengBonus = toHeroCaracs(Array(3).fill(0.06 * ginseng));
        const caracsFromGinseng = multiplyHeroCaracs(sumCaracs, multiplyHeroCaracs(xClubBonus, ginsengBonus));

        let endurance = armorCaracs.endurance;
        endurance += getPrimary(bonusedBaseCaracs) * 4;
        endurance *= xClubBonus.endurance;
        endurance += getPrimary(bonusedArmorCaracs) * 4;
        endurance *= xClubBonus.endurance;
        endurance += getPrimary(caracsFromGinseng) * 4;
        endurance += haremEndurance * xClubBonus.endurance * (1 + clubBonus.endurance * xClubBonus.endurance);

        let harmony = armorCaracs.chance;
        harmony += getSecondarySum(bonusedBaseCaracs) / 2;
        harmony *= xClubBonus.chance;
        harmony += getSecondarySum(bonusedArmorCaracs) / 2;
        harmony *= xClubBonus.chance;
        harmony += getSecondarySum(caracsFromGinseng) / 2;

        const totalCaracs = multiplyHeroCaracs(sumCaracs, addHeroCaracs(xClubBonus, ginsengBonus));
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
    const Hero = getHero(window);
    if (Hero == null) return;
    return await fetchTeamParams(+teamId, Hero, window.server_now_ts as number);
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

interface BoosterCombination {
    key: string;
    counts: BoosterCounts;
}

let boosterCombinations: BoosterCombination[] | null = null;
function getBoosterCombinations(): BoosterCombination[] {
    if (boosterCombinations == null) {
        const { simulateGinseng, simulateJujubes, simulateChlorella, simulateCordyceps } = getConfig();
        boosterCombinations = [...Array(2)].flatMap((_, mythic) =>
            [...Array(simulateCordyceps ? 5 : 1)].flatMap((_, cordyceps) =>
                [...Array(simulateChlorella ? 5 - cordyceps : 1)].flatMap((_, chlorella) =>
                    [...Array(simulateJujubes ? 5 - cordyceps - chlorella : 1)].flatMap((_, jujubes) => {
                        const ginseng = 4 - cordyceps - chlorella - jujubes;
                        if (!simulateGinseng && ginseng > 0) return [];
                        const counts = { ginseng, jujubes, chlorella, cordyceps, mythic };
                        const key = `${ginseng}${jujubes}${chlorella}${cordyceps}${mythic}`;
                        return { key, counts };
                    }),
                ),
            ),
        );
    }
    return boosterCombinations;
}

export interface BoosterSimulationResult {
    boosterCounts: BoosterCounts;
    result: number;
}

async function simulateBoosterCombination(
    f: (boosterCounts: BoosterCounts) => Promise<number>,
): Promise<BoosterSimulationResult[]> {
    const boosterCombinations = getBoosterCombinations();
    return Promise.all(
        boosterCombinations.map(async ({ counts }) => {
            const result = await f(counts);
            return { boosterCounts: counts, result };
        }),
    );
}

export async function simulateChanceForBoosterCombinationWithHeadband(
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

export async function simulateChanceForBoosterCombinationWithAME(
    playerTeam: Team,
    opponentTeam: Team,
): Promise<BoosterSimulationResult[]> {
    const ginsengCaracs = loadGinsengCaracs();
    if (ginsengCaracs == null) throw new Error('Market data not found');
    const teamParams = await getTeamParams(playerTeam);
    if (teamParams == null) throw new Error('Team data not found');
    return simulateBoosterCombination(async (boosterCounts: BoosterCounts) => {
        const calculatedTeam = calcBoostedTeam(playerTeam, teamParams, ginsengCaracs, boosterCounts);
        const mythicBoosterMultiplier = 1 + 0.15 * boosterCounts.mythic; // AME
        return simulateFromTeams('FastChance', calculatedTeam, opponentTeam, mythicBoosterMultiplier);
    });
}

export async function simulatePointsForBoosterCombinationWithAME(playerTeam: Team, opponentTeam: Team) {
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

export interface LeagueOpponent {
    id: string;
    team: Team;
    numChallenges: number;
    isBoosted: boolean;
    boosters: Booster[];
}

export interface LeagueTableResultCache {
    boosterKey: string;
    boosterCounts: BoosterCounts;
    opponentId: string;
    challenges: number;
    result: Promise<FastPointsResult>;
}

export interface LeagueTableResult {
    boosterKey: string;
    boosterCounts: BoosterCounts;
    opponentId: string;
    challenges: number;
    result: FastPointsResult;
}

export async function simulateLeagueTable(
    playerTeam: Team,
    opponents: LeagueOpponent[],
    cache: Map<string, LeagueTableResultCache>,
    usePrediction: boolean,
): Promise<LeagueTableResult[]> {
    const ginsengCaracs = loadGinsengCaracs();
    if (ginsengCaracs == null) throw new Error('Market data not found');
    const teamParams = await getTeamParams(playerTeam);
    if (teamParams == null) throw new Error('Team data not found');
    const boosterCombinations = getBoosterCombinations();
    return await Promise.all(
        boosterCombinations.flatMap(booster => {
            const calculatedTeam = calcBoostedTeam(playerTeam, teamParams, ginsengCaracs, booster.counts);
            const mythicBoosterMultiplier = 1 + 0.15 * booster.counts.mythic; // AME
            return opponents.map(async e => {
                const key = [e.id, booster.key, usePrediction ? 'prediction' : 'original'].join('-');
                let value = cache.get(key);
                if (value == null) {
                    const predictedCaracs = { ...e.team.caracs };
                    if (usePrediction) {
                        const bonus = getBoosterData(e.boosters)
                            .normals.map(e => e.multiplier)
                            .filter((e): e is FighterCaracs => e != null)
                            .reduce((p, c) => addFighterCaracs(p, c), toFighterCaracs({}));
                        predictedCaracs.damage /= 1 + bonus.damage / 100;
                        predictedCaracs.ego /= 1 + bonus.ego / 100;
                        predictedCaracs.chance /= 1 + bonus.chance / 100;
                    }
                    const predictedTeam = {
                        ...e.team,
                        caracs: predictedCaracs,
                    };
                    value = {
                        boosterKey: booster.key,
                        boosterCounts: booster.counts,
                        opponentId: e.id,
                        challenges: e.numChallenges,
                        result: simulateFromTeams('FastPoints', calculatedTeam, predictedTeam, mythicBoosterMultiplier),
                    };
                    cache.set(key, value);
                }
                const result = await value.result;
                return { ...value, result };
            });
        }),
    );
}

export interface SkillSimulationResult {
    skillName: string;
    results: {
        level: number;
        results: BoosterSimulationResult[];
    }[];
}

async function simulateSkillCombination(
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
    const skillLevelsToBeSimulated = getConfig().skillLevelsToBeSimulated;
    if (skillLevelsToBeSimulated.length === 0) return [];
    return Promise.all(
        [11, 12, 13, 14].map(async skillId => {
            const results = await Promise.all(
                skillLevelsToBeSimulated.map(async level => {
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

export async function simulateChanceForSkillCombinationWithHeadband(
    playerTeam: Team,
    opponentTeam: Team,
): Promise<SkillSimulationResult[]> {
    const ginsengCaracs = loadGinsengCaracs();
    if (ginsengCaracs == null) throw new Error('Market data not found');
    const teamParams = await getTeamParams(playerTeam);
    if (teamParams == null) throw new Error('Team data not found');
    return simulateSkillCombination(async (boosterCounts: BoosterCounts, skill: CalculatedSkill) => {
        const boostedTeam = calcBoostedTeam(playerTeam, teamParams, ginsengCaracs, boosterCounts);
        const skilledTeam = calcSkilledTeam(boostedTeam, skill);
        const mythicBoosterMultiplier = 1 + 0.25 * boosterCounts.mythic; // Headband
        return simulateFromTeams('FastChance', skilledTeam, opponentTeam, mythicBoosterMultiplier);
    });
}

export async function simulateChanceForSkillCombinationWithAME(
    playerTeam: Team,
    opponentTeam: Team,
): Promise<SkillSimulationResult[]> {
    const ginsengCaracs = loadGinsengCaracs();
    if (ginsengCaracs == null) throw new Error('Market data not found');
    const teamParams = await getTeamParams(playerTeam);
    if (teamParams == null) throw new Error('Team data not found');
    return simulateSkillCombination(async (boosterCounts: BoosterCounts, skill: CalculatedSkill) => {
        const boostedTeam = calcBoostedTeam(playerTeam, teamParams, ginsengCaracs, boosterCounts);
        const skilledTeam = calcSkilledTeam(boostedTeam, skill);
        const mythicBoosterMultiplier = 1 + 0.15 * boosterCounts.mythic; // AME
        return simulateFromTeams('FastChance', skilledTeam, opponentTeam, mythicBoosterMultiplier);
    });
}

export async function simulatePointsForSkillCombinationWithAME(
    playerTeam: Team,
    opponentTeam: Team,
): Promise<SkillSimulationResult[]> {
    const ginsengCaracs = loadGinsengCaracs();
    if (ginsengCaracs == null) throw new Error('Market data not found');
    const teamParams = await getTeamParams(playerTeam);
    if (teamParams == null) throw new Error('Team data not found');
    return simulateSkillCombination(async (boosterCounts: BoosterCounts, skill: CalculatedSkill) => {
        const boostedTeam = calcBoostedTeam(playerTeam, teamParams, ginsengCaracs, boosterCounts);
        const skilledTeam = calcSkilledTeam(boostedTeam, skill);
        const mythicBoosterMultiplier = 1 + 0.15 * boosterCounts.mythic; // AME
        return simulateFromTeams('FastPoints', skilledTeam, opponentTeam, mythicBoosterMultiplier);
    });
}
