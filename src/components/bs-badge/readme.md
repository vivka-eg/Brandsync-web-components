# bs-badge



<!-- Auto Generated Below -->


## Overview

A small status or category pill, usually paired with a label or list item.

## When to use
- Communicating a short, fixed status (e.g. "Active", "On leave") or category label.

## When not to use
- As an interactive/clickable element — a badge is a label, not a control. Use a button
  or chip component if it needs to be clickable.
- For long text — badges are sized for one or two words.

## Properties

| Property  | Attribute | Description                                                                         | Type                                                                                              | Default     |
| --------- | --------- | ----------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------- | ----------- |
| `variant` | `variant` | Maps directly to the brandsync-tokens `--bs-badge-bg-*` / `--bs-badge-text-*` sets. | `"default" \| "error" \| "info" \| "inverse" \| "neutral" \| "primary" \| "success" \| "warning"` | `'default'` |


## Slots

| Slot | Description                           |
| ---- | ------------------------------------- |
|      | Default slot: the badge's label text. |


## Shadow Parts

| Part          | Description       |
| ------------- | ----------------- |
| `"container"` | The pill element. |


----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
