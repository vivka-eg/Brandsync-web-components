# bs-chatbot-suggestion-button



<!-- Auto Generated Below -->


## Overview

A pill-shaped clickable suggestion chip for a Genie AI chat panel (e.g. "How can I help you?").

One instance renders one chip -- to show several suggestion prompts side by side, render
multiple `bs-chatbot-suggestion-button` elements inside a plain flex-wrap container; this
library doesn't ship a separate list/group component for that since a `<div>` with
`flex-wrap: wrap` is sufficient.

## When to use
- Quick-reply/starter prompts shown above or alongside `bs-composer` in a Genie AI chat panel.

## When not to use
- As a general-purpose button -- use `bs-button` instead, this component's pill shape and
  tonal color treatment are specific to Genie chat suggestion prompts.

## Properties

| Property   | Attribute  | Description                                                  | Type      | Default |
| ---------- | ---------- | ------------------------------------------------------------ | --------- | ------- |
| `disabled` | `disabled` | Disables the button and applies a reduced-opacity treatment. | `boolean` | `false` |


## Events

| Event      | Description                       | Type                |
| ---------- | --------------------------------- | ------------------- |
| `bsSelect` | Fires when the button is clicked. | `CustomEvent<void>` |


## Slots

| Slot | Description                                |
| ---- | ------------------------------------------ |
|      | Default slot: the suggestion's label text. |


## Shadow Parts

| Part       | Description         |
| ---------- | ------------------- |
| `"button"` | The button element. |


----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
