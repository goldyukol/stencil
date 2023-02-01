import fs from 'fs-extra';
import { join } from 'path';
import * as esbuild from 'esbuild';

import type { BuildOptions } from '../utils/options';
import { writePkgJson } from '../utils/write-pkg-json';

export async function buildSysNode(opts: BuildOptions) {
  const inputDir = join(opts.buildDir, 'sys', 'node');
  const srcDir = join(opts.srcDir, 'sys', 'node');
  const inputFile = join(srcDir, 'index.ts');
  const outputFile = join(opts.output.sysNodeDir, 'index.js');

  await fs.ensureDir(opts.output.sysNodeDir);

  // create public d.ts
  let dts = await fs.readFile(join(inputDir, 'public.d.ts'), 'utf8');
  dts = dts.replace('@stencil/core/internal', '../../internal/index');
  await fs.writeFile(join(opts.output.sysNodeDir, 'index.d.ts'), dts);

  // write @stencil/core/compiler/package.json
  writePkgJson(opts, opts.output.sysNodeDir, {
    name: '@stencil/core/sys/node',
    description: 'Stencil Node System.',
    main: 'index.js',
    types: 'index.d.ts',
  });

  const external = [
    join(opts.output.compilerDir, '*'),
    'child_process',
    'crypto',
    'events',
    'https',
    'path',
    'readline',
    'os',
    'util',
    '@stencil/core/compiler',
  ];

  const sysNodeAliases = {
    prompts: 'sys/node/prompts.js',
    '@stencil/core/compiler': './compiler/stencil.js',
    '@environment': join(opts.srcDir, 'compiler/sys/environment.ts'),
  };

  await esbuild.build({
    entryPoints: [inputFile],
    bundle: true,
    format: 'cjs',
    outfile: outputFile,
    platform: 'node',
    logLevel: 'info',
    external,
    alias: sysNodeAliases,
  });

  // sys/node/worker.js bundle
  const inputWorkerFile = join(srcDir, 'worker.ts');
  const outputWorkerFile = join(opts.output.sysNodeDir, 'worker.js');

  await esbuild.build({
    entryPoints: [inputWorkerFile],
    bundle: true,
    format: 'cjs',
    outfile: outputWorkerFile,
    platform: 'node',
    logLevel: 'info',
    external,
    alias: sysNodeAliases,
  });
}
