# bs-ai-thinking



<!-- Auto Generated Below -->


## Overview

A small inline status indicator for Genie AI surfaces: the colorful Genie mark next to a label
(e.g. "Retrieving", "Thinking", "Searching") whose text pulses in a slow breathing loop while
an operation is in progress.

## When to use
- Inline in a Genie AI chat transcript to show what the assistant is currently doing while a
  response is being generated (retrieving context, searching, thinking).

## When not to use
- A blocking/full-panel loading state -- this is a small inline indicator, not a spinner overlay.

The label's pulse animation reproduces Figma's exact keyframe track (a plain opacity
fade-in/hold/reset with the source's own cubic-bezier easing) rather than an invented
shimmer-sweep -- the source design only specifies this one animation.

## Properties

| Property | Attribute | Description                                                                         | Type     | Default      |
| -------- | --------- | ----------------------------------------------------------------------------------- | -------- | ------------ |
| `label`  | `label`   | The status text shown next to the icon, e.g. "Retrieving", "Thinking", "Searching". | `string` | `'Thinking'` |


## Shadow Parts

| Part      | Description            |
| --------- | ---------------------- |
| `"icon"`  | The Genie mark icon.   |
| `"label"` | The status label text. |


----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
