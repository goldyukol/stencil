export abstract class JestFacade {
  getRunner(): (_: any, _1: any) => Promise<boolean> {
    throw new Error('TODO');
  }
  getScreenshot(): (_: any, _1: any) => Promise<boolean> {
    throw new Error('TODO');
  }

  /**
   * Retrieve the default Jest runner name prescribed by Stencil
   * @returns the stringified name of the test runner, based on the currently detected version of Stencil
   */
  getDefaultJestRunner(): string {
    throw new Error('TODO');
  }

  getJestModuleNames = (): string[] => {
    return ['@types/jest', 'jest', 'jest-cli'];
  };

  getCreateJestPuppeteerEnvironment(): () => any {
    throw new Error('TODO');
  }

  getJestPreprocessor() {
    throw new Error('TODO');
  }

  getCreateJestTestRunner() {
    throw new Error('TODO');
  }

  getJestSetupTestFramework() {
    throw new Error('TODO');
  }
}
