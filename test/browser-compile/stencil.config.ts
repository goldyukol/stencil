import { Config } from '../../internal';

export const config: Config = {
  namespace: 'BrowserCompile',

  outputTargets: [
    {
      type: 'www',
      serviceWorker: null,
    },
  ],
  enableCache: false,
};
