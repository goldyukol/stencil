const { getOptions } = require('./scripts/build/utils/options.js');
const { buildCli } = require('./scripts/build/esbuild/cli');
const { buildCompiler } = require('./scripts/build/esbuild/compiler');
const { buildTesting } = require('./scripts/build/esbuild/testing');
const { buildSysNode } = require('./scripts/build/esbuild/sys-node');
const { buildInternalTesting } = require('./scripts/build/esbuild/internal-platform-testing');
const { buildMockDoc } = require('./scripts/build/esbuild/mock-doc');

async function main() {
  const opts = getOptions(__dirname, {
    isProd: !!process.argv.includes('--prod'),
    isCI: !!process.argv.includes('--ci'),
  });

  await buildCli(opts);
  await buildCompiler(opts);
  await buildSysNode(opts);
  await buildMockDoc(opts);

  // these two are more problematic right now
  // await buildInternalTesting(opts);
  // await buildTesting(opts);
}

main();
