
export abstract class JestFacade {
  static getRunner = async (): Promise<any> => {
    throw 'not implemented';
  };
  static getScreenshot = async (): Promise<any> => {
    throw 'not implemented';
  };

  /**
   * Retrieve the default Jest runner name prescribed by Stencil
   * @returns the stringified name of the test runner, based on the currently detected version of Stencil
   */
  static getDefaultJestRunner = (): string => {
    throw 'not implemented'
  };
}

export class Jest27StencilAdapter extends JestFacade {
  static override async getRunner() {
    return await import('./jest-runner');
  }
  static override async getScreenshot() {
    return await import('./jest-screenshot');
  }

  static override getDefaultJestRunner() {
    return 'jest-jasmine2';
  }
}
