import { getMojoColor } from '../utils/color';
import { toPercentage, toRoundedNumber } from '../utils/string';
import { column, columns, row } from '../utils/table';

export function createMojoElement$(resultPromise: any, winMojo: any) {
    const $element = $('<div class="sim-result"></div>')
        .addClass('sim-pending')
        .html('<div class="sim-label">E[M]:</div>-');
    queueMicrotask(update);
    return $element;

    async function update() {
        const result = await resultPromise;
        const question = result.hasAssumptions ? '?' : '';
        const winChance = result.chance;
        const lossChance = 1 - winChance;
        const lossMojo = winMojo - 40;
        const odds = winMojo * winChance + lossMojo * lossChance;
        $element
            .removeClass('sim-pending')
            .html(
                `<div class="sim-label">E[M]:</div><span class="sim-mojo">${toRoundedNumber(
                    odds,
                    2,
                )}${question}</span>`,
            )
            .css('color', getMojoColor(odds))
            .attr('tooltip', createMojoTable());

        function createMojoTable() {
            return $('<table class="sim-table"></table>')
                .append(row(column(1, ''), columns(1, ['Win', 'Loss'])))
                .append(
                    row(
                        column(1, 'Mojo'),
                        columns(
                            1,
                            [winMojo, lossMojo].map(e => toRoundedNumber(e, 2)),
                        ),
                    ),
                )
                .append(
                    row(
                        column(1, '%'),
                        columns(
                            1,
                            [winChance, lossChance].map(e => toPercentage(e)),
                        ),
                    ),
                )
                .append(row(column(1, 'E[M]'), column(2, toRoundedNumber(odds, 2))))
                .prop('outerHTML');
        }
    }
}
