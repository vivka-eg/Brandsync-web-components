# bs-stepper



<!-- Auto Generated Below -->


## Overview

A sequence of named steps showing overall progress through a multi-step flow (e.g. a checkout,
an onboarding wizard) -- each step reads as enabled (not yet reached), current, done, error, or
disabled, connected by a rail between them.

This container is intentionally thin: it renders a `<slot>` for `<bs-stepper-step>` children and
propagates `currentStep`/`direction`/`showDescription` down to them as JS properties whenever any
of those change or the slotted children themselves change -- the same "container pushes state
onto its slotted children" pattern `bs-tabs` uses for `selected` and `bs-breadcrumbs` uses for
`size`. Each step computes its own `enabled`/`current`/`done` state from its position among its
siblings relative to `currentStep`, unless that step's own `error`/`disabled` prop overrides it.

This is a static status display, not an interactive control -- Figma's spec shows no
hover/pressed treatment on any step, so nothing here is clickable.

## When to use
- Showing where the user is in a fixed, ordered, multi-step flow.

## When not to use
- A flow whose steps aren't fixed/known in advance -- a stepper implies the full sequence is
  already known.
- As a substitute for actual in-page navigation between steps -- pair this with real controls
  (Next/Back buttons) elsewhere in the flow, this component only displays status.

## Properties

| Property          | Attribute          | Description                                                                                                                                                                                                                                                                                                                                                                                                                                                                               | Type                         | Default        |
| ----------------- | ------------------ | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------- | -------------- |
| `currentStep`     | `current-step`     | 0-indexed: which step is current. Every step before this index reads as "done" (unless that step's own `error`/`disabled` overrides it), every step after reads as "enabled".                                                                                                                                                                                                                                                                                                             | `number`                     | `0`            |
| `direction`       | `direction`        | `horizontal` (icon above name/description, connected by a horizontal rail) or `vertical` (icon beside name/description, connected by a vertical rail). Propagated to every slotted `bs-stepper-step`, and reflected as an attribute so this container's own `:host` CSS can switch its `flex-direction` to match -- a bare `<slot>` with no wrapping element (see `render()`) means the slotted steps' flex-row/column layout comes directly from `:host` here, not from any wrapper div. | `"horizontal" \| "vertical"` | `'horizontal'` |
| `showDescription` | `show-description` | Whether each step's description renders at all. Propagated to every slotted `bs-stepper-step`.                                                                                                                                                                                                                                                                                                                                                                                            | `boolean`                    | `true`         |


## Slots

| Slot | Description                                                                      |
| ---- | -------------------------------------------------------------------------------- |
|      | Default slot: the `<bs-stepper-step>` elements making up the sequence, in order. |


## CSS Custom Properties

| Name                        | Description                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               |
| --------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `--bs-stepper-edge-padding` | Horizontal padding, direction="horizontal" only. Aliased to --bs-spacing-800. Every step's name/description centers under its own icon (see bs-stepper-step.css), including the first and last steps -- whose icons sit flush against this container's own edges. Without this padding, a first/last step's centered text has room to overflow in only one direction and clips against the container edge (confirmed by measuring a real render: a description clipped to a negative x position). This padding exists purely to give that overflow somewhere to go; it isn't a general "breathing room" affordance for content that fits. |


----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
