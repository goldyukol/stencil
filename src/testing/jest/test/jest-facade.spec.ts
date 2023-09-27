import { getVersion } from '../jest-facade';
import * as JestVersion from '../jest-version';

describe('jest-facade', () => {
  let getJestMajorVersionSpy: jest.SpyInstance<
    ReturnType<typeof JestVersion.getJestMajorVersion>,
    Parameters<typeof JestVersion.getJestMajorVersion>
  >;

  beforeEach(() => {
    getJestMajorVersionSpy = jest.spyOn(JestVersion, 'getJestMajorVersion');
  });

  afterEach(() => {
    getJestMajorVersionSpy.mockRestore();
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
      getJestMajorVersionSpy.mockImplementation(() => semverStr);
      expect(getVersion()).toBe(majorVersion);
    });
  });
});
