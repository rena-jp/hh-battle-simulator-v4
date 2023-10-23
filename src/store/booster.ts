import { BoosterBonus, MythicBoosterBonus } from '../data/booster';
import { getFromLocalStorage, setIntoLocalStorage } from '../utils/storage';

interface BoosterData {
    normal: BoosterBonus;
    mythic: MythicBoosterBonus;
}

export function saveBoosterData(boosterData: Partial<BoosterData>) {
    setIntoLocalStorage('HHBattleSimulator.BoosterData', {
        normal: boosterData.normal,
        mythic: boosterData.mythic,
    });
}

export function loadBoosterData(): Partial<BoosterData> {
    return getFromLocalStorage('HHBattleSimulator.BoosterData', {});
}

export function saveMythicBoosterBonus(mythic: MythicBoosterBonus) {
    const boosterData = loadBoosterData();
    boosterData.mythic = mythic;
    saveBoosterData(boosterData);
}

export function loadMythicBoosterBonus(): MythicBoosterBonus {
    return loadBoosterData().mythic ?? {};
}

export function saveBoosterBonus(boosterBonus: BoosterBonus) {
    const boosterData = loadBoosterData();
    boosterData.normal = boosterBonus;
    saveBoosterData(boosterData);
}

export function loadBoosterBonus(): BoosterBonus | null {
    return loadBoosterData().normal ?? null;
}
