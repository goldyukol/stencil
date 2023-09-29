import type * as d from '@stencil/core/internal';

import { JestPreprocessor, JestPuppeteerEnvironment, JestTestRunner } from './jest-apis';

export abstract class JestAdapter {
  abstract getRunner(): (config: d.ValidatedConfig, e2eEnv: d.E2EProcessEnv) => Promise<boolean>;
  abstract getScreenshot(): (config: d.ValidatedConfig, e2eEnv: d.E2EProcessEnv) => Promise<boolean>;

  /**
   * Retrieve the default Jest runner name prescribed by Stencil
   * @returns the stringified name of the test runner, based on the currently detected version of Stencil
   */
  abstract getDefaultJestRunner(): string;

  getJestModuleNames = (): string[] => {
    return ['@types/jest', 'jest', 'jest-cli'];
  };

  abstract getCreateJestPuppeteerEnvironment(): () => JestPuppeteerEnvironment;

  abstract getJestPreprocessor(): JestPreprocessor;

  abstract getCreateJestTestRunner(): JestTestRunner;

  abstract getJestSetupTestFramework(): void;
}
