# Storybook docs (`.mdx`) format

Applies to every `<component>.mdx` file. The shape below is already followed by `bs-badge.mdx`
and `bs-modal.mdx` — this doc makes that pattern explicit so new components don't reinvent it,
and folds in a couple of patterns worth adopting from other design systems' docs.

## Section order (required, in this order)

1. **Imports + `<Meta>`** — `import { Meta, Canvas, Controls } from '@storybook/addon-docs/blocks'`
   and `import * as XStories from './bs-x.stories'`, then `<Meta of={XStories} />`.
2. **`# <Title>`** — capitalized display name, no `bs-` prefix (e.g. `# Modal`, not `# bs-modal`).
3. **`## Table of Contents`** — one anchor link per `##` heading below it, same order they appear in.
4. **`## Overview`**
   - Component description, matching the `@Component` JSDoc in the `.tsx` source (use
     `componentDescription()` from `stories-utils.ts` instead of retyping it, when the story file
     already renders it that way).
   - **When to use** / **When not to use** bullet lists — mandatory even for simple components;
     this mirrors CONVENTIONS.md's discipline of stating intended usage, not just describing markup.
   - `<Canvas of={XStories.Default}>` (or whichever story is the closest to a "default").
5. **One `## <Feature>` section per notable story or prop axis** beyond the default — a variant
   sweep, an interactive example, a known edge case, etc. Each gets its own `<Canvas>` plus 1–3
   sentences of *why* it's shown, not just what it shows (e.g. "Long text (edge case)" explains
   what happens when the "one or two words" guidance is ignored — it doesn't just say "shows long text").
6. **`## Component API`**
   - `<Controls of={XStories.Default}>`.
   - **Customization surface** bullets: Slots, Shadow parts, and any component-specific CSS
     custom properties. Reference `CONVENTIONS.md` for the rules — don't restate them here.
7. **`## Events`** — only if the component has any `@Event`. A table: event name, when it fires,
   payload type, cancelable (yes/no). Keep this separate from the props/attributes table — worth
   doing since Storybook's `<Controls>` block doesn't surface custom events at all.
8. **`## Skeleton state`** — only once a `-skeleton` variant or `loading` prop actually exists for
   the component. `<Canvas>` plus one line on when to reach for it. Do not add this section
   speculatively ahead of the feature existing.
9. **`## Accessibility`** — actual behavior, not aspirational behavior. If there's a known gap
   (missing `aria-labelledby` fallback, no multi-instance guard, etc.), say so explicitly — same
   "flag the open question, don't silently paper over it" discipline as `docs/component-specs.md`.

## Explicitly not part of this format

- No CDN section, no Feedback/Slack link. Those are Carbon's doc-site conventions, tied to their
  publishing pipeline (versioned CDN builds, a public Slack) — this library doesn't have an
  equivalent, so don't add them just because a reference doc has them.
- No "Controlled" section unless the component genuinely has an externally-controlled example
  distinct from its default story — don't manufacture one to match a reference doc.

## Checklist for a new component's `.mdx`

- [ ] Table of Contents entries match the `##` headings exactly, in order.
- [ ] Every `<Canvas>` points at a story that actually exists in `<component>.stories.ts`.
- [ ] Overview has both When to use and When not to use.
- [ ] Component API lists every slot and part declared in the `.tsx` JSDoc.
- [ ] Events table exists if and only if the component emits `@Event`s.
- [ ] Accessibility section names real behavior and any known gaps, not aspirations.
