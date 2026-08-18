import { Config } from '@stencil/core';
import { reactOutputTarget } from '@stencil/react-output-target';
import { angularOutputTarget } from '@stencil/angular-output-target';

export const config: Config = {
  namespace: 'brandsync-wc',
  globalStyle: 'src/global/index.css',
  outputTargets: [
    {
      type: 'dist',
      esmLoaderPath: '../loader',
    },
    {
      type: 'dist-custom-elements',
      customElementsExportBehavior: 'auto-define-custom-elements',
      externalRuntime: false,
    },
    {
      type: 'docs-readme',
    },
    {
      type: 'docs-custom-elements-manifest',
      file: 'custom-elements.json',
    },
    {
      type: 'www',
      serviceWorker: null, // disable service workers
    },
    reactOutputTarget({
      outDir: '../brandsync-web-components-react/src',
      componentCorePackage: '@brandsync/wc',
      proxiesFile: '../brandsync-web-components-react/src/components.ts',
    }),
    angularOutputTarget({
      componentCorePackage: '@brandsync/wc',
      outputType: 'standalone',
      // Angular's default ('components') differs from React output-target's default
      // ('dist/components') for the same package -- align them so @brandsync/wc only needs one
      // exports entry to serve both wrapper packages.
      customElementsDir: 'dist/components',
      directivesProxyFile: '../brandsync-web-components-angular/src/lib/components.ts',
      directivesArrayFile: '../brandsync-web-components-angular/src/lib/index.ts',
    }),
  ],
};
