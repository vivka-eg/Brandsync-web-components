# bs-attachment



<!-- Auto Generated Below -->


## Overview

A single file attachment preview for `bs-composer` -- an image thumbnail, or a filename card
with a colored file-type badge (PDF/Document), with an optional upload-in-progress spinner and
a hover/focus-revealed remove button.

## When to use
- Rendered by the consuming app for each file a user has attached to a Genie AI chat message,
  typically alongside or inside `bs-composer`.

## When not to use
- A generic file-upload control -- this is a preview-only presentational component. The
  consuming app owns the actual file picker/upload logic and drives `loading` from that state.

## Properties

| Property    | Attribute   | Description                                                                                  | Type                             | Default        |
| ----------- | ----------- | -------------------------------------------------------------------------------------------- | -------------------------------- | -------------- |
| `fileName`  | `file-name` | The filename shown on the card. Only used when `type` is "pdf" or "document".                | `string`                         | `'Attachment'` |
| `imageAlt`  | `image-alt` | Accessible alt text for the image thumbnail. Only used when `type` is "image".               | `string`                         | `''`           |
| `imageSrc`  | `image-src` | The thumbnail image URL. Only used when `type` is "image".                                   | `string`                         | `undefined`    |
| `loading`   | `loading`   | Shows an upload-in-progress spinner (blurred + overlaid for images, in the badge for files). | `boolean`                        | `false`        |
| `removable` | `removable` | Whether the hover/focus-revealed remove button is rendered at all.                           | `boolean`                        | `true`         |
| `type`      | `type`      | Which kind of attachment preview to render.                                                  | `"document" \| "image" \| "pdf"` | `'image'`      |


## Events

| Event      | Description                              | Type                |
| ---------- | ---------------------------------------- | ------------------- |
| `bsRemove` | Fires when the remove button is clicked. | `CustomEvent<void>` |


## Shadow Parts

| Part          | Description                                            |
| ------------- | ------------------------------------------------------ |
| `"badge"`     | The colored file-type badge inside the card.           |
| `"card"`      | The filename card (type="pdf" / type="document" only). |
| `"filename"`  | The truncated filename text inside the card.           |
| `"remove"`    | The remove button.                                     |
| `"thumbnail"` | The image thumbnail wrapper (type="image" only).       |


----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
