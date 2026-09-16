# bs-tab



<!-- Auto Generated Below -->


## Overview

A single tab button -- an optional icon plus a text label, rendered as a real `<button>` so it
participates correctly in tab order and native click/keyboard activation.

## When to use
- As one button within a tab bar, where exactly one tab is selected/active at a time.

## When not to use
- As a standalone action button -- use `bs-button` instead, `bs-tab`'s visual language (muted
  until selected/hovered, underline indicator) only makes sense as part of a set.

`selected` is NOT self-toggling -- clicking a `bs-tab` only emits `bsSelect`, it does not set its
own `selected` prop, and it does not unselect any sibling tabs. Wrap your `<bs-tab>` elements in
`<bs-tabs type="bs-tab">` -- it owns `role="tablist"` and coordinates selection (listening for
`bsSelect` and setting `selected`/`false` across siblings) for you. Using `bs-tab` standalone,
outside a `<bs-tabs>` wrapper, still means `selected` doesn't self-toggle and `role="tablist"`
isn't provided automatically -- a consumer doing that would still need to coordinate `selected`
and supply `role="tablist"` manually, same as `bs-radio.mdx` documents for `bs-radio`'s missing
`bs-radio-group`. See `bs-tab.mdx`'s Accessibility section for the full requirement, including
`role="tabpanel"` on the corresponding content panels.

## Properties

| Property       | Attribute       | Description                                                                                                                                                                                                                                                                                                                                                                                                        | Type               | Default   |
| -------------- | --------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ------------------ | --------- |
| `ariaLabel`    | `aria-label`    | Accessible name for the tab. Required for icon-only usage (no visible label text via the default slot) so screen readers still announce what the tab does -- without it, an icon-only tab has no discernible name at all (axe-core flags this as a critical `button-name` violation). Stencil reflects this camelCase prop to the `aria-label` HTML attribute automatically, same as `bs-button`'s identical prop. | `string`           | `null`    |
| `disabled`     | `disabled`      | Disables the tab: sets the native `disabled` attribute, suppresses hover/focus styling, and prevents clicking from emitting `bsSelect`.                                                                                                                                                                                                                                                                            | `boolean`          | `false`   |
| `iconPosition` | `icon-position` | Where the icon sits relative to the label, when both `icon` and the default slot are populated. Ignored for icon-only/text-only layouts.                                                                                                                                                                                                                                                                           | `"start" \| "top"` | `'start'` |
| `selected`     | `selected`      | Whether this tab is the currently active one. NOT mutable and NOT self-toggling -- see the "Known gap" note in the class JSDoc. Still reflected as an attribute so consumers/CSS can target `bs-tab[selected]`.                                                                                                                                                                                                    | `boolean`          | `false`   |


## Events

| Event      | Description                                                                              | Type                |
| ---------- | ---------------------------------------------------------------------------------------- | ------------------- |
| `bsSelect` | Fires when the tab is clicked. Does not toggle `selected` itself -- see the class JSDoc. | `CustomEvent<void>` |


## Slots

| Slot      | Description                                                                                                                                                                                                                                                                                                                   |
| --------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
|           | Default slot: the tab's label text. When empty (icon-only), no space is reserved for it.                                                                                                                                                                                                                                      |
| `"badge"` | Optional trailing badge, rendered after the label (e.g. an unread count). Typically a `bs-badge` element -- consumer's responsibility to style/populate, this component just reserves a slot for it. Only rendered for text-only and icon+text-horizontal layouts, per the design spec (not icon-only or icon+text-vertical). |
| `"icon"`  | Optional icon (24x24). When empty (text-only), no space is reserved for it.                                                                                                                                                                                                                                                   |


## Shadow Parts

| Part          | Description                              |
| ------------- | ---------------------------------------- |
| `"badge"`     | The badge wrapper.                       |
| `"icon"`      | The icon wrapper.                        |
| `"indicator"` | The selection/hover underline indicator. |
| `"label"`     | The label wrapper.                       |
| `"tab"`       | The button element.                      |


## CSS Custom Properties

| Name                                  | Description                                                                                    |
| ------------------------------------- | ---------------------------------------------------------------------------------------------- |
| `--bs-tab-color-default`              | Text/icon color, deselected/enabled. Aliased to --bs-text-muted.                               |
| `--bs-tab-color-disabled`             | Text/icon color, disabled. Aliased to --bs-text-on-disabled.                                   |
| `--bs-tab-color-hover`                | Text/icon color, deselected/hovered, focused or pressed. Aliased to --bs-text-default.         |
| `--bs-tab-color-selected`             | Text/icon color, selected. Aliased to --bs-color-primary-default.                              |
| `--bs-tab-color-selected-hover`       | Text/icon color, selected/hovered or focused. Aliased to --bs-color-primary-hover.             |
| `--bs-tab-color-selected-pressed`     | Text/icon color, selected/pressed. Aliased to --bs-color-primary-pressed.                      |
| `--bs-tab-focus-ring-color`           | Focus ring color. Aliased to --bs-border-neutral-focus.                                        |
| `--bs-tab-font-size`                  | Aliased to --bs-font-size-md.                                                                  |
| `--bs-tab-gap`                        | Gap between icon and label, icon+text horizontal layout. Aliased to --bs-spacing-75.           |
| `--bs-tab-gap-vertical`               | Gap between icon and label, icon+text vertical layout. Aliased to --bs-spacing-50.             |
| `--bs-tab-icon-color-default`         | Icon color, deselected/enabled. Aliased to --bs-icon-muted.                                    |
| `--bs-tab-icon-color-disabled`        | Icon color, disabled. Aliased to --bs-icon-disabled.                                           |
| `--bs-tab-icon-color-hover`           | Icon color, deselected/hovered, focused or pressed. Aliased to --bs-icon-default.              |
| `--bs-tab-indicator-hover`            | Underline color, deselected/hovered, focused or pressed. Aliased to --bs-border-neutral-hover. |
| `--bs-tab-indicator-selected`         | Underline color, selected. Aliased to --bs-color-primary-default.                              |
| `--bs-tab-indicator-selected-hover`   | Underline color, selected/hovered or focused. Aliased to --bs-color-primary-hover.             |
| `--bs-tab-indicator-selected-pressed` | Underline color, selected/pressed. Aliased to --bs-color-primary-pressed.                      |
| `--bs-tab-line-height`                | Aliased to --bs-line-height-body-md.                                                           |
| `--bs-tab-padding-x`                  | Left/right padding. Aliased to --bs-spacing-200.                                               |
| `--bs-tab-padding-y`                  | Top/bottom padding. Aliased to --bs-spacing-150.                                               |
| `--bs-tab-radius`                     | Corner radius of the tab button. Aliased to --bs-border-radius-100.                            |


----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
