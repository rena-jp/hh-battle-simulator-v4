import { createBattleTable } from '../dom/battle-table';
import { ChanceView } from '../dom/chance';
import { MojoView } from '../dom/mojo';
import { getConfig } from '../interop/hh-plus-plus-config';
import { simulateFromBattlers } from '../simulator/battle';
import { calcBattlerFromFighters } from '../simulator/fighter';
import { calcCounterBonus } from '../simulator/team';
import { loadMythicBoosterBonus, saveMythicBoosterBonus } from '../store/booster';
import { saveOpponentTeamData } from '../store/team';
import { afterGameInited, beforeGameInited } from '../utils/async';
import { checkPage } from '../utils/page';
import { GameWindow, assertGameWindow } from './base/common';
import { SeasonArenaGlobal } from './types/season-arena';

type SeasonArenaWindow = GameWindow & SeasonArenaGlobal;

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
    saveOpponentTeam(window);
    const config = getConfig();
    if (config.doSimulateSeason) addSimulation();

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

            const mojoView = new MojoView(mojo);
            mojoView.updateAsync(resultPromise);

            $(`[data-opponent="${opponentId}"] .icon-area`)
                .before(chanceView.getElement().addClass('sim-left'))
                .before(mojoView.getElement().addClass('sim-right'));
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

async function saveOpponentTeam(window: SeasonArenaWindow) {
    const { opponents, localStorageSetItem } = window;

    const update = () => {
        localStorageSetItem('battle_type', 'seasons');
        const opponentId = $('.selected_opponent').attr('data-opponent');
        if (opponentId == null) return;
        const opponent = opponents.find(e => e.player.id_fighter === opponentId);
        if (opponent == null) return;
        const opponentTeam = opponent.player.team;
        const mojo = opponent.rewards.rewards.find(e => e.type === 'victory_points')?.value;
        saveOpponentTeamData({
            battleType: 'seasons',
            opponentId,
            team: opponentTeam,
            mojo: +(mojo ?? 0),
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
