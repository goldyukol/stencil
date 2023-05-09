import { getVersion as jestGetVersion } from 'jest';

/**
 * Get the current major version of Jest that Stencil reconciles
 *
 * @returns the version of Jest.
 */
export const getVersion = (): string => {
  return jestGetVersion();
};
