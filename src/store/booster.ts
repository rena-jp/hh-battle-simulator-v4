import { BoosterBonus, MythicBoosterBonus, NormalBooster } from '../data/booster';
import { FighterCaracsCalculator } from '../data/fighter';
import { getFromLocalStorage, setIntoLocalStorage } from '../utils/storage';

interface BoosterData {
    normals: NormalBooster[];
    mythic: MythicBoosterBonus;
}

export function saveBoosterData(boosterData: Partial<BoosterData>) {
    setIntoLocalStorage('HHBattleSimulator.BoosterData', {
        normals: boosterData.normals,
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

export function loadBoosterBonus(server_now_ts: number): BoosterBonus | null {
    const { normals } = loadBoosterData();
    if (normals == null) return null;
    const multiplier = new FighterCaracsCalculator();
    const addend = new FighterCaracsCalculator();
    normals.forEach(e => {
        if (e.lifetime < server_now_ts) return;
        if (e.multiplier != null) multiplier.add(e.multiplier);
        if (e.addend != null) addend.add(e.addend);
    });
    return {
        multiplier: multiplier.divide(100).add(1).result(),
        addend: addend.result(),
    };
}
