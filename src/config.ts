import { afterGameInited, beforeGameInited } from './utils/async';

declare global {
    var hhPlusPlusConfig: any | undefined;
}

interface Config {
    doSimulateLeagueTable: boolean;
    doSimulateFoughtOpponents: boolean;
}

const config: Config = {
    doSimulateLeagueTable: true,
    doSimulateFoughtOpponents: true,
};

async function getHHPlusPlusConfig() {
    if (window.hhPlusPlusConfig != null) return window.hhPlusPlusConfig;
    await beforeGameInited();
    if (window.hhPlusPlusConfig != null) return window.hhPlusPlusConfig;
    await afterGameInited();
    if (window.hhPlusPlusConfig != null) return window.hhPlusPlusConfig;
    await new Promise($);
    return window.hhPlusPlusConfig;
}

async function registerConfig() {
    const hhPlusPlusConfig = await getHHPlusPlusConfig();
    if (hhPlusPlusConfig == null) return;

    hhPlusPlusConfig.registerGroup({ key: 'sim_v4', name: 'Sim v4' });
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

    config.doSimulateLeagueTable = false;

    hhPlusPlusConfig.loadConfig();
    hhPlusPlusConfig.runModules();
}

export function getConfig(): Config {
    return config;
}

registerConfig();
