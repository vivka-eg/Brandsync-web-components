# bs-button



<!-- Auto Generated Below -->


## Overview

A clickable action element for the single most important action in a given context.

## When to use
- The primary call to action on a screen or within a card/modal (e.g. "Book room", "Confirm").
- Secondary, lower-emphasis actions alongside it (use `variant="neutral"`).
- `variant="error"` for destructive/irreversible actions (e.g. "Delete account") — per
  BrandSync guidance, destructive actions should always use the error variant, never
  `neutral`, so the visual weight matches the risk of the action.

## When not to use
- For navigation between pages — use a link/nav component instead, a button implies an
  in-page action, not a destination change.
- For more than one primary-emphasis action in the same view — pick one, demote the rest to
  `neutral`.
- `error` purely for visual emphasis — it signals a destructive action to the user, so reserve
  it for actions that actually delete/revoke/undo something.

## Properties

| Property    | Attribute    | Description                                                                                                                                                                                                                                             | Type                                                                                              | Default     |
| ----------- | ------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------- | ----------- |
| `ariaLabel` | `aria-label` | Accessible name for the button. Required for icon-only usage (no visible label text via the default slot) so screen readers still announce what the button does. Stencil reflects this camelCase prop to the `aria-label` HTML attribute automatically. | `string`                                                                                          | `null`      |
| `disabled`  | `disabled`   | Disables the button and applies the disabled token set.                                                                                                                                                                                                 | `boolean`                                                                                         | `false`     |
| `size`      | `size`       | Sizing scale.                                                                                                                                                                                                                                           | `"lg" \| "md" \| "sm"`                                                                            | `'md'`      |
| `type`      | `type`       | Native `<button>` type.                                                                                                                                                                                                                                 | `"button" \| "reset" \| "submit"`                                                                 | `'button'`  |
| `variant`   | `variant`    | Visual style. Maps directly to the brandsync-tokens `--bs-button-*` semantic set. `error` is for destructive/irreversible actions per BrandSync guidance, not a stronger emphasis alternative to `primary`.                                             | `"error" \| "info" \| "neutral" \| "outlined" \| "primary" \| "subtle" \| "success" \| "warning"` | `'primary'` |


## Slots

| Slot         | Description                                       |
| ------------ | ------------------------------------------------- |
|              | Default slot: the button's label content.         |
| `"end-icon"` | Optional trailing icon, rendered after the label. |
| `"icon"`     | Optional leading icon, rendered before the label. |


## Shadow Parts

| Part         | Description                        |
| ------------ | ---------------------------------- |
| `"end-icon"` | The trailing icon wrapper element. |
| `"icon"`     | The icon wrapper element.          |
| `"label"`    | The text label element.            |


----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
