# Customization surface convention

Every component in this library exposes exactly three customization channels. Nothing outside these is
overridable from consuming code — that's deliberate, not an oversight. It's what keeps every framework
(React, Angular, Blazor, plain HTML) customizing the same component the same way, and keeps a consuming
team from silently drifting off-brand.

1. **CSS Custom Properties** — the component's own tokens, always aliased to a `brandsync-tokens` value
   by default (e.g. `--bs-button-height: var(--bs-scale-500)`), so a consuming app can override just that
   one property (`bs-button { --bs-button-height: 56px; }`) without touching anything else.
2. **Shadow Parts** (`::part(name)`) — named internal elements a consumer can target with real CSS
   (e.g. `::part(icon)`, `::part(label)`). Used when a variable isn't expressive enough (e.g. positioning,
   pseudo-classes).
3. **Slots** — named content-injection points (e.g. `slot="icon"`) for consumer-supplied markup.

Every `@Prop` is the fourth, distinct thing: a pre-built configuration option (`variant`, `size`,
`disabled`, ...) with a fixed, valid set of values — not a customization escape hatch.

If a consuming team needs to change something not covered by one of these four, that's a request back to
this library to expose a new variable/part/slot — the same request loop as any shared design system
dependency, not a per-team CSS override.

## Naming

- CSS Custom Properties: `--bs-<component>-<property>[-<state>]`, e.g. `--bs-button-bg-primary-hover`.
  Always alias to a `brandsync-tokens` variable, never a hardcoded value, so a global token change still
  cascades even where a component hasn't been touched.
- Shadow Parts: singular, lowercase, structural noun (`label`, `icon`, `container`, `row`, `cell`) — not
  state (no `::part(hovered)`).
- Slots: same naming style as parts; default (unnamed) slot only when there's exactly one sensible content
  area (e.g. a button's label).

## Non-string props

HTML attributes can only carry strings. Any `@Prop` whose value is an array/object (e.g. `bs-data-table`'s
`columns`/`rows`) must be set as a JS property, not an attribute, and must be documented as such in the
MCP's `web_component` corpus entry for that component — this is the one place the "just an HTML tag"
mental model needs a caveat.
