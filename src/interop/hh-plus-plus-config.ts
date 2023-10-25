import { getHHPlusPlusConfig } from './hh-plus-plus';

interface Config {
    doSimulateLeagueTable: boolean;
    doSimulateFoughtOpponents: boolean;
    replaceHHLeaguePlusPlus: boolean;
}

const config: Config = {
    doSimulateLeagueTable: true,
    doSimulateFoughtOpponents: true,
    replaceHHLeaguePlusPlus: true,
};

export async function registerConfig() {
    const hhPlusPlusConfig = await getHHPlusPlusConfig();
    if (hhPlusPlusConfig == null) return;

    hhPlusPlusConfig.registerGroup({ key: 'sim_v4', name: 'Sim v4' });

    config.doSimulateLeagueTable = false;
    hhPlusPlusConfig.registerModule({
        group: 'sim_v4',
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

    config.replaceHHLeaguePlusPlus = false;
    hhPlusPlusConfig.registerModule({
        group: 'sim_v4',
        configSchema: {
            baseKey: 'ReplaceHHLeaguesPlusPlus',
            label: 'Replace HH Leagues++ sim',
            default: true,
        },
        run() {
            config.replaceHHLeaguePlusPlus = true;
        },
    });

    hhPlusPlusConfig.loadConfig();
    hhPlusPlusConfig.runModules();
}

export function getConfig(): Config {
    return config;
}
