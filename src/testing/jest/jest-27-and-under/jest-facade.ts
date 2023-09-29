import { JestAdapter } from '../jest-base';
import { createJestPuppeteerEnvironment as createJestPuppeteerEnvironment27 } from './jest-environment';
import { jestPreprocessor as jestPreprocessor27 } from './jest-preprocessor';
import { createTestRunner as createTestRunner27 } from './jest-runner';
import { runJest as runJest27 } from './jest-runner';
import { runJestScreenshot as runJestScreenshot27 } from './jest-screenshot';
import { jestSetupTestFramework as jestSetupTestFramework27 } from './jest-setup-test-framework';

export class Jest27StencilAdapter extends JestAdapter {
  override getRunner() {
    return runJest27;
  }
  override getScreenshot() {
    return runJestScreenshot27;
  }

  override getDefaultJestRunner() {
    return 'jest-jasmine2';
  }

  override getCreateJestPuppeteerEnvironment() {
    return createJestPuppeteerEnvironment27;
  }

  override getJestPreprocessor() {
    return jestPreprocessor27;
  }

  override getCreateJestTestRunner() {
    return createTestRunner27;
  }

  override getJestSetupTestFramework() {
    return jestSetupTestFramework27;
  }
}
