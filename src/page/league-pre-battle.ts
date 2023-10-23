import { createBattleTable } from '../dom/battle-table';
import { createBoosterPointsTable } from '../dom/booster-simulation';
import { ChanceView } from '../dom/chance';
import { PointsView } from '../dom/points';
import { createPointsTable } from '../dom/points-table';
import { Popup } from '../dom/popup';
import { simulateFromBattlers } from '../simulator/battle';
import { calcMythicBoosterMultiplierFromFighters, simulateBoosterCombinationWithAME } from '../simulator/booster';
import { calcBattlersFromFighters } from '../simulator/fighter';
import { loadMythicBoosterBonus, saveMythicBoosterBonus } from '../store/booster';
import { saveOpponentTeamData, savePlayerLeagueTeam } from '../store/team';
import { afterGameInited, beforeGameInited } from '../utils/async';
import { checkPage, getOpponentIdFromUrl } from '../utils/page';
import { GameWindow, assertGameWindow } from './base/common';
import { LeaguesPreBattleGlobal } from './types/leagues-pre-battle';

type LeaguesPreBattleWindow = Window & GameWindow & LeaguesPreBattleGlobal;

function asserLeaguetPreBattleWindow(window: Window): asserts window is LeaguesPreBattleWindow {
    assertGameWindow(window);
    const { hero_data, opponent_fighter } = window;
    if (hero_data == null) throw new Error('hero_data is not found.');
    if (opponent_fighter == null) throw new Error('opponent_fighter is not found.');
}

export async function LeaguePreBattlePage(window: Window) {
    if (!checkPage('/leagues-pre-battle.html')) return;
    await beforeGameInited();
    asserLeaguetPreBattleWindow(window);

    updatePlayerLeagueTeam(window);
    updateMythicBooster(window);
    saveOpponentTeam(window);
    addChanceAndPoints(window);
    addBoosterSimulation(window);
}

function updatePlayerLeagueTeam(window: LeaguesPreBattleGlobal) {
    const { hero_data } = window;
    savePlayerLeagueTeam(hero_data.team);
}

function updateMythicBooster(window: LeaguesPreBattleWindow) {
    const { hero_data, opponent_fighter } = window;
    const multiplier = calcMythicBoosterMultiplierFromFighters(hero_data, opponent_fighter.player);

    const mythicBoosterData = loadMythicBoosterBonus();
    mythicBoosterData.leagues = multiplier;
    saveMythicBoosterBonus(mythicBoosterData);
}

async function saveOpponentTeam(window: LeaguesPreBattleWindow) {
    const { opponent_fighter, localStorageSetItem } = window;
    const opponentId = getOpponentIdFromUrl();
    const opponentTeam = opponent_fighter.player.team;

    const update = () => {
        localStorageSetItem('battle_type', 'leagues');
        localStorageSetItem('leagues_id', opponentId);
        saveOpponentTeamData({
            battleType: 'leagues',
            opponentId,
            team: opponentTeam,
        });
    };

    update();

    await afterGameInited();

    const button = document.getElementById('change_team');
    if (button != null) {
        button.addEventListener('click', update, true);
        button.addEventListener('auxclick', update, true);
    }
}

async function addChanceAndPoints(window: LeaguesPreBattleWindow) {
    const { hero_data, opponent_fighter } = window;
    const { player, opponent } = calcBattlersFromFighters(hero_data, opponent_fighter.player);
    const resultPromise = simulateFromBattlers('Standard', player, opponent);
    await afterGameInited();

    const chanceView = new ChanceView();
    chanceView.updateAsync(resultPromise);
    chanceView.setTooltip(createBattleTable(player, opponent));
    $('.opponent .icon-area').before(chanceView.getElement().addClass('sim-left'));

    const pointsView = new PointsView();
    pointsView.updateAsync(resultPromise);
    resultPromise.then(result => {
        pointsView.setTooltip(createPointsTable(result));
    });
    $('.opponent .icon-area').before(pointsView.getElement().addClass('sim-right'));
}

async function addBoosterSimulation(window: LeaguesPreBattleWindow) {
    const { hero_data, opponent_fighter } = window;
    const playerTeam = hero_data.team;
    const opponentTeam = opponent_fighter.player.team;

    await afterGameInited();

    const popup = new Popup('Booster simulator');
    const iconButton = $('<div class="sim-result"><div class="sim-icon-button sim-icon-ame"></div></div>')
        .addClass('sim-right')
        .attr('tooltip', 'Booster simulator');
    let inited = false;
    iconButton.on('click', () => {
        if (!inited) {
            inited = true;
            popup.setContent('Now calculating...');
            queueMicrotask(async () => {
                const results = await simulateBoosterCombinationWithAME(playerTeam, opponentTeam);
                if (results == null || results.length === 0) {
                    popup.setContent(
                        'Error<br>1. Go to the market page<br>2. Go to every team editing page (not team selecting page)<br>3. Try again',
                    );
                } else {
                    popup.setContent(createBoosterPointsTable(results));
                }
            });
        }
        popup.toggle();
    });
    $('.battle_hero .icon-area').before(iconButton);
}
