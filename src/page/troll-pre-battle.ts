import { createBattleTable } from '../dom/battle-table';
import { ChanceView } from '../dom/chance';
import { simulateFromBattlers } from '../simulator/battle';
import { calcMythicBoosterMultiplierFromFighters } from '../simulator/booster';
import { calcBattlersFromFighters } from '../simulator/fighter';
import { loadMythicBoosterBonus, saveMythicBoosterBonus } from '../store/booster';
import { saveOpponentTeamData } from '../store/team';
import { afterGameInited, beforeGameInited } from '../utils/async';
import { checkPage, getOpponentIdFromUrl } from '../utils/page';
import { GameWindow, assertGameWindow } from './base/common';
import { TrollPreBattleGlobal } from './types/troll-pre-battle';

type TrollPreBattleWindow = Window & GameWindow & TrollPreBattleGlobal;

function assertTrollPreBattleWindow(window: Window): asserts window is TrollPreBattleWindow {
    assertGameWindow(window);
    const { hero_data, opponent_fighter } = window;
    if (hero_data == null) throw new Error('hero_data is not found.');
    if (opponent_fighter == null) throw new Error('opponent_fighter is not found.');
}

export async function TrollPreBattlePage(window: Window) {
    if (!checkPage('/troll-pre-battle.html')) return;
    await beforeGameInited();
    assertTrollPreBattleWindow(window);

    updateMythicBooster(window);
    saveOpponentTeam(window);
    addChance(window);
}

function updateMythicBooster(window: TrollPreBattleWindow) {
    const { hero_data, opponent_fighter } = window;
    const multiplier = calcMythicBoosterMultiplierFromFighters(hero_data, opponent_fighter.player);

    const mythicBoosterData = loadMythicBoosterBonus();
    mythicBoosterData.trolls = multiplier;
    saveMythicBoosterBonus(mythicBoosterData);
}

async function saveOpponentTeam(window: TrollPreBattleWindow) {
    const { opponent_fighter, localStorageSetItem } = window;
    const opponentId = getOpponentIdFromUrl();
    const opponentTeam = opponent_fighter.player.team;

    const update = () => {
        localStorageSetItem('battle_type', 'trolls');
        localStorageSetItem('troll_id', opponentId);
        saveOpponentTeamData({
            battleType: 'trolls',
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

async function addChance(window: TrollPreBattleWindow) {
    const { hero_data, opponent_fighter } = window;
    const { player, opponent } = calcBattlersFromFighters(hero_data, opponent_fighter.player);
    const resultPromise = simulateFromBattlers('Chance', player, opponent);
    await afterGameInited();

    const chanceView = new ChanceView();
    chanceView.updateAsync(resultPromise);
    chanceView.setTooltip(createBattleTable(player, opponent));
    $('.opponent .icon-area').before(chanceView.getElement().addClass('sim-left'));
}
