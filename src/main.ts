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
import { removeUnusedData } from './store/unused';
import { avoidOverlappingMatchRating } from './interop/match-rating';
import { registerConfig } from './interop/hh-plus-plus-config';
import { replaceHHPlusPlusLeague } from './interop/hh-plus-plus-league';

export async function main() {
    registerConfig();
    replaceHHPlusPlusLeague();

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

    avoidOverlappingMatchRating();
    removeUnusedData();
}
