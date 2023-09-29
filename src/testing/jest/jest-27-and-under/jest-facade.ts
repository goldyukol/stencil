import { createJestPuppeteerEnvironment as createJestPuppeteerEnvironment27 } from './jest-environment';
import { jestPreprocessor as jestPreprocessor27 } from './jest-preprocessor';
import { createTestRunner as createTestRunner27 } from './jest-runner';
import { runJest as runJest27 } from './jest-runner';
import { runJestScreenshot as runJestScreenshot27 } from './jest-screenshot';
import { jestSetupTestFramework as jestSetupTestFramework27 } from './jest-setup-test-framework';
import { JestFacade } from '../jest-base';

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
