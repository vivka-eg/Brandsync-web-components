# bs-attachment-list



<!-- Auto Generated Below -->


## Overview

A horizontally-scrolling row wrapper for one or more `bs-attachment` previews, for slotting into
`bs-composer`'s `attachments` slot when a Genie AI chat message has file attachments.

## When to use
- Wrapping any number of `bs-attachment` elements the user has attached to a message, so they
  lay out in a single row and scroll horizontally instead of wrapping/overflowing once there
  are more than fit the available width.

## When not to use
- A single attachment on its own — just render `bs-attachment` directly, this wrapper's
  scroll/fade affordance only matters once there's more content than fits.

## Properties

| Property    | Attribute    | Description                                | Type     | Default         |
| ----------- | ------------ | ------------------------------------------ | -------- | --------------- |
| `ariaLabel` | `aria-label` | Accessible name for the scrollable region. | `string` | `'Attachments'` |


## Slots

| Slot | Description                           |
| ---- | ------------------------------------- |
|      | One or more `bs-attachment` elements. |


## Shadow Parts

| Part     | Description                                                                             |
| -------- | --------------------------------------------------------------------------------------- |
| `"fade"` | The right-edge fade-out overlay shown only while the row has more content to scroll to. |
| `"row"`  | The scrollable flex row containing the slotted attachments.                             |


----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
