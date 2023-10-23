import { toPreciseLeaguePointsPerFight } from '../utils/string';
import { column, columns, row } from '../utils/table';

export function createPointsTable(result: StandardResult): string {
    return $('<table class="sim-table"></table>')
        .append(row(column(2, 'Points')))
        .append(row(columns(1, ['Max', result.maxPoints.toFixed()])))
        .append(row(columns(1, ['Avg', toPreciseLeaguePointsPerFight(result.avgPoints)])))
        .append(row(columns(1, ['Min', result.minPoints.toFixed()])))
        .prop('outerHTML');
}
