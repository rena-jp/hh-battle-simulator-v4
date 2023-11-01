import { getPointsColor } from '../utils/color';
import { toPercentage, toPreciseLeaguePointsPerFight } from '../utils/string';
import { column, columns, row } from '../utils/table';

export function createPointsTable(result: StandardResult | FullResult): string {
    if ('pointsTable' in result) {
        const max = Math.sqrt(result.pointsTable.reduce((p, c) => Math.max(p, c), 0));
        const rows = result.pointsTable
            .map((e, i) => ({ points: i, probability: e }))
            .filter(e => e.probability > 0)
            .sort((x, y) => y.points - x.points)
            .flatMap(e => [
                `<tr style="color: ${getPointsColor(e.points)};">`,
                '<td>',
                e.points.toFixed(),
                '</td>',
                '<td class="sim-bar-container">',
                `<div class="sim-bar" style="width: ${(e.probability * 5) / max}rem;"></div>`,
                toPercentage(e.probability),
                '</td>',
                '</tr>',
            ]);

        return $('<table class="sim-points-table"></table>').append(rows.join('')).prop('outerHTML');
    } else {
        return $('<table class="sim-table"></table>')
            .append(row(column(2, 'Points')))
            .append(row(columns(1, ['Max', result.maxPoints.toFixed()])))
            .append(row(columns(1, ['Avg', toPreciseLeaguePointsPerFight(result.avgPoints)])))
            .append(row(columns(1, ['Min', result.minPoints.toFixed()])))
            .prop('outerHTML');
    }
}
