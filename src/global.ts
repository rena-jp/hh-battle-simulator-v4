import { simulateFromFighters, simulateFromTeams } from './simulator/battle';

window.HHBattleSimulator = {
    /**
     * @param {any} playerFighter - hero_data
     * @param {any} opponentFighter - opponent_fighter.player
     * @returns {Promise<{ chance: number, alwaysWin: boolean, neverWin: boolean, avgPoints: number, minPoints: number, maxPoints: number }>} - Player's winning chance and league points
     */
    async simulateFromFighters(
        playerFighter: any,
        opponentFighter: any,
    ): Promise<{
        chance: number;
        alwaysWin: boolean;
        neverWin: boolean;
        avgPoints: number;
        minPoints: number;
        maxPoints: number;
    }> {
        return await simulateFromFighters('Standard', playerFighter, opponentFighter);
    },
    /**
     * @param {SimulationType} simType - 'FastChance' | 'FastPoints' | 'Chance' | 'Points' | 'Standard' | 'Full'
     * @param {any} playerFighter - hero_data
     * @param {any} opponentFighter - opponent_fighter.player
     * @returns {Promise<SimulationResult<T>>} - results
     */
    async simulateFromFightersEx<T extends SimulationType>(
        simType: T,
        playerFighter: any,
        opponentFighter: any,
    ): Promise<SimulationResult<T>> {
        return await simulateFromFighters(simType, playerFighter, opponentFighter);
    },
    /**
     * @param {any} playerTeam - hero_data.team
     * @param {any} opponentTeam - opponent_fighter.player.team
     * @param {number} mythicBoosterMultiplier - Default: 1, AME/LME/SME: 1.15, Headband: 1.25
     * @returns {Promise<{ chance: number, alwaysWin: boolean, neverWin: boolean, avgPoints: number, minPoints: number, maxPoints: number }>} - Player's winning chance and league points
     */
    async simulateFromTeams(
        playerTeam: any,
        opponentTeam: any,
        mythicBoosterMultiplier: number = 1,
    ): Promise<{
        chance: number;
        alwaysWin: boolean;
        neverWin: boolean;
        avgPoints: number;
        minPoints: number;
        maxPoints: number;
    }> {
        return await simulateFromTeams('Standard', playerTeam, opponentTeam, mythicBoosterMultiplier);
    },
    /**
     * @param {SimulationType} simType - 'FastChance' | 'FastPoints' | 'Chance' | 'Points' | 'Standard' | 'Full'
     * @param {any} playerTeam - hero_data.team
     * @param {any} opponentTeam - opponent_fighter.player.team
     * @param {number} mythicBoosterMultiplier - Default: 1, AME/LME/SME: 1.15, Headband: 1.25
     * @returns {Promise<SimulationResult<T>>} - results
     */
    async simulateFromTeamsEx<T extends SimulationType>(
        simType: T,
        playerTeam: any,
        opponentTeam: any,
        mythicBoosterMultiplier: number = 1,
    ): Promise<SimulationResult<T>> {
        return await simulateFromTeams(simType, playerTeam, opponentTeam, mythicBoosterMultiplier);
    },
};
