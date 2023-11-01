import { createBattleTable } from '../dom/battle-table';
import { ChanceView } from '../dom/chance';
import { createBoosterChanceTable, createSkillChanceTable } from '../dom/booster-simulation';
import { simulateFromBattlers } from '../simulator/battle';
import {
    calcMythicBoosterMultiplierFromFighters,
    simulateBoosterCombinationWithHeadband,
    simulateSkillCombinationWithHeadband,
} from '../simulator/booster';
import { calcBattlersFromFighters } from '../simulator/fighter';
import { loadMythicBoosterBonus, saveMythicBoosterBonus } from '../store/booster';
import { saveOpponentTeamData } from '../store/team';
import { afterGameInited, beforeGameInited } from '../utils/async';
import { checkPage, getOpponentIdFromUrl } from '../utils/page';
import { GameWindow, assertGameWindow } from './base/common';
import { PantheonPreBattleGlobal } from './types/pantheon-pre-battle';
import { Popup } from '../dom/popup';
import { getConfig } from '../interop/hh-plus-plus-config';

type PantheonPreBattleWindow = Window & GameWindow & PantheonPreBattleGlobal;

function assertPantheonPreBattleWindow(window: Window): asserts window is PantheonPreBattleWindow {
    assertGameWindow(window);
    const { hero_data, opponent_fighter } = window;
    if (hero_data == null) throw new Error('hero_data is not found.');
    if (opponent_fighter == null) throw new Error('opponent_fighter is not found.');
}

export async function PantheonPreBattlePage(window: Window) {
    if (!checkPage('/pantheon-pre-battle.html')) return;
    await beforeGameInited();
    assertPantheonPreBattleWindow(window);

    const config = getConfig();
    updateMythicBooster(window);
    saveOpponentTeam(window);
    addChance(window);
    if (config.addBoosterSimulator) addBoosterSimulator(window);
    if (config.addSkillSimulator) addSkillSimulator(window);
}

function updateMythicBooster(window: PantheonPreBattleWindow) {
    const { hero_data, opponent_fighter } = window;
    const multiplier = calcMythicBoosterMultiplierFromFighters(hero_data, opponent_fighter.player);

    const mythicBoosterData = loadMythicBoosterBonus();
    mythicBoosterData.pantheon = multiplier;
    saveMythicBoosterBonus(mythicBoosterData);
}

async function saveOpponentTeam(window: PantheonPreBattleWindow) {
    const { opponent_fighter, localStorageSetItem } = window;
    const opponentId = getOpponentIdFromUrl();
    const opponentTeam = opponent_fighter.player.team;

    const update = () => {
        localStorageSetItem('battle_type', 'pantheon');
        localStorageSetItem('pantheon_id', opponentId);
        saveOpponentTeamData({
            battleType: 'pantheon',
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

async function addChance(window: PantheonPreBattleWindow) {
    const { hero_data, opponent_fighter } = window;
    const { player, opponent } = calcBattlersFromFighters(hero_data, opponent_fighter.player);
    const resultPromise = simulateFromBattlers('Chance', player, opponent);
    await afterGameInited();

    const chanceView = new ChanceView();
    chanceView.updateAsync(resultPromise);
    chanceView.setTooltip(createBattleTable(player, opponent));
    $('.opponent .icon-area').before(chanceView.getElement().addClass('sim-left'));
}

async function addBoosterSimulator(window: PantheonPreBattleWindow) {
    const { hero_data, opponent_fighter } = window;
    const playerTeam = hero_data.team;
    const opponentTeam = opponent_fighter.player.team;

    await afterGameInited();

    const popup = new Popup('Booster simulator');
    const iconButton = $('<div class="sim-result"><div class="sim-icon-button sim-icon-headband"></div></div>')
        .addClass('sim-right')
        .attr('tooltip', 'Booster simulator');
    let inited = false;
    iconButton.on('click', () => {
        if (!inited) {
            inited = true;
            popup.setContent('Now loading...');
            queueMicrotask(async () => {
                try {
                    const results = await simulateBoosterCombinationWithHeadband(playerTeam, opponentTeam);
                    popup.setContent(createBoosterChanceTable(results));
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

async function addSkillSimulator(window: PantheonPreBattleWindow) {
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
                    const results = await simulateSkillCombinationWithHeadband(playerTeam, opponentTeam);
                    popup.setContent(createSkillChanceTable(results));
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
