import { getChanceColor } from '../utils/color';
import { toPercentage } from '../utils/string';

export class ChanceView {
    private element: JQuery<HTMLElement>;
    private last: any;

    constructor() {
        this.element = $('<div class="sim-result"></div>');
    }

    updateAsync(resultPromise: Promise<ChanceResult & { hasAssumptions?: boolean }>) {
        this.reset();
        this.last = resultPromise;

        queueMicrotask(async () => {
            const result = await resultPromise;
            if (this.last !== resultPromise) return;
            const question = result.hasAssumptions ? '?' : '';
            let mark = '';
            if (result.alwaysWin) mark = '<div class="vCheck_mix_icn sim-mark"></div>';
            if (result.neverWin) mark = '<div class="xUncheck_mix_icn sim-mark"></div>';
            this.element
                .removeClass('sim-pending')
                .html(
                    `<div class="sim-label">P[W]:</div>${mark}<span class="sim-chance">${toPercentage(
                        result.chance,
                    )}${question}</span>`,
                )
                .css('color', getChanceColor(result.chance));
        });

        return this.element;
    }

    reset() {
        this.element.addClass('sim-pending').html('<div class="sim-label">P[W]:</div>-').css('color', '');
    }

    setTooltip(html: string) {
        this.element.attr('tooltip', html);
    }

    getElement() {
        return this.element;
    }
}
