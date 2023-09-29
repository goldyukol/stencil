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
