type text = string | number;

export function column(span: number, content: text): string {
    return span >= 2 ? `<td colspan="${span}">${content}</td>` : `<td>${content}</td>`;
}

export function columns(span: number, contents: text[]): string {
    return contents.map(e => column(span, e)).join('');
}

export function row(...args: text[]): string {
    return ['<tr>', ...args, '</tr>'].join('');
}
