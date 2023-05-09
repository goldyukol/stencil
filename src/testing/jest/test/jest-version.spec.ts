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
    it('returns the value returned by getVersion()', () => {
      getVersionSpy.mockImplementation(() => '28.0.0');
      expect(getJestMajorVersion()).toBe(28);
    });
  });

  describe('getTestingModuleNames', () => {
    it.each([
      ['23.0.0', ['@types/jest', 'jest', 'jest-cli']],
      ['24.0.0', ['@types/jest', 'jest', 'jest-cli']],
      ['25.0.0', ['@types/jest', 'jest', 'jest-cli']],
      ['26.0.0', ['@types/jest', 'jest', 'jest-cli']],
      ['27.0.0', ['@types/jest', 'jest', 'jest-cli']],
      ['28.0.0', ['@types/jest', 'jest', 'jest-cli']],
      ['29.0.0', ['@types/jest', 'jest', 'jest-cli']],
    ])('returns the correct module names for jest %s', (jestMajorVersion, moduleNames) => {
      getVersionSpy.mockImplementation(() => jestMajorVersion);

      expect(getTestingModuleNames()).toEqual(moduleNames);
    });
  });

  describe('getJestRunner()', () => {
    it.each([
      ['23.0.0', 'jest-jasmine2'],
      ['24.0.0', 'jest-jasmine2'],
      ['25.0.0', 'jest-jasmine2'],
      ['26.0.0', 'jest-jasmine2'],
      ['27.0.0', 'jest-jasmine2'],
      ['28.0.0', 'jest-circus'],
      ['29.0.0', 'jest-circus'],
    ])('returns the correct module names for jest %s', (jestMajorVersion, runnerName) => {
      getVersionSpy.mockImplementation(() => jestMajorVersion);

      expect(getJestRunner()).toEqual(runnerName);
    });
  });
});
