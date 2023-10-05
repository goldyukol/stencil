import { JestAdapter } from '../jest-adapter';
import { createJestPuppeteerEnvironment as createJestPuppeteerEnvironment27 } from './jest-environment';
import { jestPreprocessor as jestPreprocessor27 } from './jest-preprocessor';
import { preset as jestPreset27 } from './jest-preset';
import { createTestRunner as createTestRunner27 } from './jest-runner';
import { runJest as runJest27 } from './jest-runner';
import { runJestScreenshot as runJestScreenshot27 } from './jest-screenshot';
import { jestSetupTestFramework as jestSetupTestFramework27 } from './jest-setup-test-framework';

/**
 * Adapter between this directory's version of Jest and Stencil
 */
export class Jest27StencilAdapter extends JestAdapter {
  override getJestCliRunner() {
    return runJest27;
  }

  override getRunJestScreenshot() {
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

  override getJestPreset() {
    return jestPreset27;
  }
}
