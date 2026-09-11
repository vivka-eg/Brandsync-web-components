# bs-chatbot-sources-drawer



<!-- Auto Generated Below -->


## Overview

The "Sources" panel shown alongside a Genie AI chat response -- a header with a title, a count
badge, and a collapse chevron, above a stack of `bs-source-link` citation rows.

## When to use
- Displaying the documents/sources a Genie response cited, typically opened from a "view
  sources" action on a `bs-chatbot-response-action` bar.

## When not to use
- A generic list container -- this component's header (title + count + collapse) is
  purpose-built for the sources use case.

## Properties

| Property  | Attribute | Description                                                                                                                                                       | Type     | Default     |
| --------- | --------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------- | ----------- |
| `count`   | `count`   | Overrides the auto-detected count badge. By default the badge reflects the number of slotted `bs-source-link` children, so most consumers don't need to set this. | `number` | `undefined` |
| `heading` | `heading` | The panel title.                                                                                                                                                  | `string` | `'Sources'` |


## Events

| Event        | Description                                                                                   | Type                |
| ------------ | --------------------------------------------------------------------------------------------- | ------------------- |
| `bsCollapse` | Fires when the collapse chevron is clicked. The consuming app owns actually hiding the panel. | `CustomEvent<void>` |


## Slots

| Slot              | Description                                  |
| ----------------- | -------------------------------------------- |
|                   | One or more `bs-source-link` rows.           |
| `"collapse-icon"` | Overrides the default collapse chevron icon. |


## Shadow Parts

| Part         | Description                                                |
| ------------ | ---------------------------------------------------------- |
| `"collapse"` | The collapse chevron button.                               |
| `"count"`    | The count badge next to the title.                         |
| `"heading"`  | The "Sources" title text.                                  |
| `"list"`     | The scrollable container of slotted `bs-source-link` rows. |


----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
