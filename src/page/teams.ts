import { createBattleTable } from '../dom/battle-table';
import { ChanceView } from '../dom/chance';
import { PointsView } from '../dom/points';
import { createPointsTable } from '../dom/points-table';
import { simulateFromBattlers } from '../simulator/battle';
import { calcBattlerFromTeams } from '../simulator/team';
import { loadPlayerLeagueTeam, savePlayerLeagueTeam } from '../store/team';
import { afterGameInited, beforeGameInited } from '../utils/async';
import { checkPage } from '../utils/page';
import { GameWindow, assertGameWindow, loadMythicBoosterMultiplier, loadOpponentTeam } from './base/common';
import { TeamsGlobal } from './types/teams';

type TeamsWindow = GameWindow & TeamsGlobal;

function assertTeamsWindow(window: Window): asserts window is TeamsWindow {
    assertGameWindow(window);
    const { teams_data } = window;
    if (teams_data == null) throw new Error('teams_data is not found.');
}

export async function TeamsPage(window: Window) {
    if (!checkPage('/teams.html')) return;
    await beforeGameInited();

    assertTeamsWindow(window);

    addSimulation(window);
    updateLeagueTeam(window);
}

async function addSimulation(window: TeamsWindow) {
    const { teams_data, localStorageGetItem } = window;

    const opponentTeam = loadOpponentTeam(window);
    if (opponentTeam == null) return;

    const battleType = localStorageGetItem('battle_type');
    const mythicBoosterMultiplier = loadMythicBoosterMultiplier(battleType);
    if (mythicBoosterMultiplier == null) return;

    const teamMap = Object.fromEntries(
        Object.values(teams_data)
            .filter((e: any) => e.id_team != null && !e.locked)
            .map((playerTeam: any) => {
                const player = calcBattlerFromTeams(playerTeam, opponentTeam, mythicBoosterMultiplier);
                const opponent = calcBattlerFromTeams(opponentTeam, playerTeam);
                const resultPromise = simulateFromBattlers('Standard', player, opponent);
                return [playerTeam.id_team, { resultPromise, player, opponent }] as [
                    string,
                    { resultPromise: Promise<FullResult>; player: Battler; opponent: Battler },
                ];
            }),
    );

    await afterGameInited();

    update();

    const observer = new MutationObserver(update);

    const teamSelector = document.querySelector('.teams-grid-container');
    if (teamSelector != null) {
        observer.observe(teamSelector, {
            subtree: true,
            attributes: true,
            attributeFilter: ['class'],
        });
    }

    function update() {
        const id = $('.selected-team').data('idTeam');
        const team = teamMap[id];
        if (team == null) return;
        const { resultPromise, player, opponent } = team;
        const $iconArea = $('.team-right-part-container .icon-area');

        const chanceView = new ChanceView();
        chanceView.updateAsync(resultPromise);
        chanceView.setTooltip(createBattleTable(player, opponent));
        $iconArea.before(chanceView.getElement().addClass('sim-left'));

        if (battleType === 'leagues') {
            const pointsView = new PointsView();
            pointsView.updateAsync(resultPromise);
            resultPromise.then(result => {
                pointsView.setTooltip(createPointsTable(result));
            });
            $iconArea.before(pointsView.getElement().addClass('sim-right'));
        }
    }
}

function updateLeagueTeam(window: TeamsWindow) {
    const { teams_data, localStorageGetItem } = window;

    const leaguesTeam = Object.values(teams_data).find(team => team.selected_for_battle_type.includes('leagues'));
    if (leaguesTeam != null && leaguesTeam.id_team != null && leaguesTeam.theme != null) {
        const team = leaguesTeam as typeof leaguesTeam & { id_team: string; theme: string };
        savePlayerLeagueTeam(team);
    }

    const selectButton = document.getElementById('btn-select-team');
    selectButton?.addEventListener(
        'click',
        () => {
            if (localStorageGetItem('battle_type') === 'leagues') {
                const selectedTeamElement = document.querySelector('.selected-team');
                const selectedIndex = (selectedTeamElement as HTMLElement).dataset.teamIndex!;
                const selectedTeam = teams_data[selectedIndex];
                if (selectedTeam != null && selectedTeam.id_team != null && selectedTeam.theme != null) {
                    const team = selectedTeam as typeof selectedTeam & { id_team: string; theme: string };
                    savePlayerLeagueTeam(team);
                }
            }
        },
        true,
    );
}

type TeamsPageData = Pick<TeamsGlobal, 'teams_data'>;
let fetchedWindow: Promise<TeamsPageData> | null = null;
async function fetchTeamsPage() {
    if (fetchedWindow == null) {
        fetchedWindow = (async () => {
            const teamsPage = await fetch('teams.html');
            const teamsHtml = await teamsPage.text();
            const teams_data = JSON.parse(teamsHtml.match(/var\s+teams_data\s*=\s*(\{.*?\});/)?.[1]!);
            return { teams_data };
        })();
    }
    return fetchedWindow;
}

let playerLeagueTeam: Promise<Team | null> | null = null;
export async function fetchPlayerLeaguesTeam() {
    playerLeagueTeam = (async () => {
        const { referrer } = document;
        if (['teams.html', 'leagues-pre-battle.html', 'league-battle.html'].every(e => !referrer.includes(e))) {
            try {
                const teamsPageData = await fetchTeamsPage();
                const teams_data = teamsPageData.teams_data;
                const leaguesTeam = Object.values(teams_data).find((team): team is typeof team & Team =>
                    team.selected_for_battle_type?.includes('leagues'),
                );
                if (leaguesTeam != null) {
                    savePlayerLeagueTeam(leaguesTeam);
                    return leaguesTeam;
                }
            } catch (e) {}
        }
        return loadPlayerLeagueTeam();
    })();
    return playerLeagueTeam;
}
