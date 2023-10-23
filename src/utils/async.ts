const beforeGameInitedPromise = new Promise<void>(resolve => {
    if (document.readyState === 'loading') {
        window.addEventListener('DOMContentLoaded', () => resolve(), true);
    } else {
        resolve();
    }
});

const afterGameInitedPromise = new Promise<void>(resolve => {
    beforeGameInitedPromise.then(() => {
        $(() => resolve());
    });
});

function beforeGameInited() {
    return beforeGameInitedPromise;
}

function afterGameInited() {
    return afterGameInitedPromise;
}

export { beforeGameInited, afterGameInited };
