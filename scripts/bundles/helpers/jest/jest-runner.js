const testing = require('./index.js');

const { getJestMajorVersion } = testing;
let jestVersion = getJestMajorVersion();
if (jestVersion < 27) {
  jestVersion = 27;
}

const createTestRunner = `createTestRunner${jestVersion}`;

module.exports = testing[createTestRunner]();
