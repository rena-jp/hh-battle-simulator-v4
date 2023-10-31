const beforeGameInitedPromise = new Promise<void>(resolve => {
    if (document.readyState === 'loading') {
        window.addEventListener('DOMContentLoaded', () => resolve(), true);
    } else {
        resolve();
    }
});

const afterGameInitedPromise = new Promise<void>(resolve => {
    beforeGameInitedPromise.then(() => {
        if (window.$ == null) return;
        $(() => resolve());
    });
});

export function beforeGameInited() {
    return beforeGameInitedPromise;
}

export function afterGameInited() {
    return afterGameInitedPromise;
}
