import { beforeGameInited } from './async';

export async function addStyle(css: string) {
    await beforeGameInited();
    if (window.$ == null) return;
    const { IMAGES_URL, SITE_ROOT } = window;
    if (typeof IMAGES_URL === 'string') {
        css = css.replaceAll('${IMAGES_URL}', IMAGES_URL);
    }
    if (typeof SITE_ROOT === 'string') {
        css = css.replaceAll('${SITE_ROOT}', SITE_ROOT);
    }
    $(document.head).append(`<style>${css}</style>`);
}
