# Distribution strategy

How `@brandsync/wc` reaches a consuming app. Three channels exist today (see root `readme.md`);
this doc adds a fourth and the one CSS detail that should ship with it, so it's solved once
instead of rediscovered per consuming team.

## Channels

1. **npm package, raw ESM** — `import '@brandsync/wc/dist/components/bs-button.js'`. For any app
   with a bundler (Vite, webpack, etc.).
2. **Auto-generated React wrapper** — `@stencil/react-output-target`, built from the same source
   as (1). No hand-maintained parallel implementation.
3. **Auto-generated Angular wrapper** — `@stencil/angular-output-target`, same idea.
4. **CDN-hosted build (new)** — a version-pinned `<script type="module" src="https://.../wc@X.Y.Z">`
   tag. `readme.md` already shows an unpkg example; this channel formalizes it as a real,
   supported path rather than an incidental side effect of publishing to npm.

## Why channel 4 is worth formalizing

- **Legacy/no-bundler EG teams.** Any product team running a stack where a full
  "npm install + build step" is disproportionate to the ask (a static site, a legacy MVC app, a
  CMS template) can drop in one `<script>` tag and start using `<bs-*>` elements — no build
  pipeline required.
- **A cleaner answer for the Blazor NuGet package.** `docs/blazor-interop/` currently only covers
  the *interop* side (setting non-string properties, listening to events) — it doesn't yet say
  how the underlying JS gets to the browser at all. The two options that don't need this channel
  are worse: embedding a copy of the compiled JS inside the Razor Class Library (NuGet package
  drifts from npm releases, has to be re-vendored on every version bump), or requiring the
  consuming Blazor project to run `npm` as part of its build (defeats the point of a NuGet
  package for a team with no Node toolchain). A version-pinned CDN script tag referenced from the
  RCL's static assets avoids both: the RCL just ships a `<script>` reference at a pinned version,
  same as any other static asset.

## FOUC prevention: `:not(:defined)`

A custom element renders as an unstyled, un-upgraded element between first paint and the moment
its JS registers it — worse on a slow connection or when loaded via channel 4 (no bundler to
guarantee load-before-render ordering). The standard fix is a CSS rule that hides each `bs-*` tag
until it's defined:

```css
bs-badge:not(:defined),
bs-button:not(:defined),
bs-card:not(:defined),
bs-input:not(:defined),
bs-modal:not(:defined) {
  visibility: hidden;
}
```

- Generate this selector list from `custom-elements.json` (same source `stories-utils.ts` already
  reads for descriptions) rather than hand-maintaining it — it'll silently go stale otherwise as
  components are added.
- Ship it as part of the CDN bundle's own stylesheet (channel 4), not as something every
  consuming team has to know to write themselves — this is exactly the kind of "someone already
  solved this" pattern that should live in the library, not get rediscovered per integration.
- Scope it to actual `bs-*` tag names, not a bare `:not(:defined)` rule — a bare rule would also
  hide any *other* undefined custom element already on the consumer's page that has nothing to do
  with this library.

## Open questions (not decided here)

- [ ] CDN host: keep relying on unpkg (zero setup, no SLA) vs. standing up a dedicated
      EG-hosted CDN (control over caching/availability, more to maintain).
- [ ] Versioning scheme for the pinned URL — exact version (`@1.4.2`) vs. minor-range (`@1.4`)
      trade-off between "never breaks silently" and "never gets security/bugfix updates."
- [ ] Whether the CDN build self-registers all components on load, or requires an explicit
      per-component import even from a `<script>` tag — affects payload size for teams using
      only one or two components.
- [ ] Where the `:not(:defined)` stylesheet gets generated/published from — a new Stencil build
      output target, or a hand-maintained file checked against `custom-elements.json` in CI.
