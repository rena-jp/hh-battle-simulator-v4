import { savePlayerLeagueTeam } from '../store/team';
import { beforeGameInited } from '../utils/async';
import { checkPage } from '../utils/page';
import { GameWindow, assertGameWindow } from './base/common';
import { LeagueBattleGlobal } from './types/league-battle';

type LeagueBattleWindow = Window & GameWindow & LeagueBattleGlobal;

function assertLeagueBattleWindow(window: Window): asserts window is LeagueBattleWindow {
    assertGameWindow(window);
    const { hero_fighter, opponent_fighter } = window;
    if (hero_fighter == null) throw new Error('hero_fighter is not found.');
    if (opponent_fighter == null) throw new Error('opponent_fighter is not found.');
}

export async function LeagueBattlePage(window: Window) {
    if (!checkPage('/league-battle.html')) return;
    await beforeGameInited();

    assertLeagueBattleWindow(window);

    updatePlayerLeagueTeam(window);
}

function updatePlayerLeagueTeam(window: LeagueBattleWindow) {
    const { hero_fighter } = window;
    savePlayerLeagueTeam(hero_fighter);
}
