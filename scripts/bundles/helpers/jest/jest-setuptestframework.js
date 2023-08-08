const jestVersion = 28;
const jestSetupTestFramework = `jestSetupTestFramework${jestVersion}`;

const testing = require('./index.js');

const setup = testing[jestSetupTestFramework];

setup();
