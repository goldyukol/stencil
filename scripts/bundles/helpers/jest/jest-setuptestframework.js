const testing = require('./index.js');

const { getJestMajorVersion } = testing;
let jestVersion = getJestMajorVersion();
if (jestVersion < 27) {
  jestVersion = 27;
}

const jestSetupTestFramework = `jestSetupTestFramework${jestVersion}`;

const setup = testing[jestSetupTestFramework];

setup();
