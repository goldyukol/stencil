import { getVersion } from 'jest';
const jestMocks = { getVersion };

import { getJestMajorVersion } from '../jest-version';

describe('getVersion', () => {
  let jestGetVersionSpy: jest.SpyInstance<
    ReturnType<typeof jestMocks.getVersion>,
    Parameters<typeof jestMocks.getVersion>
  >;

  beforeEach(() => {
    jestGetVersionSpy = jest.spyOn(jestMocks, 'getVersion');
  });

  afterEach(() => {
    jestGetVersionSpy.mockRestore();
  });

  it('returns the value returned by getVersion()', () => {
    // TODO(NOW): Our mocks above don't work
    jestGetVersionSpy.mockImplementation(() => '28.0.0');
    expect(getJestMajorVersion()).toBe(28);
  });
});
