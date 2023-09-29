import { createJestPuppeteerEnvironment as createJestPuppeteerEnvironment27 } from './jest-environment';
import { jestPreprocessor as jestPreprocessor27 } from './jest-preprocessor';
import { createTestRunner as createTestRunner27 } from './jest-runner';
import { runJest as runJest27 } from './jest-runner';
import { runJestScreenshot as runJestScreenshot27 } from './jest-screenshot';
import { jestSetupTestFramework as jestSetupTestFramework27 } from './jest-setup-test-framework';

export abstract class JestFacade {
  static getRunner = (): any => {
    throw 'not implemented';
  };
  static getScreenshot = (): any => {
    throw 'not implemented';
  };

  /**
   * Retrieve the default Jest runner name prescribed by Stencil
   * @returns the stringified name of the test runner, based on the currently detected version of Stencil
   */
  static getDefaultJestRunner = (): string => {
    throw 'not implemented';
  };

  static getJestModuleNames = (): string[] => {
    return ['@types/jest', 'jest', 'jest-cli'];
  };

  static getCreateJestPuppeteerEnvironment = (): any => {
    throw 'not implemented';
  };

  static getJestPreprocessor() {
    throw 'not implemented';
  }

  static getCreateJestTestRunner() {
    throw 'not implemented';
  }

  static getJestSetupTestFramework() {
    throw 'not implemented';
  }
}

export class Jest27StencilAdapter extends JestFacade {
  static override getRunner() {
    return runJest27;
  }
  static override getScreenshot() {
    return runJestScreenshot27;
  }

  static override getDefaultJestRunner() {
    return 'jest-jasmine2';
  }

  static override getCreateJestPuppeteerEnvironment() {
    return createJestPuppeteerEnvironment27;
  }

  static override getJestPreprocessor() {
    return jestPreprocessor27;
  }

  static override getCreateJestTestRunner() {
    return createTestRunner27;
  }

  static override getJestSetupTestFramework() {
    return jestSetupTestFramework27;
  }
}
