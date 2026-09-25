# bs-stepper-step



<!-- Auto Generated Below -->


## Overview

A single step within a `<bs-stepper>` sequence: an icon/indicator plus a name and optional
description, connected to the next step by a trailing rail.

`computedState` is set automatically by the parent `<bs-stepper>` based on this step's position
relative to its `currentStep` (before it = "done", at it = "current", after it = "enabled") --
same "container pushes state onto its slotted children" pattern `bs-tabs` uses for `selected`
and `bs-breadcrumbs` uses for `size`. This step's own `error`/`disabled` props, when set directly
by the consumer, override that computed value -- e.g. a step before `currentStep` would normally
read as "done", but `error` on that step wins regardless.

The trailing rail is owned by this component, not the container: `:host(:last-child)` hides it
on whichever step is visually last, mirroring `bs-breadcrumb`'s own `:host(:first-child)` rule
for its leading separator (same technique, opposite end -- see that component for why pure DOM
position, not CSS `:last-of-type`, is what actually needs checking here too).

## When to use
- As a child of `<bs-stepper>`, one per step in the sequence.

## When not to use
- Standalone, outside a `<bs-stepper>` wrapper -- `computedState`/`direction`/`showDescription`
  depend on that parent propagating them; alone, this defaults to `enabled`/`horizontal`/`true`.

## Properties

| Property          | Attribute          | Description                                                                                                                                                                   | Type                               | Default        |
| ----------------- | ------------------ | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------- | -------------- |
| `computedState`   | `computed-state`   | Set automatically by the parent `<bs-stepper>` from this step's position relative to its `currentStep` -- see the class doc above. Can be set directly for a standalone step. | `"current" \| "done" \| "enabled"` | `'enabled'`    |
| `description`     | `description`      | Optional supporting text below the name. Only rendered when `showDescription` (propagated from the parent `<bs-stepper>`) is also true.                                       | `string`                           | `undefined`    |
| `direction`       | `direction`        | Set automatically by the parent `<bs-stepper>`, propagated to every slotted step.                                                                                             | `"horizontal" \| "vertical"`       | `'horizontal'` |
| `disabled`        | `disabled`         | Shows the disabled treatment for this step, regardless of its `computedState`. Takes priority over `error` if both are somehow set.                                           | `boolean`                          | `false`        |
| `error`           | `error`            | Shows the error treatment for this step, regardless of its `computedState`.                                                                                                   | `boolean`                          | `false`        |
| `name`            | `name`             | This step's name/title.                                                                                                                                                       | `string`                           | `''`           |
| `showDescription` | `show-description` | Set automatically by the parent `<bs-stepper>`, propagated to every slotted step.                                                                                             | `boolean`                          | `true`         |


## Slots

| Slot | Description                                               |
| ---- | --------------------------------------------------------- |
|      | None: `name`/`description` fully drive the label content. |


## Shadow Parts

| Part            | Description                                                                                   |
| --------------- | --------------------------------------------------------------------------------------------- |
| `"connector"`   | The trailing rail segment (not rendered on the last step).                                    |
| `"description"` | The description text (only rendered when `showDescription` is true and `description` is set). |
| `"icon"`        | The icon/indicator wrapper.                                                                   |
| `"label"`       | The name+description wrapper.                                                                 |
| `"name"`        | The name text.                                                                                |


## CSS Custom Properties

| Name                                        | Description                                                                                                                                                                                     |
| ------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `--bs-stepper-step-connector-color`         | Rail color to the next step. Aliased to --bs-border-default. Figma's spec shows one static rail color regardless of adjacent steps' state -- completion is conveyed by the icons, not the rail. |
| `--bs-stepper-step-connector-thickness`     | Rail line thickness. 2px, matching Figma exactly.                                                                                                                                               |
| `--bs-stepper-step-description-font-weight` | Aliased to --bs-font-weight-regular.                                                                                                                                                            |
| `--bs-stepper-step-font-size`               | Aliased to --bs-font-size-md.                                                                                                                                                                   |
| `--bs-stepper-step-gap`                     | Gap between the icon/connector row (or column) and the label. Aliased to --bs-spacing-100.                                                                                                      |
| `--bs-stepper-step-icon-bg-done`            | Icon background, state="done". Aliased to --bs-color-primary-default.                                                                                                                           |
| `--bs-stepper-step-icon-border-current`     | Icon border, state="current". Aliased to --bs-color-primary-default.                                                                                                                            |
| `--bs-stepper-step-icon-border-disabled`    | Icon border, state="disabled". Aliased to --bs-border-neutral-disabled.                                                                                                                         |
| `--bs-stepper-step-icon-border-enabled`     | Icon border, state="enabled" (not yet reached). Aliased to --bs-border-default.                                                                                                                 |
| `--bs-stepper-step-icon-border-error`       | Icon border, state="error". Aliased to --bs-border-error.                                                                                                                                       |
| `--bs-stepper-step-icon-border-width`       | Border width of the icon circle. 1.5px, matching Figma exactly.                                                                                                                                 |
| `--bs-stepper-step-icon-color-done`         | Checkmark icon color, state="done". Aliased to --bs-text-on-action.                                                                                                                             |
| `--bs-stepper-step-icon-color-error`        | Exclamation icon color, state="error". Aliased to --bs-border-error.                                                                                                                            |
| `--bs-stepper-step-icon-dot-current`        | Inner filled dot color, state="current". Aliased to --bs-color-primary-default.                                                                                                                 |
| `--bs-stepper-step-icon-size`               | Width/height of the icon/indicator circle. 24px, matching Figma exactly.                                                                                                                        |
| `--bs-stepper-step-line-height`             | Aliased to --bs-line-height-body-md.                                                                                                                                                            |
| `--bs-stepper-step-name-font-weight`        | Aliased to --bs-font-weight-semibold.                                                                                                                                                           |
| `--bs-stepper-step-text-active`             | Name/description color, state="current"/"done". Aliased to --bs-text-default.                                                                                                                   |
| `--bs-stepper-step-text-disabled`           | Name/description color, state="disabled". Aliased to --bs-text-on-disabled.                                                                                                                     |
| `--bs-stepper-step-text-enabled`            | Name/description color, state="enabled"/"error". Aliased to --bs-text-muted.                                                                                                                    |


----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
