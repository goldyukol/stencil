import { getVersion } from 'jest';
import semverMajor from 'semver/functions/major';

// TODO(NOW): Fixup w examples
/**
 * Get the current major version of Jest that Stencil reconciles
 *
 * @returns the major version of Jest.
 */
export const getJestMajorVersion = (): number => {
  return semverMajor(getVersion());
};

export const getTestingModuleNames = (): string[] => {
  switch (getJestMajorVersion()) {
    case 27:
    case 28:
    case 29:
    default:
      return ['@types/jest', 'jest', 'jest-cli'];
  }
};
