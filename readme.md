# @brandsync/wc

Brandsync's design system components as framework-agnostic Web Components — real, self-contained
custom elements consumed the same way by React, Angular, Blazor, or plain HTML. Built with
[Stencil](https://stenciljs.com), styled entirely from `brandsync-tokens` CSS Custom Properties.

See `CONVENTIONS.md` for the customization surface every component follows (CSS Custom Properties,
Shadow Parts, slots), and `docs/blazor-interop/` for a worked Blazor/MudBlazor consumption example.

## Getting started

```bash
npm install
npm run build      # compiles all components, generates React/Angular wrapper packages
npm test           # runs the component test suite
npm run storybook  # interactive component catalog at http://localhost:6006
```

## Typography

`brandsync-tokens` specifies Roboto (`--bs-typography-font-family-*`) and every component's shadow
styles inherit `font-family` from the document root — but **loading the actual Roboto font file is
the consuming app's job**, same convention already used across `eg-brandsync` (a Google Fonts
`<link>`, or `next/font/google` in Next.js apps). This library ships styling, not a font file.

```html
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Roboto:wght@100;400;500;600;700;900&display=swap">
```

Those weights (100/400/500/600/700/900) match `brandsync-tokens`' `--bs-font-weight-*` scale
exactly. If Roboto isn't loaded, components still work — text just falls back to the browser's
default sans-serif.

## Usage

```html
<script type="module" src="https://unpkg.com/@brandsync/wc"></script>
<bs-button variant="primary">Book room</bs-button>
```

Or from `node_modules`, per-component:

```ts
import '@brandsync/wc/dist/components/bs-button.js';
```

React and Angular get auto-generated wrapper packages (`@stencil/react-output-target` /
`@stencil/angular-output-target`) built from the same source — see `stencil.config.ts`.

## Design tokens — required, not optional

Every component's shadow-DOM CSS is written entirely against `--bs-*` custom properties
(`--bs-input-bg-default`, `--bs-composer-button-size`, `--bs-spacing-150`, ...). **This package does
not inject those variables anywhere** -- it only *consumes* them. If the consuming app hasn't
defined them, every `var(--bs-something)` (none of these declarations have a fallback) resolves to
its CSS-invalid-at-computed-value fallback: `border: none`, `background: transparent`,
`width`/`height`/`padding`/`gap: 0`, browser-default `font-size`. The component still renders in
the DOM -- it just silently collapses (no visible border/box, buttons shrink to nothing, text
fields push onto their own line) with no console error or exception pointing at the missing
tokens, which makes it a confusing first bug to debug.

Fix: load the token stylesheet this package ships (vendored from `brandsync-tokens`) once,
globally, in the consuming app -- **before** any `bs-*` element renders:

```css
/* e.g. src/styles.css / global.css / angular.json "styles" array */
@import '@brandsync/wc/dist/brandsync-wc/brandsync-wc.css';
```

```html
<!-- plain HTML/CDN consumption -->
<link rel="stylesheet" href="https://unpkg.com/@brandsync/wc/dist/brandsync-wc/brandsync-wc.css">
```

This applies identically to the HTML/CDN path, npm+bundler path, and the React/Angular wrapper
packages -- none of them auto-inject it. If a consuming app already has its own differently-named
design tokens (e.g. `--surface-base` instead of `--bs-color-surface-base`), that app-level token
file does **not** satisfy this requirement even if the values match conceptually -- the shadow-DOM
CSS only resolves `--bs-*`-prefixed names, so the vendored stylesheet above must be loaded
regardless.

Known harmless noise: the vendored `brandsync-wc.css` currently contains a handful of malformed
token declarations from an upstream `brandsync-tokens` export step (e.g.
`--bs-5-brand-colors-jade-brand-700: {Brand Colors.teal.700};`), which some build tools (e.g.
Angular's CSS budget/lint step) warn about. These are pre-existing in the vendored dependency, not
introduced by this package, and don't affect any token this library actually uses.
