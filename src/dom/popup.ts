export class Popup {
    private element: JQuery<HTMLElement>;
    private content: JQuery<HTMLElement>;
    constructor(caption: string) {
        this.element = $('<div class="sim-popup"></div>');

        const closeButton = $('<div class="close-button xUncheck_mix_icn"></div>');
        closeButton.on('click', () => {
            this.hide();
        });

        this.element.append(closeButton);
        this.element.append($('<h1 class="caption"></h1>').text(caption));

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
            this.element.appendTo('#contains_all');
        } else {
            this.element.detach();
        }
    }
    setContent(html: string) {
        this.content.html(html);
    }
}
