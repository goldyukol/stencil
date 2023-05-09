import * as JestFacade from '../jest-facade';
import { getJestMajorVersion } from '../jest-version';

describe('getVersion', () => {
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

  it('returns the value returned by getVersion()', () => {
    getVersionSpy.mockImplementation(() => '28.0.0');
    expect(getJestMajorVersion()).toBe(28);
  });
});
