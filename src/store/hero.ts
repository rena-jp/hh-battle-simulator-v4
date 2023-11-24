import { FighterCaracs } from '../data/fighter';
import { getFromLocalStorage, setIntoLocalStorage } from '../utils/storage';

interface Cache<T> {
    version?: number;
    data: T;
}

const GinsengCaracsVersion = 1;
interface HeroData {
    classBonus: FighterCaracs;
    ginsengCaracs: Cache<FighterCaracs[]>;
}

function saveHeroData(boosterData: Partial<HeroData>) {
    setIntoLocalStorage('HHBattleSimulator.HeroData', {
        classBonus: boosterData.classBonus,
        ginsengCaracs: boosterData.ginsengCaracs,
    });
}

function loadHeroData(): Partial<HeroData> {
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
    heroData.ginsengCaracs = {
        data: ginsengCaracs,
        version: GinsengCaracsVersion,
    };
    saveHeroData(heroData);
}

export function loadGinsengCaracs(): FighterCaracs[] | null {
    const cache = loadHeroData().ginsengCaracs;
    return cache?.version === GinsengCaracsVersion ? cache.data : null;
}
