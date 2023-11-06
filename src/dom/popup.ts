export class Popup {
    private element: JQuery<HTMLElement>;
    private content: JQuery<HTMLElement>;
    constructor(header: string | JQuery<HTMLElement>) {
        this.element = $('<div class="sim-popup"></div>');

        const closeButton = $('<div class="close-button xUncheck_mix_icn"></div>');
        closeButton.on('click', () => {
            this.hide();
        });

        this.element.append(closeButton);
        if (typeof header === 'string') {
            this.element.append($('<h1 class="caption"></h1>').text(header));
        } else {
            this.element.append(header);
        }

        const content = $('<div class="content"></div>');
        this.content = content;
        this.element.append(content);
    }
    show() {
        this.element.appendTo('#contains_all');
    }
    hide() {
        this.element.detach();
    }
    toggle() {
        if (this.element.parent().length === 0) {
            this.show();
        } else {
            this.hide();
        }
    }
    setContent(dom: string | JQuery<HTMLElement>) {
        if (typeof dom === 'string') {
            this.content.html(dom);
        } else {
            this.content.empty().append(dom);
        }
    }
}
