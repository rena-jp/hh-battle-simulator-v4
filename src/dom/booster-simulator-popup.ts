import { SelectorView } from '../data/selector';
import { LeagueOpponent, LeagueTableResult, LeagueTableResultCache, simulateLeagueTable } from '../simulator/booster';
import {
    LeagueTableBoosterResult,
    createLeagueTableAllTable,
    createLeagueTableBestTable,
    createLeagueTableUnfoughtBestTable,
    createLeagueTableUnfoughtTable,
} from './booster-simulation';
import { Popup } from './popup';

export class BoosterSimulatorPopup extends Popup {
    private fights: SelectorView;
    private booster: SelectorView;
    private output: SelectorView;
    private playerTeam: Team;
    private opponents: LeagueOpponent[];
    private currentScore: number;
    private foughtCounts: number;
    private cache = new Map<string, LeagueTableResultCache>();
    constructor(playerTeam: Team, opponents: LeagueOpponent[], currentScore: number, foughtCounts: number) {
        const header = $('<div class="sim-selectors form-wrapper"></div>');
        const fights = new SelectorView('sim-selector-fights', 'Fights', [
            { label: 'All', value: 'all' },
            { label: 'Unfought', value: 'unfought', selected: true },
        ]);
        const booster = new SelectorView('sim-selector-booster', 'Booster', [
            { label: 'All', value: 'all', selected: true },
            { label: 'Boosted', value: 'boosted' },
            { label: 'Unboosted', value: 'unboosted' },
        ]);
        const output = new SelectorView('sim-selector-output', 'Output', [
            { label: 'All', value: 'all', selected: true },
            { label: 'Best', value: 'best' },
        ]);
        const update = () => {
            this.update();
        };
        fights.onChange(update);
        booster.onChange(update);
        output.onChange(update);
        super(header.append(fights.getElement(), booster.getElement(), output.getElement()));
        this.fights = fights;
        this.booster = booster;
        this.output = output;
        this.playerTeam = playerTeam;
        this.opponents = opponents;
        this.currentScore = currentScore;
        this.foughtCounts = foughtCounts;
    }
    update() {
        this.setContent('Now loading...');
        queueMicrotask(async () => {
            const fights = this.fights.getValue();
            const booster = this.booster.getValue();
            const output = this.output.getValue();
            const unfoughtOnly = fights === 'unfought';
            try {
                let opponents = this.opponents;
                if (unfoughtOnly) opponents = opponents.filter(e => e.numChallenges > 0);
                if (booster === 'boosted') opponents = opponents.filter(e => e.isBoosted);
                if (booster === 'unboosted') opponents = opponents.filter(e => !e.isBoosted);
                const results = await simulateLeagueTable(this.playerTeam, opponents, this.cache);
                const push = <K, V>(map: Map<K, V[]>, key: K, value: V) => {
                    let list = map.get(key);
                    if (list == null) {
                        list = [];
                        map.set(key, list);
                    }
                    list.push(value);
                };
                if (output === 'all') {
                    const map = new Map<string, LeagueTableResult[]>();
                    results.forEach(e => {
                        push(map, e.boosterKey, e);
                    });
                    const allResults = [...map.values()].map(value => {
                        const boosterCounts = value[0].boosterCounts;
                        const sum = unfoughtOnly
                            ? value.reduce((p, c) => p + c.result * c.challenges, 0)
                            : value.reduce((p, c) => p + c.result, 0) * 3;
                        const challenges = unfoughtOnly
                            ? value.reduce((p, c) => p + c.challenges, 0)
                            : value.length * 3;
                        const average = sum / challenges;
                        const result = sum;
                        return { boosterCounts, sum, challenges, average, result };
                    });
                    if (fights === 'unfought' && booster === 'all') {
                        this.setContent(
                            createLeagueTableUnfoughtTable(allResults, this.currentScore, this.foughtCounts),
                        );
                    } else {
                        this.setContent(createLeagueTableAllTable(allResults));
                    }
                }
                if (output === 'best') {
                    const opponentMap = new Map<string, LeagueTableResult[]>();
                    results.forEach(e => {
                        push(opponentMap, e.opponentId, e);
                    });
                    const [noAME, all] = [
                        [...opponentMap.values()].map(e => e.filter(e => e.boosterCounts.mythic == 0)),
                        [...opponentMap.values()],
                    ].map(list => {
                        const bestMap = new Map<string, LeagueTableResult[]>();
                        list.forEach(e => {
                            const max = e.reduce((p, c) => Math.max(p, c.result), 0);
                            e.filter(e => e.result >= max).forEach(e => {
                                push(bestMap, e.boosterKey, e);
                            });
                        });
                        const opponentSet = new Set<string>();
                        const bestList = [];
                        let duplicateBestList = [...bestMap.values()];
                        while (true) {
                            if (duplicateBestList.length === 0) break;
                            const best = duplicateBestList.sort((x, y) => x.length - y.length).pop()!;
                            if (best.length === 0) break;
                            bestList.push(best);
                            best.forEach(e => {
                                opponentSet.add(e.opponentId);
                            });
                            duplicateBestList = duplicateBestList.map(e =>
                                e.filter(e => !opponentSet.has(e.opponentId)),
                            );
                        }

                        const results = bestList.map(value => {
                            const boosterCounts = value[0].boosterCounts;
                            const sum = unfoughtOnly
                                ? value.reduce((p, c) => p + c.result * c.challenges, 0)
                                : value.reduce((p, c) => p + c.result, 0) * 3;
                            const challenges = unfoughtOnly
                                ? value.reduce((p, c) => p + c.challenges, 0)
                                : value.length * 3;
                            const average = sum / challenges;
                            const result = challenges;
                            return { boosterCounts, sum, challenges, average, result };
                        });
                        return results;
                    });
                    if (fights === 'unfought' && booster === 'all') {
                        this.setContent(
                            createLeagueTableUnfoughtBestTable(noAME, all, this.currentScore, this.foughtCounts),
                        );
                    } else {
                        this.setContent(createLeagueTableBestTable(noAME, all));
                    }
                }
            } catch (e) {
                const message = e instanceof Error ? e.message : e;
                this.setContent(`Error: ${message}<br>1. Go to the market page<br>2. Try again`);
            }
        });
    }
    show(): void {
        this.update();
        super.show();
    }
}
