import * as esbuild from 'esbuild';
import fs from 'fs-extra';
import { join } from 'path';
import { writeSizzleBundle } from '../bundles/plugins/sizzle-plugin';

import { BuildOptions } from '../utils/options';
import { writePkgJson } from '../utils/write-pkg-json';

export async function buildInternalTesting(opts: BuildOptions) {
  const inputTestingPlatform = join(opts.srcDir, 'testing', 'platform', 'index.ts');
  const outputTestingPlatformDir = join(opts.output.internalDir, 'testing');

  await fs.emptyDir(outputTestingPlatformDir);

  // write @stencil/core/internal/testing/package.json
  writePkgJson(opts, outputTestingPlatformDir, {
    name: '@stencil/core/internal/testing',
    description:
      'Stencil internal testing platform to be imported by the Stencil Compiler. Breaking changes can and will happen at any time.',
    main: 'index.js',
  });

  const sizzlePath = await writeSizzleBundle(opts);

  const internalTestingAliases = {
    '@platform': inputTestingPlatform,
    sizzle: sizzlePath,
    '@stencil/core/mock-doc': './mock-doc/index.cjs',
  };

  await esbuild.build({
    entryPoints: [inputTestingPlatform],
    bundle: true,
    format: 'cjs',
    outfile: join(outputTestingPlatformDir, 'index.js'),
    platform: 'node',
    logLevel: 'info',
    external: [join(opts.output.mockDocDir, '*')],
    alias: internalTestingAliases,
  });
}
