import { Booster, getBoosterData } from '../data/booster';
import { FighterCaracsCalculator } from '../data/fighter';
import { HeroCaracs, HeroType, addHeroCaracs, toHeroCaracs } from '../data/hero';
import { simulateGinsengCaracs } from '../simulator/booster';
import { saveBoosterData } from '../store/booster';
import { saveClassBonus, saveGinsengCaracs } from '../store/hero';
import { beforeGameInited } from '../utils/async';
import { checkPage } from '../utils/page';
import { GameWindow, assertGameWindow } from './base/common';
import { EquippedArmor, ShopGlobal } from './types/shop';

interface ClassResonanceBonus {
    bonus: number;
    identifier: string;
    resonance: 'damage' | 'ego';
}

type ShopWindow = Window & GameWindow & ShopGlobal;

function assertShopWindow(window: Window): asserts window is ShopWindow {
    assertGameWindow(window);
    const { equipped_armor, equipped_booster } = window;
    if (equipped_armor == null) throw new Error('equipped_armor is not found.');
    if (equipped_booster == null) throw new Error('equipped_booster is not found.');
}

export async function ShopPage(window: Window) {
    if (!checkPage('/shop.html')) return;
    await beforeGameInited();

    assertShopWindow(window);

    updateHeroData(window);
}

function updateHeroData(window: ShopWindow) {
    updateGinsengCaracs(window);
    updateHeroClassBonus(window);
    updateBoosterBonus(window);

    // I want to observe the use of boosters and the replacement of hero armor.
    // Changing the game code is a bad idea, but I don't know of any other good solution.
    const Hero: HeroType = window.Hero;
    const Hero_updates = Hero.updates;
    if (typeof Hero_updates === 'function') {
        Hero.updates = function updates(...args: any) {
            const ret = Hero_updates(...args);
            try {
                updateGinsengCaracs(window);
                updateHeroClassBonus(window);
                updateBoosterBonus(window);
            } catch (e) {
                console.error(e);
            }
            return ret;
        };
    }
}

function updateGinsengCaracs(window: ShopWindow) {
    const { equipped_armor } = window;
    const ginsengCaracs = simulateGinsengCaracs(window.Hero, getArmorCaracs(equipped_armor));
    saveGinsengCaracs(ginsengCaracs);
}

function getArmorCaracs(equipped_armor: Record<string, EquippedArmor>): HeroCaracs {
    return Object.values(equipped_armor)
        .map(e => toHeroCaracs(e.caracs))
        .reduce((p, c) => addHeroCaracs(p, c), toHeroCaracs({}));
}

function updateHeroClassBonus(window: ShopWindow) {
    const { equipped_armor, Hero } = window;
    const heroClass = Hero.infos.class;
    const classBonus = Object.values(equipped_armor)
        .map(e => e.resonance_bonuses?.class)
        .filter((e): e is ClassResonanceBonus => e != null)
        .filter(e => +e.identifier === heroClass)
        .reduce(
            (p, c) => {
                p[c.resonance] += c.bonus;
                return p;
            },
            { damage: 0, ego: 0 },
        );
    saveClassBonus(new FighterCaracsCalculator(classBonus).divide(100).add(1).result());
}

function updateBoosterBonus(window: ShopWindow) {
    const { equipped_booster } = window;
    const boosters = Array<Booster>(0).concat(equipped_booster.normal, equipped_booster.mythic);
    const boosterData = getBoosterData(boosters);
    boosterData.mythic = {
        leagues: 1,
        seasons: 1,
        trolls: 1,
        pantheon: 1,
        ...boosterData.mythic,
    };
    saveBoosterData(boosterData);
}
