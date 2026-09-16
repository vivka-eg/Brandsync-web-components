# bs-radio



<!-- Auto Generated Below -->


## Overview

A single radio button with its label, for one mutually-exclusive choice within a group.

## When to use
- One option within a set of mutually-exclusive choices, where all options should stay visible
  (a radio group).

## When not to use
- An independent, non-exclusive binary choice, or one item in a set of independent choices --
  use `bs-checkbox` instead.
- An on/off setting that takes effect immediately (no explicit form submission) -- use `bs-switch`.

## Properties

| Property   | Attribute  | Description                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                              | Type      | Default     |
| ---------- | ---------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------- | ----------- |
| `checked`  | `checked`  | Whether the radio is checked. Mutable so clicking the label/input sets it directly.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      | `boolean` | `false`     |
| `disabled` | `disabled` | Disables the radio: sets the native `disabled` attribute, suppresses hover/focus styling, and prevents toggling.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                         | `boolean` | `false`     |
| `name`     | `name`     | The native radio input's `name` attribute. Passed straight through to the native input inside. NOTE: because each `bs-radio` renders its own shadow root, native `<input type="radio">` mutual-exclusion grouping (which the HTML spec scopes to a single DOM tree) does NOT extend across separate `bs-radio` instances sharing the same `name` -- checking one will not natively uncheck another. Within a single instance this still behaves like a normal radio input. See bs-radio.mdx's Accessibility section for this known gap; consumers building a group currently need to manage mutual exclusivity themselves (e.g. via `bsChange`) until a `bs-radio-group` wrapper exists. | `string`  | `undefined` |
| `value`    | `value`    | The native radio input's `value` attribute -- read from `event.target.value`, or used when wiring the group up to a form.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                | `string`  | `undefined` |


## Events

| Event      | Description                                                                                                                                                                                                                                                                                                                                                        | Type                  |
| ---------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | --------------------- |
| `bsChange` | Emitted with this radio's own `value` when it becomes checked via user interaction. Since native same-`name` grouping doesn't cross shadow-root boundaries (see the `name` prop's doc), a consumer wiring up a group of `bs-radio`s must itself set `checked = false` on the others in response to this event -- there's no automatic un-checking to rely on here. | `CustomEvent<string>` |


## Slots

| Slot | Description                   |
| ---- | ----------------------------- |
|      | Default slot: the label text. |


## Shadow Parts

| Part       | Description                                           |
| ---------- | ----------------------------------------------------- |
| `"circle"` | The visual radio ring.                                |
| `"dot"`    | The center fill shown inside the ring when `checked`. |
| `"label"`  | The label text wrapper.                               |


## CSS Custom Properties

| Name                          | Description                                                           |
| ----------------------------- | --------------------------------------------------------------------- |
| `--bs-radio-border-width`     | Width of the ring border.                                             |
| `--bs-radio-gap`              | Gap between the ring and the label text. Aliased to --bs-spacing-100. |
| `--bs-radio-hit-area-size`    | Diameter of the layout box the state layer is centered in.            |
| `--bs-radio-size`             | Diameter of the visual radio ring. Aliased to --bs-spacing-300.       |
| `--bs-radio-state-layer-size` | Diameter of the hover/focus/pressed halo behind the ring.             |


----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
