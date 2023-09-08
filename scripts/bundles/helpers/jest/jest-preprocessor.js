const testing = require('./index.js');

const jestVersion = testing['getJestMajorVersion']();
const jestSetupTestFramework = `jestPreprocessor${jestVersion}`;

module.exports = testing[jestSetupTestFramework];

