interface SelectorOption {
    value: string;
    label: string;
    selected?: boolean;
}

export class SelectorView {
    private element: JQuery<HTMLElement>;
    private selectElement: JQuery<HTMLElement>;
    private callbacks: ((value: string) => void)[] = [];

    constructor(id: string, header: string, options: SelectorOption[]) {
        const element = $('<div class="form-control"><div class="select-group"></div></div>');
        const labelElement = $('<label class="head-group"></label>').attr('for', id).text(header);
        const optionElements = options.map(e => {
            const option = $(`<option></option>`).attr('value', e.value).text(e.label);
            if (e.selected) option.prop('selected', true);
            return option;
        });
        const selectElement = $('<select icon="down-arrow"></select>')
            .attr('name', id)
            .attr('id', id)
            .append(optionElements);
        selectElement.on('change', () => {
            this.callbacks.forEach(e => {
                e(String(selectElement.val()));
            });
        });
        element.find('.select-group').append(labelElement).append(selectElement);
        this.element = element;
        this.selectElement = selectElement;
        (selectElement as any).selectric();
    }

    onChange(callback: (value: string) => void) {
        this.callbacks.push(callback);
    }

    getValue() {
        return String(this.selectElement.val());
    }

    getElement() {
        return this.element;
    }
}
