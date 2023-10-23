import { BoosterCounts, BoosterSimulationResult } from '../simulator/booster';
import { getChanceColor, getPointsColor } from '../utils/color';
import { toLeaguePointsPerFight, toPercentage } from '../utils/string';
import { column, columns, row } from '../utils/table';

function sortBoosterSimulationResults(results: BoosterSimulationResult[]) {
    results.sort((x, y) => {
        const compareHelper = (x: number, y: number): number | null => (x == y ? null : x - y);
        const compare = (f: (e: BoosterSimulationResult) => number): number | null => compareHelper(f(y), f(x));
        return (
            compare(e => e.result) ??
            compare(e => e.boosterCounts.mythic) ??
            compare(e => e.boosterCounts.cordyceps) ??
            compare(e => e.boosterCounts.chlorella) ??
            compare(e => e.boosterCounts.ginseng) ??
            0
        );
    });
}

function getBoosterIcon(rarity: string, booster: string) {
    return `<div class="sim-booster-slot slot ${rarity}"><div class="sim-booster-icon sim-icon-${booster}"></div></div>`;
}
const BoosterKeys = ['ginseng', 'chlorella', 'cordyceps', 'mythic'] as const;
const BoosterIconMap = {
    ginseng: getBoosterIcon('legendary', 'ginseng'),
    chlorella: getBoosterIcon('legendary', 'chlorella'),
    cordyceps: getBoosterIcon('legendary', 'cordyceps'),
    headband: getBoosterIcon('mythic', 'headband'),
    ame: getBoosterIcon('mythic', 'ame'),
} as const;

function getBoosterIcons(boosterCounts: BoosterCounts, mythic: 'headband' | 'ame') {
    return BoosterKeys.map(key => BoosterIconMap[key === 'mythic' ? mythic : key].repeat(boosterCounts[key])).join('');
}

export function createBoosterChanceTable(results: BoosterSimulationResult[]) {
    sortBoosterSimulationResults(results);
    const withoutHB = results.filter(e => e.boosterCounts.mythic <= 0);
    const withHB = results.filter(e => e.boosterCounts.mythic > 0);
    return createTable();

    function createTable() {
        const test = withoutHB.map((e, i) =>
            row(
                columns(1, [
                    getBoosterIcons(e.boosterCounts, 'headband'),
                    `<span class="sim-chance" style="color: ${getChanceColor(e.result)}">${toPercentage(
                        e.result,
                    )}</span>`,
                    getBoosterIcons(withHB[i].boosterCounts, 'headband'),
                    `<span class="sim-chance" style="color: ${getChanceColor(withHB[i].result)}">${toPercentage(
                        withHB[i].result,
                    )}</span>`,
                ]),
            ),
        );
        return $('<table class="sim-booster-table"></table>').append(test.join('')).prop('outerHTML');
    }
}

export function createBoosterPointsTable(results: BoosterSimulationResult[]) {
    sortBoosterSimulationResults(results);
    const withoutAME = results.filter(e => e.boosterCounts.mythic <= 0);
    const withAME = results.filter(e => e.boosterCounts.mythic > 0);
    return createTable();

    function createTable() {
        const test = withoutAME.map((e, i) =>
            row(
                columns(1, [
                    getBoosterIcons(e.boosterCounts, 'ame'),
                    `<span class="sim-chance" style="color: ${getPointsColor(e.result)}">${toLeaguePointsPerFight(
                        e.result,
                    )}</span>`,
                    getBoosterIcons(withAME[i].boosterCounts, 'ame'),
                    `<span class="sim-chance" style="color: ${getPointsColor(
                        withAME[i].result,
                    )}">${toLeaguePointsPerFight(withAME[i].result)}</span>`,
                ]),
            ),
        );
        return $('<table class="sim-booster-table"></table>').append(test.join('')).prop('outerHTML');
    }
}
