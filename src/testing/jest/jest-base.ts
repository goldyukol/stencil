import { Jest27StencilAdapter } from './jest-27-and-under/jest-facade';
import { getVersion } from './jest-facade';

export abstract class JestFacade {
  static getRunner = (): ((_: any, _1: any) => Promise<boolean>) => {
    const version = getVersion();
    if (version <= 27) {
      return Jest27StencilAdapter.getRunner();
    } else {
      // in Stencil 4.X, defaulting to v27 and under is the default behavior.
      // when Jest 28+ is supported, this will likely change.
      // we default here instead of throwing an error
      return Jest27StencilAdapter.getRunner();
    }
  };
  static getScreenshot = (): ((_: any, _1: any) => Promise<boolean>) => {
    const version = getVersion();
    if (version <= 27) {
      return Jest27StencilAdapter.getScreenshot();
    } else {
      // in Stencil 4.X, defaulting to v27 and under is the default behavior.
      // when Jest 28+ is supported, this will likely change.
      // we default here instead of throwing an error
      return Jest27StencilAdapter.getScreenshot();
    }
  };

  /**
   * Retrieve the default Jest runner name prescribed by Stencil
   * @returns the stringified name of the test runner, based on the currently detected version of Stencil
   */
  static getDefaultJestRunner = (): string => {
    const version = getVersion();
    if (version <= 27) {
      return Jest27StencilAdapter.getDefaultJestRunner();
    } else {
      // in Stencil 4.X, defaulting to jest-jasmine2 is the default behavior.
      // when Jest 28+ is supported, this will likely change.
      // we default here instead of throwing an error
      return Jest27StencilAdapter.getDefaultJestRunner();
    }
  };

  static getJestModuleNames = (): string[] => {
    return ['@types/jest', 'jest', 'jest-cli'];
  };

  static getCreateJestPuppeteerEnvironment = (): (() => any) => {
    const version = getVersion();
    if (version <= 27) {
      return Jest27StencilAdapter.getCreateJestPuppeteerEnvironment();
    } else {
      // in Stencil 4.X, defaulting to v27 and under is the default behavior.
      // when Jest 28+ is supported, this will likely change.
      // we default here instead of throwing an error
      return Jest27StencilAdapter.getCreateJestPuppeteerEnvironment();
    }
  };

  static getJestPreprocessor() {
    const version = getVersion();
    if (version <= 27) {
      return Jest27StencilAdapter.getJestPreprocessor();
    } else {
      // in Stencil 4.X, defaulting to v27 and under is the default behavior.
      // when Jest 28+ is supported, this will likely change.
      // we default here instead of throwing an error
      return Jest27StencilAdapter.getJestPreprocessor();
    }
  }

  static getCreateJestTestRunner() {
    const version = getVersion();
    if (version <= 27) {
      return Jest27StencilAdapter.getCreateJestTestRunner();
    } else {
      // in Stencil 4.X, defaulting to v27 and under is the default behavior.
      // when Jest 28+ is supported, this will likely change.
      // we default here instead of throwing an error
      return Jest27StencilAdapter.getCreateJestTestRunner();
    }
  }

  static getJestSetupTestFramework() {
    const version = getVersion();
    if (version <= 27) {
      return Jest27StencilAdapter.getJestSetupTestFramework();
    } else {
      // in Stencil 4.X, defaulting to v27 and under is the default behavior.
      // when Jest 28+ is supported, this will likely change.
      // we default here instead of throwing an error
      return Jest27StencilAdapter.getJestSetupTestFramework();
    }
  }
}
