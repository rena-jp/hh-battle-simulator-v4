import { toPercentage } from '../utils/string';
import { column, columns, row } from '../utils/table';

export function createBattleTable(player: Battler, opponent: Battler): string {
    const createTable = (attacker: any, defender: any) => {
        let attackerAttack = attacker.attack;
        let defenderDefense = defender.defense;
        const rows = [];
        for (let i = 0; i < 10; i++) {
            const baseDamage = Math.max(0, Math.floor(attackerAttack - defenderDefense));
            const columns = [];
            columns.push(baseDamage);
            columns.push(Math.ceil(baseDamage * attacker.healing));
            columns.push(Math.ceil(baseDamage * attacker.critMultiplier));
            columns.push(Math.ceil(baseDamage * attacker.critMultiplier * attacker.healing));
            rows.push(columns);
            attackerAttack *= attacker.attackMultiplier;
            defenderDefense *= attacker.defenseMultiplier;
        }
        return rows;
    };
    const playerTable = createTable(player, opponent);
    const opponentTable = createTable(opponent, player);
    const chanceRow = [player, opponent].flatMap(e => [e.baseHitChance, e.critHitChance]);

    return $('<table class="sim-table"></table>')
        .append(row(column(1, ''), columns(4, ['Player', 'Opponent'])))
        .append(row(column(1, ''), columns(2, ['Normal', 'Critical']).repeat(2)))
        .append(
            row(
                column(1, '%'),
                columns(
                    2,
                    chanceRow.map(e => toPercentage(e)),
                ),
            ),
        )
        .append(row(column(1, ''), columns(1, ['Damage', 'Healing']).repeat(4)))
        .append(
            [...Array<void>(9)]
                .map((_, i) => i + 1)
                .map(i =>
                    row(
                        column(1, i),
                        ...[playerTable, opponentTable].map(table =>
                            columns(
                                1,
                                table[i].map(e => e.toLocaleString()),
                            ),
                        ),
                    ),
                )
                .join(''),
        )
        .prop('outerHTML');
}
