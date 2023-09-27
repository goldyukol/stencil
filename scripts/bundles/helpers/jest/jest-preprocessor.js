const testing = require('./index.js');

let jestVersion = testing['getJestMajorVersion']();
if (jestVersion < 27) {
  jestVersion = 27;
}
const jestSetupTestFramework = `jestPreprocessor${jestVersion}`;

module.exports = testing[jestSetupTestFramework];
