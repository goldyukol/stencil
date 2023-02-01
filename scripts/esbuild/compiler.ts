import fs from 'fs-extra';
import MagicString from 'magic-string';
import { join } from 'path';
import type { OutputChunk, RollupOptions, RollupWarning, TransformResult } from 'rollup';
import sourcemaps from 'rollup-plugin-sourcemaps';
import * as esbuild from 'esbuild';
import type { BuildOptions as ESBuildOptions } from 'esbuild';
import ts from 'typescript';

import { getBanner } from '../utils/banner';
import { BuildOptions, createReplaceData } from '../utils/options';
import { writePkgJson } from '../utils/write-pkg-json';
import { bundleTypeScriptSourceEsbuild } from '../bundles/plugins/typescript-source-plugin';
import { writeSizzleBundle } from '../bundles/plugins/sizzle-plugin';
import { getEsbuildAliases, getEsbuildExternalModules } from './util';

export async function buildCompiler(opts: BuildOptions) {
  const inputDir = join(opts.buildDir, 'compiler');
  const srcDir = join(opts.srcDir, 'compiler');
  const compilerFileName = 'stencil.js';
  const compilerDtsName = compilerFileName.replace('.js', '.d.ts');

  // create public d.ts
  let dts = await fs.readFile(join(inputDir, 'public.d.ts'), 'utf8');
  dts = dts.replace('@stencil/core/internal', '../internal/index');
  await fs.writeFile(join(opts.output.compilerDir, compilerDtsName), dts);

  // write @stencil/core/compiler/package.json
  writePkgJson(opts, opts.output.compilerDir, {
    name: '@stencil/core/compiler',
    description: 'Stencil Compiler.',
    main: compilerFileName,
    types: compilerDtsName,
  });

  // copy and edit compiler/sys/in-memory-fs.d.ts
  let inMemoryFsDts = await fs.readFile(join(inputDir, 'sys', 'in-memory-fs.d.ts'), 'utf8');
  inMemoryFsDts = inMemoryFsDts.replace('@stencil/core/internal', '../../internal/index');
  await fs.ensureDir(join(opts.output.compilerDir, 'sys'));
  await fs.writeFile(join(opts.output.compilerDir, 'sys', 'in-memory-fs.d.ts'), inMemoryFsDts);

  // copy and edit compiler/transpile.d.ts
  let transpileDts = await fs.readFile(join(inputDir, 'transpile.d.ts'), 'utf8');
  transpileDts = transpileDts.replace('@stencil/core/internal', '../internal/index');
  await fs.writeFile(join(opts.output.compilerDir, 'transpile.d.ts'), transpileDts);

  /**
   * These files are wrap the compiler in an Immediately-Invoked Function Expression (IIFE). The intro contains the
   * first half of the IIFE, and the outro contains the second half. Those files are not valid JavaScript on their own,
   * and editors may produce warnings as a result. This comment is not in the files themselves, as doing so would lead
   * to the comment being added to the compiler output itself. These files could be converted to non-JS files, at the
   * cost of losing some source code highlighting in editors.
   */
  const cjsIntro = fs.readFileSync(join(opts.bundleHelpersDir, 'compiler-cjs-intro.js'), 'utf8');
  const cjsOutro = fs.readFileSync(join(opts.bundleHelpersDir, 'compiler-cjs-outro.js'), 'utf8');

  const rollupWatchPath = join(opts.nodeModulesDir, 'rollup', 'dist', 'es', 'shared', 'watch.js');

  const compilerAliases = getEsbuildAliases(opts);

  const external = getEsbuildExternalModules(opts, opts.output.compilerDir);

  // get replace data, works with esbuild 'define'
  // note that the `bundleTypeScriptSource` implicitly depends on
  // `createReplaceData` being called before it
  const replaceData = createReplaceData(opts);
  const defineData = Object.fromEntries(
    Object.entries(replaceData).map(([id, substitute]) => [`\"${id}\"`, `\"${substitute}\"`])
  );

  // stuff to patch typescript before bundling
  const tsPath = require.resolve('typescript');
  const tsFilePath = await bundleTypeScriptSourceEsbuild(tsPath, opts);
  compilerAliases['typescript'] = tsFilePath;

  // gotta do a thing for sizzle too
  const sizzlePath = await writeSizzleBundle(opts);
  compilerAliases['sizzle'] = sizzlePath;

  const compilerEsbuildOptions: ESBuildOptions = {
    entryPoints: [join(srcDir, 'index.ts')],
    bundle: true,
    platform: 'node',
    logLevel: 'info',
    sourcemap: 'linked',
    external,
    format: 'cjs',
    alias: compilerAliases,
  };

  await esbuild.build({
    ...compilerEsbuildOptions,
    outfile: join(opts.output.compilerDir, compilerFileName),
  });

  await esbuild.build({
    ...compilerEsbuildOptions,
    outfile: join(opts.output.compilerDir, 'stencil.min.js'),
    minify: true,
  });

  // may need to do something about each of these
  // inlinedCompilerDepsPlugin(opts, inputDir),
  // parse5Plugin(opts),
  // sizzlePlugin(opts),
  // sysModulesPlugin(inputDir),

  // copy typescript default lib dts files
  const tsLibNames = await getTypeScriptDefaultLibNames(opts);

  await Promise.all(tsLibNames.map((f) => fs.copy(join(opts.typescriptLibDir, f), join(opts.output.compilerDir, f))));
}

/**
 * Helper function that reads in the `lib.*.d.ts` files in the TypeScript lib/ directory on disk.
 * @param opts the Stencil build options, which includes the location of the TypeScript lib/
 * @returns all file names that match the `lib.*.d.ts` format
 */
async function getTypeScriptDefaultLibNames(opts: BuildOptions): Promise<string[]> {
  return (await fs.readdir(opts.typescriptLibDir)).filter((f) => f.startsWith('lib.') && f.endsWith('.d.ts'));
}
