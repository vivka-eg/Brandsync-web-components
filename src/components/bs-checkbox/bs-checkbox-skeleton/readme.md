# bs-checkbox-skeleton



<!-- Auto Generated Below -->


## Overview

A shape-matched loading placeholder for `bs-checkbox`, shown while the real label text isn't
known yet (e.g. still being fetched from an API). Renders a small square (matching the
checkbox's own box) beside a text-bar placeholder (standing in for the label), both pulsing
together, sized to match `bs-checkbox`'s `sm`/`md`/`lg` box dimensions so layout doesn't shift
once the real checkbox renders.

## When to use
- In place of a `bs-checkbox` whose label/checked state depends on data that hasn't loaded yet.

## When not to use
- While a checkbox's own change handler is running (e.g. a save request in flight) -- render the
  real `bs-checkbox` itself; this component is not a saving-in-progress spinner.

## Properties

| Property | Attribute | Description                                                                                                                             | Type                   | Default |
| -------- | --------- | --------------------------------------------------------------------------------------------------------------------------------------- | ---------------------- | ------- |
| `size`   | `size`    | Sizing scale, matching the `bs-checkbox` size it stands in for. Defaults to `lg`, the same (unusual) default `bs-checkbox` itself uses. | `"lg" \| "md" \| "sm"` | `'lg'`  |


## Shadow Parts

| Part          | Description                                                     |
| ------------- | --------------------------------------------------------------- |
| `"box"`       | The pulsing placeholder standing in for the checkbox's own box. |
| `"container"` | The outer wrapper holding both placeholder pieces.              |
| `"label"`     | The pulsing placeholder bar standing in for the label text.     |


----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
