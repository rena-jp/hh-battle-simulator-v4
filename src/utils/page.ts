export function checkPage(...args: string[]) {
    const { pathname } = window.location;
    return args.some(e => pathname.includes(e));
}

export function getOpponentIdFromUrl() {
    const id = location.search.match(/id_opponent=(\d+)/)?.[1];
    if (id == null) throw new Error('id_opponent is not found from url.');
    return id;
}
