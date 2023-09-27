const testing = require('./index.js');

const jestVersion = testing['getJestMajorVersion']();
const jestSetupTestFramework = `jestSetupTestFramework${jestVersion}`;

const setup = testing[jestSetupTestFramework];

setup();
