import { createBattleTable } from '../dom/battle-table';
import { createBoosterPointsTable } from '../dom/booster-simulation';
import { ChanceView } from '../dom/chance';
import { PointsView } from '../dom/points';
import { createPointsTable } from '../dom/points-table';
import { Popup } from '../dom/popup';
import { simulateFromBattlers } from '../simulator/battle';
import { simulateBoosterCombinationWithAME } from '../simulator/booster';
import { calcBattlersFromTeams, calcCounterBonus } from '../simulator/team';
import { getHHPlusPlus, getHHPlusPlusConfig } from './hh-plus-plus';
import { getConfig } from './hh-plus-plus-config';

export async function replaceHHPlusPlusLeague() {
    const HHPlusPlus = await getHHPlusPlus();
    if (HHPlusPlus == null) return;
    await getHHPlusPlusConfig(); // FIXME
    const config = getConfig();
    if (!config.replaceHHLeaguePlusPlus) return;

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
            let { forSim } = result;
            if (forSim == null) {
                const hero_data = window.hero_data as Fighter;
                const opponent_fighter = window.opponent_fighter as OpponentFighter;
                if (hero_data != null && opponent_fighter != null) {
                    const counterBonus = calcCounterBonus(hero_data.team, opponent_fighter.player.team);
                    const percentage = Math.round(
                        (100 * hero_data.damage) / hero_data.team.caracs.damage / counterBonus,
                    );
                    forSim = {
                        playerTeam: hero_data.team,
                        opponentTeam: opponent_fighter.player.team,
                        mythicBoosterMultiplier: percentage / 100,
                    };
                }
            }
            if (forSim != null) {
                const playerTeam: Team = forSim.playerTeam;
                const opponentTeam: Team = forSim.opponentTeam;

                if (forSim.result == null) {
                    const mythicBoosterMultiplier: number = forSim.mythicBoosterMultiplier;
                    const { player, opponent } = calcBattlersFromTeams(
                        playerTeam,
                        opponentTeam,
                        mythicBoosterMultiplier,
                    );
                    forSim.battleTable = createBattleTable(player, opponent);
                    forSim.result = simulateFromBattlers('Standard', player, opponent);
                }
                const resultPromise = forSim.result;

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
                        popup.setContent('Now calculating...');
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
