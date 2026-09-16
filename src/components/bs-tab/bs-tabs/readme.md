# bs-tabs



<!-- Auto Generated Below -->


## Overview

A tab-group wrapper: owns `role="tablist"` and coordinates selection across its slotted
`<bs-tab>` or `<bs-inline-tab>` children, so consumers no longer have to hand-roll this.

`bs-tab.mdx`/`bs-inline-tab.mdx` previously documented this coordination -- listening for
`bsSelect` and setting `selected`/`false` on siblings, plus supplying `role="tablist"` on
whatever element groups the tabs -- as a "Known gap"/manual consumer responsibility. This
component is that wrapper: it renders the `role="tablist"` element and listens for `bsSelect`
itself. Using `<bs-tab>`/`<bs-inline-tab>` standalone, outside a `<bs-tabs>` wrapper, still means
`selected` doesn't self-toggle -- a consumer doing that would still need to coordinate `selected`
manually -- but that's no longer the first recommended path.

## When to use
- Wrapping a set of `<bs-tab>` (underline style) or `<bs-inline-tab>` (pill style) elements that
  should behave as a single-selection tab bar.

## When not to use
- For a single, standalone tab button not participating in a group -- use `bs-tab`/`bs-inline-tab`
  directly.

## Properties

| Property      | Attribute     | Description                                                                                                                                                                                                                                                                                | Type                          | Default        |
| ------------- | ------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ----------------------------- | -------------- |
| `orientation` | `orientation` | Layout direction of the tab bar itself. Sets `aria-orientation` on the internal wrapper and switches `flex-direction`.                                                                                                                                                                     | `"horizontal" \| "vertical"`  | `'horizontal'` |
| `type`        | `type`        | Which tab-button family this group wraps. Governs the wrapper's own visual treatment (gap-only for `bs-tab`, a filled pill bar for `bs-inline-tab`). Not reflected as an attribute -- nothing external needs to target it via CSS attribute selector, it only drives internal class names. | `"bs-inline-tab" \| "bs-tab"` | `'bs-tab'`     |


## Slots

| Slot | Description                                                                                                |
| ---- | ---------------------------------------------------------------------------------------------------------- |
|      | Default slot: the tab elements (`<bs-tab>` or `<bs-inline-tab>`, matching `type`) that make up this group. |


## Shadow Parts

| Part        | Description                                     |
| ----------- | ----------------------------------------------- |
| `"tablist"` | The wrapping element carrying `role="tablist"`. |


## CSS Custom Properties

| Name                             | Description                                                                        |
| -------------------------------- | ---------------------------------------------------------------------------------- |
| `--bs-tabs-inline-tab-bg`        | Bar background when type="bs-inline-tab". Aliased to --bs-color-neutral-container. |
| `--bs-tabs-inline-tab-gap`       | Gap between tabs when type="bs-inline-tab". Aliased to --bs-spacing-50.            |
| `--bs-tabs-inline-tab-padding-x` | Bar horizontal padding when type="bs-inline-tab". Aliased to --bs-spacing-50.      |
| `--bs-tabs-inline-tab-radius`    | Bar corner radius when type="bs-inline-tab". Aliased to --bs-border-radius-full.   |
| `--bs-tabs-tab-gap`              | Gap between tabs when type="bs-tab". Aliased to --bs-spacing-100.                  |


----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
