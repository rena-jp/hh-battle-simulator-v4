import { getHHPlusPlusConfig } from './hh-plus-plus';

const config = {
    doSimulateLeagueTable: true,
    doSimulateFoughtOpponents: true,
    replaceHHLeaguesPlusPlus: true,
    addBoosterSimulator: true,
    simulateGinseng: true,
    simulateJujubes: true,
    simulateChlorella: true,
    simulateCordyceps: true,
};

type Config = typeof config;

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

    hhPlusPlusConfig.loadConfig();
    hhPlusPlusConfig.runModules();
}

export function getConfig(): Config {
    return config;
}
