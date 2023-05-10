import type { Config } from '@jest/types';
import type * as d from '@stencil/core/internal';
import { isString } from '@utils';

import { getJestRunner } from './jest-version';

/**
 * Helper function for retrieving legacy Jest options. These options have been provided as defaults to Stencil users
 * by Jest + yargs for all users using Jest versions 24 through 26 (inclusively). Between Jest v26 and v27, a few
 * changes occurred:
 * 1. Jest CLI options were no longer exported, with no means of retrieving it without breaking package encapsulation
 * 2. the location of default values moved internally in Jest
 * As a result, this list could no longer be autogenerated. To ensure backwards compatability between versions Jest 24
 * through 27 (inclusive), recreate the list manually to be used in Jest argument generation. This will be removed in a
 * future version of Stencil.
 *
 * @returns a list of Jest legacy options generated for all users of Stencil+Jest testing
 */
function getLegacyJestOptions(): Record<string, boolean | number | string> {
  return {
    detectLeaks: false,
    'detect-leaks': false,
    detectOpenHandles: false,
    'detect-open-handles': false,
    errorOnDeprecated: false,
    'error-on-deprecated': false,
    listTests: false,
    'list-tests': false,
    maxConcurrency: 5,
    'max-concurrency': 5,
    notifyMode: 'failure-change',
    'notify-mode': 'failure-change',
    passWithNoTests: false,
    'pass-with-no-tests': false,
    runTestsByPath: false,
    'run-tests-by-path': false,
    testLocationInResults: false,
    'test-location-in-results': false,
  };
}

/**
 * Builds the `argv` to be used when programmatically invoking the Jest CLI
 * @param config the Stencil config to use while generating Jest CLI arguments
 * @returns the arguments to pass to the Jest CLI, wrapped in an object
 */
export function buildJestArgv(config: d.ValidatedConfig): Config.Argv {
  const yargs = require('yargs');

  const knownArgs = config.flags.knownArgs.slice();

  if (!knownArgs.some((a) => a.startsWith('--max-workers') || a.startsWith('--maxWorkers'))) {
    knownArgs.push(`--max-workers=${config.maxConcurrentWorkers}`);
  }

  if (config.flags.devtools) {
    knownArgs.push('--runInBand');
  }

  // we combine the modified args and the unknown args here and declare the
  // result read only, providing some typesystem-level assurance that we won't
  // mutate it after this point.
  //
  // We want that assurance because Jest likes to have any filepath match
  // patterns at the end of the args it receives. Those args are going to be
  // found in our `unknownArgs`, so while we want to do some stuff in this
  // function that adds to `knownArgs` we need a guarantee that all of the
  // `unknownArgs` are _after_ all the `knownArgs` in the array we end up
  // generating the Jest configuration from.
  const args: ReadonlyArray<string> = [...knownArgs, ...config.flags.unknownArgs];

  config.logger.info(config.logger.magenta(`jest args: ${args.join(' ')}`));

  let jestArgv = yargs(args).argv as Config.Argv;
  jestArgv = { ...getLegacyJestOptions(), ...jestArgv };
  jestArgv.config = buildJestConfig(config);

  if (typeof jestArgv.maxWorkers === 'string') {
    try {
      jestArgv.maxWorkers = parseInt(jestArgv.maxWorkers, 10);
    } catch (e) {}
  }

  if (typeof jestArgv.ci === 'string') {
    jestArgv.ci = jestArgv.ci === 'true' || jestArgv.ci === '';
  }

  return jestArgv;
}

/**
 * Generate a Jest run configuration to be used as a part of the `argv` passed to the Jest CLI when it is invoked
 * programmatically
 * @param config the Stencil config to use while generating Jest CLI arguments
 * @returns the Jest Config to attach to the `argv` argument
 */
export function buildJestConfig(config: d.ValidatedConfig): string {
  const stencilConfigTesting = config.testing;
  const jestDefaults: Config.DefaultOptions = require('jest-config').defaults;

  const validJestConfigKeys = Object.keys(jestDefaults);

  const jestConfig: d.JestConfig = {};

  Object.keys(stencilConfigTesting).forEach((key) => {
    if (validJestConfigKeys.includes(key)) {
      (jestConfig as any)[key] = (stencilConfigTesting as any)[key];
    }
  });

  jestConfig.rootDir = config.rootDir;

  if (isString(stencilConfigTesting.collectCoverage)) {
    jestConfig.collectCoverage = stencilConfigTesting.collectCoverage;
  }
  if (Array.isArray(stencilConfigTesting.collectCoverageFrom)) {
    jestConfig.collectCoverageFrom = stencilConfigTesting.collectCoverageFrom;
  }
  if (isString(stencilConfigTesting.coverageDirectory)) {
    jestConfig.coverageDirectory = stencilConfigTesting.coverageDirectory;
  }
  if (stencilConfigTesting.coverageThreshold) {
    jestConfig.coverageThreshold = stencilConfigTesting.coverageThreshold;
  }
  if (isString(stencilConfigTesting.globalSetup)) {
    jestConfig.globalSetup = stencilConfigTesting.globalSetup;
  }
  if (isString(stencilConfigTesting.globalTeardown)) {
    jestConfig.globalTeardown = stencilConfigTesting.globalTeardown;
  }
  if (isString(stencilConfigTesting.preset)) {
    jestConfig.preset = stencilConfigTesting.preset;
  }
  if (stencilConfigTesting.projects) {
    jestConfig.projects = stencilConfigTesting.projects;
  }
  if (Array.isArray(stencilConfigTesting.reporters)) {
    jestConfig.reporters = stencilConfigTesting.reporters;
  }
  if (isString(stencilConfigTesting.testResultsProcessor)) {
    jestConfig.testResultsProcessor = stencilConfigTesting.testResultsProcessor;
  }
  if (stencilConfigTesting.transform) {
    jestConfig.transform = stencilConfigTesting.transform;
  }
  if (stencilConfigTesting.verbose) {
    jestConfig.verbose = stencilConfigTesting.verbose;
  }

  // TODO(NOW): What if this is overwritten?
  jestConfig.testRunner = getJestRunner();

  return JSON.stringify(jestConfig);
}

export function getProjectListFromCLIArgs(config: d.Config, argv: Config.Argv): Config.Path[] {
  const projects = argv.projects ? argv.projects : [];

  projects.push(config.rootDir);

  return projects;
}
