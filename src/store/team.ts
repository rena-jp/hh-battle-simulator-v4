import { FighterCaracs } from '../data/fighter';
import { getFromLocalStorage, setIntoLocalStorage } from '../utils/storage';

export interface OpponentTeamData {
    battleType: string;
    opponentId: string;
    team: Team;
}

export interface TeamParams {
    teamId: number;
    multiplier: FighterCaracs;
    addend: FighterCaracs;
}

interface TeamData {
    opponent: OpponentTeamData | null;
    league: Team;
    params: TeamParams[];
}

export function saveTeamData(teamData: Partial<TeamData>) {
    setIntoLocalStorage('HHBattleSimulator.TeamData', {
        opponent: teamData.opponent,
        league: teamData.league,
        params: teamData.params,
    });
}

export function loadTeamData(): Partial<TeamData> {
    return getFromLocalStorage('HHBattleSimulator.TeamData', {});
}

export function saveOpponentTeamData(opponentTeamData: OpponentTeamData | null) {
    const teamData = loadTeamData();
    teamData.opponent = opponentTeamData;
    saveTeamData(teamData);
}

export function loadOpponentTeamData(): OpponentTeamData | null {
    return loadTeamData().opponent ?? null;
}

export function savePlayerLeagueTeam(team: Team | null) {
    const teamData = loadTeamData();
    teamData.league = team ?? undefined;
    saveTeamData(teamData);
}

export function loadPlayerLeagueTeam(): Team | null {
    return loadTeamData().league ?? null;
}

export function saveTeamParams(teamParams: TeamParams) {
    const teamData = loadTeamData();
    teamData.params ??= [];
    teamData.params = [teamParams, ...teamData.params.filter(e => e.teamId !== teamParams.teamId)];
    saveTeamData(teamData);
}

export function loadTeamParams() {
    return loadTeamData().params ?? [];
}
