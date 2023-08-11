import { TranspileOptions } from '@stencil/core/compiler';
import { WebContainer } from '@webcontainer/api';
import { Logger } from './logger';
import { files } from './stencil-container-files';

/**
 * This just does initial setup for a web container
 */
export async function createStencilContainer(logger: Logger) {
  const webcontainerInstance = await WebContainer.boot();
  await webcontainerInstance.mount(files);
  let install = await webcontainerInstance.spawn('npm', ['i'], {
    // output: false
  });
  install.output.pipeTo(logger.createWritableStream());
  await install.exit;
  // we install `@stencil/core@latest` by default, and we do it in our
  // WebContainer setup function to ensure that the package is always present
  // (we return the wc from this function, which implies it's ready to 'do
  // work', so we want to make sure that's the case)
  await installStencil(webcontainerInstance, 'latest', logger.createWritableStream());
  return webcontainerInstance;
}

export async function installStencil(wc: WebContainer, version: string, logStream: WritableStream) {
  let install = await wc.spawn('npm', ['i', `@stencil/core@${version}`], {});
  install.output.pipeTo(logStream);
  await install.exit;
}

export async function runStencilInfo(wc: WebContainer, logStream: WritableStream) {
  const result = await wc.spawn('npx', ['stencil', 'info']);
  result.output.pipeTo(logStream);
  await result.exit;
}

export async function saveStencilComponentFile(wc: WebContainer, filename: string, data: string) {
  await wc.fs.writeFile(filename, data);
}

/**
 * This writes a file called `options.json` within the webcontainer which
 * contains information that will be picked up by the `transpile.js` script to
 * correctly transpile
 *
 */
export async function saveStencilTranspileOptions(wc: WebContainer, data: TranspileOptions) {
  await wc.fs.writeFile('options.json', JSON.stringify(data));
}

/**
 * it's `ls`, what do you want?
 */
export const ls = async (wc: WebContainer, path: string, logStream: WritableStream): Promise<void> => {
  const result = await wc.spawn('ls', [path]);
  result.output.pipeTo(logStream);
  await result.exit;
};

export const runTranspilation = async (wc: WebContainer, stream: WritableStream) => {
  const result = await wc.spawn('node', ['compile.js']);
  result.output.pipeTo(stream);
  await result.exit;
};

export const runCompilation = async (wc: WebContainer, stream: WritableStream) => {
  const result = await wc.spawn('npx', ['stencil', 'build']);
  result.output.pipeTo(stream);
  await result.exit;
};

export const writeHTML = async (wc: WebContainer, html: string) => {
  await wc.fs.writeFile(
    "src/index.html",
    `<!DOCTYPE html>
<html dir="ltr" lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0, minimum-scale=1.0, maximum-scale=5.0" />
    <title>Stencil Component Playground Preview</title>

    <script type="module" src="/build/stencil-browser-playground.esm.js"></script>
    <script nomodule src="/build/stencil-browser-playground.js"></script>
  </head>
  <body>
    ${ html }
  </body>
</html>`
  )
}

export const runDevServer = async (wc: WebContainer, stream: WritableStream, iframeEl: HTMLIFrameElement) => {

  const result = await wc.spawn('node', ['dev-server.js']);

  result.output.pipeTo(stream);

  // Wait for `server-ready` event
  wc.on('server-ready', (_port, url) => {
    console.log('THIS HAPPENS');
    console.log(url);
    iframeEl.src = url;
  });

  return result
}
