# bs-input



<!-- Auto Generated Below -->


## Overview

A single-line text field with an optional label, description, and error state.

## When to use
- Collecting a single line of free-text, email, password, or numeric input.
- Pair with `error` for inline validation feedback tied to that specific field.

## When not to use
- Multi-line text — this component has no `textarea` mode.
- A fixed set of choices — use a select/radio/checkbox component instead of free text.

## Properties

| Property      | Attribute     | Description                                                                                                                                                            | Type                                          | Default     |
| ------------- | ------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------- | ----------- |
| `description` | `description` |                                                                                                                                                                        | `string`                                      | `undefined` |
| `disabled`    | `disabled`    |                                                                                                                                                                        | `boolean`                                     | `false`     |
| `error`       | `error`       |                                                                                                                                                                        | `string`                                      | `undefined` |
| `label`       | `label`       |                                                                                                                                                                        | `string`                                      | `undefined` |
| `placeholder` | `placeholder` |                                                                                                                                                                        | `string`                                      | `undefined` |
| `type`        | `type`        |                                                                                                                                                                        | `"email" \| "number" \| "password" \| "text"` | `'text'`    |
| `value`       | `value`       | Current value. Native `input`/`change` events don't cross the Shadow DOM boundary, so this component re-dispatches them as `bsInput`/`bsChange` custom events instead. | `string`                                      | `''`        |


## Events

| Event      | Description | Type                  |
| ---------- | ----------- | --------------------- |
| `bsChange` |             | `CustomEvent<string>` |
| `bsInput`  |             | `CustomEvent<string>` |


## Shadow Parts

| Part            | Description                                           |
| --------------- | ----------------------------------------------------- |
| `"control"`     | The native `<input>` element.                         |
| `"description"` | The helper text element (hidden when `error` is set). |
| `"error"`       | The error message element.                            |
| `"label"`       | The `<label>` element.                                |


----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
