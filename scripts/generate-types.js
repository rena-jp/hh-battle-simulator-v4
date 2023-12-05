const fs = require('fs');
const { JSDOM, ResourceLoader } = require('jsdom');
const { quicktype, InputData, jsonInputForTargetLanguage } = require('quicktype-core');

const toPascalCase = str => {
    return str
        .split('-')
        .map(s => s.charAt(0).toUpperCase() + s.slice(1).toLowerCase())
        .join('');
};

const htmlDir = './html/';
const cache = {};
const loadFile = fileName => {
    cache[fileName] ??= fs.promises.readFile(htmlDir + fileName);
    return cache[fileName];
};

[
    ['troll-pre-battle', ['hero_data', 'opponent_fighter']],
    ['troll-battle', ['hero_fighter', 'opponent_fighter']],
    ['pantheon-pre-battle', ['hero_data', 'opponent_fighter']],
    ['leagues-pre-battle', ['hero_data', 'opponent_fighter']],
    ['league-battle', ['hero_fighter', 'opponent_fighter']],
    ['season-arena', ['hero_data', 'caracs_per_opponent', 'opponents']],
    ['edit-team', ['teamGirls', 'hero_data', 'hero_data', 'availableGirls', 'theme_resonance_bonuses', 'Hero']],
    ['shop', ['player_inventory', 'market_inventory', 'equipped_armor', 'equipped_booster', 'heroStatsPrices', 'Hero']],
    ['teams', ['teams_data']],
    ['tower-of-fame', ['opponents_list', 'Hero']],
].map(async ([pageName, variableNames]) => {
    const html = (await loadFile(`${pageName}.html`)).toString().replaceAll('src="//', 'src="https://');
    class CustomResourceLoader extends ResourceLoader {
        fetch(url) {
            if (url.includes('/default.js')) return loadFile('default.js');
            if (url.includes('/phoenix-tr_labels-en-')) return loadFile('phoenix-tr_labels-en-1609.js');
            if (url.includes('/jquery.min.js')) return loadFile('jquery-3.7.1.min.js');
            return null;
        }
    }
    const dom = new JSDOM(html, {
        runScripts: 'dangerously',
        resources: new CustomResourceLoader(),
        pretendToBeVisual: true,
        beforeParse: window => {
            window.addEventListener(
                'DOMContentLoaded',
                async event => {
                    event.stopImmediatePropagation();
                    event.preventDefault();

                    const globalObject = variableNames.reduce((o, key) => {
                        o[key] = dom.window[key];
                        return o;
                    }, {});
                    dom.window.close();

                    const jsonInput = jsonInputForTargetLanguage('typescript');
                    await jsonInput.addSource({
                        name: `${toPascalCase(pageName)}Global`,
                        samples: [JSON.stringify(globalObject)],
                    });
                    const inputData = new InputData();
                    inputData.addInput(jsonInput);

                    const result = await quicktype({
                        outputFilename: 'output',
                        inputData,
                        lang: 'typescript',
                        inferEnums: false,
                        inferUuids: false,
                        inferDateTimes: false,
                        inferIntegerStrings: false,
                        inferBooleanStrings: false,
                        combineClasses: false,
                        rendererOptions: {
                            'just-types': true,
                            'explicit-unions': false,
                            'prefer-unions': true,
                            'prefer-const-values': false,
                        },
                    });

                    await fs.promises.writeFile(`./src/page/types/${pageName}.ts`, result.lines.join('\n'));
                },
                true,
            );
            window.addEventListener(
                'error',
                event => {
                    event.stopImmediatePropagation();
                    event.preventDefault();
                },
                true,
            );
            [window, window.document].forEach(e => {
                Object.getPrototypeOf(e).addEventListener = () => {};
                e.addEventListener = () => {};
            });
        },
    });
});
