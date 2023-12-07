import { getConfig } from '../interop/hh-plus-plus-config';
import { Booster, getBoosterData } from '../data/booster';
import { simulateFromTeams } from '../simulator/battle';
import { loadBoosterData, loadMythicBoosterBonus, saveBoosterData, saveMythicBoosterBonus } from '../store/booster';
import { loadPlayerLeagueTeam, saveOpponentTeamData, savePlayerLeagueTeam } from '../store/team';
import { afterGameInited, beforeGameInited } from '../utils/async';
import { getPointsColor } from '../utils/color';
import { checkPage } from '../utils/page';
import { toLeaguePointsPerFight, truncateSoftly } from '../utils/string';
import { GameWindow, assertGameWindow } from './base/common';
import { TowerOfFameGlobal } from './types/tower-of-fame';
import { getHHPlusPlus } from '../interop/hh-plus-plus';
import { getLeaguesPlusPlusOpponentTeam } from '../interop/hh-plus-plus-league';
import { BoosterSimulatorPopup } from '../dom/booster-simulator-popup';
import { fetchLeaguesPreBattlePage } from './leagues-pre-battle';
import { calcMythicBoosterMultiplierFromFighters } from '../simulator/booster';
import { fetchPlayerLeaguesTeamFromTeams } from './teams';

interface Opponent {
    can_fight: number;
    player: {
        id_fighter: string;
        team: any;
    };
    boosters: Booster[];
    match_history: Record<string, (number | null)[]>;
    power?: number;
    sim?:
        | {
              win: number;
              loss: number;
              avgTurns: number;
              points: Record<number, number>;
              scoreClass: 'plus' | 'minus' | 'close';
          }
        | any;
}

type Player = TowerOfFameGlobal['opponents_list'][number] &
    Omit<Opponent, 'match_history'> & {
        match_history: Record<string, false>;
    };

type TowerOfFameWindow = GameWindow & {
    opponents_list: (Opponent | Player)[];
} & TowerOfFameGlobal;

export function assertTowerOfFameWindow(window: Window): asserts window is TowerOfFameWindow {
    assertGameWindow(window);
    const { opponents_list } = window;
    if (opponents_list == null) throw new Error('opponents_list is not found.');
}

export async function TowerOfFamePage(window: Window) {
    if (!checkPage('/tower-of-fame.html')) return;
    await beforeGameInited();

    assertTowerOfFameWindow(window);
    const { opponents_list, Hero } = window;

    updateBoosters(window);
    changePowerSortToSimSort(window);
    updateOpponentTeam();

    async function changePowerSortToSimSort(window: TowerOfFameWindow) {
        const config = getConfig();
        if (!config.doSimulateLeagueTable) return;

        const playerId = Hero.infos.id;

        const player = opponents_list.find((e): e is Player => +e.player.id_fighter === playerId);
        if (player == null) return;

        const playerLeagueData = await fetchPlayerLeagueData(window);
        const mythicBoosterMultiplier = playerLeagueData.leagueMultiplier;
        const playerTeam = playerLeagueData.team;
        if (mythicBoosterMultiplier == null || playerTeam == null) return;

        const opponents = opponents_list.filter(
            (opponent): opponent is Opponent => +opponent.player.id_fighter !== playerId,
        );
        const unfoughtOpponents = opponents.filter(
            opponent => Object.values(opponent.match_history)[0].filter(e => e != null).length < 3,
        );

        const resultPromises = (config.doSimulateFoughtOpponents ? opponents : unfoughtOpponents).map(opponent =>
            simulateFromTeams('Points', playerTeam, opponent.player.team, mythicBoosterMultiplier).then(
                result => [opponent.player.id_fighter, result] as [string, PointsResult],
            ),
        );

        const results = await Promise.all(resultPromises);
        const resultMap = Object.fromEntries(results);

        const replacePowerDataWithSimResult = () => {
            opponents_list.forEach(opponent => {
                opponent.power = resultMap[opponent.player.id_fighter]?.avgPoints ?? 0;
            });
            if (config.replaceHHLeaguesPlusPlus) {
                opponents_list.forEach(opponent => {
                    opponent.sim = {
                        ...opponent.sim,
                        forSim: {
                            ...opponent.sim?.forSim,
                            playerTeam,
                            opponentTeam: opponent.player.team,
                            mythicBoosterMultiplier,
                        },
                    };
                });
            }
        };
        replacePowerDataWithSimResult();

        const expectedPoints = opponents_list.reduce((p, c) => {
            const matchHistory = Object.values(c.match_history)[0];
            if (!Array.isArray(matchHistory)) return p;
            const matchResults = matchHistory.filter(<T>(e: T | null): e is T => e != null);
            const knownPoints = matchResults.reduce((p, c) => p + parseInt(c.match_points), 0);
            const remainingChallenges = 3 - matchResults.length;
            return p + knownPoints + c.power! * remainingChallenges;
        }, 0);
        const numOpponents = opponents_list.length - 1;
        const expectedAverage = expectedPoints / numOpponents / 3;

        const sumPoints = results.reduce((p, c) => p + c[1].avgPoints, 0) * 3;
        const averagePoints = sumPoints / results.length / 3;

        await afterGameInited();

        const $challengesHeader = $('.league_table .head-column[column="match_history_sorting"] > span');
        $challengesHeader.attr(
            'tooltip',
            `Score expected: <em>${truncateSoftly(expectedPoints, 1)}</em><br>Average: <em>${toLeaguePointsPerFight(
                expectedAverage,
            )}</em>`,
        );

        const $powerHeader = $('.league_table .head-column[column="power"] > span');
        $powerHeader.html($powerHeader.html().replace('Power', 'Sim'));
        $powerHeader.attr(
            'tooltip',
            `Sum: <em>${truncateSoftly(sumPoints, 1)}</em><br>Average: <em>${toLeaguePointsPerFight(
                averagePoints,
            )}</em>`,
        );

        const leagueOpponents = opponents.map(e => {
            return {
                id: e.player.id_fighter,
                team: e.player.team,
                numChallenges: 3 - Object.values(e.match_history)[0].filter(e => e != null).length,
                isBoosted: e.boosters.filter(e => +e.lifetime > window.server_now_ts).length > 0,
            };
        });

        const currentScore = +player.player_league_points;
        const foughtCounts = leagueOpponents.reduce((p, c) => p + (3 - c.numChallenges), 0);
        const popup = new BoosterSimulatorPopup(playerTeam, leagueOpponents, currentScore, foughtCounts);
        const replacePowerViewWithSimResult = () => {
            const powerColumnMap: Record<string, HTMLElement[]> = {};
            document.querySelectorAll('.data-row.body-row').forEach(row => {
                const id = row.querySelector('[id-member]')?.getAttribute('id-member');
                const column = row.querySelector<HTMLElement>('.data-column[column=power]');
                if (id == null || column == null) return;
                powerColumnMap[id] ??= [];
                powerColumnMap[id].push(column);
            });
            opponents_list.forEach(opponent => {
                let $columnContent = $('<div></div>').addClass('sim-column');
                const opponentId = opponent.player.id_fighter;
                const result = resultMap[opponentId];
                if (result != null) {
                    let mark = '';
                    if (result.minPoints >= 25) mark = '<div class="vCheck_mix_icn sim-mark"></div>';
                    $columnContent
                        .html(`${mark}${truncateSoftly(result.avgPoints, 2)}`)
                        .css('color', getPointsColor(result.avgPoints));
                } else {
                    if (
                        +opponentId === playerId &&
                        config.addBoosterSimulator &&
                        config.addBoosterSimulatorToLeagueTable
                    ) {
                        const iconButton = $('<div class="sim-icon-button sim-icon-ame"></div>').attr(
                            'tooltip',
                            'Booster simulator',
                        );
                        iconButton.on('click', () => {
                            popup.toggle();
                        });
                        $columnContent.append(iconButton);
                    } else {
                        $columnContent.text('-');
                    }
                }
                $(powerColumnMap[opponentId]).empty().append($columnContent);
            });
        };
        replacePowerViewWithSimResult();

        function replaceHHLaguesPlusPlus() {
            getHHPlusPlus().then(HHPlusPlus => {
                if (HHPlusPlus == null) return;
                const opponent_fighter = window.opponent_fighter as Opponent | undefined;
                if (opponent_fighter?.sim != null) {
                    new HHPlusPlus.League().display(opponent_fighter.sim);
                }
            });
        }
        if (config.replaceHHLeaguesPlusPlus) replaceHHLaguesPlusPlus();

        const header = $powerHeader[0];
        if (header != null) {
            const observer = new MutationObserver(() => {
                replacePowerDataWithSimResult();
                replacePowerViewWithSimResult();
                if (config.replaceHHLeaguesPlusPlus) replaceHHLaguesPlusPlus();
            });
            observer.observe(header, { childList: true, subtree: true });
        }

        const table = document.querySelector('.league_table .data-list');
        if (table != null) {
            const observer = new MutationObserver(() => {
                replacePowerDataWithSimResult();
                replacePowerViewWithSimResult();
            });
            observer.observe(table, { childList: true });
        }
    }
}

function updateBoosters(window: TowerOfFameWindow) {
    const { Hero, opponents_list, server_now_ts } = window;

    const playerId = Hero.infos.id;
    const player = opponents_list.find(e => +e.player.id_fighter === playerId);
    if (player == null) return;

    const activeBoosters = player.boosters.filter(e => +e.lifetime > server_now_ts || +e.usages_remaining > 0);

    const oldBoosterData = loadBoosterData();
    const newBoosterData = getBoosterData(activeBoosters);
    newBoosterData.mythic = {
        ...oldBoosterData.mythic,
        // leagues: 1, // BUGFIX
        ...newBoosterData.mythic,
    };
    saveBoosterData(newBoosterData);
}

async function updateOpponentTeam() {
    await afterGameInited();

    const button = document.getElementById('change_team');
    if (button != null) {
        const update = () => {
            const config = getConfig();
            if (config.replaceHHLeaguesPlusPlus) {
                const opponentTeam = getLeaguesPlusPlusOpponentTeam();
                if (opponentTeam != null) {
                    saveOpponentTeamData({
                        battleType: 'leagues',
                        opponentId: '',
                        team: opponentTeam,
                    });
                    return;
                }
            }
            saveOpponentTeamData(null);
        };
        button.addEventListener('click', update, true);
        button.addEventListener('auxclick', update, true);
    }
}

let battleData: Promise<{ player: Fighter; opponent: Fighter } | null> | null = null;
async function fetchBattleData(window: TowerOfFameWindow) {
    battleData ??= (async () => {
        try {
            const { opponents_list } = window;
            const id = opponents_list.filter(e => {
                const history = Object.values(e.match_history)[0];
                return Array.isArray(history) && history.some(e => e === null);
            })[0]?.player.id_fighter;
            if (id != null) {
                const { hero_data, opponent_fighter } = await fetchLeaguesPreBattlePage(id);
                const leaguesTeam = hero_data.team;
                if (leaguesTeam != null) {
                    savePlayerLeagueTeam(leaguesTeam);
                    return { player: hero_data, opponent: opponent_fighter.player };
                }
            }
        } catch (e) {
            console.error(e);
        }
        return null;
    })();
    return battleData;
}

let playerLeagueData: Promise<{ team: Team | null; leagueMultiplier: number | null }> | null = null;
export async function fetchPlayerLeagueData(window: TowerOfFameWindow) {
    playerLeagueData ??= (async () => {
        let team = undefined;
        let leagueMultiplier = undefined;

        const { referrer } = document;

        // Avoid a bug
        // if (['teams.html', 'leagues-pre-battle.html', 'league-battle.html'].some(e => referrer.includes(e))) {
        if (['leagues-pre-battle.html', 'league-battle.html'].some(e => referrer.includes(e))) {
            team = loadPlayerLeagueTeam();
            leagueMultiplier = loadMythicBoosterBonus().leagues ?? null;
            if (team != null && leagueMultiplier != null) {
                return { team, leagueMultiplier };
            }
        }
        try {
            const battleData = await fetchBattleData(window);
            if (battleData != null) {
                const { player, opponent } = battleData;
                const { team } = player;
                savePlayerLeagueTeam(team);
                const leagueMultiplier = calcMythicBoosterMultiplierFromFighters(player, opponent);
                const oldMythicBoosters = loadMythicBoosterBonus();
                const newMythicBoosters = {
                    ...oldMythicBoosters,
                    leagues: leagueMultiplier,
                };
                saveMythicBoosterBonus(newMythicBoosters);
                return { team, leagueMultiplier };
            } else {
                team = (await fetchPlayerLeaguesTeamFromTeams()) ?? team;
                if (team != null) savePlayerLeagueTeam(team);
            }
        } catch (e) {
            console.error(e);
        }
        {
            if (team === undefined) team = loadPlayerLeagueTeam();
            if (leagueMultiplier === undefined) leagueMultiplier = loadMythicBoosterBonus().leagues ?? null;
            return { team, leagueMultiplier };
        }
    })();
    return playerLeagueData;
}
