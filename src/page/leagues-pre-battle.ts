import { createBattleTable } from '../dom/battle-table';
import { createBoosterPointsTable, createSkillPointsTable } from '../dom/booster-simulation';
import { ChanceView } from '../dom/chance';
import { PointsView } from '../dom/points';
import { createPointsTable } from '../dom/points-table';
import { Popup } from '../dom/popup';
import { getConfig } from '../interop/hh-plus-plus-config';
import { simulateFromBattlers } from '../simulator/battle';
import {
    calcMythicBoosterMultiplierFromFighters,
    simulatePointsForBoosterCombinationWithAME,
    simulatePointsForSkillCombinationWithAME,
} from '../simulator/booster';
import { calcBattlersFromFighters } from '../simulator/fighter';
import { loadMythicBoosterBonus, saveMythicBoosterBonus } from '../store/booster';
import { saveOpponentTeamData, savePlayerLeagueTeam } from '../store/team';
import { afterGameInited, beforeGameInited } from '../utils/async';
import { checkPage, getOpponentIdFromUrl, getSessionUrl } from '../utils/page';
import { GameWindow, assertGameWindow } from './base/common';
import { LeaguesPreBattleGlobal } from './types/leagues-pre-battle';

type LeaguesPreBattleWindow = Window & GameWindow & LeaguesPreBattleGlobal;

function asserLeaguesPreBattleWindow(window: Window): asserts window is LeaguesPreBattleWindow {
    assertGameWindow(window);
    const { hero_data, opponent_fighter } = window;
    if (hero_data == null) throw new Error('hero_data is not found.');
    if (opponent_fighter == null) throw new Error('opponent_fighter is not found.');
}

export async function LeaguesPreBattlePage(window: Window) {
    if (!checkPage('/leagues-pre-battle.html')) return;
    await beforeGameInited();
    asserLeaguesPreBattleWindow(window);

    const config = getConfig();
    updatePlayerLeagueTeam(window);
    updateMythicBooster(window);
    saveOpponentTeam(window);
    if (config.doSimulateLeague) {
        addChanceAndPoints(window);
        if (config.addBoosterSimulator) addBoosterSimulator(window);
        if (config.addSkillSimulator) addSkillSimulator(window);
    }
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
    const { calculateLeaguePointsTable } = getConfig();
    const simType = calculateLeaguePointsTable ? 'Full' : 'Standard';
    const resultPromise = simulateFromBattlers(simType, player, opponent);
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

async function addBoosterSimulator(window: LeaguesPreBattleWindow) {
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
            popup.setContent('Now loading...');
            queueMicrotask(async () => {
                try {
                    const results = await simulatePointsForBoosterCombinationWithAME(playerTeam, opponentTeam);
                    popup.setContent(createBoosterPointsTable(results));
                } catch (e) {
                    const message = e instanceof Error ? e.message : e;
                    popup.setContent(`Error: ${message}<br>1. Go to the market page<br>2. Try again`);
                }
            });
        }
        popup.toggle();
    });
    $('.battle_hero .icon-area').before(iconButton);
}

async function addSkillSimulator(window: LeaguesPreBattleWindow) {
    const { hero_data, opponent_fighter } = window;
    const playerTeam = hero_data.team;
    const opponentTeam = opponent_fighter.player.team;

    await afterGameInited();

    const popup = new Popup('Skill simulator');
    const iconButton = $('<div class="sim-result"><div class="sim-icon-button sim-icon-girl-skills"></div></div>')
        .addClass('sim-left')
        .attr('tooltip', 'Skill simulator');
    let inited = false;
    iconButton.on('click', () => {
        if (!inited) {
            inited = true;
            popup.setContent('Now loading...');
            queueMicrotask(async () => {
                try {
                    const results = await simulatePointsForSkillCombinationWithAME(playerTeam, opponentTeam);
                    popup.setContent(createSkillPointsTable(results));
                } catch (e) {
                    const message = e instanceof Error ? e.message : e;
                    popup.setContent(`Error: ${message}<br>1. Go to the market page<br>2. Try again`);
                }
            });
        }
        popup.toggle();
    });
    $('.battle_hero .icon-area').before(iconButton);
}

type LeaguesPreBattlePageData = Pick<LeaguesPreBattleGlobal, 'hero_data' | 'opponent_fighter'>;
let fetchedWindow: Promise<LeaguesPreBattlePageData> | null = null;
export async function fetchLeaguesPreBattlePage(opponentId: string) {
    fetchedWindow ??= (async () => {
        const url = getSessionUrl(`leagues-pre-battle.html?id_opponent=${opponentId}`);
        const preBattlePage = await fetch(url);
        const html = await preBattlePage.text();
        const hero_data = JSON.parse(html.match(/var\s+hero_data\s*=\s*(\{.*?\});/s)![1]);
        const opponent_fighter = Function('return ' + html.match(/var\s+opponent_fighter\s*=\s*(\{.*?\});/s)![1])();
        return { hero_data, opponent_fighter };
    })();
    return fetchedWindow;
}
