// import type { Config } from '@jest/types';
// import { ValidatedConfig } from '@stencil/core/declarations';
import { getVersion as jestGetVersion } from 'jest';

// import { buildJestArgv as buildJest27Argv } from './jest-27-and-under/jest-config';

/**
 * Get the current major version of Jest that Stencil reconciles
 *
 * @returns the major version of Jest.
 */
export const getJestMajorVersion = (): string => {
  return jestGetVersion();
};


//
// export type JestArgvFactoryOpts = {
//   config: ValidatedConfig;
// };
// export const buildJestArgvFactory = (opts: JestArgvFactoryOpts): Config.Argv => {
//   switch (getJestMajorVersion()) {
//     case 24:
//     case 25:
//     case 26:
//     case 27:
//       return buildJest27Argv(opts.config);
//     case 28:
//     case 29:
//     default:
//       throw new Error(`No config for version!`);
//   }
// };
