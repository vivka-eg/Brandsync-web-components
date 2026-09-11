# bs-ai-greeting



<!-- Auto Generated Below -->


## Overview

The centered welcome heading shown at the top of an empty Genie AI chat panel, e.g.
"Hi. I'm Genie, your AI assistant." + "How can I help you with [product] today?"

## When to use
- The empty/initial state of a Genie AI chat panel, before the user has sent a message.

## When not to use
- Once a conversation has started -- this is a one-time empty-state greeting, not a persistent
  header (see `bs-chatbot-header` for that).

`productName` is optional: Figma's copy has a `[product_name]` placeholder the consuming app is
expected to fill in, but a component shouldn't force a product name to exist, so leaving it
unset falls back to a product-agnostic "How can I help you today?".

## Properties

| Property        | Attribute        | Description                                                                        | Type     | Default     |
| --------------- | ---------------- | ---------------------------------------------------------------------------------- | -------- | ----------- |
| `assistantName` | `assistant-name` | The assistant's name, used in the heading ("Hi. I'm {assistantName},").            | `string` | `'Genie'`   |
| `productName`   | `product-name`   | The product name mentioned in the subtext. Omit to use a product-agnostic subtext. | `string` | `undefined` |


## Shadow Parts

| Part        | Description                                                     |
| ----------- | --------------------------------------------------------------- |
| `"heading"` | The bold "Hi. I'm {assistantName}, your AI assistant." heading. |
| `"subtext"` | The "How can I help you..." subtext.                            |


----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
