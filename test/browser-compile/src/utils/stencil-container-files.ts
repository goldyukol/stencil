export const files = {
  'index.tsx': {
    file: {
      contents: '',
    },
  },
  src: {
    directory: {
      components: {
        directory: {},
      },
    },
  },
  'package.json': {
    file: {
      contents: JSON.stringify({
        name: 'stencil-browser-playground',
        type: 'module',
        dependencies: {
          '@stencil/core': 'latest',
          express: '4.18.2',
        },
      }),
    },
  },
  'compile.js': {
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
  'dev-server.js': {
    file: {
      contents: `
import express from 'express';
const app = express();
const port = 3111;

app.use(express.static('www'));

app.listen(port, () => {
  console.log(\`App is live at http://localhost:\${port}\`);
});`,
    },
  },
  'stencil.config.ts': {
    file: {
      contents: `import { Config } from '@stencil/core';

export const config: Config = {
  namespace: 'stencil-browser-playground',
  outputTargets: [
    {
      type: 'www',
      serviceWorker: null, // disable service workers
    },
  ],
  testing: {
    browserHeadless: "new",
  },
};`,
    },
  },
  'tsconfig.json': {
    file: {
      contents: JSON.stringify({
        compilerOptions: {
          allowSyntheticDefaultImports: true,
          allowUnreachableCode: false,
          declaration: false,
          experimentalDecorators: true,
          lib: ['dom', 'es2017'],
          moduleResolution: 'node',
          module: 'esnext',
          target: 'es2017',
          noUnusedLocals: true,
          noUnusedParameters: true,
          jsx: 'react',
          jsxFactory: 'h',
        },
        include: ['src'],
        exclude: ['node_modules'],
      }),
    },
  },
};

// the above is kind of hacky! We write a string to the 'disk' within the
// web container which contains this little shim script we use to kick off
// transpilation.
