/*!
 * This file acts as the connector/bridge between Stencil and Jest.
 *
 * It defines/caches a `JestAdapter` instance to dispatch Jest-related configuration calls to the correct section of the
 * Stencil codebase.
 *
 * It contains the APIs that are designed to be used by the Jest pre-configurations supplied by Stencil.
 */

import semverMajor from 'semver/functions/major';

import { Jest27StencilAdapter } from './jest-27-and-under/jest-facade';
import { JestAdapter } from './jest-adapter';
import { getJestMajorVersion } from './jest-apis';

/**
 * Store a reference to the Jest version-specific adapter used to get pieces of testing infrastructure
 */
let JEST_ADAPTER: JestAdapter | null = null;

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
 * Retrieve the cached local variable containing a Jest adapter, based on the version of Jest detected.
 * If no Jest adapter is cached, set it.
 *
 * @returns the cached Jest adapter.
 */
const getJestAdapter = (): JestAdapter => {
  if (!JEST_ADAPTER) {
    const version = getVersion();
    if (version <= 27) {
      JEST_ADAPTER = new Jest27StencilAdapter();
    } else {
      // in Stencil 4.X, defaulting to jest 27 infrastructure is the default behavior.
      // when Jest 28+ is supported, this will likely change.
      JEST_ADAPTER = new Jest27StencilAdapter();
    }
  }

  return JEST_ADAPTER;
};

/**
 * Retrieve the default Jest runner name prescribed by Stencil
 *
 * @returns the stringified name of the test runner, based on the currently detected version of Stencil
 */
export const getDefaultJestRunner = (): string => {
  return getJestAdapter().getDefaultJestRunner();
};

/**
 * Retrieve the Stencil-Jest test runner based on the version of Jest that's installed.
 *
 * @returns a test runner for Stencil tests, based on the version of Jest that's detected
 */
export const getRunner = () => {
  return getJestAdapter().getJestCliRunner();
};

/**
 * Retrieve the Stencil-Jest screenshot adapter based on the version of Jest that's installed.
 *
 * @returns a screenshot adapter for Stencil tests, based on the version of Jest that's detected
 */
export const getScreenshot = () => {
  return getJestAdapter().getRunJestScreenshot();
};

/**
 * Retrieve the Jest-Puppeteer Environment, based on the version of Jest that is installed
 *
 * @returns a function capable of creating a Jest-Puppeteer environment
 */
export const getCreateJestPuppeteerEnvironment = () => {
  return getJestAdapter().getCreateJestPuppeteerEnvironment();
};

/**
 * Retrieve the Jest preprocessor, based on the version of Jest that is installed
 *
 * @returns a Jest preprocessor to transform code at test time
 */
export const getJestPreprocessor = () => {
  return getJestAdapter().getJestPreprocessor();
};

/**
 * Retrieve the Jest-Runner, based on the version of Jest that is installed
 *
 * @returns a function capable of creating a Jest test runner
 */
export const getCreateJestTestRunner = () => {
  return getJestAdapter().getCreateJestTestRunner();
};

/**
 * Retrieve the Jest-setup function, based on the version of Jest that is installed
 *
 * @returns a function capable of setting up Jest
 */
export const getJestSetupTestFramework = () => {
  return getJestAdapter().getJestSetupTestFramework();
};
