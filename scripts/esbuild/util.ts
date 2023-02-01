import { join } from 'path';
import { BuildOptions } from '../utils/options';

/**
 * Aliases which map the module identifiers we set in `paths` in `tsconfig.json` to
 * bundles (built either with esbuild or with rollup).
 *
 * @param opts options for the current build
 * @returns a map of aliases to bundle entry points, relative to the root directory
 */
export function getEsbuildAliases(opts: BuildOptions): Record<string, string> {
  return {
    // node module redirection
    chalk: 'ansi-colors',

    // mapping aliases to top-level bundle entrypoints
    '@stencil/core/testing': './testing/index.js',
    '@stencil/core/compiler': './compiler/stencil.js',
    '@stencil/core/dev-server': './dev-server/index.js',
    '@stencil/core/mock-doc': './mock-doc/index.cjs',
    '@stencil/core/internal/testing': './internal/testing/index.js',

    // this has to be added here pointing to the `.ts` file so that the `import
    // { IS_NODE_ENV } from '@environment';` in the `typescript.js` file we
    // bundle will resolve correctly
    //
    // esbuild will automatically resolve aliases from `paths` in
    // `tsconfig.json` but only for `.ts` files, so when we bundle `typescript`
    // into e.g. the compiler bundle we'll need this so things resolve
    // correctly
    '@environment': join(opts.srcDir, 'compiler/sys/environment.ts'),
  };
}

/**
 * Node modules which should be universally marked as external
 *
 */
const externalNodeModules = [
  '@jest/core',
  '@jest/reporters',
  '@microsoft/typescript-etw',
  'assert',
  'buffer',
  'child_process',
  'console',
  'constants',
  'crypto',
  'expect',
  'fs',
  'fsevents',
  'inspector',
  'jest',
  'jest-cli',
  'jest-config',
  'jest-message-id',
  'jest-pnp-resolver',
  'jest-runner',
  'net',
  'os',
  'path',
  'process',
  'puppeteer',
  'puppeteer-core',
  'readline',
  'stream',
  'tty',
  'url',
  'util',
  'vm',
  'yargs',
  'zlib',
];

/**
 * Get a manifest of modules which should be marked as external for a given
 * esbuild bundle
 *
 * @param opts options for the current build
 * @param ownEntryPoint the entry point alias of the current module
 * @returns a list of modules which should be marked as external
 */
export function getEsbuildExternalModules(opts: BuildOptions, ownEntryPoint: string): string[] {
  const bundles = Object.values(opts.output);
  const externalBundles = bundles.filter((outdir) => outdir !== ownEntryPoint).map((outdir) => join(outdir, '*'));

  return [...externalNodeModules, ...externalBundles];
}
