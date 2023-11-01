import { FighterCaracs } from '../data/fighter';
import { PointsView } from '../dom/points';
import { simulateFromBattlers } from '../simulator/battle';
import {
    FighterCaracsCalculator,
    addFighterCaracs,
    getFighterCaracsFromHero,
    getFighterCaracsFromTeamPower,
    multiplyFighterCaracs,
    toFighterCaracs,
} from '../data/fighter';
import { loadClassBonus } from '../store/hero';
import { TeamParams, saveTeamParams } from '../store/team';
import { afterGameInited, beforeGameInited } from '../utils/async';
import { checkPage } from '../utils/page';
import { GameWindow, assertGameWindow, loadMythicBoosterMultiplier, loadOpponentTeam } from './base/common';
import { loadBoosterBonus } from '../store/booster';
import { ChanceView } from '../dom/chance';
import { createBattleTable } from '../dom/battle-table';
import { createPointsTable } from '../dom/points-table';
import { EditTeamGlobal } from './types/edit-team';
import { calcBattlerFromTeams } from '../simulator/team';
import { HeroType } from '../data/hero';

type EditTeamWindow = GameWindow &
    EditTeamGlobal & {
        theme_resonance_bonuses: any;
    };

type TeamForSimulation = {
    caracs: EditTeamGlobal['hero_data']['team']['caracs'];
    total_power: EditTeamGlobal['hero_data']['team']['total_power'];
    girls: EditTeamGlobal['availableGirls'];
    id_team: EditTeamGlobal['hero_data']['team']['id_team'];
};

function assertEditTeamWindow(window: Window): asserts window is EditTeamWindow {
    assertGameWindow(window);
    const { hero_data, teamGirls, theme_resonance_bonuses, availableGirls } = window;
    if (hero_data == null) throw new Error('hero_data is not found.');
    if (teamGirls == null) throw new Error('teamGirls is not found.');
    if (theme_resonance_bonuses == null) throw new Error('theme_resonance_bonuses is not found.');
    if (availableGirls == null) throw new Error('availableGirls is not found.');
}

export async function EditTeamPage(window: Window) {
    if (!checkPage('/edit-team.html')) return;
    await beforeGameInited();

    assertEditTeamWindow(window);

    const { availableGirls } = window;
    const girlMap = Object.fromEntries(availableGirls.map((e: any) => [e.id_girl, e]));

    const { get_lang, get_dec_and_sep } = window;
    const separator = get_dec_and_sep(get_lang()).sep;
    const parseNumber = (str: string) => parseFloat(str.trim().replaceAll(separator, ''));

    const getTeamPower = () => parseNumber($('.team-total-power').text());

    const getCaracs = (): FighterCaracs => {
        const getStat = (name: string) => parseNumber($(`#stats-${name}`).text());
        return {
            damage: getStat('damage'),
            defense: getStat('defense'),
            ego: getStat('ego'),
            chance: getStat('chance'),
        };
    };

    const getGirls = () => {
        const girls = Array<any>(7);
        document.querySelectorAll<HTMLElement>('.team-hexagon [data-girl-id]').forEach(e => {
            const index = e.dataset.teamMemberPosition;
            const girlId = e.dataset.girlId;
            if (index != null && girlId != null) {
                girls[+index] = girlMap[girlId];
            }
        });
        return girls.filter(e => e != null);
    };

    const getTeam = () => ({
        caracs: getCaracs(),
        total_power: getTeamPower(),
        girls: getGirls(),
        id_team: window.hero_data.team.id_team,
    });

    addSimulation(window);
    saveTeamSimulationParams(window);

    async function addSimulation(window: EditTeamWindow) {
        const { hero_data, teamGirls, theme_resonance_bonuses, availableGirls, localStorageGetItem } = window;

        const opponentTeam = loadOpponentTeam(window);
        if (opponentTeam == null) return;
        const opponentTeam2 = opponentTeam;

        const initialTeam = hero_data.team;
        if (initialTeam == null) return;

        const girlsMap = new Map(Object.values(availableGirls).map((e: any) => [e.id_girl, e]));

        const battleType = localStorageGetItem('battle_type');
        const mythicBoosterMultiplier = loadMythicBoosterMultiplier(battleType);
        if (mythicBoosterMultiplier == null) return;

        const elements = Object.fromEntries(initialTeam.synergies.map((e: any) => [e.element.type, e.element]));
        let currentTeam: Team = { ...initialTeam };
        let hasAssumptions = false;

        await afterGameInited();

        const $iconArea = $('.player_team_block.battle_hero .icon-area');

        const chanceView = new ChanceView();
        $iconArea.before(chanceView.getElement().addClass('sim-left'));

        const pointsView = battleType === 'leagues' ? new PointsView() : null;
        if (pointsView != null) {
            $iconArea.before(pointsView.getElement().addClass('sim-right'));
        }

        update();

        const statsContainer = document.querySelector('.player_stats');
        if (statsContainer != null) {
            const observer = new MutationObserver(updateStats);
            observer.observe(statsContainer, {
                subtree: true,
                childList: true,
            });
        }

        const teamHexagon = document.querySelector('.team-hexagon');
        if (teamHexagon != null) {
            const observer = new MutationObserver(updateTeam);
            observer.observe(teamHexagon, {
                subtree: true,
                attributes: true,
                attributeFilter: ['src'],
            });
        }

        function updateTeam() {
            const oldTeamGirls = currentTeam.girls;
            const oldTeamCenterGirlId = +oldTeamGirls[0]?.id_girl;
            const oldTeamIdSet = new Set(oldTeamGirls.map(e => +e.id_girl));
            const newTeamGirlIds = getTeam().girls.map(e => +e.id_girl);
            const newTeamCenterGirlId = newTeamGirlIds[0];
            if (newTeamGirlIds.length == oldTeamGirls.length) {
                if (newTeamGirlIds.every(e => oldTeamIdSet.has(e))) {
                    if (newTeamCenterGirlId === oldTeamCenterGirlId) {
                        // skip sim
                        return;
                    } else {
                        // update sim
                        currentTeam.girls = newTeamGirlIds.map(e => oldTeamGirls.find(girl => +girl.id_girl === +e)!);
                        update();
                        return;
                    }
                }
            }
            // reset sim
            chanceView.reset();
            pointsView?.reset();
        }

        function updateStats() {
            const caracs = getCaracs();

            const teamMembers = Array.from(
                document.querySelectorAll<HTMLElement>('.team-member-container[data-girl-id]'),
            )
                .sort((x, y) => Number(x.dataset.teamMemberPosition) - Number(y.dataset.teamMemberPosition))
                .map(e => girlsMap.get(e.dataset.girlId));

            hasAssumptions = false;
            currentTeam.girls = teamMembers.map(e => {
                const id = e.id_girl;
                const girlData = teamGirls.find((girl: any) => girl.id_girl == id);
                if (girlData != null) return { ...e, skills: girlData.skills };

                const skills: any = {};
                const tier4 = e.skill_tiers_info[4]?.skill_points_used ?? 0;
                if (tier4) {
                    hasAssumptions = true;
                    skills[9] = { skill: { percentage_value: 0.2 * tier4 } };
                    skills[10] = { skill: { percentage_value: 0 } };
                }
                const tier5 = e.skill_tiers_info[5]?.skill_points_used ?? 0;
                if (tier5 > 0) {
                    const element = e.element;
                    if (['darkness', 'sun'].includes(element)) skills[11] = { skill: { percentage_value: 7 * tier5 } }; // stun
                    if (['stone', 'light'].includes(element)) skills[12] = { skill: { percentage_value: 8 * tier5 } }; // shield
                    if (['nature', 'psychic'].includes(element))
                        skills[13] = { skill: { percentage_value: 20 * tier5 } }; // reflect
                    if (['fire', 'water'].includes(element)) skills[14] = { skill: { percentage_value: 6 * tier5 } }; // execute
                }
                return { ...e, skills };
            });

            const elementCounts = Object.fromEntries(Object.keys(elements).map(e => [e, 0]));
            teamMembers.forEach(e => {
                elementCounts[e.element]++;
            });

            currentTeam.synergies = initialTeam.synergies.map(e => ({
                ...e,
                element: { type: e.element.type },
                bonus_multiplier: e.harem_bonus_multiplier + e.team_bonus_per_girl * elementCounts[e.element.type],
            }));

            const theme = Object.entries(elementCounts)
                .filter(([_, count]) => count >= 3)
                .map(([type, _]) => type);
            currentTeam.theme_elements = theme.map(e => elements[e]);
            currentTeam.theme = theme.join(',');

            if (theme.length > 0) {
                const balancedBonus = theme_resonance_bonuses[''];
                if (balancedBonus) {
                    const { defense, chance } = balancedBonus;
                    if (defense) caracs.defense /= Math.pow(1.02, defense / 2);
                    if (chance) caracs.chance /= Math.pow(1.04, chance / 4);
                }
                theme.forEach(element => {
                    const bonus = theme_resonance_bonuses[element];
                    if (bonus) {
                        const { defense, chance } = bonus;
                        if (defense) caracs.defense *= Math.pow(1.02, defense / 2);
                        if (chance) caracs.chance *= Math.pow(1.04, chance / 4);
                    }
                });
            }

            currentTeam.caracs = caracs;
            update();
        }

        function update() {
            const _hasAssumptions = hasAssumptions;
            const player = calcBattlerFromTeams(currentTeam, opponentTeam2, mythicBoosterMultiplier ?? 1);
            const opponent = calcBattlerFromTeams(opponentTeam2, currentTeam);
            const resultPromise = simulateFromBattlers('Standard', player, opponent).then(result => {
                return {
                    ...result,
                    hasAssumptions: _hasAssumptions,
                };
            });

            chanceView.updateAsync(resultPromise);
            chanceView.setTooltip(createBattleTable(player, opponent));

            if (pointsView != null) {
                pointsView.updateAsync(resultPromise);
                resultPromise.then(result => {
                    pointsView.setTooltip(createPointsTable(result));
                });
            }
        }
    }

    async function saveTeamSimulationParams(window: EditTeamWindow) {
        const { Hero, hero_data } = window;

        const initialTeam = hero_data.team;
        const mergedInitialTeam = { ...initialTeam, girls: initialTeam.girls.map(e => girlMap[e.id_girl]) };
        updateTeamParams(mergedInitialTeam, Hero);

        await afterGameInited();

        const validateButton = document.getElementById('validate-team');
        if (validateButton != null) {
            validateButton.parentNode?.addEventListener(
                'click',
                () => {
                    updateTeamParams(getTeam(), Hero);
                },
                true,
            );
        }
    }
}

type EditTeamPageData = Pick<EditTeamGlobal, 'teamGirls' | 'theme_resonance_bonuses' | 'hero_data' | 'availableGirls'>;
let fetchedWindow: Promise<EditTeamPageData> | null = null;
async function fetchEditTeamPage(id_team: string) {
    fetchedWindow ??= (async () => {
        const page = await fetch(`edit-team.html?id_team=${id_team}`);
        const html = await page.text();
        const teamGirls = JSON.parse(html.match(/var\s+teamGirls\s*=\s*(\[.*?\]);/)?.[1]!);
        const theme_resonance_bonuses = JSON.parse(
            html.match(/var\s+theme_resonance_bonuses\s*=\s*((?:\{|\[).*?(?:\}|\]));/)?.[1]!,
        );
        const hero_data = eval('(' + html.match(/var\s+hero_data\s*=\s*(\{.*?\});/s)?.[1]! + ')');
        const availableGirls = JSON.parse(html.match(/var\s+availableGirls\s*=\s*(\[.*?\]);/)?.[1]!);
        return {
            teamGirls,
            theme_resonance_bonuses,
            hero_data,
            availableGirls,
        };
    })();
    return fetchedWindow;
}

let teamParams: TeamParams | undefined;
export async function fetchTeamParams(teamId: string, hero: HeroType) {
    if (teamParams != null) return teamParams;
    const editTeamPage = await fetchEditTeamPage(teamId);
    const girlMap = Object.fromEntries(editTeamPage.availableGirls.map(e => [e.id_girl, e]));
    const team = {
        ...editTeamPage.hero_data.team,
        girls: editTeamPage.hero_data.team.girls.map(e => girlMap[e.id_girl]),
    };
    teamParams = updateTeamParams(team, hero);
    return teamParams;
}

function updateTeamParams(team: TeamForSimulation, hero: HeroType) {
    const classBonus = loadClassBonus();
    if (classBonus == null) return;

    const boosterBonus = loadBoosterBonus();
    if (boosterBonus == null) return;

    const heroCaracs = multiplyFighterCaracs(getFighterCaracsFromHero(hero), classBonus);

    const girlArmorCaracs = team.girls
        .flatMap(girl => girl.armor.map(armor => toFighterCaracs(armor.caracs)))
        .reduce((p, c) => addFighterCaracs(p, c), toFighterCaracs({}));
    const teamCaracs = new FighterCaracsCalculator()
        .add(getFighterCaracsFromTeamPower(team.total_power))
        .multiply(classBonus)
        .add(girlArmorCaracs)
        .result();
    const combinedBonus = new FighterCaracsCalculator()
        .add(team.caracs as FighterCaracs)
        .divide(boosterBonus.multiplier)
        .subtract(boosterBonus.addend)
        .divide(addFighterCaracs(teamCaracs, heroCaracs))
        .result();
    const multiplier = multiplyFighterCaracs(classBonus, combinedBonus);
    const addend = multiplyFighterCaracs(teamCaracs, combinedBonus);
    const teamId = +team.id_team;
    const teamParams = { teamId, multiplier, addend, caracs: team.caracs };
    saveTeamParams(teamParams);
    return teamParams;
}
