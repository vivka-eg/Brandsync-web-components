# bs-inline-tab



<!-- Auto Generated Below -->


## Overview

A pill-shaped tab button -- an optional leading icon plus a text label, rendered as a real
`<button>` so it participates correctly in tab order and native click/keyboard activation.
Unlike `bs-tab`'s underline indicator, selection here is communicated entirely by the pill's
background fill color -- there is no separate indicator element.

## When to use
- As one button within a segmented-control-style tab bar, where exactly one tab is
  selected/active at a time.

## When not to use
- As a standalone action button -- use `bs-button` instead, `bs-inline-tab`'s visual language
  (muted pill until selected/hovered) only makes sense as part of a set.

`selected` is NOT self-toggling -- clicking a `bs-inline-tab` only emits `bsSelect`, it does not
set its own `selected` prop, and it does not unselect any sibling tabs. Wrap your
`<bs-inline-tab>` elements in `<bs-tabs type="bs-inline-tab">` -- it owns `role="tablist"` and
coordinates selection (listening for `bsSelect` and setting `selected`/`false` across siblings)
for you. Using `bs-inline-tab` standalone, outside a `<bs-tabs>` wrapper, still means `selected`
doesn't self-toggle and `role="tablist"` isn't provided automatically -- a consumer doing that
would still need to coordinate `selected` and supply `role="tablist"` manually, same as
`bs-tab.mdx`/`bs-radio.mdx` document for their own components. See `bs-inline-tab.mdx`'s
Accessibility section for the full requirement, including `role="tabpanel"` on the corresponding
content panels.

## Properties

| Property    | Attribute    | Description                                                                                                                                                                                                                                                                                                                                                                                                     | Type      | Default |
| ----------- | ------------ | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------- | ------- |
| `ariaLabel` | `aria-label` | Accessible name for the tab. Required for icon-only usage (no visible label text via the default slot) so screen readers still announce what the tab does -- without it, an icon-only tab has no discernible name at all (axe-core flags this as a critical `button-name` violation). Stencil reflects this camelCase prop to the `aria-label` HTML attribute automatically, same as `bs-tab`'s identical prop. | `string`  | `null`  |
| `disabled`  | `disabled`   | Disables the tab: sets the native `disabled` attribute, suppresses hover/focus styling, and prevents clicking from emitting `bsSelect`.                                                                                                                                                                                                                                                                         | `boolean` | `false` |
| `selected`  | `selected`   | Whether this tab is the currently active one. NOT mutable and NOT self-toggling -- see the "Known gap" note in the class JSDoc. Still reflected as an attribute so consumers/CSS can target `bs-inline-tab[selected]`.                                                                                                                                                                                          | `boolean` | `false` |


## Events

| Event      | Description                                                                              | Type                |
| ---------- | ---------------------------------------------------------------------------------------- | ------------------- |
| `bsSelect` | Fires when the tab is clicked. Does not toggle `selected` itself -- see the class JSDoc. | `CustomEvent<void>` |


## Slots

| Slot     | Description                                                                              |
| -------- | ---------------------------------------------------------------------------------------- |
|          | Default slot: the tab's label text. When empty (icon-only), no space is reserved for it. |
| `"icon"` | Optional leading icon (24x24). When empty (text-only), no space is reserved for it.      |


## Shadow Parts

| Part      | Description         |
| --------- | ------------------- |
| `"icon"`  | The icon wrapper.   |
| `"label"` | The label wrapper.  |
| `"tab"`   | The button element. |


## CSS Custom Properties

| Name                                      | Description                                                                            |
| ----------------------------------------- | -------------------------------------------------------------------------------------- |
| `--bs-inline-tab-bg-default`              | Background, deselected/enabled. Aliased to --bs-color-neutral-container.               |
| `--bs-inline-tab-bg-disabled`             | Background, disabled (wins over selected). Aliased to --bs-surface-action-disabled.    |
| `--bs-inline-tab-bg-focus`                | Background, deselected/focused. Aliased to --bs-color-neutral-container-focused.       |
| `--bs-inline-tab-bg-hover`                | Background, deselected/hovered. Aliased to --bs-color-neutral-container-hover.         |
| `--bs-inline-tab-bg-pressed`              | Background, deselected/pressed. Aliased to --bs-color-neutral-container-pressed.       |
| `--bs-inline-tab-bg-selected`             | Background, selected/enabled. Aliased to --bs-color-primary-default.                   |
| `--bs-inline-tab-bg-selected-focus`       | Background, selected/focused. Aliased to --bs-color-primary-focused.                   |
| `--bs-inline-tab-bg-selected-hover`       | Background, selected/hovered. Aliased to --bs-color-primary-hover.                     |
| `--bs-inline-tab-bg-selected-pressed`     | Background, selected/pressed. Aliased to --bs-color-primary-pressed.                   |
| `--bs-inline-tab-color-default`           | Text/icon color, deselected/enabled. Aliased to --bs-text-secondary.                   |
| `--bs-inline-tab-color-disabled`          | Text/icon color, disabled (wins over selected). Aliased to --bs-text-on-disabled.      |
| `--bs-inline-tab-color-hover`             | Text/icon color, deselected/hovered, focused or pressed. Aliased to --bs-text-default. |
| `--bs-inline-tab-color-selected`          | Text/icon color, selected. Aliased to --bs-text-on-action.                             |
| `--bs-inline-tab-focus-ring-color`        | Focus ring color. Aliased to --bs-border-neutral-focus.                                |
| `--bs-inline-tab-font-size`               | Aliased to --bs-font-size-sm.                                                          |
| `--bs-inline-tab-font-weight`             | Aliased to --bs-font-weight-semibold.                                                  |
| `--bs-inline-tab-gap`                     | Gap between icon and label. Aliased to --bs-spacing-50.                                |
| `--bs-inline-tab-line-height`             | Aliased to --bs-line-height-body-sm.                                                   |
| `--bs-inline-tab-padding-left-with-icon`  | Left padding, icon present. Aliased to --bs-spacing-150.                               |
| `--bs-inline-tab-padding-right-with-icon` | Right padding, icon present. Aliased to --bs-spacing-200.                              |
| `--bs-inline-tab-padding-x`               | Left/right padding, no icon. Aliased to --bs-spacing-200.                              |
| `--bs-inline-tab-padding-y`               | Top/bottom padding. Aliased to --bs-spacing-100.                                       |
| `--bs-inline-tab-radius`                  | Corner radius of the pill. Aliased to --bs-border-radius-full.                         |


----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
