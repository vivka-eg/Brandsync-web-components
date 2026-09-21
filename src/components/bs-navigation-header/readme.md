# bs-navigation-header



<!-- Auto Generated Below -->


## Overview

The top-level navigation bar for a page: the BrandSync logo plus two consumer-provided slots
for menu/action content (e.g. `bs-button`/`bs-icon-button` elements).

## When to use
- The persistent top bar of an application, above the page content.

## When not to use
- The header of a Genie AI chat panel -- use `bs-chatbot-header` instead, which is purpose-built
  for that narrower layout and its own fixed action buttons.

`alignment` controls both whether the logo renders and how the two slots are laid out:
- `default` (default): logo on the left, `left` slot content immediately after it, `right` slot
  content pushed to the far right.
- `center`: logo and `right` slot both grow equally (`flex: 1`), which centers the `left` slot
  content in the middle of the bar.
- `with-navigation-drawer`: no logo at all (this variant assumes a nav-drawer toggle is the
  leftmost thing on the page instead) -- `left` slot content starts at the bar's own left edge,
  `right` slot content pushed to the far right.

## Properties

| Property             | Attribute               | Description                                                                                                                                                                                                                                                                                                                                                                                                                                                                     | Type                                                | Default                  |
| -------------------- | ----------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------- | ------------------------ |
| `alignment`          | `alignment`             | Controls whether the logo renders and how the `left`/`right` slots are laid out -- see the class doc above for the three variants' exact behavior.                                                                                                                                                                                                                                                                                                                              | `"center" \| "default" \| "with-navigation-drawer"` | `'default'`              |
| `ariaLabel`          | `aria-label`            | Accessible label for the header landmark, useful when a page has more than one `<header>` (e.g. this one plus a page-specific sub-header) and screen reader users need to tell them apart in the landmarks list.                                                                                                                                                                                                                                                                | `string`                                            | `null`                   |
| `skipToContentHref`  | `skip-to-content-href`  | Fragment/URL to jump to when the "Skip to main content" link is activated (e.g. `#main-content`, matching an id on your page's main landmark). Unset by default -- the link is opt-in rather than pointing at a guessed default id, since a skip link to a target that doesn't exist on the consumer's page is worse than no skip link at all (it silently does nothing when activated). Set this to the same id your page's `<main>` (or equivalent) already has to enable it. | `string`                                            | `null`                   |
| `skipToContentLabel` | `skip-to-content-label` | Link text for the skip-to-content link. Only rendered when `skipToContentHref` is set.                                                                                                                                                                                                                                                                                                                                                                                          | `string`                                            | `'Skip to main content'` |


## Slots

| Slot      | Description                                                                                                                                                                 |
| --------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `"left"`  | Menu/action content immediately after the logo (or, in `with-navigation-drawer` mode, at the bar's left edge). Typically one or more `bs-button`/`bs-icon-button` elements. |
| `"right"` | Menu/action content pushed to the bar's far right.                                                                                                                          |


## Shadow Parts

| Part          | Description                                                                           |
| ------------- | ------------------------------------------------------------------------------------- |
| `"left"`      | The wrapper around the `left` slot.                                                   |
| `"logo"`      | The BrandSync brand mark (inline SVG). Not rendered in `with-navigation-drawer` mode. |
| `"right"`     | The wrapper around the `right` slot.                                                  |
| `"skip-link"` | The "Skip to main content" link (only rendered when `skipToContentHref` is set).      |


## CSS Custom Properties

| Name                                     | Description                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    |
| ---------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `--bs-navigation-header-bg`              | Background of the bar. Aliased to --bs-surface-base.                                                                                                                                                                                                                                                                                                                                                                                                                                           |
| `--bs-navigation-header-border`          | Bottom border color. Aliased to --bs-border-default.                                                                                                                                                                                                                                                                                                                                                                                                                                           |
| `--bs-navigation-header-item-gap`        | Gap between the logo and the `left` slot (`default` alignment), or between the `left` and `right` slots (`with-navigation-drawer` alignment, which has no logo). Not used in `center` alignment -- see the class doc in bs-navigation-header.tsx. The global vendored --bs-navigation-header-gap token is also malformed (a bare unitless `40`, which is an invalid `gap` value and silently falls back to `normal`/0), so this multiplies it into a real length instead of aliasing directly. |
| `--bs-navigation-header-max-width`       | Overall max-width of the bar. The global vendored --bs-breakpoints-max-width token is malformed (`1920rem` instead of `1920px` -- at a 16px root font size that's ~30720px, effectively unconstrained), so this is a literal 1920px instead of aliasing to it.                                                                                                                                                                                                                                 |
| `--bs-navigation-header-padding-bottom`  | Aliased to --bs-spacing-100.                                                                                                                                                                                                                                                                                                                                                                                                                                                                   |
| `--bs-navigation-header-padding-top`     | Aliased to --bs-spacing-200.                                                                                                                                                                                                                                                                                                                                                                                                                                                                   |
| `--bs-navigation-header-padding-x`       | Aliased to --bs-margin-fluid.                                                                                                                                                                                                                                                                                                                                                                                                                                                                  |
| `--bs-navigation-header-skip-link-bg`    | Skip-to-content link background, once focused into view. Aliased to --bs-surface-action.                                                                                                                                                                                                                                                                                                                                                                                                       |
| `--bs-navigation-header-skip-link-color` | Skip-to-content link text color, once focused into view. Aliased to --bs-text-inverse.                                                                                                                                                                                                                                                                                                                                                                                                         |
| `--bs-navigation-header-slot-gap`        | Gap between items within a single `left`/`right` slot. Aliased to --bs-spacing-100.                                                                                                                                                                                                                                                                                                                                                                                                            |


----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
