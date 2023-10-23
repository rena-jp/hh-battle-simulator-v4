import { getPointsColor } from '../utils/color';
import { toLeaguePointsPerFight } from '../utils/string';

export class PointsView {
    private element: JQuery<HTMLElement>;

    constructor() {
        this.element = $('<div class="sim-result"></div>');
    }

    updateAsync(resultPromise: Promise<PointsResult & { hasAssumptions?: boolean }>) {
        this.reset();

        queueMicrotask(async () => {
            const result = await resultPromise;
            const question = result.hasAssumptions ? '?' : '';
            let mark = '';
            if (result.minPoints >= 25) mark = '<div class="vCheck_mix_icn sim-mark"></div>';
            this.element
                .removeClass('sim-pending')
                .html(
                    `<div class="sim-label">E[P]:</div>${mark}<span class="sim-points">${toLeaguePointsPerFight(
                        result.avgPoints,
                    )}${question}</span>`,
                )
                .css('color', getPointsColor(result.avgPoints));
        });

        return this.element;
    }

    reset() {
        this.element.addClass('sim-pending').html('<div class="sim-label">E[P]:</div>-').css('color', '');
    }

    setTooltip(html: string) {
        this.element.attr('tooltip', html);
    }

    getElement() {
        return this.element;
    }
}
