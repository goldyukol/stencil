import { getVersion as jestGetVersion } from 'jest';

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

  // @ts-ignore let this be unused
  someRandoFunction = () => {
    throw 'not implemented';
  };

  static getRunner = () => {
    throw 'not implemented';
  }
}

// @ts-ignore
// eslint-disable-next-line @typescript-eslint/no-unused-vars
class Jest27StencilAdapter extends JestFacade {
  static override getRunner() {

  }
}

export const getVersion = (): string => {
  return jestGetVersion();
};
