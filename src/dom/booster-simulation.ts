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

export interface LeagueTableBoosterResult {
    boosterCounts: BoosterCounts;
    result: number;
    average: number;
    sum: number;
    challenges: number;
}

export function createLeagueTableAllTable(results: LeagueTableBoosterResult[]) {
    sortBoosterSimulationResults(results);
    const withoutAME = results.filter(e => e.boosterCounts.mythic <= 0);
    const withAME = results.filter(e => e.boosterCounts.mythic > 0);
    return createTable();

    function createTable() {
        const test = [...Array(Math.max(withoutAME.length, withAME.length))].map((_, i) =>
            row(
                columns(
                    1,
                    [withoutAME[i], withAME[i]].flatMap(e => {
                        const color = getPointsColor(e.average);
                        return [
                            getBoosterIcons(e.boosterCounts, 'ame'),
                            `<span class="sim-points" style="color: ${color}">${toLeaguePointsPerFight(
                                e.average,
                            )}</span>`,
                            '*',
                            `<span class="sim-points">${e.challenges.toFixed()}</span>`,
                            '=',
                            `<span class="sim-points" style="color: ${color}">${e.sum.toFixed()}</span>`,
                        ];
                    }),
                ),
            ),
        );
        return $('<table class="sim-booster-table"></table>').append(test.join('')).prop('outerHTML');
    }
}

export function createLeagueTableUnfoughtTable(
    results: LeagueTableBoosterResult[],
    currentScore: number,
    foughtCounts: number,
) {
    sortBoosterSimulationResults(results);
    const withoutAME = results.filter(e => e.boosterCounts.mythic <= 0);
    const withAME = results.filter(e => e.boosterCounts.mythic > 0);
    return createTable();

    function createTable() {
        const test = [...Array(Math.max(withoutAME.length, withAME.length))].map((_, i) =>
            row(
                columns(
                    1,
                    [withoutAME[i], withAME[i]].flatMap(e => {
                        const color = getPointsColor(e.average);
                        const total = e.sum + currentScore;
                        const avgTotal = total / (e.challenges + foughtCounts);
                        const color3 = getPointsColor(avgTotal);
                        return [
                            getBoosterIcons(e.boosterCounts, 'ame'),
                            `<span class="sim-points" style="color: ${color}">${toLeaguePointsPerFight(
                                e.average,
                            )}</span>`,
                            '*',
                            `<span>${e.challenges.toFixed()}</span>`,
                            '=',
                            `<span style="color: ${color}">${e.sum.toFixed()}</span>`,
                            '=>',
                            `<span style="color: ${color3}">${total.toFixed()}</span>`,
                            `<span style="color: ${color3}">(${toLeaguePointsPerFight(avgTotal)})</span>`,
                        ];
                    }),
                ),
            ),
        );
        return $('<table class="sim-booster-table"></table>').append(test.join('')).prop('outerHTML');
    }
}

export function createLeagueTableBestTable(noAME: LeagueTableBoosterResult[], all: LeagueTableBoosterResult[]) {
    sortBoosterSimulationResults(noAME);
    sortBoosterSimulationResults(all);
    const totals = [noAME, all].map(e => {
        const sum = e.reduce((p, c) => p + c.sum, 0);
        const challenges = e.reduce((p, c) => p + c.challenges, 0);
        const average = sum / challenges;
        const color = getPointsColor(average);
        return { sum, challenges, average, color };
    });
    return createTable();

    function createTable() {
        const rows = [...Array(Math.max(noAME.length, all.length))].map((_, i) =>
            row(
                columns(
                    1,
                    [noAME[i], all[i]].flatMap(e => {
                        if (e == null) return Array(6).fill('');
                        const color = getPointsColor(e.average);
                        return [
                            getBoosterIcons(e.boosterCounts, 'ame'),
                            `<span class="sim-points" style="color: ${color}">${toLeaguePointsPerFight(
                                e.average,
                            )}</span>`,
                            '*',
                            `<span class="sim-points">${e.challenges.toFixed()}</span>`,
                            '=',
                            `<span class="sim-points" style="color: ${color}">${e.sum.toFixed()}</span>`,
                        ];
                    }),
                ),
            ),
        );
        return $('<table class="sim-booster-table"></table>')
            .append(
                row(columns(6, ['No AME', 'All'])),
                rows.join(''),
                row(
                    columns(
                        1,
                        totals.flatMap(e => [
                            'Sum:',
                            `<span class="sim-points" style="color: ${e.color}">${toLeaguePointsPerFight(
                                e.average,
                            )}</span>`,
                            '*',
                            `<span class="sim-points">${e.challenges.toFixed()}</span>`,
                            '=',
                            `<span class="sim-points" style="color: ${e.color}">${e.sum.toFixed()}</span>`,
                        ]),
                    ),
                ),
            )
            .prop('outerHTML');
    }
}

export function createLeagueTableUnfoughtBestTable(
    noAME: LeagueTableBoosterResult[],
    all: LeagueTableBoosterResult[],
    currentScore: number,
    foughtCounts: number,
) {
    sortBoosterSimulationResults(noAME);
    sortBoosterSimulationResults(all);
    const currentAvg = foughtCounts === 0 ? NaN : currentScore / foughtCounts;
    const color2 = foughtCounts === 0 ? '#FFF' : getPointsColor(currentAvg);
    const totals = [noAME, all].map(e => {
        const sum = e.reduce((p, c) => p + c.sum, 0);
        const challenges = e.reduce((p, c) => p + c.challenges, 0);
        const average = sum / challenges;
        const color = getPointsColor(average);
        const total = sum + currentScore;
        const avgTotal = total / (challenges + foughtCounts);
        const color3 = getPointsColor(avgTotal);
        return { sum, challenges, average, color, total, avgTotal, color3 };
    });
    return createTable();

    function createTable() {
        const rows = [...Array(Math.max(noAME.length, all.length))].map((_, i) =>
            row(
                columns(
                    1,
                    [noAME[i], all[i]].flatMap(e => {
                        if (e == null) return Array(6).fill('');
                        const color = getPointsColor(e.average);
                        return [
                            getBoosterIcons(e.boosterCounts, 'ame'),
                            `<span class="sim-points" style="color: ${color}">${toLeaguePointsPerFight(
                                e.average,
                            )}</span>`,
                            '*',
                            `<span class="sim-points">${e.challenges.toFixed()}</span>`,
                            '=',
                            `<span class="sim-points" style="color: ${color}">${e.sum.toFixed()}</span>`,
                        ];
                    }),
                ),
            ),
        );
        return $('<table class="sim-booster-table"></table>')
            .append(
                row(columns(6, ['No AME', 'All'])),
                rows.join(''),
                row(
                    columns(
                        1,
                        totals.flatMap(e => [
                            'Sum',
                            `<span class="sim-points" style="color: ${e.color}">${toLeaguePointsPerFight(
                                e.average,
                            )}</span>`,
                            '*',
                            `<span class="sim-points">${e.challenges.toFixed()}</span>`,
                            '=',
                            `<span class="sim-points" style="color: ${e.color}">${e.sum.toFixed()}</span>`,
                        ]),
                    ),
                ),
                row(
                    columns(
                        1,
                        totals.flatMap(e => [
                            'Current score',
                            `<span style="color: ${color2}">${
                                Number.isNaN(currentAvg) ? '?' : toLeaguePointsPerFight(currentAvg)
                            }</span>`,
                            '*',
                            `<span>${foughtCounts}</span>`,
                            '=',
                            `<span style="color: ${color2}">${currentScore}</span>`,
                        ]),
                    ),
                ),
                row(
                    columns(
                        1,
                        totals.flatMap(e => [
                            'Total',
                            `<span style="color: ${e.color3}">${toLeaguePointsPerFight(e.avgTotal)}</span>`,
                            '*',
                            `<span>${e.challenges + foughtCounts}</span>`,
                            '=',
                            `<span style="color: ${e.color3}">${e.total.toFixed()}</span>`,
                        ]),
                    ),
                ),
            )
            .prop('outerHTML');
    }
}
