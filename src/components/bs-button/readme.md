# bs-button



<!-- Auto Generated Below -->


## Overview

A clickable action element for the single most important action in a given context.

## When to use
- The primary call to action on a screen or within a card/modal (e.g. "Book room", "Confirm").
- Secondary, lower-emphasis actions alongside it (use `variant="neutral"`).

## When not to use
- For navigation between pages — use a link/nav component instead, a button implies an
  in-page action, not a destination change.
- For more than one primary-emphasis action in the same view — pick one, demote the rest to
  `neutral`.

## Properties

| Property   | Attribute  | Description                                                                       | Type                              | Default     |
| ---------- | ---------- | --------------------------------------------------------------------------------- | --------------------------------- | ----------- |
| `disabled` | `disabled` | Disables the button and applies the disabled token set.                           | `boolean`                         | `false`     |
| `size`     | `size`     | Sizing scale.                                                                     | `"lg" \| "md" \| "sm"`            | `'md'`      |
| `type`     | `type`     | Native `<button>` type.                                                           | `"button" \| "reset" \| "submit"` | `'button'`  |
| `variant`  | `variant`  | Visual style. Maps directly to the brandsync-tokens `--bs-button-*` semantic set. | `"neutral" \| "primary"`          | `'primary'` |


## Slots

| Slot     | Description                                       |
| -------- | ------------------------------------------------- |
|          | Default slot: the button's label content.         |
| `"icon"` | Optional leading icon, rendered before the label. |


## Shadow Parts

| Part      | Description               |
| --------- | ------------------------- |
| `"icon"`  | The icon wrapper element. |
| `"label"` | The text label element.   |


----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
