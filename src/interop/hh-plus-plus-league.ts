import { createBattleTable } from '../dom/battle-table';
import { createBoosterPointsTable } from '../dom/booster-simulation';
import { ChanceView } from '../dom/chance';
import { PointsView } from '../dom/points';
import { createPointsTable } from '../dom/points-table';
import { Popup } from '../dom/popup';
import { fetchPlayerLeaguesTeam } from '../page/teams';
import { simulateFromBattlers } from '../simulator/battle';
import { simulateBoosterCombinationWithAME } from '../simulator/booster';
import { calcBattlersFromTeams } from '../simulator/team';
import { loadBoosterData } from '../store/booster';
import { checkPage } from '../utils/page';
import { getHHPlusPlus, getHHPlusPlusConfig } from './hh-plus-plus';
import { getConfig } from './hh-plus-plus-config';

export async function replaceHHPlusPlusLeague() {
    if (!checkPage('/tower-of-fame.html')) return;
    const HHPlusPlus = await getHHPlusPlus();
    if (HHPlusPlus == null) return;
    await getHHPlusPlusConfig(); // FIXME
    const config = getConfig();
    if (!config.replaceHHLeaguesPlusPlus) return;

    let inited = config.doSimulateLeagueTable;
    let playerLeagueTeam: Team | null;
    let leagueBoosterMultiplier: number | undefined;
    let lastDisplay: any;
    const originalLeague = HHPlusPlus.League;
    HHPlusPlus.League = class League {
        original: any;
        constructor(...args: any[]) {
            this.original = new originalLeague(...args);
        }
        extract() {
            return this.original.extract();
        }
        display(result: any) {
            lastDisplay = result;
            let { forSim } = result;
            if (forSim == null) {
                if (!inited) {
                    inited = true;
                    (async () => {
                        playerLeagueTeam = await fetchPlayerLeaguesTeam();
                        leagueBoosterMultiplier = loadBoosterData().mythic?.leagues;
                        const forSim = lastDisplay?.forSim;
                        if (forSim != null && forSim.hasAssumptions === true) {
                            forSim.playerTeam = playerLeagueTeam;
                            forSim.mythicBoosterMultiplier = leagueBoosterMultiplier;
                            this.display(lastDisplay);
                        }
                    })();
                }
                const hero_data = window.hero_data as Fighter;
                const opponent_fighter = window.opponent_fighter as OpponentFighter;
                if (hero_data != null && opponent_fighter != null) {
                    const playerTeam = playerLeagueTeam ?? hero_data.team;
                    const opponentTeam = opponent_fighter.player.team;
                    const mythicBoosterMultiplier = leagueBoosterMultiplier ?? 1;
                    const hasAssumptions = playerTeam.id_team == null;
                    forSim = { playerTeam, opponentTeam, mythicBoosterMultiplier, hasAssumptions };
                    result.forSim = forSim;
                }
            }
            if (forSim != null) {
                let playerTeam: Team = forSim.playerTeam;
                const opponentTeam: Team = forSim.opponentTeam;

                if (forSim.result == null || (forSim.hasAssumptions && playerTeam.id_team != null)) {
                    playerTeam = playerLeagueTeam ?? playerTeam;
                    const mythicBoosterMultiplier: number = leagueBoosterMultiplier ?? forSim.mythicBoosterMultiplier;
                    const { player, opponent } = calcBattlersFromTeams(
                        playerTeam,
                        opponentTeam,
                        mythicBoosterMultiplier,
                    );
                    forSim.battleTable = createBattleTable(player, opponent);
                    const hasAssumptions = playerTeam.id_team == null;
                    forSim.hasAssumptions = hasAssumptions;
                    forSim.result = simulateFromBattlers('Standard', player, opponent).then(result => ({
                        ...result,
                        hasAssumptions,
                    }));
                }
                const resultPromise = forSim.result;

                $('.opponent .icon-area').parent().find('.sim-result').remove();

                const chanceView = new ChanceView();
                chanceView.updateAsync(resultPromise);
                chanceView.setTooltip(forSim.battleTable);
                $('.opponent .icon-area').before(chanceView.getElement().addClass('sim-left'));

                const pointsView = new PointsView();
                pointsView.updateAsync(resultPromise);
                resultPromise.then((result: any) => {
                    pointsView.setTooltip(createPointsTable(result));
                });
                $('.opponent .icon-area').before(pointsView.getElement().addClass('sim-right'));

                const popup = new Popup('Booster simulator');
                const iconButton = $('<div class="sim-result"><div class="sim-icon-button sim-icon-ame"></div></div>')
                    .addClass('sim-left')
                    .addClass('sim-top')
                    .attr('tooltip', 'Booster simulator');
                iconButton.on('click', () => {
                    if (result.boosterTable == null) {
                        popup.setContent('Now loading...');
                        queueMicrotask(async () => {
                            const results = await simulateBoosterCombinationWithAME(playerTeam, opponentTeam);
                            if (results == null || results.length === 0) {
                                popup.setContent(
                                    'Error<br>1. Go to the market page<br>2. Go to every team editing page (not team selecting page)<br>3. Try again',
                                );
                            } else {
                                result.boosterTable = createBoosterPointsTable(results);
                                popup.setContent(result.boosterTable);
                            }
                        });
                    } else {
                        popup.setContent(result.boosterTable);
                    }
                    popup.toggle();
                });
                if (playerTeam.id_team != null) $('.opponent .icon-area').before(iconButton);
                return;
            }
            return this.original.display(result);
        }
    };
}
