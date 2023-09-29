const { getCreateJestTestRunner } = require('./index.js');
const testRunner = getCreateJestTestRunner();
module.exports = testRunner();
