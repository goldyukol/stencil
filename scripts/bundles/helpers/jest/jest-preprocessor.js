const jestVersion = 27;
const jestSetupTestFramework = `jestPreprocessor${jestVersion}`;

const testing = require('./index.js');

module.exports = testing[jestSetupTestFramework];

