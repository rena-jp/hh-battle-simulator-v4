import './global';
import { TrollPreBattlePage } from './page/troll-pre-battle';
import { EditTeamPage } from './page/edit-team';
import { LeagueBattlePage } from './page/league-battle';
import { LeaguePreBattlePage } from './page/league-pre-battle';
import { PantheonPreBattlePage } from './page/pantheon-pre-battle';
import { SeasonArenaPage } from './page/season-arena';
import { ShopPage } from './page/shop';
import { TeamsPage } from './page/teams';
import { TowerOfFamePage } from './page/tower-of-fame';
import { afterGameInited } from './utils/async';
import { removeUnusedData } from './store/unused';

export async function main() {
    [
        EditTeamPage,
        LeagueBattlePage,
        LeaguePreBattlePage,
        PantheonPreBattlePage,
        SeasonArenaPage,
        ShopPage,
        TeamsPage,
        TowerOfFamePage,
        TrollPreBattlePage,
    ].forEach(pageRun => {
        queueMicrotask(() => {
            pageRun(window);
        });
    });

    avoidOverlap();
    removeUnusedData();
}

async function avoidOverlap() {
    await afterGameInited();

    const update = () => {
        if ($('.matchRating').length > 0) {
            $('.sim-result').addClass('sim-top');
        }
    };

    update();

    const observer = new MutationObserver(update);
    document.querySelectorAll('.player_team_block.opponent, .season_arena_opponent_container').forEach(e => {
        observer.observe(e, { childList: true, subtree: true });
    });
}
