import { FighterCaracs } from '../data/fighter';
import { getFromLocalStorage, setIntoLocalStorage } from '../utils/storage';

export interface OpponentTeamData {
    battleType: string;
    opponentId: string;
    team: Team;
    mojo?: number;
    currentMojo?: number;
}

const TeamParamsVersion = 2;
export interface TeamParams {
    teamId: number;
    addend1: FighterCaracs;
    multiplier1: FighterCaracs;
    addend2: FighterCaracs;
    multiplier2: FighterCaracs;
    caracs?: FighterCaracs;
    version?: number;
}

interface TeamData {
    opponent: OpponentTeamData | null;
    league: Team;
    params: TeamParams[];
}

function saveTeamData(teamData: Partial<TeamData>) {
    setIntoLocalStorage('HHBattleSimulator.TeamData', {
        opponent: teamData.opponent,
        league: teamData.league,
        params: teamData.params,
    });
}

function loadTeamData(): Partial<TeamData> {
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
    teamData.params = [
        { ...teamParams, version: TeamParamsVersion },
        ...teamData.params.filter(e => e.version === TeamParamsVersion).filter(e => e.teamId !== teamParams.teamId),
    ];
    saveTeamData(teamData);
}

export function loadTeamParams() {
    return (loadTeamData().params ?? []).filter(e => e.version === TeamParamsVersion);
}
