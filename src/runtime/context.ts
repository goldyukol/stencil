import { Context, doc, getAssetPath, readTask, tick, win, writeTask } from '@platform';
import { BUILD } from '@build-conditionals';

export const getContext = (_elm: HTMLElement, context: string) => {
  if (context in Context) {
    return Context[context];

  } else if (context === 'window') {
    return win;
  } else if (context === 'document') {
    return doc;
  } else if (context === 'isServer' || context === 'isPrerender') {
    return !!BUILD.hydrateServerSide;
  } else if (context === 'isClient') {
    return !BUILD.hydrateServerSide;
  } else if (context === 'resourcesUrl' || context === 'publicPath') {
    return getAssetPath('.');
  } else if (context === 'queue') {
    return {
      write: writeTask,
      read: readTask,
      tick
    };
  }
  return undefined;
};
