import { getMojoColor } from '../utils/color';
import { toPercentage, toRoundedNumber } from '../utils/string';
import { column, columns, row } from '../utils/table';

export class MojoView {
    private element: JQuery<HTMLElement>;
    private last: any;

    constructor(private mojo: number) {
        this.element = $('<div class="sim-result"></div>');
    }

    updateAsync(resultPromise: Promise<ChanceResult & { hasAssumptions?: boolean }>) {
        this.reset();
        this.last = resultPromise;

        queueMicrotask(async () => {
            const result = await resultPromise;
            if (this.last !== resultPromise) return;
            const question = result.hasAssumptions ? '?' : '';

            const winChance = result.chance;
            const lossChance = 1 - winChance;
            const winMojo = this.mojo;
            const lossMojo = Math.min(winMojo - 40, -1);
            const odds = winMojo * winChance + lossMojo * lossChance;

            this.element
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
        });

        return this.element;
    }

    reset() {
        this.element.addClass('sim-pending').html('<div class="sim-label">E[M]:</div>-').css('color', '');
    }

    getElement() {
        return this.element;
    }
}
