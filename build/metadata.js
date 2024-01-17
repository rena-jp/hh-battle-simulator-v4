const packageJson = require('../package.json');

module.exports = `// ==UserScript==
// @name         Hentai Heroes Battle Simulator v4
// @namespace    https://github.com/rena-jp/${packageJson.name}
// @version      ${packageJson.version}
// @description  ${packageJson.description}
// @author       ${packageJson.author}
// @match        https://*.hentaiheroes.com/*
// @match        https://nutaku.haremheroes.com/*
// @match        https://*.gayharem.com/*
// @match        https://*.comixharem.com/*
// @match        https://*.hornyheroes.com/*
// @match        https://*.pornstarharem.com/*
// @match        https://*.transpornstarharem.com/*
// @match        https://*.gaypornstarharem.com/*
// @grant        none
// @run-at       document-body
// @updateURL    https://github.com/rena-jp/${packageJson.name}/raw/main/dist/${packageJson.name}.meta.js
// @downloadURL  https://github.com/rena-jp/${packageJson.name}/raw/main/dist/${packageJson.name}.user.js
// ==/UserScript==
`;
