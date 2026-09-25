# bs-card



<!-- Auto Generated Below -->


## Overview

A bounded surface for grouping related content — a summary, a form section, a list item.

## When to use
- Grouping a self-contained piece of content that needs visual separation from the page
  background (e.g. a booking summary, a settings section).

## When not to use
- As the only structural element on a page — cards group content, they don't replace layout.
- For a dismissible/transient message — use a modal or a dedicated notification component.

## Properties

| Property  | Attribute | Description                                                                                                                                                            | Type                                | Default    |
| --------- | --------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------- | ---------- |
| `surface` | `surface` | Maps to the brandsync-tokens `--bs-paper-bg-*` set — Brandsync's tokens don't have a dedicated "card" component yet, so this reuses the existing Paper surface tokens. | `"base" \| "container" \| "raised"` | `'raised'` |


## Slots

| Slot       | Description                                                                                                                                                                             |
| ---------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
|            | Default slot: the card's main body content.                                                                                                                                             |
| `"footer"` | Optional actions/content below the body (e.g. a button).                                                                                                                                |
| `"header"` | Optional heading content above the body.                                                                                                                                                |
| `"image"`  | Optional hero image across the top of the card, flush with its edges and clipped to its top corners. Presence of assigned content is what shows it -- doesn't affect layout when empty. |


## Shadow Parts

| Part          | Description                                                              |
| ------------- | ------------------------------------------------------------------------ |
| `"body"`      | The body wrapper.                                                        |
| `"container"` | The outer surface element.                                               |
| `"footer"`    | The footer wrapper.                                                      |
| `"header"`    | The header wrapper.                                                      |
| `"image"`     | The hero image wrapper (only visible when the `image` slot has content). |


----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
