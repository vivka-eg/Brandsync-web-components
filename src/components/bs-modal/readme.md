# bs-modal



<!-- Auto Generated Below -->


## Overview

An overlay dialog that interrupts the current flow for a focused task or confirmation.
Closes itself on backdrop click, Escape, or its own close button, and emits `bsClose`.

## When to use
- Confirming a consequential action (e.g. "Confirm booking") before it takes effect.
- A short, focused task that doesn't warrant navigating to a new page.

## When not to use
- For non-blocking status messages — use a toast/notification instead of interrupting the user.
- For a long, multi-step flow — a full page or a dedicated route is usually a better fit than a
  modal that just gets taller and taller.

## Properties

| Property  | Attribute | Description                                                                                                                                                                                      | Type                   | Default     |
| --------- | --------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ---------------------- | ----------- |
| `heading` | `heading` |                                                                                                                                                                                                  | `string`               | `undefined` |
| `open`    | `open`    | Mutable + reflected so the component can close itself (backdrop click, Escape, close button) the same way a native `<dialog>` does, while still emitting `bsClose` for the consumer to react to. | `boolean`              | `false`     |
| `size`    | `size`    |                                                                                                                                                                                                  | `"lg" \| "md" \| "sm"` | `'md'`      |


## Events

| Event     | Description | Type                |
| --------- | ----------- | ------------------- |
| `bsClose` |             | `CustomEvent<void>` |


## Slots

| Slot       | Description                                         |
| ---------- | --------------------------------------------------- |
|            | Default slot: the dialog body content.              |
| `"footer"` | Optional footer content (typically action buttons). |


## Shadow Parts

| Part         | Description                                                         |
| ------------ | ------------------------------------------------------------------- |
| `"backdrop"` | The full-viewport overlay behind the dialog.                        |
| `"body"`     | The body content wrapper.                                           |
| `"close"`    | The close button.                                                   |
| `"dialog"`   | The dialog box itself.                                              |
| `"footer"`   | The footer wrapper (only visible when the footer slot has content). |
| `"header"`   | The header row (heading + close button).                            |


----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
