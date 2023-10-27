import { afterGameInited, beforeGameInited } from '../utils/async';

const hhPlusPlusPromise = (async (): Promise<any> => {
    if (window.HHPlusPlus != null) return window.HHPlusPlus;
    await beforeGameInited();
    if (window.HHPlusPlus != null) return window.HHPlusPlus;
    await afterGameInited();
    if (window.HHPlusPlus != null) return window.HHPlusPlus;
    await new Promise($);
    return window.HHPlusPlus;
})();

const hhPlusPlusConfigPromise = (async (): Promise<any> => {
    if (window.hhPlusPlusConfig != null) return window.hhPlusPlusConfig;
    await beforeGameInited();
    if (window.hhPlusPlusConfig != null) return window.hhPlusPlusConfig;
    await afterGameInited();
    if (window.hhPlusPlusConfig != null) return window.hhPlusPlusConfig;
    await new Promise($);
    return window.hhPlusPlusConfig;
})();

export function getHHPlusPlus() {
    return hhPlusPlusPromise;
}

export function getHHPlusPlusConfig() {
    return hhPlusPlusConfigPromise;
}
