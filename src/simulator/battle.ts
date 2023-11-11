import { calcBattlerFromFighters } from './fighter';
import { calcBattlerFromTeams } from './team';

interface WorkerMessage {
    id: number;
    type: SimulationType;
    args: Battler[];
}

interface WorkerResult {
    id: number;
    ret?: any;
    error?: any;
}

const workerScript = (() => {
    const simulatorMap: Record<
        SimulationType,
        (player: Battler, opponent: Battler) => SimulationResult<SimulationType>
    > = {
        FastChance: simulateFastChance,
        FastPoints: simulateFastPoints,
        Chance: simulateChance,
        Points: simulatePoints,
        Standard: simulateStandard,
        Full: simulateFull,
    };

    self.addEventListener('message', e => {
        const { id, type, args } = e.data as WorkerMessage;
        try {
            const f = simulatorMap[type];
            const ret = f(args[0], args[1]);
            self.postMessage({ id, ret });
        } catch (error) {
            self.postMessage({ id, error });
        }
    });

    function simulateFastChance(player: Battler, opponent: Battler): FastChanceResult {
        const result = simulate<number>(player, opponent, createPlayerWinResult, createOpponentWinResult, mergeResult);
        return Math.max(0, Math.min(1, result));

        function createPlayerWinResult(playerEgo: number, playerMaxEgo: number) {
            return 1;
        }

        function createOpponentWinResult(opponentEgo: number, opponentMaxEgo: number) {
            return 0;
        }

        function mergeResult(xResult: FastChanceResult, xChance: number, yResult: FastChanceResult, yChance: number) {
            return xResult * xChance + yResult * yChance;
        }
    }

    function simulateFastPoints(player: Battler, opponent: Battler): FastPointsResult {
        const result = simulate<number>(player, opponent, createPlayerWinResult, createOpponentWinResult, mergeResult);
        return Math.max(3, Math.min(25, result));

        function createPlayerWinResult(playerEgo: number, playerMaxEgo: number) {
            return Math.ceil((10 * playerEgo) / playerMaxEgo) + 15;
        }

        function createOpponentWinResult(opponentEgo: number, opponentMaxEgo: number) {
            return Math.ceil((10 * (opponentMaxEgo - opponentEgo)) / opponentMaxEgo) + 3;
        }

        function mergeResult(xResult: number, xChance: number, yResult: number, yChance: number) {
            return xResult * xChance + yResult * yChance;
        }
    }

    function simulateChance(player: Battler, opponent: Battler): ChanceResult {
        const result = simulate<ChanceResult>(
            player,
            opponent,
            createPlayerWinResult,
            createOpponentWinResult,
            mergeResult,
        );
        result.chance = Math.max(0, Math.min(1, result.chance));
        return result;

        function createPlayerWinResult(playerEgo: number, playerMaxEgo: number) {
            return {
                chance: 1,
                alwaysWin: true,
                neverWin: false,
            };
        }

        function createOpponentWinResult(opponentEgo: number, opponentMaxEgo: number) {
            return {
                chance: 0,
                alwaysWin: false,
                neverWin: true,
            };
        }

        function mergeResult(xResult: ChanceResult, xChance: number, yResult: ChanceResult, yChance: number) {
            return {
                chance: xResult.chance * xChance + yResult.chance * yChance,
                alwaysWin: xResult.alwaysWin && yResult.alwaysWin,
                neverWin: xResult.neverWin && yResult.neverWin,
            };
        }
    }

    function simulatePoints(player: Battler, opponent: Battler): PointsResult {
        const result = simulate<PointsResult>(
            player,
            opponent,
            createPlayerWinResult,
            createOpponentWinResult,
            mergeResult,
        );
        result.avgPoints = Math.max(result.minPoints, Math.min(25, result.avgPoints));
        return result;

        function createPlayerWinResult(playerEgo: number, playerMaxEgo: number) {
            const points = Math.ceil((10 * playerEgo) / playerMaxEgo) + 15;
            return createResult(points);
        }

        function createOpponentWinResult(opponentEgo: number, opponentMaxEgo: number) {
            const points = Math.ceil((10 * (opponentMaxEgo - opponentEgo)) / opponentMaxEgo) + 3;
            return createResult(points);
        }

        function createResult(points: number) {
            return {
                avgPoints: points,
                minPoints: points,
            };
        }

        function mergeResult(xResult: PointsResult, xChance: number, yResult: PointsResult, yChance: number) {
            return {
                avgPoints: xResult.avgPoints * xChance + yResult.avgPoints * yChance,
                minPoints: Math.min(xResult.minPoints, yResult.minPoints),
            };
        }
    }

    function simulateStandard(player: Battler, opponent: Battler): StandardResult {
        const result = simulate<StandardResult>(
            player,
            opponent,
            createPlayerWinResult,
            createOpponentWinResult,
            mergeResult,
        );
        result.chance = Math.max(0, Math.min(1, result.chance));
        result.avgPoints = Math.max(result.minPoints, Math.min(result.maxPoints, result.avgPoints));
        return result;

        function createPlayerWinResult(playerEgo: number, playerMaxEgo: number) {
            const points = Math.ceil((10 * playerEgo) / playerMaxEgo) + 15;
            return createResult(1, true, false, points);
        }

        function createOpponentWinResult(opponentEgo: number, opponentMaxEgo: number) {
            const points = Math.ceil((10 * (opponentMaxEgo - opponentEgo)) / opponentMaxEgo) + 3;
            return createResult(0, false, true, points);
        }

        function createResult(chance: number, alwaysWin: boolean, neverWin: boolean, points: number) {
            return {
                chance,
                alwaysWin,
                neverWin,
                avgPoints: points,
                minPoints: points,
                maxPoints: points,
            };
        }

        function mergeResult(xResult: StandardResult, xChance: number, yResult: StandardResult, yChance: number) {
            return {
                chance: xResult.chance * xChance + yResult.chance * yChance,
                alwaysWin: xResult.alwaysWin && yResult.alwaysWin,
                neverWin: xResult.neverWin && yResult.neverWin,
                avgPoints: xResult.avgPoints * xChance + yResult.avgPoints * yChance,
                minPoints: Math.min(xResult.minPoints, yResult.minPoints),
                maxPoints: Math.max(xResult.maxPoints, yResult.maxPoints),
            };
        }
    }

    function simulateFull(player: Battler, opponent: Battler): FullResult {
        type CompressedResult = {
            minPoints: number;
            maxPoints: number;
            pointsTable: number[];
        };
        const compressedResult = simulate<CompressedResult>(
            player,
            opponent,
            createPlayerWinResult,
            createOpponentWinResult,
            mergeResult,
        );
        const sumProbability = compressedResult.pointsTable.reduce((p, c) => p + c);
        const pointsTable = [0, 0, 0, ...compressedResult.pointsTable.map(p => p / sumProbability)];
        const [loss, win] = [
            [3, 14],
            [15, 26],
        ].map(args => pointsTable.slice(...args).reduce((p, c) => p + c));
        const minPoints = compressedResult.minPoints + 3;
        const maxPoints = compressedResult.maxPoints + 3;
        const alwaysWin = minPoints >= 15;
        const neverWin = maxPoints < 15;
        const avgPoints = pointsTable.reduce((p, c, i) => p + c * i, 0);
        return {
            chance: win / (win + loss),
            alwaysWin,
            neverWin,
            avgPoints,
            minPoints,
            maxPoints,
            pointsTable,
        };

        function createPlayerWinResult(playerEgo: number, playerMaxEgo: number) {
            const points = Math.ceil((10 * playerEgo) / playerMaxEgo) + 12; // (-3): [15, 25] => [12, 22]
            return createResult(points);
        }

        function createOpponentWinResult(opponentEgo: number, opponentMaxEgo: number) {
            const points = Math.ceil((10 * (opponentMaxEgo - opponentEgo)) / opponentMaxEgo); // (-3): [3, 13] => [0, 10]
            return createResult(points);
        }

        function createResult(points: number) {
            const pointsTable = Array<number>(23).fill(0);
            pointsTable[points] = 1;
            return {
                minPoints: points,
                maxPoints: points,
                pointsTable,
            };
        }

        function mergeResult(xResult: CompressedResult, xChance: number, yResult: CompressedResult, yChance: number) {
            const minPoints = Math.min(xResult.minPoints, yResult.minPoints);
            const maxPoints = Math.max(xResult.maxPoints, yResult.maxPoints);
            const xPointsTable = xResult.pointsTable;
            const yPointsTable = yResult.pointsTable;
            const pointsTable = Array<number>(23).fill(0);
            for (let i = minPoints; i <= maxPoints; i++) {
                pointsTable[i] = xPointsTable[i] * xChance + yPointsTable[i] * yChance;
            }
            return {
                minPoints,
                maxPoints,
                pointsTable,
            };
        }
    }

    function simulate<T>(
        player: Battler,
        opponent: Battler,
        createPlayerWinResult: (playerEgo: number, playerMaxEgo: number) => T,
        createOpponentWinResult: (opponentEgo: number, opponentMaxEgo: number) => T,
        mergeResult: (xResult: T, xChance: number, yResult: T, yChance: number) => T,
    ): T {
        type BattleData = {
            ego: number;
            healing: number;
            baseHitChance: number;
            critHitChance: number;
            critMultiplier: number;
            attackMultiplier: number;
            defenseMultiplier: number;
            shield: number;
            stun: number;
            execute: number;
            reflect: number;
            shieldEndurance: number;
            deathThreshold: number;
            win(ego: number, maxEgo: number): T;
        };
        const playerData = { ...player, win: createPlayerWinResult };
        const opponentData = { ...opponent, win: createOpponentWinResult };
        const result = attack(
            playerData,
            player.ego,
            player.attack,
            player.defense,
            0,
            opponentData,
            opponent.ego,
            opponent.attack,
            opponent.defense,
            0,
        );
        return result;

        function attack(
            attacker: BattleData,
            attackerEgo: number,
            attackerAttack: number,
            attackerDefense: number,
            attackerSkill: number,
            defender: BattleData,
            defenderEgo: number,
            defenderAttack: number,
            defenderDefense: number,
            defenderSkill: number,
        ): T {
            attackerAttack *= attacker.attackMultiplier;
            defenderDefense *= attacker.defenseMultiplier;
            const baseDamage = Math.max(0, Math.floor(attackerAttack - defenderDefense));
            const baseResult = hit(
                attacker,
                attackerEgo,
                attackerAttack,
                attackerDefense,
                attackerSkill,
                defender,
                defenderEgo,
                defenderAttack,
                defenderDefense,
                defenderSkill,
                baseDamage,
            );
            const critDamage = baseDamage * attacker.critMultiplier;
            const critResult = hit(
                attacker,
                attackerEgo,
                attackerAttack,
                attackerDefense,
                attackerSkill,
                defender,
                defenderEgo,
                defenderAttack,
                defenderDefense,
                defenderSkill,
                critDamage,
            );
            return mergeResult(baseResult, attacker.baseHitChance, critResult, attacker.critHitChance);
        }

        function hit(
            attacker: BattleData,
            attackerEgo: number,
            attackerAttack: number,
            attackerDefense: number,
            attackerSkill: number,
            defender: BattleData,
            defenderEgo: number,
            defenderAttack: number,
            defenderDefense: number,
            defenderSkill: number,
            damage: number,
        ): T {
            const roundedDamage = Math.ceil(damage);

            // Check defender shield
            let shieldDamage = 0;
            if (defender.shield && 1 <= defenderSkill && defenderSkill <= defender.shieldEndurance) {
                const remainingShieald = defender.shieldEndurance - (defenderSkill - 1);
                shieldDamage = Math.min(roundedDamage, remainingShieald);
                defenderSkill += shieldDamage;
            }

            // Damage defender ego
            const egoDamage = roundedDamage - shieldDamage;
            defenderEgo -= Math.ceil(egoDamage);

            // Heal attacker ego
            attackerEgo += Math.ceil(egoDamage * attacker.healing);
            attackerEgo = Math.min(attackerEgo, attacker.ego);

            // Check attacker execution
            // Shield will have no effect on execution.
            if (attacker.execute && defenderEgo <= defender.deathThreshold) {
                defenderEgo = 0;
            }

            // Check defender reflection
            if (defender.reflect && 1 <= defenderSkill && defenderSkill <= 2) {
                // Skip reflection while stunned
                const isDefenderStunned = attacker.stun && attackerSkill == 1;
                if (!isDefenderStunned) {
                    defenderSkill++;

                    // Defender does not have shield and reflect at the same time, so shieldDamage is not required.
                    // Reflected damage daes not include execution damage now.
                    const reflectedDamage = Math.ceil(egoDamage * defender.reflect);

                    // Check attacker shield
                    let reflectedDamageToShield = 0;
                    if (attacker.shield && 1 <= attackerSkill && attackerSkill <= attacker.shieldEndurance) {
                        const remainingAttackerShieald = attacker.shieldEndurance - (attackerSkill - 1);
                        reflectedDamageToShield = Math.min(reflectedDamage, remainingAttackerShieald);
                        attackerSkill += reflectedDamageToShield;
                    }

                    // Damage attacker ego from reflection
                    const reflectedDamageToEgo = reflectedDamage - reflectedDamageToShield;
                    attackerEgo -= reflectedDamageToEgo;
                    if (attackerEgo <= 0) {
                        // TODO: I suspect the game do nothing.
                    }
                }
            }

            // Attacker win
            if (defenderEgo <= 0) return attacker.win(attackerEgo, attacker.ego);

            // Check if attacker stun triggerd (defender is stunned)
            if (attacker.stun && attackerSkill === 1) {
                attackerSkill++;
                // Skip defender attack
                return attack(
                    attacker,
                    attackerEgo,
                    attackerAttack,
                    attackerDefense,
                    attackerSkill,
                    defender,
                    defenderEgo,
                    defenderAttack,
                    defenderDefense,
                    defenderSkill,
                );
            }

            // Trigger attacker reflect
            if (attacker.reflect && attackerSkill === 0) attackerSkill = 1;

            // Trigger attacker shield
            if (attacker.shield && attackerSkill === 0) attackerSkill = 1;

            // Next turn (defender's attack)
            const result = attack(
                defender,
                defenderEgo,
                defenderAttack,
                defenderDefense,
                defenderSkill,
                attacker,
                attackerEgo,
                attackerAttack,
                attackerDefense,
                attackerSkill,
            );

            // Check attacker stun
            if (attacker.stun && attackerSkill === 0) {
                attackerSkill = 1;
                const stunningResult = attack(
                    attacker,
                    attackerEgo,
                    attackerAttack,
                    attackerDefense,
                    attackerSkill,
                    defender,
                    defenderEgo,
                    defenderAttack,
                    defenderDefense,
                    defenderSkill,
                );
                return mergeResult(stunningResult, attacker.stun, result, 1 - attacker.stun);
            }

            return result;
        }
    }
})
    .toString()
    .match(/{.+}/s)![0];

const workerBlob = new Blob([workerScript], { type: 'text/javascript' });
const workerURL = URL.createObjectURL(workerBlob);
const maxWorkers = navigator?.hardwareConcurrency ?? 1;
const workerList: Worker[] = [];
const waiterMap = new Map();
let workerIndex = 0;
let workerTaskIndex = 0;

function getWorker() {
    let worker = workerList[workerIndex];
    if (worker == null) {
        worker = new Worker(workerURL);
        const onMessage = ({ data }: MessageEvent) => {
            const { id, ret, error } = data as WorkerResult;
            if (ret != null) {
                waiterMap.get(id).resolve(ret);
            } else {
                waiterMap.get(id).reject(error);
            }
            waiterMap.delete(id);
        };
        const onError = (error: any) => {
            throw error;
        };
        worker.addEventListener('message', onMessage);
        worker.addEventListener('messageerror', onError);
        worker.addEventListener('error', onError);
        workerList[workerIndex] = worker;
    }
    workerIndex = (workerIndex + 1) % maxWorkers;
    return worker;
}

async function workerRun(type: SimulationType, args: Battler[]): Promise<any> {
    const id = workerTaskIndex++;
    const message: WorkerMessage = { id, type, args };
    getWorker().postMessage(message);
    return new Promise((resolve, reject) => {
        waiterMap.set(id, { resolve, reject });
    });
}

export async function simulateFromBattlers<T extends SimulationType>(
    type: T,
    player: Battler,
    opponent: Battler,
): Promise<SimulationResult<T>> {
    return await workerRun(type, [player, opponent]);
}

export async function simulateFromFighters<T extends SimulationType>(
    type: T,
    playerFighter: Fighter,
    opponentFighter: Fighter,
): Promise<SimulationResult<T>> {
    const player = calcBattlerFromFighters(playerFighter, opponentFighter);
    const opponent = calcBattlerFromFighters(opponentFighter, playerFighter);
    return await simulateFromBattlers(type, player, opponent);
}

export async function simulateFromTeams<T extends SimulationType>(
    type: T,
    playerTeam: Team,
    opponentTeam: Team,
    mythicBoosterMultiplier: number = 1,
): Promise<SimulationResult<T>> {
    const player = calcBattlerFromTeams(playerTeam, opponentTeam, mythicBoosterMultiplier);
    const opponent = calcBattlerFromTeams(opponentTeam, playerTeam);
    return await simulateFromBattlers(type, player, opponent);
}
