import semverMajor from 'semver/functions/major';

import { Jest27StencilAdapter, JestFacade } from './jest-27-and-under/jest-facade';
import { getJestMajorVersion } from './jest-version';

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
  const version = getVersion();
  if (version <= 27) {
    return Jest27StencilAdapter.getDefaultJestRunner();
  } else {
    // in Stencil 4.X, defaulting to jest-jasmine2 is the default behavior.
    // when Jest 28+ is supported, this will likely change.
    // we default here instead of throwing an error
    return Jest27StencilAdapter.getDefaultJestRunner();
  }
};

/**
 * Retrieve the Stencil-Jest test runner based on the version of Jest that's installed.
 *
 * @returns a test runner for Stencil tests, based on the version of Jest that's detected
 */
export const getRunner = () => {
  const version = getVersion();
  if (version <= 27) {
    return Jest27StencilAdapter.getRunner();
  } else {
    // in Stencil 4.X, defaulting to v27 and under is the default behavior.
    // when Jest 28+ is supported, this will likely change.
    // we default here instead of throwing an error
    return Jest27StencilAdapter.getRunner();
  }
};

/**
 * Retrieve a list of modules that are expected to be installed when a user runs `stencil test`.
 *
 * @returns a Jest version-specific expected list of modules that should be installed
 */
export const getJestModuleNames = (): string[] => {
    return JestFacade.getJestModuleNames();
};

/**
 * Retrieve the Stencil-Jest screenshot adapter based on the version of Jest that's installed.
 *
 * @returns a screenshot adapter for Stencil tests, based on the version of Jest that's detected
 */
export const getScreenshot = () => {
  const version = getVersion();
  if (version <= 27) {
    return Jest27StencilAdapter.getScreenshot();
  } else {
    // in Stencil 4.X, defaulting to v27 and under is the default behavior.
    // when Jest 28+ is supported, this will likely change.
    // we default here instead of throwing an error
    return Jest27StencilAdapter.getScreenshot();
  }
};

/**
 * Retrieve the Jest-Puppeteer Environment, based on the version of Jest that is installed
 * @returns a function capable of creating a Jest environment
 */
export const getCreateJestPuppeteerEnvironment = () => {
  const version = getVersion();
  if (version <= 27) {
    return Jest27StencilAdapter.getCreateJestPuppeteerEnvironment();
  } else {// in Stencil 4.X, defaulting to v27 and under is the default behavior.
    // when Jest 28+ is supported, this will likely change.
    // we default here instead of throwing an error
    return Jest27StencilAdapter.getCreateJestPuppeteerEnvironment();
  }
};

/**
 * Retrieve the Jest preprocessor, based on the version of Jest that is installed
 * @returns a Jest preprocessor
 */
export const getJestPreprocessor = () => {
  const version = getVersion();
  if (version <= 27) {
    return Jest27StencilAdapter.getJestPreprocessor();
  } else {// in Stencil 4.X, defaulting to v27 and under is the default behavior.
    // when Jest 28+ is supported, this will likely change.
    // we default here instead of throwing an error
    return Jest27StencilAdapter.getJestPreprocessor();
  }
};

/**
 * Retrieve the Jest-Runner, based on the version of Jest that is installed
 * @returns a function capable of creating a Jest test runner
 */
export const getCreateJestTestRunner = () => {
  const version = getVersion();
  if (version <= 27) {
    return Jest27StencilAdapter.getCreateJestTestRunner();
  } else {// in Stencil 4.X, defaulting to v27 and under is the default behavior.
    // when Jest 28+ is supported, this will likely change.
    // we default here instead of throwing an error
    return Jest27StencilAdapter.getCreateJestTestRunner();
  }
};

/**
 * Retrieve the Jest-setup function, based on the version of Jest that is installed
 * @returns a function capable of setting up Jest
 */
export const getJestSetupTestFramework = () => {
  const version = getVersion();
  if (version <= 27) {
    return Jest27StencilAdapter.getJestSetupTestFramework();
  } else {// in Stencil 4.X, defaulting to v27 and under is the default behavior.
    // when Jest 28+ is supported, this will likely change.
    // we default here instead of throwing an error
    return Jest27StencilAdapter.getJestSetupTestFramework();
  }
};
