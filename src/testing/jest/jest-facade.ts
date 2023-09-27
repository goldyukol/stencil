import { getVersion as jestGetVersion } from 'jest';

import { getJestMajorVersion } from './jest-version';

// Probably a good bit of over-engineering
//
// This assumes we know the version/can resolve jest ourselves
// There is something to be said about:
// - Not being able to resolve Jest (at all, not the expected version e.g. monorepo)
// - Trying to resolve Jest and follow up attempts/strategies
//
// Probably the way forward (if at all) is to try to resolve Jest once and cache that decision
abstract class JestFacade {
  // eslint-disable-next-line jsdoc/require-returns-check
  /**
   * Get the current major version of Jest that Stencil reconciles
   *
   * @returns the version of Jest.
   */
  static getVersion = (): string => {
    return jestGetVersion();
  };

  static getRunner = async (): Promise<any> => {
    throw 'not implemented';
  };
  static getScreenshot = async (): Promise<any> => {
    throw 'not implemented';
  };
}

class Jest27StencilAdapter extends JestFacade {
  static override async getRunner() {
    return await import('./jest-27-and-under/jest-runner');
  }
  static override async getScreenshot() {
    return await import('./jest-27-and-under/jest-screenshot');
  }
}

export const getRunner = async () => {
  // TODO(NOW): Cyclic deps
  const majorVersion = getJestMajorVersion();
  switch (majorVersion) {
    case 24:
    case 25:
    case 26:
    case 27:
      return await Jest27StencilAdapter.getRunner();
    case 28:
    case 29:
    default:
      // in Stencil 4.X, defaulting to v27 and under is the default behavior
      // when Jest 28+ is supported, this will change.
      // we default here instead of throwing an error
      return await Jest27StencilAdapter.getRunner();
  }
};
export const getScreenshot = async () => {
  // TODO(NOW): Cyclic deps
  const majorVersion = getJestMajorVersion();
  switch (majorVersion) {
    case 24:
    case 25:
    case 26:
    case 27:
      return await Jest27StencilAdapter.getScreenshot();
    case 28:
    case 29:
    default:
      // in Stencil 4.X, defaulting to v27 and under is the default behavior
      // when Jest 28+ is supported, this will change.
      // we default here instead of throwing an error
      return await Jest27StencilAdapter.getRunner();
  }
};

export const getVersion = (): string => {
  return jestGetVersion();
};
