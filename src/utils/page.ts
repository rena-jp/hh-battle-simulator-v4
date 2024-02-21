export function checkPage(...args: string[]) {
    const { pathname } = window.location;
    return args.some(e => pathname.includes(e));
}

export function getOpponentIdFromUrl() {
    const id = window.location.search.match(/id_opponent=(\d+)/)?.[1];
    if (id == null) throw new Error('id_opponent is not found from url.');
    return id;
}

export function getSessionUrl(url: string) {
    return window.getDocumentHref?.(url) ?? url;
}
