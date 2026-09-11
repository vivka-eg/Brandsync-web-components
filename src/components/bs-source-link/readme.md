# bs-source-link



<!-- Auto Generated Below -->


## Overview

A single citation row inside `bs-chatbot-sources-drawer` -- a file icon + filename on the first
line, the originating system and version on the second, and a trailing "open" arrow.

## When to use
- One row per source Genie cited in a response, slotted into `bs-chatbot-sources-drawer`.

## When not to use
- Outside the sources drawer context -- this is a purpose-built citation row, not a generic
  link/list-item component.

## Properties

| Property     | Attribute     | Description                                                                                            | Type     | Default     |
| ------------ | ------------- | ------------------------------------------------------------------------------------------------------ | -------- | ----------- |
| `fileName`   | `file-name`   | The cited document's filename.                                                                         | `string` | `'Source'`  |
| `href`       | `href`        | If set, renders the row as a link that opens this URL; otherwise as a button that only emits `bsOpen`. | `string` | `undefined` |
| `sourceName` | `source-name` | The system/app the document came from (e.g. "HoltePortalen").                                          | `string` | `undefined` |
| `target`     | `target`      | `target` used when `href` is set.                                                                      | `string` | `'_blank'`  |
| `version`    | `version`     | The document's version label (e.g. "v3.2"). Omit if the source has no version.                         | `string` | `undefined` |


## Events

| Event    | Description                                                                                               | Type                |
| -------- | --------------------------------------------------------------------------------------------------------- | ------------------- |
| `bsOpen` | Fires on click/activation, whether or not `href` is set -- lets the consuming app log or handle the open. | `CustomEvent<void>` |


## Slots

| Slot     | Description                      |
| -------- | -------------------------------- |
| `"icon"` | Overrides the default file icon. |


## Shadow Parts

| Part         | Description                     |
| ------------ | ------------------------------- |
| `"arrow"`    | The trailing "open" arrow icon. |
| `"filename"` | The filename text.              |
| `"icon"`     | The leading file-type icon.     |
| `"source"`   | The source system name.         |
| `"version"`  | The version label.              |


----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
