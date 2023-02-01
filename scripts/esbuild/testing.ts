import * as esbuild from 'esbuild';
import fs from 'fs-extra';
import { join } from 'path';
import { OutputOptions, RollupOptions } from 'rollup';

import { BuildOptions } from '../utils/options';
import { writePkgJson } from '../utils/write-pkg-json';
import { writeSizzleBundle } from '../bundles/plugins/sizzle-plugin';
import { getEsbuildAliases, getEsbuildExternalModules } from './util';

async function copyTestingInternalDts(opts: BuildOptions, inputDir: string) {
  // copy testing d.ts files
  await fs.copy(join(inputDir), join(opts.output.testingDir), {
    filter: (f) => {
      if (f.endsWith('.d.ts')) {
        return true;
      }
      if (fs.statSync(f).isDirectory() && !f.includes('platform')) {
        return true;
      }
      return false;
    },
  });
}

export async function buildTesting(opts: BuildOptions) {
  const inputDir = join(opts.buildDir, 'testing');
  const sourceDir = join(opts.srcDir, 'testing');

  await Promise.all([
    // copy jest testing entry files
    fs.copy(join(opts.scriptsBundlesDir, 'helpers', 'jest'), opts.output.testingDir),
    copyTestingInternalDts(opts, inputDir),
  ]);

  // write package.json
  writePkgJson(opts, opts.output.testingDir, {
    name: '@stencil/core/testing',
    description: 'Stencil testing suite.',
    main: 'index.js',
    types: 'index.d.ts',
  });

  const external = [
    ...getEsbuildExternalModules(opts, opts.output.testingDir),
    '@rollup/plugin-commonjs',
    '@rollup/plugin-node-resolve',
    'rollup',
  ];

  const testingAliases = getEsbuildAliases(opts);

  testingAliases['@platform'] = './internal/testing/index.js';

  const sizzlePath = await writeSizzleBundle(opts);
  testingAliases['sizzle'] = sizzlePath;

  const output: OutputOptions = {
    format: 'cjs',
    dir: opts.output.testingDir,
    esModule: false,
    preferConst: true,
  };

  await esbuild.build({
    entryPoints: [join(sourceDir, 'index.ts')],
    bundle: true,
    format: 'cjs',
    outfile: join(opts.output.testingDir, 'index.js'),
    platform: 'node',
    logLevel: 'info',
    external,
    alias: testingAliases,
  });
}
