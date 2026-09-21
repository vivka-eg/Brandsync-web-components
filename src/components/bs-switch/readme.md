# bs-switch



<!-- Auto Generated Below -->


## Overview

A toggle switch for an on/off setting that takes effect immediately (no explicit form
submission required).

## When to use
- A binary setting that applies right away (e.g. "Enable notifications", "Dark mode").

## When not to use
- A binary choice that's part of a form submitted later, or one item within a group of
  independent choices -- use `bs-checkbox` instead.
- A single mutually-exclusive choice from a set -- use a radio group instead.

## Properties

| Property    | Attribute    | Description                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                         | Type           | Default |
| ----------- | ------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------- | ------- |
| `ariaLabel` | `aria-label` | Accessible name for the switch. Required whenever the default (label) slot is empty (e.g. a bare "enabled" switch in a table row) -- without it, the internal native `<input>` has no accessible name at all. Setting `aria-label` directly on the `<bs-switch>` host does NOT work for this: that attribute stays on the light-DOM host and is never forwarded into the shadow DOM by the browser, so the actual focusable element (the native `<input>` inside) stays nameless. This prop exists specifically to bridge that gap -- same pattern as `bs-button`'s and `bs-checkbox`'s identical `ariaLabel` prop, both of which explicitly bind it onto their own internal focusable element for the same reason. | `string`       | `null`  |
| `checked`   | `checked`    | Whether the switch is on. Mutable so clicking the label/input toggles it directly, and reflected so consumers can target `bs-switch[checked]` via CSS.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                              | `boolean`      | `false` |
| `disabled`  | `disabled`   | Disables the switch: sets the native `disabled` attribute, suppresses hover/focus styling, and prevents toggling.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   | `boolean`      | `false` |
| `size`      | `size`       | Sizing scale. Controls the track's width/height and the knob's diameter.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                            | `"lg" \| "md"` | `'lg'`  |


## Events

| Event      | Description                                                                                | Type                   |
| ---------- | ------------------------------------------------------------------------------------------ | ---------------------- |
| `bsChange` | Emitted when the checked state changes via user interaction, with the new `checked` value. | `CustomEvent<boolean>` |


## Slots

| Slot | Description                   |
| ---- | ----------------------------- |
|      | Default slot: the label text. |


## Shadow Parts

| Part      | Description                   |
| --------- | ----------------------------- |
| `"knob"`  | The sliding circular knob.    |
| `"label"` | The label text wrapper.       |
| `"track"` | The visual pill-shaped track. |


## CSS Custom Properties

| Name                                 | Description                                                                                                                                                                                                                                   |
| ------------------------------------ | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `--bs-switch-border-width`           | Track border width, constant across all sizes.                                                                                                                                                                                                |
| `--bs-switch-focus-ring-color`       | Outer focus ring color, drawn outside the track. Aliased to --bs-switch-track-border-focus.                                                                                                                                                   |
| `--bs-switch-gap`                    | Gap between the track and the label text. Aliased to --bs-spacing-100.                                                                                                                                                                        |
| `--bs-switch-knob-bg`                | Knob background, resting. Aliased to --bs-switch-thumb-bg-default.                                                                                                                                                                            |
| `--bs-switch-knob-bg-checked`        | Knob background, checked. Aliased to --bs-switch-thumb-bg-checked.                                                                                                                                                                            |
| `--bs-switch-knob-bg-disabled`       | Knob background, disabled. Aliased to --bs-switch-thumb-bg-disabled.                                                                                                                                                                          |
| `--bs-switch-knob-bg-hover`          | Knob background, hovered. Aliased to --bs-switch-thumb-bg-hover.                                                                                                                                                                              |
| `--bs-switch-knob-size-lg`           | Knob width/height at size="lg".                                                                                                                                                                                                               |
| `--bs-switch-knob-size-md`           | Knob width/height at size="md".                                                                                                                                                                                                               |
| `--bs-switch-label-color`            | Label text color. Aliased to --bs-text-default.                                                                                                                                                                                               |
| `--bs-switch-label-color-disabled`   | Label text color, disabled. Aliased to --bs-text-on-disabled.                                                                                                                                                                                 |
| `--bs-switch-padding`                | Internal padding of the track around the knob, constant across all sizes. Aliased to --bs-spacing-25.                                                                                                                                         |
| `--bs-switch-radius`                 | Corner radius of the track, constant across all sizes. Aliased to --bs-border-radius-full.                                                                                                                                                    |
| `--bs-switch-track-bg`               | Track background, unchecked/resting. Aliased to --bs-switch-track-bg-default.                                                                                                                                                                 |
| `--bs-switch-track-bg-checked`       | Track background, checked/resting. Aliased to --bs-switch-track-bg-checked-default.                                                                                                                                                           |
| `--bs-switch-track-bg-checked-focus` | Track background, checked/focused. Aliased to --bs-switch-track-bg-checked-focused.                                                                                                                                                           |
| `--bs-switch-track-bg-checked-hover` | Track background, checked/hovered. The global vendored token directly, same reasoning as --bs-switch-track-bg-hover above.                                                                                                                    |
| `--bs-switch-track-bg-disabled`      | Track background, disabled (either checked state). The global vendored token directly, same reasoning as --bs-switch-track-bg-hover above.                                                                                                    |
| `--bs-switch-track-bg-hover`         | Track background, unchecked/hovered. This is the global vendored token directly (src/global/tokens.css) -- not locally re-aliased under a different name here, since it already carries this exact name; see the :host comment below for why. |
| `--bs-switch-track-border`           | Track border color, resting/disabled. Aliased to --bs-switch-track-border-default.                                                                                                                                                            |
| `--bs-switch-track-border-hover`     | Track border color, hovered or focused. The global vendored token directly, same reasoning as --bs-switch-track-bg-hover above.                                                                                                               |
| `--bs-switch-track-height-lg`        | Track height at size="lg".                                                                                                                                                                                                                    |
| `--bs-switch-track-height-md`        | Track height at size="md".                                                                                                                                                                                                                    |
| `--bs-switch-track-width-lg`         | Track width at size="lg".                                                                                                                                                                                                                     |
| `--bs-switch-track-width-md`         | Track width at size="md".                                                                                                                                                                                                                     |


----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
