const testing = require('./index.js');

const jestVersion = testing['getJestMajorVersion']();
const createJestPuppeteerEnvironment = `createJestPuppeteerEnvironment${jestVersion}`;

module.exports = testing[createJestPuppeteerEnvironment]();

