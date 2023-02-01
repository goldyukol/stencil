import type { CompilerSystem } from '../declarations';

export const loadCoreCompiler = async (_sys: CompilerSystem): Promise<CoreCompiler> => {
  const coreCompiler = await import('@stencil/core/compiler');

  return coreCompiler
};

export type CoreCompiler = typeof import('@stencil/core/compiler');
