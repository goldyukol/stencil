import { Component, Host, h, State, Watch } from '@stencil/core';
import type StencilTypes from '@stencil/core/compiler';
import type TypeScriptTypes from 'typescript';
import { templates, templateList } from '../../utils/templates';
import {
  createStencilContainer,
  saveStencilTranspileOptions,
  saveStencilComponentFile,
  runTranspilation,
  installStencil,
  runCompilation,
  writeHTML,
  runDevServer,
  // installStencil,
} from '../../utils/stencil-webcontainer';
import { WebContainer, WebContainerProcess } from '@webcontainer/api';
import { EditorView, basicSetup } from 'codemirror';
import { ViewUpdate } from '@codemirror/view';
import { javascript } from '@codemirror/lang-javascript';
import { Logger } from '../../utils/logger';
import {Terminal} from 'xterm';

const INSTALL_ACTIONS = {
  install: 'installing Stencil...',
  initialize: 'initializing environment, installing Stencil...',
  none: '',
};

type InstallAction = keyof typeof INSTALL_ACTIONS;

@Component({
  tag: 'app-root',
  styleUrl: 'app-root.css',
})
export class AppRoot {
  file: HTMLInputElement;
  sourceCodeInput: HTMLDivElement;
  transpiledInput: HTMLTextAreaElement;
  bundledInput: HTMLTextAreaElement;
  htmlCodeInput: HTMLTextAreaElement;
  componentMetadata: HTMLSelectElement;
  proxy: HTMLSelectElement;
  module: HTMLSelectElement;
  target: HTMLSelectElement;
  sourceMap: HTMLSelectElement;
  style: HTMLSelectElement;
  styleImportData: HTMLSelectElement;
  componentExport: HTMLSelectElement;
  coreImportPath: HTMLSelectElement;
  build: HTMLSelectElement;
  fileTemplate: HTMLSelectElement;
  transpilerThread: HTMLSelectElement;
  iframe: HTMLIFrameElement;
  terminalEl: HTMLDivElement;
  /**
   * Holds a logger instance that we use to echo what's going on in the
   * {@link WebContainer} out to the console.
   *
   */
  logger: Logger;
  terminalInstance: Terminal;

  fs = new Map<string, string>();
  resolveLookup = new Map<string, string>();
  /**
   * Holds a reference to the {@link WebContainerProcess} for the dev server if
   * it is running.
   */
  devServerProcess: WebContainerProcess | null = null;

  @State() wrap = 'off';
  @State() buildView: 'transpiled' | 'bundled' = 'transpiled';
  @State() minified: 'uncompressed' | 'pretty' | 'minified' = 'uncompressed';
  @State() bundledLength = 0;
  @State() diagnostics: any = [];
  /**
   * This holds the {@link WebContainer} which is used to transpile and build
   * Stencil components in the browser.
   */
  @State() wc: WebContainer | null = null;
  @State() stencilVersions: string[] = [];
  @State() selectedStencilVersion = 'latest';
  @State() transpiledCode = '';
  @State() editorView: EditorView | null = null;
  /**
   * We use this to indicate both the initial setup (which covers both setting
   * up the WebContainer and installing `@stencil/core@latest`) and any
   * subsequent installs of `@stencil/core` that happen if we switch versions.
   */
  @State() currentInstallAction: InstallAction = 'initialize';

  async componentDidLoad() {
    this.fetchStencilVersions();
    this.editorView = new EditorView({
      extensions: [
        javascript({
          jsx: true,
          typescript: true,
        }),
        basicSetup,
        EditorView.updateListener.of((v: ViewUpdate) => {
          console.log('EDITOR CHANGE DETECTED');
          if (v.docChanged) {
            this.transpile();
          }
        }),
      ],
      parent: this.sourceCodeInput,
    });
    this.loadTemplate(templates.keys().next().value);

    this.terminalInstance = new Terminal({
      convertEol: true,
    });
    this.terminalInstance.open(this.terminalEl);

    this.logger = new Logger(this.terminalInstance);

    const wc = await createStencilContainer(this.logger);
    this.wc = wc;
    this.currentInstallAction = 'none';
    this.transpile();
  }

  @Watch('selectedStencilVersion')
  async watchSelectedStencilVersion(newVal: string, _oldVal: string) {
    this.currentInstallAction = 'install';
    await installStencil(this.wc, newVal, this.logger.createWritableStream());
    this.currentInstallAction = 'none';
  }

  async fetchStencilVersions() {
    const response = await fetch('https://registry.npmjs.org/@stencil/core');
    const json = await response.json();
    const versionsAndTags = [...Object.keys(json.versions), ...Object.keys(json['dist-tags'])]
      .filter((v) => v !== 'latest')
      .reverse();
    this.stencilVersions = versionsAndTags;
  }

  loadTemplate(fileName: string) {
    this.file.value = fileName;
    const tmp = templates.get(fileName);

    // Echo the newly-selected template into the code editor
    //
    // In CodeMirror this is done by creating a transaction which is then
    // dispatched to the editor view. To replace all the text we just
    // insert our new text over the range of the whole current text.
    const updateTransaction = this.editorView.state.update({
      changes: {
        from: 0,
        to: this.editorView.state?.doc.length,
        insert: tmp.source.trim(),
      },
    });
    this.editorView.dispatch(updateTransaction);
    this.htmlCodeInput.value = tmp.html.trim();
    this.transpile();
  }

  /**
   * Run the quick transpilation step (for showing a preview of the output
   * code). This does not run a full build like `npm run build` would, so the
   * output is not bundled and ready for use in the browser.
   */
  async transpile() {
    if (this.wc) {
      const file = getComponentFilename(this.file.value);
      console.log(file);
      const opts: StencilTypes.TranspileOptions = {
        file,
        componentExport: this.componentExport.value,
        componentMetadata: this.componentMetadata.value,
        coreImportPath: this.coreImportPath.value !== 'null' ? this.coreImportPath.value : null,
        proxy: this.proxy.value,
        module: this.module.value ?? 'esm',
        target: this.target.value,
        sourceMap: this.sourceMap.value === 'true' ? true : this.sourceMap.value === 'inline' ? 'inline' : false,
        style: this.style.value,
        styleImportData: this.styleImportData.value,
      };

      await saveStencilTranspileOptions(this.wc, opts);
      const currentValue = this.editorView.state.doc.toString();
      await saveStencilComponentFile(this.wc, file, currentValue);
      const that = this;
      const writeableStream = new WritableStream({
        write(data) {
          // this writes the transpiled output JS into the textarea
          that.transpiledCode = data;
        },
      });
      await runTranspilation(this.wc, writeableStream);
      console.log('done!');

      this.diagnostics = [];
      this.wrap = 'off';

      this.diagnostics.forEach((d: any) => {
        if (d.level === 'error') {
          console.error(d.messageText);
        } else if (d.level === 'warn') {
          console.warn(d.messageText);
        } else {
          console.info(d.messageText);
        }
      });
    }
  }

  async bundle() {
    if (this.devServerProcess) {
      this.devServerProcess.kill();
    }
    await writeHTML(this.wc, this.htmlCodeInput.value);
    await runCompilation(this.wc, this.logger.createWritableStream());

    this.devServerProcess = await runDevServer(this.wc, this.logger.createWritableStream(), this.iframe);

    this.iframe.src = this.iframe.src;
  }

  async refreshPreview() {
    console.log('preview reload');
    // TODO do this here? how do we make sure dev server build finishes?
    // await writeHTML(this.wc, this.htmlCodeInput.value);
    this.iframe.src = this.iframe.src;
  }

  openInWindow = () => {
    window.open('/preview.html', '_blank');
  };

  render() {
    return (
      <Host>
        <div class="stencil-version">
          <label>
            <span>Stencil version:</span>
            <select
              ref={(el) => (this.componentExport = el)}
              onInput={(e: any) => {
                const newSelectedVersion = e.target.value;
                this.selectedStencilVersion = newSelectedVersion;
              }}
            >
              <option value="latest" selected>
                latest (default)
              </option>
              {this.stencilVersions.map((version) => (
                <option value={version}>{version}</option>
              ))}
            </select>
          </label>
          {this.currentInstallAction ? (
            <span class="install-action">
              <em>{INSTALL_ACTIONS[this.currentInstallAction]}</em>
            </span>
          ) : null}
        </div>
        <main>
          <section class="source">
            <header>Source</header>
            <div class="codemirror-container" ref={(el) => (this.sourceCodeInput = el)} />
            <div class="options">
              <header>Options</header>
              <label>
                <span>Templates:</span>
                <select
                  ref={(el) => (this.fileTemplate = el)}
                  onInput={(ev: any) => {
                    this.loadTemplate(ev.target.value);
                  }}
                >
                  {templateList.map((fileName) => (
                    <option value={fileName}>{fileName.replace('.tsx', '')}</option>
                  ))}
                </select>
              </label>
              <label>
                <span>File:</span>
                <input ref={(el) => (this.file = el)} onInput={this.transpile.bind(this)} />
              </label>
              <label>
                <span>Export:</span>
                <select ref={(el) => (this.componentExport = el)} onInput={this.transpile.bind(this)}>
                  <option value="customelement">customelement</option>
                  <option value="module">module</option>
                  <option value="null">null</option>
                </select>
              </label>
              <label>
                <span>Module:</span>
                <select ref={(el) => (this.module = el)} onInput={this.transpile.bind(this)}>
                  <option value="esm">esm</option>
                  <option value="cjs">cjs</option>
                  <option value="null">null</option>
                </select>
              </label>
              <label>
                <span>Target:</span>
                <select ref={(el) => (this.target = el)} onInput={this.transpile.bind(this)}>
                  <option value="latest">latest</option>
                  <option value="esnext">esnext</option>
                  <option value="es2020">es2020</option>
                  <option value="es2017">es2017</option>
                  <option value="es2015">es2015</option>
                  <option value="es5">es5</option>
                  <option value="null">null</option>
                </select>
              </label>
              <label>
                <span>Source Map:</span>
                <select ref={(el) => (this.sourceMap = el)} onInput={this.transpile.bind(this)}>
                  <option value="true">true</option>
                  <option value="inline">inline</option>
                  <option value="false">false</option>
                  <option value="null">null</option>
                </select>
              </label>
              <label>
                <span>Style:</span>
                <select ref={(el) => (this.style = el)} onInput={this.transpile.bind(this)}>
                  <option value="static">static</option>
                  <option value="null">null</option>
                </select>
              </label>
              <label>
                <span>Style Import Data:</span>
                <select ref={(el) => (this.styleImportData = el)} onInput={this.transpile.bind(this)}>
                  <option value="queryparams">queryparams</option>
                  <option value="null">null</option>
                </select>
              </label>
              <label>
                <span>Proxy:</span>
                <select ref={(el) => (this.proxy = el)} onInput={this.transpile.bind(this)}>
                  <option value="defineproperty">defineproperty</option>
                  <option value="null">null</option>
                </select>
              </label>
              <label>
                <span>Metadata:</span>
                <select ref={(el) => (this.componentMetadata = el)} onInput={this.transpile.bind(this)}>
                  <option value="null">null</option>
                  <option value="compilerstatic">compilerstatic</option>
                </select>
              </label>
              <label>
                <span>Core:</span>
                <select ref={(el) => (this.coreImportPath = el)} onInput={this.transpile.bind(this)}>
                  <option value="null">null</option>
                  <option value="@stencil/core/internal/client">@stencil/core/internal/client</option>
                  <option value="@stencil/core/internal/testing">@stencil/core/internal/testing</option>
                </select>
              </label>
              <label>
                <span>Transpiler:</span>
                <select ref={(el) => (this.transpilerThread = el)} onInput={this.transpile.bind(this)}>
                  <option value="main">Main thread</option>
                  <option value="worker">Worker thread</option>
                </select>
              </label>
            </div>
          </section>

          <section class="build">
            <header>{this.buildView === 'transpiled' ? 'Transpiled Build' : 'Bundled Build'}</header>

            <div class="transpiled">
              <pre>
                <code class="language-javascript">{this.transpiledCode}</code>
              </pre>
            </div>

            <div class="options">
              <label>
                <span>Build:</span>
                <button
                  onClick={() => {
                    this.bundle();
                  }}
                >
                bundle
                </button>
              </label>
            </div>
            <div ref={el => this.terminalEl = el} class="terminal"></div>
          </section>

          <section class="preview">
            <header>HTML</header>
            <textarea
              class="html"
              spellcheck="false"
              wrap="off"
              autocapitalize="off"
              ref={(el) => (this.htmlCodeInput = el)}
              onInput={this.refreshPreview.bind(this)}
            />
            <div class="options"></div>

            <div class="view">
              <header>
                Preview
                <a href="#" onClick={this.openInWindow}>
                  Open in window
                </a>
              </header>
              <iframe ref={(el) => (this.iframe = el)}></iframe>
            </div>
          </section>
        </main>
      </Host>
    );
  }
}

function getComponentFilename(filename: string): string {
  return 'src/components/' + filename;
}

declare const stencil: typeof StencilTypes;
declare const ts: typeof TypeScriptTypes;
// declare const rollup: typeof RollupTypes;
