import { getHHPlusPlusConfig } from './hh-plus-plus';

const config = {
    addBattleSimulator: true,
    doSimulateTroll: true,
    doSimulateLeague: true,
    doSimulateSeason: true,
    doSimulatePantheon: true,
    doSimulateTeams: true,
    doSimulateEditTeam: true,
    doSimulateLeagueTable: true,
    doSimulateFoughtOpponents: true,
    replaceHHLeaguesPlusPlus: true,
    addBoosterSimulator: true,
    simulateGinseng: true,
    simulateJujubes: true,
    simulateChlorella: true,
    simulateCordyceps: true,
    addSkillSimulator: true,
    skillLevelsToBeSimulated: [5, 4, 3, 2, 1],
    calculateLeaguePointsTable: false,
};

type Config = typeof config;

export async function registerConfig() {
    const hhPlusPlusConfig = await getHHPlusPlusConfig();
    if (hhPlusPlusConfig == null) return;

    hhPlusPlusConfig.registerGroup({ key: 'sim-v4', name: 'Sim v4' });

    config.addBattleSimulator = false;
    config.doSimulateTroll = false;
    config.doSimulateLeague = false;
    config.doSimulateSeason = false;
    config.doSimulatePantheon = false;
    config.doSimulateTeams = false;
    config.doSimulateEditTeam = false;
    hhPlusPlusConfig.registerModule({
        group: 'sim-v4',
        configSchema: {
            baseKey: 'BattleSimulator',
            label: 'Battle Sim',
            default: true,
            subSettings: [
                { key: 'troll', default: true, label: 'Villain' },
                { key: 'league', default: true, label: 'League' },
                { key: 'season', default: true, label: 'Season' },
                { key: 'pantheon', default: true, label: 'Pantheon' },
                { key: 'teams', default: true, label: 'Team Selecting' },
                { key: 'editTeam', default: true, label: 'Team Editing' },
            ],
        },
        run(subSettings: any) {
            config.addBattleSimulator = true;
            config.doSimulateTroll = subSettings.troll;
            config.doSimulateLeague = subSettings.league;
            config.doSimulateSeason = subSettings.season;
            config.doSimulatePantheon = subSettings.pantheon;
            config.doSimulateTeams = subSettings.teams;
            config.doSimulateEditTeam = subSettings.editTeam;
        },
    });

    config.doSimulateLeagueTable = false;
    hhPlusPlusConfig.registerModule({
        group: 'sim-v4',
        configSchema: {
            baseKey: 'DoSimulateLeagueTable',
            label: 'Run simulations in the league table (maybe slow)',
            default: true,
            subSettings: [{ key: 'skip', default: false, label: 'Skip fought opponents' }],
        },
        run(subSettings: any) {
            config.doSimulateLeagueTable = true;
            config.doSimulateFoughtOpponents = !subSettings.skip;
        },
    });

    config.calculateLeaguePointsTable = false;
    hhPlusPlusConfig.registerModule({
        group: 'sim-v4',
        configSchema: {
            baseKey: 'CalculateLeaguePointsTable',
            label: 'Calculate each probability of league score (maybe slow)',
            default: false,
        },
        run() {
            config.calculateLeaguePointsTable = true;
        },
    });

    config.addBoosterSimulator = false;
    hhPlusPlusConfig.registerModule({
        group: 'sim-v4',
        configSchema: {
            baseKey: 'BoosterSimulator',
            label: 'Booster Sim',
            default: true,
            subSettings: [
                { key: 'ginseng', default: true, label: 'Ginseng' },
                { key: 'jujubes', default: false, label: 'Jujubes' },
                { key: 'chlorella', default: true, label: 'Chlorella' },
                { key: 'cordyceps', default: true, label: 'Cordyceps' },
            ],
        },
        run(subSettings: any) {
            config.addBoosterSimulator = true;
            config.simulateGinseng = subSettings.ginseng;
            config.simulateJujubes = subSettings.jujubes;
            config.simulateChlorella = subSettings.chlorella;
            config.simulateCordyceps = subSettings.cordyceps;
        },
    });

    config.addSkillSimulator = false;
    hhPlusPlusConfig.registerModule({
        group: 'sim-v4',
        configSchema: {
            baseKey: 'SkillSimulator',
            label: 'Skill Sim',
            default: false,
            subSettings: [
                { key: 'level5', default: true, label: 'Level 5' },
                { key: 'level4', default: true, label: 'Level 4' },
                { key: 'level3', default: false, label: 'Level 3' },
                { key: 'level2', default: false, label: 'Level 2' },
                { key: 'level1', default: false, label: 'Level 1' },
            ],
        },
        run(subSettings: any) {
            config.addSkillSimulator = true;
            config.skillLevelsToBeSimulated = [5, 4, 3, 2, 1].filter(e => subSettings['level' + e]);
        },
    });

    config.replaceHHLeaguesPlusPlus = false;
    hhPlusPlusConfig.registerModule({
        group: 'sim-v4',
        configSchema: {
            baseKey: 'ReplaceHHLeaguesPlusPlus',
            label: 'Replace HH Leagues++ sim',
            default: true,
        },
        run() {
            config.replaceHHLeaguesPlusPlus = true;
        },
    });

    hhPlusPlusConfig.loadConfig();
    hhPlusPlusConfig.runModules();
}

export function getConfig(): Config {
    return config;
}
