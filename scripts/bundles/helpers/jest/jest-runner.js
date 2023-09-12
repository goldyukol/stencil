const testing = require('./index.js');

const jestVersion = testing['getJestMajorVersion']();
const createTestRunner = `createTestRunner${jestVersion}`;

module.exports = testing[createTestRunner]();
