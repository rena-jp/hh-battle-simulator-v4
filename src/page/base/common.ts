import { loadBoosterData } from '../../store/booster';
import { loadOpponentTeamData } from '../../store/team';

declare global {
    interface Window {
        [key: string]: unknown;
    }
}

export interface GameWindow extends Window {
    // from jquery.min.js
    $: typeof jQuery;

    // from default.js
    localStorageGetItem(key: string): string;
    localStorageSetItem(key: string, value: string): void;
    get_lang(): string;
    get_dec_and_sep(lang: string): { dec: string; sep: string };

    // from head
    SITE_ROOT: string;
    IMAGES_URL: string;

    // from body
    server_now_ts: number;
    //Hero: HeroType; // Hero is defined in default.js but initialized in body.
}

export function assertGameWindow(window: Window): asserts window is GameWindow {
    // from jquery.js
    const { $ } = window;
    if ($ == null) throw new Error('jQuery is not found.');

    // from default.js
    const { localStorageGetItem, localStorageSetItem, get_lang, get_dec_and_sep } = window;
    if (localStorageGetItem == null) throw new Error('localStorageGetItem is not found.');
    if (localStorageSetItem == null) throw new Error('localStorageSetItem is not found.');
    if (get_lang == null) throw new Error('get_lang is not found.');
    if (get_dec_and_sep == null) throw new Error('get_dec_and_sep is not found.');

    // from head
    const { SITE_ROOT, IMAGES_URL } = window;
    if (SITE_ROOT == null) throw new Error('SITE_ROOT is not found.');
    if (IMAGES_URL == null) throw new Error('IMAGES_URL is not found.');

    // from body
    const { Hero } = window;
    if (Hero == null) throw new Error('Hero is not found.');
}

export function loadOpponentTeam(window: GameWindow): Team | null {
    const { localStorageGetItem } = window;
    const battleType = localStorageGetItem('battle_type');
    const opponentTeamData = loadOpponentTeamData();
    if (opponentTeamData == null || opponentTeamData.battleType !== battleType) return null;
    const opponentIdMap: Record<string, (() => string) | undefined> = {
        leagues: () => localStorageGetItem('leagues_id'),
        trolls: () => localStorageGetItem('troll_id'),
        pantheon: () => localStorageGetItem('pantheon_id'),
    };
    const opponentId = opponentIdMap[battleType]?.();
    if (opponentId === opponentTeamData.opponentId) return opponentTeamData.team;
    return null;
}

export function loadMythicBoosterMultiplier(battleType: string): number | null {
    return loadBoosterData().mythic?.[battleType] ?? null;
}
