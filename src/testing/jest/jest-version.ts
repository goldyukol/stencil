import { getVersion as jestGetVersion } from 'jest';

/**
 * Get the current major version of Jest that Stencil reconciles
 *
 * @returns the major version of Jest.
 */
export const getJestMajorVersion = (): string => {
  return jestGetVersion();
};
