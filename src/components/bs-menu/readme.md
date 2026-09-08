# bs-menu



<!-- Auto Generated Below -->


## Overview

A generic dropdown/popup menu container: a rounded, elevated list of items (typically
`bs-menu-item` elements).

## When to use
- A popup list of actions/options triggered by another control (e.g. a "more options" kebab
  button), such as `bs-chatbot-response-action`'s `menu` slot.

## When not to use
- A persistent, always-visible list of options -- this component is purpose-built as a popup
  surface (rounded corners, elevation shadow), not a plain list.

## Slots

| Slot | Description                                                                                                                                                   |
| ---- | ------------------------------------------------------------------------------------------------------------------------------------------------------------- |
|      | Default slot: the menu's items (typically `bs-menu-item` elements, though anything can be slotted in -- this component doesn't restrict slot content via JS). |


## Shadow Parts

| Part     | Description                                           |
| -------- | ----------------------------------------------------- |
| `"list"` | The rounded, elevated box wrapping the slotted items. |


----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
