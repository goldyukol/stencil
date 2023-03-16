export const files = {
  "index.tsx": {
    file: {
      contents: "",
    },
  },
  "package.json": {
    file: {
      contents: JSON.stringify({
        name: "stencil-browser-playground",
        type: "module",
        dependencies: {
          // 3.1.0-dev.1678219461.af742f8 is a build of ap/remove-browser-support
          // performed on 3/7/23. See here:
          // https://github.com/ionic-team/stencil/actions/runs/4358070181/jobs/7618247756
          "@stencil/core": "3.1.0-dev.1678219461.af742f8",
        },
      }),
    },
  },
  "compile.js": {
    file: {
      contents: `
import { transpileSync } from '@stencil/core/compiler/stencil.js';
import { readFileSync } from 'fs';

const options = JSON.parse(readFileSync("./options.json"));
const componentString = String(readFileSync(options.file));

const transpiled = transpileSync(componentString, options);
console.log(transpiled.code);
  `,
    },
  },
};

// the above is kind of hacky! We write a string to the 'disk' within the
// web container which contains this little shim script we use to kick off
// transpilation.
