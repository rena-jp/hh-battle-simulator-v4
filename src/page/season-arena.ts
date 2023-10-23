import { createBattleTable } from '../dom/battle-table';
import { ChanceView } from '../dom/chance';
import { createMojoElement$ } from '../dom/mojo';
import { simulateFromBattlers } from '../simulator/battle';
import { calcBattlerFromFighters } from '../simulator/fighter';
import { calcCounterBonus } from '../simulator/team';
import { loadMythicBoosterBonus, saveMythicBoosterBonus } from '../store/booster';
import { afterGameInited, beforeGameInited } from '../utils/async';
import { checkPage } from '../utils/page';
import { GameWindow, assertGameWindow } from './base/common';
import { SeasonArenaGlobal } from './types/season-arena';

type SeasonArenaWindow = Window & GameWindow & SeasonArenaGlobal;

function assertSeasonArenaWindow(window: Window): asserts window is SeasonArenaWindow {
    assertGameWindow(window);
    const { hero_data, caracs_per_opponent, opponents } = window;
    if (hero_data == null) throw new Error('hero_data is not found.');
    if (caracs_per_opponent == null) throw new Error('caracs_per_opponent is not found.');
    if (opponents == null) throw new Error('opponents is not found.');
}

export async function SeasonArenaPage(window: Window) {
    if (!checkPage('/season-arena.html')) return;
    await beforeGameInited();

    assertSeasonArenaWindow(window);
    const { hero_data, caracs_per_opponent, opponents } = window;

    updateMythicBooster();
    addSimulation();

    async function addSimulation() {
        opponents.forEach(async opponent_fighter => {
            const opponentFighter = opponent_fighter.player;
            const opponentId = opponentFighter.id_fighter;
            const playerFighter = { ...hero_data, ...caracs_per_opponent[opponentId] };
            const player = calcBattlerFromFighters(playerFighter, opponentFighter);
            const opponent = calcBattlerFromFighters(opponentFighter, playerFighter);
            const resultPromise = simulateFromBattlers('Chance', player, opponent);
            const mojo = +opponent_fighter.rewards.rewards.find(e => e.type === 'victory_points')!.value;

            await afterGameInited();

            const chanceView = new ChanceView();
            chanceView.updateAsync(resultPromise);
            chanceView.setTooltip(createBattleTable(player, opponent));

            const mojoView = createMojoElement$(resultPromise, mojo).addClass('sim-right');

            $(`[data-opponent="${opponentId}"] .icon-area`)
                .before(chanceView.getElement().addClass('sim-left'))
                .before(mojoView);
        });
    }

    function updateMythicBooster() {
        const opponent = opponents[0].player;
        const playerCaracs = caracs_per_opponent[opponent.id_fighter];
        const counterBonus = calcCounterBonus(hero_data.team, opponent.team);
        const percentage = Math.round((100 * playerCaracs.damage) / hero_data.team.caracs.damage / counterBonus);

        const mythicBoosterData = loadMythicBoosterBonus();
        mythicBoosterData.seasons = percentage / 100;
        saveMythicBoosterBonus(mythicBoosterData);
    }
}
