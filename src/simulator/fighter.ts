export function calcBattlerFromFighters(fighter: Fighter, opponent: Fighter | { team: Team; chance: number }) {
    const { team } = fighter;
    const { girls } = team;

    const synergyBonuses = Object.fromEntries(team.synergies.map(e => [e.element.type, e.bonus_multiplier]));

    let chance = (0.3 * fighter.chance) / (fighter.chance + opponent.chance);
    chance += synergyBonuses.stone;

    const chanceDominations = ['darkness', 'light', 'psychic'];
    const opponentTeamTheme = opponent.team.theme;
    team.theme_elements.forEach(e => {
        if (chanceDominations.includes(e.type) && opponentTeamTheme.includes(e.domination)) {
            chance += 0.2;
        }
    });

    const getSkillPercentage = (id: number) => {
        if(girls[0].skills !== undefined) {
            return girls.map(e => e.skills![id]?.skill.percentage_value ?? 0).reduce((p, c) => p + c, 0) / 100;
        } else {
            if(id === 10) {
                return 0;
            }
            if (id === 9) {
                return girls.map(e => e.skill_tiers_info[4]?.skill_points_used ? e.skill_tiers_info[4]?.skill_points_used * 0.2 : 0).reduce((p, c) => p + c, 0) / 100;
            }
        }
        return 0;
    }

    const get5thSkillPercentageFromGirl = (centeredGirl : Girl , id: number) => {
        if(centeredGirl.skills !== undefined) {
            const skill =centeredGirl.skills?.[id]?.skill;
            return skill == null ? 0 : (skill.percentage_value ?? parseFloat(skill.display_value_text ?? 0)) / 100;
        }
        const tier5  = centeredGirl.skill_tiers_info[5];
        if (tier5 == null) return 0;
        switch (centeredGirl.girl.element_data.type){
            case 'darkness':
            case 'sun':
                if (id === 11) return (1 + tier5.skill_points_used * 7) / 100;
                break;
            case 'light':
            case 'stone':
                if (id === 12) return (1 + tier5.skill_points_used * 8) / 100;
                break;
            case 'psychic':
            case 'nature':
                if (id === 13) return (1 +tier5.skill_points_used * 20) / 100;
                break;
            case 'water':
            case 'fire':
                if (id === 14) return (1 +tier5.skill_points_used * 6) / 100;
                break;
        }
        return 0;
        
    };
    const get5thSkillPercentage = (id: number) => get5thSkillPercentageFromGirl(girls[0], id);

    const ego = Math.ceil(fighter.remaining_ego);
    const stun = get5thSkillPercentage(11);
    const shield = get5thSkillPercentage(12);
    const reflect = get5thSkillPercentage(13);
    const execute = get5thSkillPercentage(14);
    const opponentExecute = get5thSkillPercentageFromGirl(opponent.team.girls[0], 14);
    return {
        attack: fighter.damage,
        defense: fighter.defense,
        ego,
        baseHitChance: 1 - chance,
        critHitChance: chance,
        critMultiplier: 2 + synergyBonuses.fire,
        healing: synergyBonuses.water,
        attackMultiplier: 1 + getSkillPercentage(9),
        defenseMultiplier: 1 + getSkillPercentage(10),
        stun,
        shield,
        reflect,
        execute,
        shieldEndurance: Math.ceil(ego * shield),
        deathThreshold: ego * opponentExecute,
    };
}

export function calcBattlersFromFighters(player: Fighter, opponent: Fighter) {
    return {
        player: calcBattlerFromFighters(player, opponent),
        opponent: calcBattlerFromFighters(opponent, player),
    };
}
