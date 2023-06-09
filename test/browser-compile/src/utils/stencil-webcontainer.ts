import { TranspileOptions } from '@stencil/core/compiler';
import { WebContainer } from '@webcontainer/api';
import { files } from './stencil-container-files';

/**
 * This just does initial setup for a web container
 */
export async function createStencilContainer() {
  const webcontainerInstance = await WebContainer.boot();

  await webcontainerInstance.mount(files);
  let install = await webcontainerInstance.spawn('npm', ['i'], {
    // output: false
  });
  await install.exit;
  // we install `@stencil/core@latest` by default, and we do it in our
  // WebContainer setup function to ensure that the package is always present
  // (we return the wc from this function, which implies it's ready to 'do
  // work', so we want to make sure that's the case)
  await installStencil(webcontainerInstance, 'latest');
  return webcontainerInstance;
}

export async function installStencil(wc: WebContainer, version: string) {
  let install = await wc.spawn('npm', ['i', `@stencil/core@${version}`], {});
  await install.exit;
}

export async function runStencilInfo(wc: WebContainer) {
  const result = await wc.spawn('npx', ['stencil', 'info']);
  result.output.pipeTo(
    new WritableStream({
      write(data) {
        console.log(data);
      },
    })
  );
  await result.exit;
}

export async function saveStencilComponentFile(wc: WebContainer, filename: string, data: string) {
  await wc.fs.writeFile(filename, data);
}

export async function saveStencilTranspileOptions(wc: WebContainer, data: TranspileOptions) {
  await wc.fs.writeFile('options.json', JSON.stringify(data));
}

function debounce<F, T extends Array<F>>(fn: (...args: T) => void, delay: number) {
  let timeout: any;

  return function (...args: T) {
    clearTimeout(timeout);
    timeout = setTimeout(() => {
      fn(...args);
    }, delay);
  };
}

export const runCompilation = debounce(async (wc: WebContainer, stream: WritableStream) => {
  const result = await wc.spawn('node', ['compile.js']);
  result.output.pipeTo(stream);
}, 300);
