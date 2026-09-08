# CLAUDE.md

Project-specific notes for working in this repo (and its `@brandsync/react`/`@brandsync/angular`
sibling wrapper packages). See `CONVENTIONS.md` for the component customization-surface rules and
`readme.md` for full usage docs — this file only calls out the things most likely to be missed.

## Design tokens must be loaded by the consuming app — always check for this first

Every `bs-*` component's shadow-DOM CSS is written entirely against `--bs-*` custom properties. This
package never injects them; it only consumes them. If you're building or debugging a consuming app
(React, Angular, plain HTML, anything) and a `bs-*` component renders with no visible border/background
and near-zero size — collapsed to icon-only width, text field pushed onto its own line, no console
error — **check for this before anything else**. `var(--bs-something)` with no fallback silently
resolves to its CSS initial value when the variable is undefined, so the failure mode looks like a
component bug but isn't one.

Fix: the consuming app must load the vendored token stylesheet globally, once, before any `bs-*`
element renders:

```css
@import '@brandsync/wc/dist/brandsync-wc/brandsync-wc.css';
```

A consuming app having its **own** differently-named design tokens (e.g. `--surface-base` instead of
`--bs-color-surface-base`) does **not** satisfy this, even if the values match conceptually — the
shadow-DOM CSS only resolves `--bs-*`-prefixed names.

Known harmless noise: that vendored stylesheet contains a handful of malformed token lines from an
upstream `brandsync-tokens` export step (e.g. `--bs-5-brand-colors-jade-brand-700: {Brand
Colors.teal.700};`), which some build tools warn about. Don't chase these as a bug in this repo —
they're pre-existing in the vendored dependency and don't affect any token this library uses.

## Publishing

Three packages ship in lockstep from this component set: `@brandsync/wc` (this repo), and the
Stencil-generated wrapper packages `@brandsync/react` and `@brandsync/angular` (sibling directories
`../brandsync-web-components-react`, `../brandsync-web-components-angular`). Because these are all
still `0.0.x`, npm's semver rules mean a `^0.0.x` dependency range behaves like an *exact* pin (no
auto-patch resolution) — after bumping `@brandsync/wc`'s version, the dependency range in both
wrapper packages' `package.json` must be bumped by hand to match, or consumers installing "latest" of
all three can end up with two non-deduped copies of `@brandsync/wc` in `node_modules` (duplicate
custom-element registrations). Consider moving to `0.1.0`+ or adding lockstep release tooling (e.g.
Changesets) once this stabilizes.
