import { getConfig } from '../../interop/hh-plus-plus-config';
import { loadBoosterData } from '../../store/booster';
import { loadOpponentTeamData } from '../../store/team';
import { afterGameInited, beforeGameInited } from '../../utils/async';
import { checkPage } from '../../utils/page';
import { getFromLocalStorage, setIntoLocalStorage } from '../../utils/storage';

declare global {
    interface Window {
        [key: string]: unknown;
    }
    let girl_rewards: any[] | undefined;
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

export async function GamePage(window: Window) {
    await beforeGameInited();
    try {
        assertGameWindow(window);

        const config = getConfig();
        if (config.addGirlTraitsToGirlTooltip) addGirlTraitsToTooltip(window);
    } catch (e: any) {}
}

async function addGirlTraitsToTooltip(window: GameWindow) {
    const { tooltips } = window;
    if (tooltips == null || typeof tooltips !== 'object') return;
    if (!('[data-new-girl-tooltip]' in tooltips)) return;
    if (typeof tooltips['[data-new-girl-tooltip]'] !== 'function') return;
    const old = tooltips['[data-new-girl-tooltip]'];
    const map = new Map<number, string[]>();
    tooltips['[data-new-girl-tooltip]'] = function dataNewGirlTooltip(...args: any[]) {
        const ret = old(...args);
        const element = $(args[0]);
        const data = JSON.parse(element.attr('data-new-girl-tooltip') ?? '');
        const id =
            data.id_girl ??
            (() => {
                const icon = element.is('[girl-ico-src]') ? element : element.find('[girl-ico-src]');
                return icon.attr('girl-ico-src')?.match(/pictures\/girls\/(\d+)\/(?:ico|ava)/)?.[1] as string;
            })() ??
            (() => {
                const icon = element.is('img[src]') ? element : element.find('img[src]');
                return icon.attr('src')?.match(/pictures\/girls\/(\d+)\/(?:ico|ava)/)?.[1] as string;
            })();
        if (id != null) {
            const traits = map.get(+id);
            if (traits != null) {
                const zodiacMap = {
                    '♈': 'aries',
                    '♉': 'taurus',
                    '♊': 'gemini',
                    '♋': 'cancer',
                    '♌': 'leo',
                    '♍': 'virgo',
                    '♎': 'libra',
                    '♏': 'scorpio',
                    '♐': 'sagittarius',
                    '♑': 'capricorn',
                    '♒': 'aquarius',
                    '♓': 'pisces',
                } as Record<string, string>;
                const baseUrl = window.IMAGES_URL + '/pictures/design/blessings_icons/';
                const getIcon = (icon: string) =>
                    `<span class="sim-trait-icon" style="background-image: url('${baseUrl}${icon}');"></span>`;
                const getHairColorIcon = (color: string) =>
                    color == '' ? '' : getIcon(`hair_colors/hair_color_${color}.png`);
                const getEyeColorIcon = (color: string) =>
                    color == '' ? '' : getIcon(`eye_colors/eye_color_${color}.png`);
                const getZodiacIcon = (zodiac: string) =>
                    zodiac == '' ? '' : getIcon(`zodiac_signs/zodiac_sign_${zodiacMap[zodiac.charAt(0)]}.png`);
                const getPoseIcon = (pose: string) => (pose == '' ? '' : getIcon(`positions/fav_pose_${pose}.png`));
                const icons = [
                    '<div class="sim-traits">',
                    getHairColorIcon(traits[0]),
                    getHairColorIcon(traits[1]),
                    ' ',
                    getEyeColorIcon(traits[2]),
                    getEyeColorIcon(traits[3]),
                    ' ',
                    getZodiacIcon(traits[4]),
                    ' ',
                    getPoseIcon(traits[5]),
                    '</div>',
                ];
                const body = ret.body as string;
                ret.body = body + icons.join('');
            }
        }
        const html = ret.body;
        if (typeof html === 'string') {
            if (html.includes('active_skills_icon.png')) {
                const girlElement = html.match(/class="(\w+?)_element_icn/)?.[1];
                if (girlElement != null) {
                    const stun = '/pvp4_trigger_skills/stun_icon.png';
                    const shield = '/pvp4_trigger_skills/shield_icon.png';
                    const reflect = '/pvp3_active_skills/reflect_icon.png';
                    const execute = '/pvp3_active_skills/execute_icon.png';
                    const map = {
                        darkness: stun,
                        sun: stun,
                        stone: shield,
                        light: shield,
                        nature: reflect,
                        psychic: reflect,
                        fire: execute,
                        water: execute,
                    } as Record<string, string>;
                    const labyrinthMap = {
                        darkness: '/pvp4_trigger_skills/punch_icon.png',
                        sun: '/pvp4_trigger_skills/stun_icon.png',
                        stone: '/pvp4_trigger_skills/defenses_up_icon.png',
                        light: '/pvp4_trigger_skills/heal_up_icon.png',
                        nature: '/pvp4_trigger_skills/mana_boost_icon.png',
                        psychic: '/pvp4_trigger_skills/mana_steal_icon.png',
                        fire: '/pvp4_trigger_skills/burn_icon.png',
                        water: '/pvp4_trigger_skills/shield_icon.png',
                    } as Record<string, string>;
                    const skill = (html.includes('carac-speed') ? labyrinthMap : map)[girlElement];
                    if (skill != null) {
                        const newHtml = html.replace(
                            '/images/pictures/design/girl_skills/active_skills_icon.png',
                            window.IMAGES_URL + '/pictures/design/girl_skills' + skill,
                        );
                        return { ...ret, body: newHtml };
                    }
                }
            }
        }
        return ret;
    };

    const addToMap = (girl: any) => {
        if (girl?.id_girl == null) return;
        const data = [
            girl.hair_color1 ?? girl.girl?.hair_color1 ?? '',
            girl.hair_color2 ?? girl.girl?.hair_color2 ?? '',
            girl.eye_color1 ?? girl.girl?.eye_color1 ?? '',
            girl.eye_color2 ?? girl.girl?.eye_color2 ?? '',
            girl.zodiac ?? girl.girl?.zodiac ?? '',
            girl.figure ?? girl.girl?.figure ?? '',
        ];
        if (data.every(e => e === '')) return;
        map.set(+girl.id_girl, data);
    };

    if (checkPage('/troll-pre-battle.html', '/leagues-pre-battle.html', '/pantheon-pre-battle.html')) {
        const hero_data = window.hero_data as any;
        hero_data.team.girls.map((e: any) => addToMap(e));
        const opponent_fighter = window.opponent_fighter as any;
        opponent_fighter.player.team.girls.map((e: any) => addToMap(e));
    }
    if (
        checkPage(
            '/troll-battle.html',
            '/league-battle.html',
            '/pantheon-battle.html',
            '/season-battle.html',
            '/boss-bang-battle.html',
        )
    ) {
        const hero_fighter = window.hero_fighter as any;
        hero_fighter.girls.map((e: any) => addToMap(e));
        const opponent_fighter = window.opponent_fighter as any;
        opponent_fighter.girls.map((e: any) => addToMap(e));
    }
    if (checkPage('/leagues.html')) {
        const opponents_list = window.opponents_list as any;
        opponents_list.forEach((e: any) => e.player.team.girls.map((e: any) => addToMap(e)));
    }
    if (checkPage('/season-arena.html')) {
        const hero_data = window.hero_data as any;
        hero_data.team.girls.map((e: any) => addToMap(e));
        const opponents = window.opponents as any;
        opponents.forEach((e: any) => e.player.team.girls.map((e: any) => addToMap(e)));
    }
    if (checkPage('/teams.html')) {
        const teams_data = window.teams_data as any;
        Object.values(teams_data).forEach((team: any) => {
            team.girls.map((e: any) => addToMap(e));
        });
    }
    if (checkPage('/edit-team.html')) {
        const availableGirls = window.availableGirls as any;
        availableGirls.forEach((e: any) => addToMap(e));
    }
    if (checkPage('/waifu.html')) {
        const girlsDataList = window.girlsDataList as any;
        girlsDataList.forEach((e: any) => addToMap(e));
    }
    if (checkPage('/path-of-valor.html', '/path-of-glory.html')) {
        const path_girls = window.path_girls as any;
        path_girls.forEach((e: any) => addToMap(e));
    }
    if (checkPage('/activities.html')) {
        const pop_hero_girls = window.pop_hero_girls as any;
        Object.values(pop_hero_girls).forEach((e: any) => addToMap(e));
    }
    if (checkPage('/pantheon.html')) {
        if (Array.isArray(girl_rewards)) {
            girl_rewards.forEach((e: any) => addToMap(e.girl_data));
        }
    }
    if (checkPage('/clubs.html')) {
        const club_champion_data = window.club_champion_data as any;
        const girl = club_champion_data?.champion?.girl;
        if (girl != null) addToMap(girl);
    }
    if (checkPage('/champions/')) {
        const championData = window.championData as any;
        const girl = championData?.champion?.girl;
        if (girl != null) addToMap(girl);
    }
    if (checkPage('/girl/')) {
        const girl = window.girl as any;
        if (girl != null) addToMap(girl);
        $(document).on('ajaxComplete', (event, jqXHR: JQueryXHR, ajaxOptions: JQueryAjaxSettings) => {
            if (ajaxOptions.data?.includes('action=get_teams_for_girl')) {
                const json = jqXHR.responseJSON;
                json?.teams?.forEach((e: any) => e.girls.forEach((e: any) => addToMap(e)));
            }
        });
    }
    if (checkPage('/event.html')) {
        const event_girls = window.event_girls as any;
        event_girls?.forEach((e: any) => addToMap(e));
        // Boss Bang
        const current_event = window.current_event as any;
        current_event?.event_data?.indexed_hero_teams?.forEach((e: any) => {
            e.girls?.forEach((e: any) => addToMap(e));
        });
    }
    if (checkPage('/add-boss-bang-team.html')) {
        const availableGirls = window.availableGirls as any;
        availableGirls.forEach((e: any) => addToMap(e));
    }
    if (checkPage('/labyrinth.html')) {
        const old = window.applyLabyrinthSpecifications;
        if (typeof old === 'function') {
            window.applyLabyrinthSpecifications = function applyLabyrinthSpecifications(...args: any[]) {
                addToMap(args[0]);
                old(...args);
            };
        }
    }
    if (checkPage('/labyrinth-pre-battle.html')) {
        const hero_fighter = window.hero_fighter as any;
        Object.values(hero_fighter.team.girls).map((e: any) => addToMap(e));
        const opponent_fighter = window.opponent_fighter as any;
        opponent_fighter.team.girls.map((e: any) => addToMap(e));
    }
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
        seasons: () => opponentTeamData.opponentId,
    };
    const opponentId = opponentIdMap[battleType]?.();
    if (opponentId === opponentTeamData.opponentId) return opponentTeamData.team;
    return null;
}

export function loadMythicBoosterMultiplier(battleType: string): number | null {
    return loadBoosterData().mythic?.[battleType] ?? null;
}
