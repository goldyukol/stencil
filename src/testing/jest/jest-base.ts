import type * as d from '@stencil/core/internal';

import { JestPreprocessor, JestPuppeteerEnvironment, JestTestRunner } from './jest-apis';

/**
 * Base class for Jest-version specific code implementations that interact with Stencil.
 */
export abstract class JestAdapter {
  /**
   * Retrieve a function that invokes the Jest CLI.
   *
   * This function does not perform the invocation itself. Rather, it expects the caller to prepare a Stencil
   * configuration object and environment for tests to run and invoke the returned value itself.
   *
   * @returns A function that invokes the Jest CLI.
   */
  abstract getJestCliRunner(): (config: d.ValidatedConfig, e2eEnv: d.E2EProcessEnv) => Promise<boolean>;

  /**
   * Retrieve a function that invokes Stencil's Screenshot runner.
   *
   * This function does not perform the invocation itself. Rather, it expects the caller to prepare a Stencil
   * configuration object and environment for tests to run and invoke the returned value itself.
   *
   * @returns A function that invokes the Screenshot runner.
   */
  abstract getRunJestScreenshot(): (config: d.ValidatedConfig, e2eEnv: d.E2EProcessEnv) => Promise<boolean>;

  /**
   * Retrieve the default Jest runner name prescribed by Stencil.
   *
   * Examples of valid return values include 'jest-jasmine2' and 'jest-circus'
   *
   * @returns the stringified name of the test runner, based on the currently detected version of Stencil
   */
  abstract getDefaultJestRunner(): string;

  /**
   * Retrieve a list of node modules the Stencil expects to be installed when running tests
   *
   * @returns the list of expected modules
   */
  getJestModuleNames = (): string[] => {
    return ['@types/jest', 'jest', 'jest-cli'];
  };

  /**
   * Retrieve a function that builds a testing environment for Jest + Stencil.
   *
   * @returns A function that builds a testing environment.
   */
  abstract getCreateJestPuppeteerEnvironment(): () => JestPuppeteerEnvironment;

  /**
   * Create an object used to transform files as a part of running Jest.
   *
   * The object returned by this function is expected to conform to the interface/guide laid out by Jest for
   * [writing custom transformers](https://jestjs.io/docs/code-transformation#writing-custom-transformers).
   *
   * @returns the object used to transform files at test time
   */
  abstract getJestPreprocessor(): JestPreprocessor;

  /**
   * Retrieve a custom Stencil-Jest test runner
   * @returns the test runner
   */
  abstract getCreateJestTestRunner(): JestTestRunner;

  /**
   * Retrieve a function that returns the setup configuration code to run between tests.
   *
   * The value returned by said function is expected to be used in a
   * [setupFilesAfterEnv](https://jestjs.io/docs/configuration#setupfilesafterenv-array) context.
   *
   * @returns a function that runs a setup configuration between tests.
   */
  abstract getJestSetupTestFramework(): () => void;
}
