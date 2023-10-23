import { FighterCaracs } from '../data/fighter';
import { getFromLocalStorage, setIntoLocalStorage } from '../utils/storage';

interface HeroData {
    classBonus: FighterCaracs;
    ginsengCaracs: FighterCaracs[];
}

export function saveHeroData(boosterData: Partial<HeroData>) {
    setIntoLocalStorage('HHBattleSimulator.HeroData', {
        classBonus: boosterData.classBonus,
        ginsengCaracs: boosterData.ginsengCaracs,
    });
}

export function loadHeroData(): Partial<HeroData> {
    return getFromLocalStorage('HHBattleSimulator.HeroData', {});
}

export function saveClassBonus(classBonus: FighterCaracs) {
    const heroData = loadHeroData();
    heroData.classBonus = classBonus;
    saveHeroData(heroData);
}

export function loadClassBonus(): FighterCaracs | null {
    return loadHeroData().classBonus ?? null;
}

export function saveGinsengCaracs(ginsengCaracs: FighterCaracs[]) {
    const heroData = loadHeroData();
    heroData.ginsengCaracs = ginsengCaracs;
    saveHeroData(heroData);
}

export function loadGinsengCaracs(): FighterCaracs[] | null {
    return loadHeroData().ginsengCaracs ?? null;
}
