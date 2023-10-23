const fs = require('fs');
const metadata = require('../build/metadata.js');
const filename = metadata.match(/@updateURL.+?([^/]+\.meta\.js)/)[1];
fs.writeFileSync(`./dist/${filename}`, metadata);
