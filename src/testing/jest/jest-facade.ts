import semverMajor from 'semver/functions/major';

import { getJestMajorVersion } from './jest-version';
import { createJestPuppeteerEnvironment as createJestPuppeteerEnvironment27 } from './jest-27-and-under/jest-environment';
import { jestPreprocessor as jestPreprocessor27 } from './jest-27-and-under/jest-preprocessor';
import { createTestRunner as createTestRunner27 } from './jest-27-and-under/jest-runner';
import { jestSetupTestFramework as jestSetupTestFramework27 } from './jest-27-and-under/jest-setup-test-framework';

/**
 * Retrieve the numeric representation of the major version of Jest being used.
 *
 * If a user has Jest v27.1.0 installed, `27` will be returned.
 *
 * @returns the major version of Jest detected
 */
export const getVersion = (): number => {
  return semverMajor(getJestMajorVersion());
};

/**
 * Retrieve the default Jest runner name prescribed by Stencil
 * @returns the stringified name of the test runner, based on the currently detected version of Stencil
 */
export const getDefaultJestRunner = (): string => {
  switch (getVersion()) {
    case 24:
    case 25:
    case 26:
    case 27:
      return 'jest-jasmine2';
    case 28:
    case 29:
    default:
      // in Stencil 4.X, defaulting to jest-jasmine2 is the default behavior.
      // when Jest 28+ is supported, this will likely change.
      // we default here instead of throwing an error
      return 'jest-jasmine2';
  }
};

/**
 * Retrieve the Stencil-Jest test runner based on the version of Jest that's installed.
 *
 * @returns a test runner for Stencil tests, based on the version of Jest that's detected
 */
export const getRunner = async () => {
  switch (getVersion()) {
    case 24:
    case 25:
    case 26:
    case 27:
      return await import('./jest-27-and-under/jest-runner');
    case 28:
    case 29:
    default:
      // in Stencil 4.X, defaulting to v27 and under is the default behavior.
      // when Jest 28+ is supported, this will likely change.
      // we default here instead of throwing an error
      return await import('./jest-27-and-under/jest-runner');
  }
};

/**
 * Retrieve a list of modules that are expected to be installed when a user runs `stencil test`.
 *
 * @returns a Jest version-specific expected list of modules that should be installed
 */
export const getJestModuleNames = (): string[] => {
  switch (getVersion()) {
    case 24:
    case 25:
    case 26:
    case 27:
    case 28:
    case 29:
    default:
      return ['@types/jest', 'jest', 'jest-cli'];
  }
};

/**
 * Retrieve the Stencil-Jest screenshot adapter based on the version of Jest that's installed.
 *
 * @returns a screenshot adapter for Stencil tests, based on the version of Jest that's detected
 */
export const getScreenshot = async () => {
  switch (getVersion()) {
    case 24:
    case 25:
    case 26:
    case 27:
      return await import('./jest-27-and-under/jest-screenshot');
    case 28:
    case 29:
    default:
      // in Stencil 4.X, defaulting to v27 and under is the default behavior.
      // when Jest 28+ is supported, this will likely change.
      // we default here instead of throwing an error
      return await import('./jest-27-and-under/jest-screenshot');
  }
};

/**
 * Retrieve the Jest-Puppeteer Environment, based on the version of Jest that is installed
 * @returns a function capable of creating a Jest environment
 */
export const getCreateJestPuppeteerEnvironment = (): typeof createJestPuppeteerEnvironment27 => {
  switch (getVersion()) {
    case 24:
    case 25:
    case 26:
    case 27:
      return createJestPuppeteerEnvironment27;
    case 28:
    case 29:
    default:
      // in Stencil 4.X, defaulting to v27 and under is the default behavior.
      // when Jest 28+ is supported, this will likely change.
      // we default here instead of throwing an error
      return createJestPuppeteerEnvironment27;
  }
};

/**
 * Retrieve the Jest preprocessor, based on the version of Jest that is installed
 * @returns a Jest preprocessor
 */
export const getJestPreprocessor = (): typeof jestPreprocessor27 => {
  switch (getVersion()) {
    case 24:
    case 25:
    case 26:
    case 27:
      return jestPreprocessor27;
    case 28:
    case 29:
    default:
      // in Stencil 4.X, defaulting to v27 and under is the default behavior.
      // when Jest 28+ is supported, this will likely change.
      // we default here instead of throwing an error
      return jestPreprocessor27;
  }
};

/**
 * Retrieve the Jest-Runner, based on the version of Jest that is installed
 * @returns a function capable of creating a Jest test runner
 */
export const getCreateJestTestRunner = (): typeof createTestRunner27 => {
  switch (getVersion()) {
    case 24:
    case 25:
    case 26:
    case 27:
      return createTestRunner27;
    case 28:
    case 29:
    default:
      // in Stencil 4.X, defaulting to v27 and under is the default behavior.
      // when Jest 28+ is supported, this will likely change.
      // we default here instead of throwing an error
      return createTestRunner27;
  }
};

/**
 * Retrieve the Jest-setup function, based on the version of Jest that is installed
 * @returns a function capable of setting up Jest
 */
export const getJestSetupTestFramework = (): typeof jestSetupTestFramework27 => {
  switch (getVersion()) {
    case 24:
    case 25:
    case 26:
    case 27:
      return jestSetupTestFramework27;
    case 28:
    case 29:
    default:
      // in Stencil 4.X, defaulting to v27 and under is the default behavior.
      // when Jest 28+ is supported, this will likely change.
      // we default here instead of throwing an error
      return jestSetupTestFramework27;
  }
};
