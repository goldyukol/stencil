import * as d from '../../../declarations';
import { fetchUrlSync } from '../fetch/fetch-module-sync';
import { IS_WEB_WORKER_ENV, IS_CASE_SENSITIVE_FILE_NAMES } from '../environment';
import { basename, resolve } from 'path';
import { noop } from '@utils';
import ts from 'typescript';


export const getTypeScriptSys = async (config: d.Config, inMemoryFs: d.InMemoryFileSystem) => {
  const stencilSys = config.sys_next;
  const tsSys = Object.assign({}, ts.sys || {} as ts.System);

  patchTsSystemFileSystem(config, stencilSys, inMemoryFs, tsSys);
  patchTsSystemWatch(stencilSys, tsSys);
  patchTsSystemUtils(tsSys);

  return tsSys;
};


const patchTsSystemFileSystem = (config: d.Config, stencilSys: d.CompilerSystem, inMemoryFs: d.InMemoryFileSystem, tsSys: ts.System) => {
  const skipFile = (readPath: string) => {
    // filter e2e tests
    if (readPath.includes('.e2e.') || readPath.includes('/e2e.')) {
      // keep this test if it's an e2e file and we should be testing e2e
      return true;
    }

    // filter spec tests
    if (readPath.includes('.spec.') || readPath.includes('/spec.')) {
      return true;
    }
    return false;
  };

  const realpath = (path: string) => {
    const rp = stencilSys.realpathSync(path);
    if (rp) {
      return rp;
    }
    return path;
  };

  const getAccessibleFileSystemEntries = (path: string) => {
    try {
      const entries = stencilSys.readdirSync(path || '.').sort();
      const files: string[] = [];
      const directories: string[] = [];

      for (const absPath of entries) {
        // This is necessary because on some file system node fails to exclude
        // "." and "..". See https://github.com/nodejs/node/issues/4002
        const stat = stencilSys.statSync(absPath);
        if (!stat) {
          continue;
        }

        const entry = basename(absPath);
        if (stat.isFile()) {
          files.push(entry);
        } else if (stat.isDirectory()) {
          directories.push(entry);
        }
      }
      return { files, directories };

    } catch (e) {
      return { files: [], directories: [] };
    }
  };

  tsSys.createDirectory = (p) => stencilSys.mkdirSync(p);

  tsSys.directoryExists = (p) => {
    if (skipFile(p)) {
      return false;
    }
    const s = inMemoryFs.statSync(p);
    return s.isDirectory;
  };

  tsSys.fileExists = (p) => {
    if (skipFile(p)) {
      return false;
    }
    const s = inMemoryFs.statSync(p);
    return s.isFile;
  };

  tsSys.getDirectories = (p) => {
    const items = stencilSys.readdirSync(p);
    return items.filter(itemPath => {
      const s = stencilSys.statSync(itemPath);
      return !!(s && s.isDirectory());
    });
  };

  tsSys.readDirectory = (path, extensions, exclude, include, depth) => {
    const cwd = stencilSys.getCurrentDirectory();
    return (ts as any).matchFiles(path, extensions, exclude, include, IS_CASE_SENSITIVE_FILE_NAMES, cwd, depth, getAccessibleFileSystemEntries, realpath);
  };

  tsSys.readFile = (p) => {
    if (skipFile(p)) {
      return undefined;
    }
    const isUrl = p.startsWith('https:') || p.startsWith('http:');
    let content = inMemoryFs.readFileSync(p, { useCache: isUrl });

    if (typeof content !== 'string' && isUrl) {
      if (IS_WEB_WORKER_ENV) {
        content = fetchUrlSync(p);
        if (typeof content === 'string') {
          inMemoryFs.writeFile(p, content);
        }
      } else {
        config.logger.error(`ts.sys can only request http resources from within a web worker: ${p}`);
      }
    }

    return content;
  };

  tsSys.writeFile = (p, data) =>
    inMemoryFs.writeFile(p, data);
};


const patchTsSystemWatch = (stencilSys: d.CompilerSystem, tsSys: ts.System) => {

  tsSys.watchDirectory = (p, cb, recursive) => {
    const watcher = stencilSys.watchDirectory(p, (filePath) => {
      cb(filePath);
    }, recursive);
    return {
      close() {
        watcher.close();
      }
    };
  };

  tsSys.watchFile = (p, cb) => {
    const watcher = stencilSys.watchFile(p, (filePath, eventKind) => {
      if (eventKind === 'fileAdd') {
        cb(filePath, ts.FileWatcherEventKind.Created);
      } else if (eventKind === 'fileUpdate') {
        cb(filePath, ts.FileWatcherEventKind.Changed);
      } else if (eventKind === 'fileDelete') {
        cb(filePath, ts.FileWatcherEventKind.Deleted);
      }
    });
    return {
      close() {
        watcher.close();
      }
    };
  };

};


export const patchTsSystemUtils = (tsSys: ts.System) => {
  if (!tsSys.getCurrentDirectory) {
    tsSys.getCurrentDirectory = () => '/';
  }

  if (!tsSys.args) {
    tsSys.args = [];
  }

  if (!tsSys.newLine) {
    tsSys.newLine = '\n';
  }

  if (typeof tsSys.useCaseSensitiveFileNames !== 'boolean') {
    tsSys.useCaseSensitiveFileNames = IS_CASE_SENSITIVE_FILE_NAMES;
  }

  if (!tsSys.exit) {
    tsSys.exit = noop;
  }

  if (!tsSys.resolvePath) {
    tsSys.resolvePath = (p) => resolve(p);
  }

  if (!tsSys.write) {
    tsSys.write = noop;
  }
};
