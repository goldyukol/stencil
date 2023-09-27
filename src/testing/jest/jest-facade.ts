import semverMajor from 'semver/functions/major';

import { getJestMajorVersion } from './jest-version';

export const getRunner = async () => {
  const majorVersion = getVersion();
  switch (majorVersion) {
    case 24:
    case 25:
    case 26:
    case 27:
      return await import('./jest-27-and-under/jest-runner');
    case 28:
    case 29:
    default:
      // in Stencil 4.X, defaulting to v27 and under is the default behavior
      // when Jest 28+ is supported, this will change.
      // we default here instead of throwing an error
      return await import('./jest-27-and-under/jest-runner');
  }
};
export const getScreenshot = async () => {
  const majorVersion = getVersion();
  switch (majorVersion) {
    case 24:
    case 25:
    case 26:
    case 27:
      return await import('./jest-27-and-under/jest-screenshot');
    case 28:
    case 29:
    default:
      // in Stencil 4.X, defaulting to v27 and under is the default behavior
      // when Jest 28+ is supported, this will change.
      // we default here instead of throwing an error
      return await import('./jest-27-and-under/jest-screenshot');
  }
};

export const getVersion = (): number => {
  return semverMajor(getJestMajorVersion());
};
