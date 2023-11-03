import { BoosterCounts, BoosterKeys, BoosterSimulationResult, SkillSimulationResult } from '../simulator/booster';
import { getChanceColor, getPointsColor } from '../utils/color';
import { toLeaguePointsPerFight, toPrecisePercentage } from '../utils/string';
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
            compare(e => e.boosterCounts.jujubes) ??
            compare(e => e.boosterCounts.ginseng) ??
            0
        );
    });
}

function getBoosterIcon(rarity: string, booster: string) {
    return `<div class="sim-booster-slot slot ${rarity}"><div class="sim-booster-icon sim-icon-${booster}"></div></div>`;
}

const BoosterIconMap = {
    ginseng: getBoosterIcon('legendary', 'ginseng'),
    jujubes: getBoosterIcon('legendary', 'jujubes'),
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
                    `<span class="sim-chance" style="color: ${getChanceColor(e.result)}">${toPrecisePercentage(
                        e.result,
                    )}</span>`,
                    getBoosterIcons(withHB[i].boosterCounts, 'headband'),
                    `<span class="sim-chance" style="color: ${getChanceColor(withHB[i].result)}">${toPrecisePercentage(
                        withHB[i].result,
                    )}</span>`,
                ]),
            ),
        );
        return $('<table class="sim-booster-table"></table>').append(test.join('')).prop('outerHTML');
    }
}

export function createSkillChanceTable(results: SkillSimulationResult[]) {
    results.forEach(result => {
        result.results.forEach(result => {
            sortBoosterSimulationResults(result.results);
        });
    });
    return createTable();

    function createTable() {
        function createRow(level: number) {
            return row(
                columns(
                    1,
                    results.map(result => createColumn(result)),
                ),
            );
            function createColumn(result: SkillSimulationResult) {
                const skillName = result.skillName;
                const boosterResults = result.results.find(e => e.level === level)?.results;
                if (boosterResults == null) return '';
                return createSubTable(boosterResults);
                function createSubTable(boosterResults: BoosterSimulationResult[]) {
                    return [
                        '<table>',
                        row(column(2, `Level ${level} ${skillName}`)),
                        ...boosterResults.map(e => {
                            return row(
                                columns(1, [
                                    getBoosterIcons(e.boosterCounts, 'headband'),
                                    `<span class="sim-chance" style="color: ${getChanceColor(
                                        e.result,
                                    )}">${toPrecisePercentage(e.result)}</span>`,
                                ]),
                            );
                        }),
                        '</table>',
                    ].join('');
                }
            }
        }
        const rows = [5, 4, 3, 2, 1].map(e => createRow(e));
        return $('<table class="sim-booster-table"></table>').append(rows.join('')).prop('outerHTML');
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
                    `<span class="sim-points" style="color: ${getPointsColor(e.result)}">${toLeaguePointsPerFight(
                        e.result,
                    )}</span>`,
                    getBoosterIcons(withAME[i].boosterCounts, 'ame'),
                    `<span class="sim-points" style="color: ${getPointsColor(
                        withAME[i].result,
                    )}">${toLeaguePointsPerFight(withAME[i].result)}</span>`,
                ]),
            ),
        );
        return $('<table class="sim-booster-table"></table>').append(test.join('')).prop('outerHTML');
    }
}

export function createSkillPointsTable(results: SkillSimulationResult[]) {
    results.forEach(result => {
        result.results.forEach(result => {
            sortBoosterSimulationResults(result.results);
        });
    });
    return createTable();

    function createTable() {
        function createRow(level: number) {
            return row(
                columns(
                    1,
                    results.map(result => createColumn(result)),
                ),
            );
            function createColumn(result: SkillSimulationResult) {
                const skillName = result.skillName;
                const boosterResults = result.results.find(e => e.level === level)?.results;
                if (boosterResults == null) return '';
                return createSubTable(boosterResults);
                function createSubTable(boosterResults: BoosterSimulationResult[]) {
                    return [
                        '<table>',
                        row(column(2, `Level ${level} ${skillName}`)),
                        ...boosterResults.map(e => {
                            return row(
                                columns(1, [
                                    getBoosterIcons(e.boosterCounts, 'ame'),
                                    `<span class="sim-points" style="color: ${getPointsColor(
                                        e.result,
                                    )}">${toLeaguePointsPerFight(e.result)}</span>`,
                                ]),
                            );
                        }),
                        '</table>',
                    ].join('');
                }
            }
        }
        const rows = [5, 4, 3, 2, 1].map(e => createRow(e));
        return $('<table class="sim-booster-table"></table>').append(rows.join('')).prop('outerHTML');
    }
}

export function createAllBoosterPointsTable(results: BoosterSimulationResult[], opponentCount: number) {
    sortBoosterSimulationResults(results);
    const withoutAME = results.filter(e => e.boosterCounts.mythic <= 0);
    const withAME = results.filter(e => e.boosterCounts.mythic > 0);
    return createTable();

    function createTable() {
        const test = withoutAME.map((e, i) =>
            row(
                columns(1, [
                    getBoosterIcons(e.boosterCounts, 'ame'),
                    `<span class="sim-points" style="color: ${getPointsColor(e.result)}">${(
                        e.result *
                        opponentCount *
                        3
                    ).toFixed()}</span>`,
                    `<span class="sim-points" style="color: ${getPointsColor(e.result)}">(${toLeaguePointsPerFight(
                        e.result,
                    )})</span>`,
                    getBoosterIcons(withAME[i].boosterCounts, 'ame'),
                    `<span class="sim-points" style="color: ${getPointsColor(withAME[i].result)}">${(
                        withAME[i].result *
                        opponentCount *
                        3
                    ).toFixed()}</span>`,
                    `<span class="sim-points" style="color: ${getPointsColor(
                        withAME[i].result,
                    )}">(${toLeaguePointsPerFight(withAME[i].result)})</span>`,
                ]),
            ),
        );
        return $('<table class="sim-booster-table"></table>').append(test.join('')).prop('outerHTML');
    }
}
