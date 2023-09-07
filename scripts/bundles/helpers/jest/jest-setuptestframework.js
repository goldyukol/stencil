const jestVersion = 27;
const jestSetupTestFramework = `jestSetupTestFramework${jestVersion}`;

const testing = require('./index.js');

const setup = testing[jestSetupTestFramework];

setup();
