import type { Preview, Decorator } from '@storybook/web-components-vite';
import { setCustomElementsManifest } from '@storybook/web-components';
import customElementsManifest from '../custom-elements.json';
import '../src/global/index.css';

// Deliberately NOT using `defineCustomElements()` from '../loader' here. That loader is Stencil's
// *lazy* dist output: each component's JS is fetched via a runtime `import()` whose path is
// computed dynamically (relative to the loader's own resolved URL) at the moment a given tag is
// first used, not a static string Vite's bundler can see ahead of time. That's invisible in local
// `storybook dev` (Vite's dev server serves any file from disk on request, static analysis or
// not), but `build-storybook`'s production Vite build can only bundle/copy files it can discover
// via static import analysis -- so every one of those lazy per-component chunks (bs-composer.js,
// bs-button.js, etc.) silently gets left out of storybook-static/, and every component 404s with
// "Constructor for ... was not found" the moment it's hosted anywhere (confirmed by inspecting our
// own already-built storybook-static/assets/ -- zero .entry.js files present).
//
// The fix is to import each component from the *non-lazy* `dist-custom-elements` output instead
// (dist/components/<tag>.js -- self-contained, calls customElements.define on import, no dynamic
// import() inside). A plain top-level `import` is a static reference Vite can always resolve and
// bundle correctly in both dev and static-build modes.
//
// Keep this list in sync with src/components/*/ -- add a line here for every new component.
import '../dist/components/bs-ai-disclaimer.js';
import '../dist/components/bs-ai-greeting.js';
import '../dist/components/bs-ai-thinking.js';
import '../dist/components/bs-attachment.js';
import '../dist/components/bs-attachment-list.js';
import '../dist/components/bs-badge.js';
import '../dist/components/bs-button.js';
import '../dist/components/bs-button-skeleton.js';
import '../dist/components/bs-card.js';
import '../dist/components/bs-chatbot-feedback.js';
import '../dist/components/bs-chatbot-header.js';
import '../dist/components/bs-chatbot-response-action.js';
import '../dist/components/bs-chatbot-sources-drawer.js';
import '../dist/components/bs-chatbot-suggestion-button.js';
import '../dist/components/bs-composer.js';
import '../dist/components/bs-composer-status-banner.js';
import '../dist/components/bs-data-table.js';
import '../dist/components/bs-input.js';
import '../dist/components/bs-menu.js';
import '../dist/components/bs-menu-item.js';
import '../dist/components/bs-modal.js';
import '../dist/components/bs-source-link.js';
import '../dist/components/bs-tooltip.js';

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

// brandsync-tokens themes via a `[data-theme="dark"]` attribute selector in tokens.css -- CSS
// custom properties inherit through shadow DOM boundaries, so setting this on the preview
// iframe's <html> re-themes every bs-* component's internals automatically, no per-component
// changes needed. Also flips the canvas background so the empty space around a component matches
// its surface, not just the component itself.
const withThemeAttribute: Decorator = (story, context) => {
  const theme = context.globals.theme ?? 'light';
  document.documentElement.setAttribute('data-theme', theme);
  document.body.style.background = 'var(--bs-surface-base)';
  return story();
};

// Storybook's built-in Measure tool crawls shadow roots (see its `deepElementFromPoint`/
// `crawlShadows` in the storybook package), but in practice lands on the wrong nested node for
// our components (icon SVGs nested inside slots inside shadow-DOM buttons) and draws degenerate
// boxes. Since every component in this library already exposes consistent `part="..."`
// attributes on its structural elements (per CONVENTIONS.md), this outlines every `[part]`
// element directly -- injected straight into each shadow root (not via ::part(), which would
// need every part name enumerated per component) so it works uniformly across the whole library.
const PARTS_DEBUG_STYLE_ID = 'bs-debug-parts-style';
const PARTS_DEBUG_CSS = `
  [part] {
    outline: 1px dashed #ff2fb2 !important;
    outline-offset: -1px;
  }
  [part] {
    position: relative;
  }
  [part]::before {
    content: attr(part);
    position: absolute;
    top: 0;
    left: 0;
    transform: translateY(-100%);
    background: #ff2fb2;
    color: white;
    font-size: 9px;
    line-height: 1.4;
    padding: 0 3px;
    font-family: monospace;
    white-space: nowrap;
    pointer-events: none;
    z-index: 2147483647;
  }
`;

function applyPartsDebug(root: Document | ShadowRoot | Element, enabled: boolean) {
  const walk = (node: Element) => {
    const shadow = (node as HTMLElement).shadowRoot;
    if (shadow) {
      const existing = shadow.getElementById(PARTS_DEBUG_STYLE_ID);
      if (enabled && !existing) {
        const style = document.createElement('style');
        style.id = PARTS_DEBUG_STYLE_ID;
        style.textContent = PARTS_DEBUG_CSS;
        shadow.appendChild(style);
      } else if (!enabled && existing) {
        existing.remove();
      }
      shadow.querySelectorAll('*').forEach(walk);
    }
    node.querySelectorAll('*').forEach(walk);
  };
  if (root instanceof Element) walk(root);
  else root.querySelectorAll('*').forEach(walk);
}

const withPartsDebug: Decorator = (story, context) => {
  const enabled = Boolean(context.globals.showParts);
  const result = story();
  // Run after the story's custom elements have actually rendered/hydrated their shadow roots
  // (Stencil hydration is async), and again shortly after to catch anything that was still
  // upgrading on the first pass.
  requestAnimationFrame(() => applyPartsDebug(document.body, enabled));
  setTimeout(() => applyPartsDebug(document.body, enabled), 300);
  return result;
};

const preview: Preview = {
  globalTypes: {
    theme: {
      name: 'Theme',
      description: 'brandsync-tokens color theme',
      toolbar: {
        icon: 'circlehollow',
        items: [
          { value: 'light', icon: 'sun', title: 'Light' },
          { value: 'dark', icon: 'moon', title: 'Dark' },
        ],
        dynamicTitle: true,
      },
    },
    showParts: {
      name: 'Show parts',
      description: 'Outline every shadow-DOM part with its part name (shadow-DOM-aware alternative to the Measure tool)',
      toolbar: {
        icon: 'ruler',
        items: [
          { value: false, icon: 'eyeclose', title: 'Parts hidden' },
          { value: true, icon: 'eye', title: 'Parts outlined' },
        ],
        dynamicTitle: true,
      },
    },
  },
  initialGlobals: {
    theme: 'light',
    showParts: false,
  },
  decorators: [withThemeAttribute, withPartsDebug],
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
