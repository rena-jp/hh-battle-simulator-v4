import { FighterCaracs } from '../data/fighter';
import { calcBattlerFromFighters } from './fighter';

export function calcCounterBonus(fighterTeam: Team, opponentTeam: Team): number {
    const checklist = ['fire', 'nature', 'stone', 'sun', 'water'];
    let multiplier = 1;
    fighterTeam.theme_elements.forEach(e => {
        if (opponentTeam.theme.includes(e.domination) && checklist.includes(e.domination)) {
            multiplier += 0.1;
        }
    });
    return multiplier;
}

export function calcBattlerFromTeams(
    fighterTeam: Team,
    opponentTeam: Team,
    mythicBoosterMultiplier: number = 1,
    prestigeBonus?: FighterCaracs,
): Battler {
    const counterBonus = calcCounterBonus(fighterTeam, opponentTeam);
    const damageMultiplier = counterBonus * mythicBoosterMultiplier;
    const egoMultiplier = counterBonus;
    const opponentSynergyBonuses = Object.fromEntries(
        opponentTeam.synergies.map(e => [e.element.type, e.bonus_multiplier]),
    );
    const defenseDecreasing = opponentSynergyBonuses.sun;
    const caracs = fighterTeam.caracs;
    return calcBattlerFromFighters(
        {
            damage: Math.ceil(caracs.damage * damageMultiplier) * (prestigeBonus?.damage ?? 1),
            defense: (caracs.defense - Math.ceil(caracs.defense * defenseDecreasing)) * (prestigeBonus?.defense ?? 1),
            remaining_ego: Math.ceil(caracs.ego * egoMultiplier) * (prestigeBonus?.ego ?? 1),
            chance: caracs.chance,
            team: fighterTeam,
        },
        {
            chance: opponentTeam.caracs.chance,
            team: opponentTeam,
        },
    );
}

export function calcBattlersFromTeams(playerTeam: Team, opponentTeam: Team, mythicBoosterMultiplier: number = 1) {
    return {
        player: calcBattlerFromTeams(playerTeam, opponentTeam, mythicBoosterMultiplier),
        opponent: calcBattlerFromTeams(opponentTeam, playerTeam),
    };
}
