const { getCreateJestPuppeteerEnvironment } = require('./index.js');
const createJestEnvironment = getCreateJestPuppeteerEnvironment();
module.exports = createJestEnvironment();
