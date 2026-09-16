# bs-checkbox



<!-- Auto Generated Below -->


## Overview

A single checkbox with its label, for a binary choice or one item within a group of independent
choices.

## When to use
- A single standalone binary setting (e.g. "Remember me", "I agree to the terms").
- One item within a set of independent, non-exclusive choices (a checkbox group/list).
- `indeterminate` for a "select all" checkbox representing a partially-selected group.

## When not to use
- A single mutually-exclusive choice from a set -- use a radio group instead.
- An on/off setting that takes effect immediately (no explicit form submission) -- use `bs-switch`.

## Properties

| Property        | Attribute       | Description                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                         | Type                   | Default |
| --------------- | --------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------- | ------- |
| `checked`       | `checked`       | Whether the checkbox is checked. Mutable so clicking the label/input toggles it directly. When `indeterminate` is also true, `indeterminate` wins visually (shows the minus icon) regardless of this value -- same as native checkboxes.                                                                                                                                                                                                                                                                                                                                            | `boolean`              | `false` |
| `disabled`      | `disabled`      | Disables the checkbox: sets the native `disabled` attribute, suppresses hover/focus styling, and prevents toggling.                                                                                                                                                                                                                                                                                                                                                                                                                                                                 | `boolean`              | `false` |
| `error`         | `error`         | Applies the error border/label-color treatment. This component's spec has no error message text of its own (unlike `bs-input`'s `error: string`), so it's a plain boolean.                                                                                                                                                                                                                                                                                                                                                                                                          | `boolean`              | `false` |
| `indeterminate` | `indeterminate` | Whether the checkbox is in the indeterminate ("partially selected") state -- shows a minus icon instead of a check, and takes visual precedence over `checked`. Unlike `checked`, native checkboxes have no `indeterminate` HTML attribute; it can only be set as a JS property on the element. This `@Prop` still works as an attribute for the *host* (`<bs-checkbox>`) since that's this component's own reflected state, not the native control's -- the native `<input>` inside has its `.indeterminate` property set imperatively in `componentDidLoad`/`componentDidUpdate`. | `boolean`              | `false` |
| `size`          | `size`          | Sizing scale. Controls the box's width/height and border width; corner radius is constant across all sizes.                                                                                                                                                                                                                                                                                                                                                                                                                                                                         | `"lg" \| "md" \| "sm"` | `'lg'`  |


## Events

| Event      | Description                                                                                | Type                   |
| ---------- | ------------------------------------------------------------------------------------------ | ---------------------- |
| `bsChange` | Emitted when the checked state changes via user interaction, with the new `checked` value. | `CustomEvent<boolean>` |


## Slots

| Slot | Description                   |
| ---- | ----------------------------- |
|      | Default slot: the label text. |


## Shadow Parts

| Part      | Description                                                                  |
| --------- | ---------------------------------------------------------------------------- |
| `"box"`   | The visual checkbox square.                                                  |
| `"icon"`  | The check/minus icon shown inside the box when `checked` or `indeterminate`. |
| `"label"` | The label text wrapper.                                                      |


## CSS Custom Properties

| Name                                  | Description                                                                               |
| ------------------------------------- | ----------------------------------------------------------------------------------------- |
| `--bs-checkbox-bg-disabled`           | Box background, disabled. Aliased to --bs-surface-action-disabled.                        |
| `--bs-checkbox-bg-focus`              | Box background, deselected/focused. Aliased to --bs-surface-raised.                       |
| `--bs-checkbox-bg-hover`              | Box background, deselected/hovered. Aliased to --bs-surface-hover.                        |
| `--bs-checkbox-bg-selected`           | Box background, selected or indeterminate/enabled. Aliased to --bs-color-primary-default. |
| `--bs-checkbox-bg-selected-error`     | Box background, selected or indeterminate/error. Aliased to --bs-icon-error.              |
| `--bs-checkbox-bg-selected-hover`     | Box background, selected or indeterminate/hovered. Aliased to --bs-color-primary-hover.   |
| `--bs-checkbox-border-default`        | Border color, deselected/enabled. Aliased to --bs-border-default.                         |
| `--bs-checkbox-border-disabled`       | Border color, disabled. Aliased to --bs-border-neutral-disabled.                          |
| `--bs-checkbox-border-error`          | Border color, deselected/error. Aliased to --bs-border-error.                             |
| `--bs-checkbox-border-focus`          | Border color, deselected/focused. Aliased to --bs-border-neutral-hover.                   |
| `--bs-checkbox-border-hover`          | Border color, deselected/hovered. Aliased to --bs-border-neutral-hover.                   |
| `--bs-checkbox-border-selected`       | Border color, selected or indeterminate/enabled. Aliased to --bs-color-primary-default.   |
| `--bs-checkbox-border-selected-error` | Border color, selected or indeterminate/error. Aliased to --bs-icon-error.                |
| `--bs-checkbox-border-selected-hover` | Border color, selected or indeterminate/hovered. Aliased to --bs-color-primary-hover.     |
| `--bs-checkbox-border-width-lg`       | Border width at size="lg".                                                                |
| `--bs-checkbox-border-width-md`       | Border width at size="md".                                                                |
| `--bs-checkbox-border-width-sm`       | Border width at size="sm".                                                                |
| `--bs-checkbox-focus-ring-color`      | Focus ring color, drawn outside the box. Aliased to --bs-border-neutral-focus.            |
| `--bs-checkbox-gap`                   | Gap between the box and the label text. Aliased to --bs-spacing-100.                      |
| `--bs-checkbox-icon-color`            | Check/minus icon color. Aliased to --bs-icon-static-white.                                |
| `--bs-checkbox-icon-color-disabled`   | Check/minus icon color, disabled. Aliased to --bs-icon-disabled.                          |
| `--bs-checkbox-label-color`           | Label text color. Aliased to --bs-text-default.                                           |
| `--bs-checkbox-label-color-disabled`  | Label text color, disabled. Aliased to --bs-text-on-disabled.                             |
| `--bs-checkbox-label-color-error`     | Label text color, error. Aliased to --bs-text-error.                                      |
| `--bs-checkbox-radius`                | Corner radius of the box, constant across all sizes. Aliased to --bs-border-radius-50.    |
| `--bs-checkbox-size-lg`               | Box width/height at size="lg". Aliased to --bs-spacing-300.                               |
| `--bs-checkbox-size-md`               | Box width/height at size="md". Aliased to --bs-spacing-250.                               |
| `--bs-checkbox-size-sm`               | Box width/height at size="sm". Aliased to --bs-spacing-200.                               |


----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
