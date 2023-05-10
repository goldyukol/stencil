import type { Config } from '@jest/types';
import { ValidatedConfig } from '@stencil/core/declarations';
import semverMajor from 'semver/functions/major';

import { buildJestArgv as buildJest28Argv } from './experimental/jest-28/jest-config';
import { buildJestArgv as buildJest27Argv } from './jest-config';
import { getVersion } from './jest-facade';

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
    case 24:
    case 25:
    case 26:
    case 27:
    case 28:
    case 29:
    default:
      return ['@types/jest', 'jest', 'jest-cli'];
  }
};

export const getJestRunner = (): string => {
  if (getJestMajorVersion() <= 27) {
    return 'jest-jasmine2';
  }
  return 'jest-circus';
};

export type JestArgvFactoryOpts = {
  config: ValidatedConfig;
};
export const buildJestArgvFactory = (opts: JestArgvFactoryOpts): Config.Argv => {
  switch (getJestMajorVersion()) {
    case 24:
    case 25:
    case 26:
    case 27:
      return buildJest27Argv(opts.config);
    case 28:
      return buildJest28Argv(opts.config);
    case 29:
    default:
      throw new Error(`No config for version!`);
  }
};
