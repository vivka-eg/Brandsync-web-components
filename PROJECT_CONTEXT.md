# Project Context

A working-context reference for `brandsync-web-components` — what this project is, how the
pieces fit together, and the non-obvious decisions/gotchas accumulated so far. See also
`CLAUDE.md` (Claude-specific operating notes), `CONVENTIONS.md` (component customization-surface
rules), and `readme.md` (consumer-facing usage docs).

## What this is

Brandsync's design system components, built as framework-agnostic Web Components with
[Stencil](https://stenciljs.com), styled entirely from `brandsync-tokens` CSS custom properties.
Consumed the same way by React, Angular, Blazor, or plain HTML.

## Repos involved

| Repo | Purpose |
|---|---|
| `brandsync-web-components` (this repo) | Source of truth — Stencil components, Storybook, tests |
| `brandsync-web-components-react` (sibling dir, `../`) | Publishable `@brandsync/react` wrapper package (auto-generated proxies via `@stencil/react-output-target`, built with `tsup`) |
| `brandsync-web-components-angular` (sibling dir, `../`) | Publishable `@brandsync/angular` wrapper package (auto-generated proxies via `@stencil/angular-output-target`, built with `ng-packagr`) |
| `Brandsync-wc-storybook` (github.com/vivka-eg) | Static Storybook build output, for a separate team to host — **not auto-synced**, must be manually rebuilt (`npx storybook build`) and pushed after changes here |

## npm packages

Three packages ship in lockstep: `@brandsync/wc`, `@brandsync/react`, `@brandsync/angular`, all
published to **public npmjs.org** under the `@brandsync` scope.

**Publish order matters** — `@brandsync/wc` first, then the wrappers (they depend on it):

```bash
# 1. In brandsync-web-components/
npm run build && npm version patch --no-git-tag-version
git add package.json package-lock.json && git commit -m "Bump @brandsync/wc to X.Y.Z" && git push
npm publish

# 2. Bump the dependency pin in BOTH wrapper package.json files to match, e.g. "^X.Y.Z"

# 3. In ../brandsync-web-components-react/
rm -rf node_modules package-lock.json dist && npm install && npm run build
npm version patch --no-git-tag-version && npm publish

# 4. In ../brandsync-web-components-angular/
rm -rf node_modules package-lock.json dist && npm install && npx ng-packagr -p ng-package.json
npm version patch --no-git-tag-version && npx ng-packagr -p ng-package.json  # rebuild dist with new version baked in
cd dist && npm publish
```

**Known footgun:** since all three are still `0.0.x`, npm's semver rules mean `^0.0.x` behaves like
an *exact* pin (no auto-patch resolution). After bumping `@brandsync/wc`, the dependency range in
both wrapper `package.json` files must be bumped by hand — forgetting this means consumers
installing "latest" of all three can get two non-deduped copies of `@brandsync/wc` in
`node_modules` (duplicate custom-element registrations). Worth moving to `0.1.0`+ or adding
lockstep release tooling (e.g. Changesets) once this stabilizes.

**Publishing auth:** the npm account (`vivka-eg`) uses a WebAuthn security key for 2FA, not a TOTP
app — this CLI can't satisfy the OTP challenge npm requires for a package's first-ever publish.
The working setup is a **granular access token** with "bypass 2FA" enabled, configured in
`~/.npmrc`. New tokens are generated via npmjs.com → Access Tokens (UI), not from the CLI.

## Component conventions (see CONVENTIONS.md for full detail)

Every component exposes exactly three customization surfaces: **CSS custom properties** (aliased
to a `brandsync-tokens` value, never hardcoded), **shadow parts**, and **slots**. `@Prop`s are a
separate, fourth thing — fixed-value configuration, not a customization escape hatch. If a real
use case needs something outside those three surfaces, that's a gap in the library to fix, not
something to work around in a consuming app — this came up concretely with `bs-composer`'s
missing `actions-end` slot and `bs-chatbot-header`'s missing icon-override slots, both added after
the fact once a real need surfaced.

**Naming:** CSS vars `--bs-<component>-<property>[-state]`; parts are singular structural nouns
(`icon`, `label`, not `hovered`); when no existing semantic token matches a design value exactly,
alias a local custom property directly to the closest raw primitive token and comment why (e.g.
`bs-chatbot-suggestion-button`'s pressed-state color aliases `--bs-brand-200` directly, since
`--bs-color-primary-pressed` is semantically wrong — it's tuned for solid/filled buttons, not this
component's lighter tonal pressed-state progression).

## Design tokens & theming

`brandsync-tokens` (npm dependency, public) defines the full token set in
`src/global/tokens.css`, including a `[data-theme="dark"]` block that overrides ~146 semantic
tokens for dark mode. `prefers-reduced-motion: reduce` already zeroes all `--bs-duration-*` tokens
globally — components that use those tokens for transitions get reduced-motion support for free,
no extra handling needed.

Storybook has a **Theme toggle** (sun/moon icon, top toolbar) and a **Show parts** toggle (ruler
icon) — see `.storybook/preview.ts`. The Show parts toggle exists because Storybook's built-in
Measure tool's shadow-DOM crawling produces degenerate results on this component library's nested
slot/icon structure (confirmed by testing); it injects a `<style>` directly into each shadow root
outlining every `[part]` element instead.

**Known gap:** `bs-modal`'s backdrop is hardcoded to `rgba(0, 0, 0, 0.4)` instead of using
`--bs-surface-overlay` (which has distinct light/dark values) — the one confirmed hardcoded-color
violation in the whole library as of this writing.

## Testing

`vitest.config.ts` defines three projects:
- `unit` — Stencil-environment logic tests (`*.unit.test.ts`)
- `browser` — real-browser component tests via Playwright (`*.cmp.test.tsx`)
- `storybook` — every Storybook story runs as a real test via `@storybook/addon-vitest`

The `storybook` project needed `optimizeDeps.include: ['aria-query', 'lz-string', 'pretty-format']`
to work at all — these are transitive CJS dependencies pulled in by the addon's setup file, and
Vite's default esbuild-based named-export synthesis fails for them in browser mode without being
forced into pre-bundling. If adding/upgrading Storybook addons breaks the `storybook` test project
with an error like `"does not provide an export named ..."`, this is the pattern to look for.

`@storybook/addon-vitest` and `@storybook/addon-a11y` are pinned to the **exact** version matching
the core `storybook` package (`10.5.8`) — their default caret ranges resolve to newer versions
with incompatible peer requirements (`storybook@^10.6.0`), which conflicts with everything else
pinned to `10.5.8`.

Two pre-existing test failures (`bs-modal.cmp.test.tsx`, focus-restoration assertions) are
unrelated to any work done in this session — confirmed by reproducing them against an unmodified
tree multiple times.

## Genie AI Components

A distinct component group (`Genie AI Components` in Storybook, separate from the generic
`Components` group) for a specific chat-panel product surface, sourced from a separate Figma file
("Genie Components", not the general "EG Brand Sync UI Kit"): `bs-composer`, `bs-chatbot-header`,
`bs-chatbot-response-action`, `bs-menu` / `bs-menu-item` (moved to the generic `Components` group
since they're reusable primitives, not Genie-specific), `bs-chatbot-suggestion-button`. `bs-tooltip`
is from the general UI Kit file and lives in `Components`.

**Pattern for building these:** pull Figma design context first (`get_design_context`, after
answering the Code Connect prompt — usually "no, just get the design" since this repo doesn't use
Code Connect mappings), verify every token value against `src/global/tokens.css` by grep rather
than assuming a name matches, implement, then **visually verify in a live Storybook instance** —
this has repeatedly caught real bugs that "build succeeded" and even passing unit tests missed
(a broken CSS import, a wrong border-radius token, an asset path that 404s only in a specific
runtime context). Don't trust a component is correct until it's been rendered and looked at.

## Figma → code workflow gotchas

- `get_metadata` first to find the right node, then `get_design_context` for the real spec — never
  skip straight to guessing from a screenshot alone if the actual node is available.
- Complex multi-layer/gradient assets (e.g. the Genie logo mark) should be pulled as a real
  exported SVG and inlined as a string constant (matching every other hand-rolled icon in this
  codebase) — Stencil's `assetsDirs`/`getAssetPath()` mechanism was tried once and failed silently
  in Storybook's Vite dev server (resolved to the wrong URL, 404); inlining sidesteps the whole
  asset-path-resolution problem.
- Simple solid-color geometric shapes (arrows, triangles) are fine to hand-code as CSS
  (`clip-path`) rather than reproducing the exact exported SVG — that fidelity requirement is for
  genuinely complex/branded visuals, not primitives.
- Don't invent unconfirmed variants (e.g. `bs-tooltip` only implements `placement="top"` because
  that's the only direction Figma actually specified; `bs-chatbot-suggestion-button` didn't get an
  invented toggled/selected state despite being a plausible UX pattern, because Figma only showed
  one state).

## Deployment (out of scope for this doc)

Storybook hosting for `storybook.brand.dev.egsync.com` is owned by a separate team/pipeline this
project has no visibility into — pushing to `Brandsync-wc-storybook` does not automatically
redeploy that site. See git history / conversation log for the specific lazy-loader-vs-static-build
bug that was fixed there, if it resurfaces.
