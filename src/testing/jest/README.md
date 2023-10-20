# Jest Support in Stencil

This directory contains support for the Jest testing library.

## Adding Support for a New Version of Jest

The steps for adding support for a new version of Jest can be found below.
These steps are intended to be followed in order, and be a part of a single pull request.
**It is HIGHLY recommended that you create a commit for each step in the process.**
This allows for 'well known' commits that map directly back to these steps to be created, speeding up the review process.

1. In this directory, there are several version-specific directories to support Jest.
   For example, `jest-27-and-under/` is for Jest v27 and below, `jest-28/` is for Jest v28, etc.
   To start, create a copy of the entire directory contents for the latest version of Jest in this directory, ensuring the version number is in the directory name.
   
   For example, if we wanted to add support for Jest v28 and had the following directory structure:
   ```
   └── src/testing/jest/
       └── jest-27-and-under
   ```
   Adding support for Jest v28 would begin with making a copy of `jest-27-and-under/` (the latest supported version) and naming it `jest-28/`.
   The end result of this step are two identical copies of the copied directory, with one bearing the name of the new version of Jest:
   ```
   └── src/testing/jest/
       ├── jest-27-and-under
       └── jest-28            <- Newly copied version of jest-27-and-under, just with a different name
   ```
1. **Commit your changes to help your reviewers out - this makes it easier to review changes that are coming down the line.**
1. Update the name of the package in the newly created directory to reflect the version of Jest it supports.
   Do so by replacing the one instance of the package name in `package.json` and two instances in `package-lock-json`.
   Following the example above, `@stencil/jest-27-and-under` would be replaced with `@stencil/jest-28`
    ```diff
    --- a/src/testing/jest/jest-28/package-lock.json
    +++ b/src/testing/jest/jest-28/package-lock.json
    @@ -1,11 +1,11 @@
    {
    -  "name": "@stencil/jest-27-and-under",
    +  "name": "@stencil/jest-28",
       "version": "1.0.0",
       "lockfileVersion": 3,
       "requires": true,
       "packages": {
       "": {
    -      "name": "@stencil/jest-27-and-under",
    +      "name": "@stencil/jest-28",
           "version": "1.0.0",
           "license": "MIT",
           "devDependencies": {
    diff --git a/src/testing/jest/jest-28/package.json b/src/testing/jest/jest-28/package.json
    index 92b5ee419..bd1614fe0 100644
    --- a/src/testing/jest/jest-28/package.json
    +++ b/src/testing/jest/jest-28/package.json
    @@ -1,5 +1,5 @@
    {
    -  "name": "@stencil/jest-27-and-under",
    +  "name": "@stencil/jest-28",
       "version": "1.0.0",
       "description": "Internal package for supporting Jest 27 and under with Stencil",
       "license": "MIT",
    
    ```
1. Update the description of the package in `package.json` to match the supported version of Jest:
    ```diff
    --- a/src/testing/jest/jest-28/package.json
    +++ b/src/testing/jest/jest-28/package.json
    @@ -1,7 +1,7 @@
     {
       "name": "@stencil/jest-28",
       "version": "1.0.0",
    -  "description": "Internal package for supporting Jest 27 and under with Stencil",
    +  "description": "Internal package for supporting Jest 28 with Stencil",
       "license": "MIT",
       "author": "Ionic Team",
       "homepage": "https://stenciljs.com/",
    
    ```
1. Update any Jest related dependencies to use the targeted version of Jest.
   Note: It is up to you to determine/verify the packages needed here.
   ```bash
   $ cd src/testing/jest/jest-28
   $ npm i -D jest@28 @types/jest@28
   ```
   Note that all dependencies can simply be dev-dependencies, since they're only used for type checking.
1. Update `renovate.json` to not bump Jest beyond the version that this directory is responsible for:
    ```diff
    index 4861b2477..7cf75e16d 100644
    --- a/renovate.json5
    +++ b/renovate.json5
    @@ -98,6 +98,11 @@
           matchPackageNames: ['@types/jest'],
           allowedVersions: '<=27'
         },
    +    {
    +      "matchFileNames": ["src/testing/jest/jest-28/package.json"],
    +      matchPackageNames: ['@types/jest'],
    +      allowedVersions: '<=28'
    +    },
         {
    
    ```
   Note how:
   - `matchFileNames` maps to the new Jest directory's `package.json`
   - `matchPackageNames` lists the packages that were upgraded earlier
   - `allowedVersions` allows versions less than or equal to the version we're adding support for
1. Add the new version of Jest to the Component Starter smoke tests:
    ```diff
   index 16560a659..a4bee5308 100644
    --- a/.github/workflows/test-component-starter.yml
    +++ b/.github/workflows/test-component-starter.yml
    @@ -16,7 +16,7 @@ jobs:
    strategy:
    fail-fast: false
    matrix:
    -        jest: ['24', '25', '26', '27']
    +        jest: ['24', '25', '26', '27', '28']
             node: ['16', '18', '20']
             os: ['ubuntu-latest', 'windows-latest']
      runs-on: ${{ matrix.os }}
   ```
1. Rename the `JestFacade` implementation in the new directory's `jest-facade.ts` file.
   The number in the class name should match the version of Jest we're adding support for.
   It is recommended that you use your editor's renaming/refactoring utility to do this step:
    ```diff
    import type * as d from '@stencil/core/internal';
    import { isString } from '@utils';
    
    -import { Jest27Stencil } from './jest-facade';
    +import { Jest28Stencil } from './jest-facade';
    
    /**
    * Helper function for retrieving legacy Jest options. These options have been provided as defaults to Stencil users
      @@ -147,7 +147,7 @@ export function buildJestConfig(config: d.ValidatedConfig): string {
      jestConfig.verbose = stencilConfigTesting.verbose;
      }
    
    -  jestConfig.testRunner = new Jest27Stencil().getDefaultJestRunner();
    +  jestConfig.testRunner = new Jest28Stencil().getDefaultJestRunner();
    
       return JSON.stringify(jestConfig);
       }
       diff --git a/src/testing/jest/jest-28/jest-facade.ts b/src/testing/jest/jest-28/jest-facade.ts
       index 3c7aa949c..3dea9b42b 100644
       --- a/src/testing/jest/jest-28/jest-facade.ts
       +++ b/src/testing/jest/jest-28/jest-facade.ts
       @@ -10,7 +10,7 @@ import { jestSetupTestFramework } from './jest-setup-test-framework';
       /**
        * `JestFacade` implementation for communicating between this directory's version of Jest and Stencil
        */
    -  export class Jest27Stencil implements JestFacade {
    +  export class Jest28Stencil implements JestFacade {
        getJestCliRunner() {
        return runJest;
      }
    
    ```
1. Update the `stencil-jest-connector.ts` to call the new `JestFacade` implementation:
    ```diff
    index 50372d9df..81f9e6cf9 100644
    --- a/src/testing/jest/jest-stencil-connector.ts
    +++ b/src/testing/jest/jest-stencil-connector.ts
    @@ -10,6 +10,7 @@
     import semverMajor from 'semver/functions/major';
     
     import { Jest27Stencil } from './jest-27-and-under/jest-facade';
    +import { Jest28Stencil } from './jest-28/jest-facade';
     import { getJestMajorVersion } from './jest-apis';
     import { JestFacade } from './jest-facade';
     
    @@ -40,9 +41,10 @@ const getJestFacade = (): JestFacade => {
         const version = getVersion();
         if (version <= 27) {
           JEST_STENCIL_FACADE = new Jest27Stencil();
    +    } else if (version === 28) {
    +      JEST_STENCIL_FACADE = new Jest28Stencil();
         } else {
    
    ```
1. Set the recommended and max version to the new version of Jest:
    ```diff
    index c5bf2ed14..9936ce738 100644
    --- a/src/sys/node/node-sys.ts
    +++ b/src/sys/node/node-sys.ts
    @@ -664,9 +664,9 @@ export function createNodeSys(c: { process?: any; logger?: Logger } = {}): Compi
       const nodeResolve = new NodeResolveModule();
     
       sys.lazyRequire = new NodeLazyRequire(nodeResolve, {
    -    '@types/jest': { minVersion: '24.9.1', recommendedVersion: '27.0.3', maxVersion: '27.0.0' },
    -    jest: { minVersion: '24.9.0', recommendedVersion: '27.0.3', maxVersion: '27.0.0' },
    -    'jest-cli': { minVersion: '24.9.0', recommendedVersion: '27.4.5', maxVersion: '27.0.0' },
    +    '@types/jest': { minVersion: '24.9.1', recommendedVersion: '28', maxVersion: '28' },
    +    jest: { minVersion: '24.9.0', recommendedVersion: '28', maxVersion: '28' },
    +    'jest-cli': { minVersion: '24.9.0', recommendedVersion: '28', maxVersion: '28' },
         puppeteer: { minVersion: '10.0.0', recommendedVersion: '20' },
         'puppeteer-core': { minVersion: '10.0.0', recommendedVersion: '20' },
         'workbox-build': { minVersion: '4.3.1', recommendedVersion: '4.3.1' },
    ```
1. It's time to get the project to compile.
   Build Stencil and resolve any typing errors that have arisen from adding new versions of Jest.
1. Once Stencil compiles, generate a version that can be installed in a Stencil component starter project (either a tarball or a dev build) and install it.
   Work through errors that arise when attempting to run the tests.
   Consider working through the Jest Breaking Changes guide for the current version that you are adding support for.
1. Perform a final pass through the Jest Breaking Changes guide for the current version that you are adding support for.
   Ensure any changes that ought to be made are completed.
   Note: Just because something didn't give us a runtime error, doesn't mean it should not be changed.
1. Once your PR is merged, please ensure that the CI gate checks are updated to enforce successful runs of the new version of Jest for the Stencil Component Starter smoke test.
