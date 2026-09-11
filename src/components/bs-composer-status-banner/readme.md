# bs-composer-status-banner



<!-- Auto Generated Below -->


## Overview

A full-width status banner for use directly above `bs-composer`, surfacing a message about the
composer's current state (e.g. a send failure, an informational notice) with an optional
"Continue"-style action button and an optional close button.

## When to use
- A message tied to the composer itself (send failed, rate-limited, draft restored, etc.) that
  needs to sit directly above it, not a general-purpose alert -- see `CONVENTIONS.md` if this
  library gains a generic banner/alert component later, and prefer that instead once it exists.

## When not to use
- A toast/snackbar notification unrelated to the composer -- this component is not
  self-dismissing and has no positioning of its own (it's a static block, not an overlay).

## Properties

| Property      | Attribute      | Description                                                                                        | Type                                          | Default               |
| ------------- | -------------- | -------------------------------------------------------------------------------------------------- | --------------------------------------------- | --------------------- |
| `actionLabel` | `action-label` | Label for the action button, only rendered when `showButton` is true.                              | `string`                                      | `'Continue'`          |
| `allowClose`  | `allow-close`  | Whether the close button is rendered.                                                              | `boolean`                                     | `true`                |
| `message`     | `message`      | The message text.                                                                                  | `string`                                      | `'This is a message'` |
| `showButton`  | `show-button`  | Whether the "Continue"-style action button is rendered.                                            | `boolean`                                     | `false`               |
| `showIcon`    | `show-icon`    | Whether the leading icon (default: clock) is rendered.                                             | `boolean`                                     | `true`                |
| `type`        | `type`         | Which severity/style to render. Drives background, text/icon color, and the action button's color. | `"error" \| "info" \| "neutral" \| "warning"` | `'error'`             |


## Events

| Event      | Description                                                                       | Type                |
| ---------- | --------------------------------------------------------------------------------- | ------------------- |
| `bsAction` | Fires when the action button is clicked. Only relevant when `showButton` is true. | `CustomEvent<void>` |
| `bsClose`  | Fires when the close button is clicked. Only relevant when `allowClose` is true.  | `CustomEvent<void>` |


## Slots

| Slot     | Description                                                                |
| -------- | -------------------------------------------------------------------------- |
| `"icon"` | Overrides the default leading icon. Only rendered when `showIcon` is true. |


## Shadow Parts

| Part        | Description                                  |
| ----------- | -------------------------------------------- |
| `"action"`  | The optional "Continue"-style action button. |
| `"close"`   | The optional close button.                   |
| `"icon"`    | The leading icon wrapper.                    |
| `"message"` | The message text.                            |


----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
