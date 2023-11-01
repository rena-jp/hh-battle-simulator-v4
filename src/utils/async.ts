const beforeScriptStartPromise = new Promise<void>(resolve => {
    if (document.readyState === 'loading') {
        window.addEventListener('DOMContentLoaded', () => resolve(), true);
    } else {
        resolve();
    }
});

const beforeGameInitedPromise = new Promise<void>(resolve => {
    beforeScriptStartPromise.then(() => {
        queueMicrotask(resolve);
    });
});

const afterGameInitedPromise = new Promise<void>(resolve => {
    beforeGameInitedPromise.then(() => {
        if (window.$ == null) return;
        $(resolve);
    });
});

export function beforeScriptStart() {
    return beforeScriptStartPromise;
}

export function beforeGameInited() {
    return beforeGameInitedPromise;
}

export function afterGameInited() {
    return afterGameInitedPromise;
}
