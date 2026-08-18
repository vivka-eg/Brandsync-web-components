import type { Preview } from '@storybook/web-components-vite';
import { setCustomElementsManifest } from '@storybook/web-components';
import { defineCustomElements } from '../loader';
import customElementsManifest from '../custom-elements.json';
import '../src/global/index.css';

// Drives the auto-generated props/slots/parts tables on each component's Docs page from the
// same @Prop/@slot/@part JSDoc tags in the .tsx source -- one source of truth, not a hand-written
// doc that drifts from the code.
setCustomElementsManifest(customElementsManifest);

// Storybook is itself a "consuming app" -- per CONVENTIONS.md / README.md, loading the Roboto
// font file is the consuming app's job, not the library's. Weights match brandsync-tokens'
// --bs-font-weight-* scale (thin/regular/medium/semibold/bold/black).
const robotoLink = document.createElement('link');
robotoLink.rel = 'stylesheet';
robotoLink.href = 'https://fonts.googleapis.com/css2?family=Roboto:wght@100;400;500;600;700;900&display=swap';
document.head.appendChild(robotoLink);

defineCustomElements();

const preview: Preview = {
  // Each component now gets a hand-authored .mdx docs page (Carbon-style: overview, named
  // variant sections, Component API, Accessibility) instead of the generic autodocs template.
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
  },
};

export default preview;
