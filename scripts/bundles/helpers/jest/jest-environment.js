const testing = require('./index.js');

let jestVersion = testing['getJestMajorVersion']();
if (jestVersion < 27) {
  jestVersion = 27;
}const createJestPuppeteerEnvironment = `createJestPuppeteerEnvironment${jestVersion}`;

module.exports = testing[createJestPuppeteerEnvironment]();
