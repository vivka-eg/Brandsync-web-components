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
