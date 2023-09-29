import type * as d from '@stencil/core/internal';
import {JestPreprocessor, JestPuppeteerEnvironment, JestTestRunner} from "./jest-version";

export abstract class JestAdapter {
  getRunner(): (config: d.ValidatedConfig, e2eEnv: d.E2EProcessEnv) => Promise<boolean> {
    throw new Error('TODO');
  }
  getScreenshot(): (config: d.ValidatedConfig, e2eEnv: d.E2EProcessEnv) => Promise<boolean> {
    throw new Error('TODO');
  }

  /**
   * Retrieve the default Jest runner name prescribed by Stencil
   * @returns the stringified name of the test runner, based on the currently detected version of Stencil
   */
  getDefaultJestRunner(): string {
    return 'jest-jasmine2';
  }

  getJestModuleNames = (): string[] => {
    return ['@types/jest', 'jest', 'jest-cli'];
  };

  getCreateJestPuppeteerEnvironment(): () => JestPuppeteerEnvironment {
    throw new Error('TODO');
  }

  getJestPreprocessor(): JestPreprocessor {
    throw new Error('TODO');
  }

  getCreateJestTestRunner(): JestTestRunner {
    throw new Error('TODO');
  }

  getJestSetupTestFramework():void {
    throw new Error('TODO');
  }
}
