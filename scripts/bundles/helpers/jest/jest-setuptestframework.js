const testing = require('./index.js');

let jestVersion = testing['getJestMajorVersion']();
if (jestVersion < 27) {
  jestVersion = 27;
}const jestSetupTestFramework = `jestSetupTestFramework${jestVersion}`;

const setup = testing[jestSetupTestFramework];

setup();
