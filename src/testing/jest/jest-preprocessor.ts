import { getJestMajorVersion } from './jest-version';
import {jestPreprocessor27, jestPreprocessor28} from "../index";

// TODO(STENCIL-306): Remove support for earlier versions of Jest
type Jest26Config = { instrument: boolean; rootDir: string };
type Jest27TransformOptions = { config: Jest26Config };

export const jestPreprocessorTodoRemove = {
  /**
   * Transforms a file to CommonJS to be used by Jest. The API for `process` is described in the
   * ["Writing custom transformers"](https://jestjs.io/docs/code-transformation#writing-custom-transformers)
   * documentation on the jest site. Unfortunately, the URL is not versioned at the time of this writing. For
   * reference, the v27.2 docs were referenced (the most recent available).
   *
   * This function attempts to support several versions of Jest (v23 through v27). Support for earlier versions of Jest
   * will be removed in a future major version of Stencil.
   *
   * @param sourceText the contents of the source file
   * @param sourcePath the path to the source file
   * @param jestConfig the jest configuration when called by Jest 26 and lower. This parameter is folded into
   * `transformOptions` when called by Jest 27+ as a top level `config` property. Calls to this function from Jest 27+
   * will have a `Jest27TransformOptions` shape
   * @param transformOptions an object containing the various transformation options. In Jest 27+ this parameter occurs
   * third in this function signature (and no fourth parameter is formally accepted)
   * @returns the transformed file contents if the file should be transformed. returns the original source otherwise
   */
  process(
    sourceText: string,
    sourcePath: string,
    // TODO(NOW): This is probably gonna be an issue
    jestConfig: Jest26Config | Jest27TransformOptions,
    transformOptions?: Jest26Config
  ): string {
    console.log(`hello ryan`)
    const jestVersion = getJestMajorVersion();
    if (jestVersion <= 27) {
      const { process } = jestPreprocessor27
      return process(sourceText, sourcePath, jestConfig, transformOptions);
    } else if (jestVersion === 28) {
      const { process } = jestPreprocessor28
      // @ts-expect-error
      return process(sourceText, sourcePath, jestConfig, transformOptions);
    } else {
      throw new Error('Not implemented!');
    }
  },
};
