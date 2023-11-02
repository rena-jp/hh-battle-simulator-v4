const beforeScriptStartPromise = new Promise<void>(resolve => {
    const ready = () => {
        if (window.$ != null) resolve();
    };
    if (document.readyState === 'loading') {
        window.addEventListener('DOMContentLoaded', ready, true);
    } else {
        ready();
    }
});

const beforeGameInitedPromise = new Promise<void>(resolve => {
    beforeScriptStartPromise.then(() => {
        queueMicrotask(resolve);
    });
});

const afterGameInitedPromise = new Promise<void>(resolve => {
    beforeGameInitedPromise.then(() => {
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
