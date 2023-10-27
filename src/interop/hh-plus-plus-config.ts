import { getHHPlusPlusConfig } from './hh-plus-plus';

interface Config {
    doSimulateLeagueTable: boolean;
    doSimulateFoughtOpponents: boolean;
    replaceHHLeaguesPlusPlus: boolean;
}

const config: Config = {
    doSimulateLeagueTable: true,
    doSimulateFoughtOpponents: true,
    replaceHHLeaguesPlusPlus: true,
};

export async function registerConfig() {
    const hhPlusPlusConfig = await getHHPlusPlusConfig();
    if (hhPlusPlusConfig == null) return;

    hhPlusPlusConfig.registerGroup({ key: 'sim-v4', name: 'Sim v4' });

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
