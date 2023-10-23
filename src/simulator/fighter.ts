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

    const getSkillPercentage = (id: number) =>
        girls.map(e => e.skills[id]?.skill.percentage_value ?? 0).reduce((p, c) => p + c, 0) / 100;

    const centerGirlSkills = girls[0]?.skills;
    const get5thSkillPercentageFromGirl = (skills: Record<number, Skill>, id: number) => {
        const skill = skills?.[id]?.skill;
        return skill == null ? 0 : (skill.percentage_value ?? parseFloat(skill.display_value_text ?? 0)) / 100;
    };
    const get5thSkillPercentage = (id: number) => get5thSkillPercentageFromGirl(centerGirlSkills, id);

    const ego = Math.ceil(fighter.remaining_ego);
    const stun = get5thSkillPercentage(11);
    const shield = get5thSkillPercentage(12);
    const reflect = get5thSkillPercentage(13);
    const execute = get5thSkillPercentage(14);
    const opponentExecute = get5thSkillPercentageFromGirl(opponent.team.girls[0]?.skills, 14);
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
