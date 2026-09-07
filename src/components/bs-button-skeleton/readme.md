# bs-button-skeleton



<!-- Auto Generated Below -->


## Overview

A shape-matched loading placeholder for `bs-button`, shown while the real label/action isn't
known yet (e.g. still being fetched from an API). Sized to match `bs-button`'s `sm`/`md`/`lg`
heights so layout doesn't shift once the real button renders.

This is not a submit-in-progress spinner — that's a different concern (a button that's
already rendered but waiting on an async action it triggered). Use this component only when
the button itself doesn't exist yet.

## When to use
- In place of a `bs-button` whose label/visibility depends on data that hasn't loaded yet.

## When not to use
- While a button's own click handler is running (e.g. a submit request in flight) — render the
  real `bs-button` and show its own busy/spinner state instead.

## Properties

| Property | Attribute | Description                                                   | Type                   | Default |
| -------- | --------- | ------------------------------------------------------------- | ---------------------- | ------- |
| `size`   | `size`    | Sizing scale, matching the `bs-button` size it stands in for. | `"lg" \| "md" \| "sm"` | `'md'`  |


## Shadow Parts

| Part          | Description                      |
| ------------- | -------------------------------- |
| `"container"` | The pulsing placeholder element. |


----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
