import * as JestFacade from '../jest-facade';
import { getJestMajorVersion, getJestRunner, getTestingModuleNames } from '../jest-version';

describe('jest-utils', () => {
  let getVersionSpy: jest.SpyInstance<
    ReturnType<typeof JestFacade.getVersion>,
    Parameters<typeof JestFacade.getVersion>
  >;

  beforeEach(() => {
    getVersionSpy = jest.spyOn(JestFacade, 'getVersion');
  });

  afterEach(() => {
    getVersionSpy.mockRestore();
  });

  describe('getVersion', () => {
    it.each([
      ['27.0.0', 27],
      ['28.1.0', 28],
      ['29.1.2', 29],
      ['29.1.2-3', 29],
      ['29.1.2-alpha.0', 29],
      ['29.1.2-beta.1', 29],
      ['29.1.2-rc.2', 29],
    ])('transforms semver string %s into major version %d', (semverStr, majorVersion) => {
      getVersionSpy.mockImplementation(() => semverStr);
      expect(getJestMajorVersion()).toBe(majorVersion);
    });
  });

  describe('getTestingModuleNames', () => {
    it.each([
      ['24.0.0', ['@types/jest', 'jest', 'jest-cli']],
      ['25.0.0', ['@types/jest', 'jest', 'jest-cli']],
      ['26.0.0', ['@types/jest', 'jest', 'jest-cli']],
      ['27.0.0', ['@types/jest', 'jest', 'jest-cli']],
      ['28.0.0', ['@types/jest', 'jest', 'jest-cli']],
      ['29.0.0', ['@types/jest', 'jest', 'jest-cli']],
      ['30.0.0', ['@types/jest', 'jest', 'jest-cli']],
    ])('returns the correct module names for jest %s', (jestMajorVersion, moduleNames) => {
      getVersionSpy.mockImplementation(() => jestMajorVersion);

      expect(getTestingModuleNames()).toEqual(moduleNames);
    });
  });

  describe('getJestRunner()', () => {
    it.each([
      ['24.0.0', 'jest-jasmine2'],
      ['25.0.0', 'jest-jasmine2'],
      ['26.0.0', 'jest-jasmine2'],
      ['27.0.0', 'jest-jasmine2'],
      ['28.0.0', 'jest-circus'],
      ['29.0.0', 'jest-circus'],
      ['30.0.0', 'jest-circus'],
    ])('returns the correct module names for jest %s', (jestMajorVersion, runnerName) => {
      getVersionSpy.mockImplementation(() => jestMajorVersion);

      expect(getJestRunner()).toEqual(runnerName);
    });
  });
});
