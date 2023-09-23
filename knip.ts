
const config = {
  entry: ['src/{cli, client, compiler, declarations, dev-server, hydrate, internal, mock-doc, runtime, screenshot, sys, testing, utils}/index.ts'],
  project: ['src/{cli, client, compiler, declarations, dev-server, hydrate, internal, mock-doc, runtime, screenshot, sys, testing, utils}/*.{ts,tsx}', 'scripts/**/*.{ts,tsx,js}'],
  // ignore: ['scripts/**']
};

export default config;
