import { TranspileOptions } from "@stencil/core/compiler";
import { WebContainer } from "@webcontainer/api";
import { files } from "./stencil-container-files";

/**
 * This just does initial setup for a web container
 */
export async function createStencilContainer() {
  const webcontainerInstance = await WebContainer.boot();

  await webcontainerInstance.mount(files);
  let install = await webcontainerInstance.spawn("npm", ["i"], {
    // output: false
  });
  await install.exit;
  return webcontainerInstance;
}

export async function runStencilInfo(wc: WebContainer) {
  const result = await wc.spawn("npx", ["stencil", "info"]);
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

export async function saveStencilTranspileOptions(
  wc: WebContainer,
  data: TranspileOptions
) {
  await wc.fs.writeFile("options.json", JSON.stringify(data));
}

export async function runCompilation(wc: WebContainer, stream: WritableStream) {
  const result = await wc.spawn("node", ["compile.js"]);
  result.output.pipeTo(stream);
}
