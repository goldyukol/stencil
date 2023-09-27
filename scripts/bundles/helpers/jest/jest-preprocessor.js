const testing = require('./index.js');

const { getJestMajorVersion } = testing;
let jestVersion = getJestMajorVersion();
if (jestVersion < 27) {
  jestVersion = 27;
}

const jestSetupTestFramework = `jestPreprocessor${jestVersion}`;

module.exports = testing[jestSetupTestFramework];
