# bs-chatbot-response-action



<!-- Auto Generated Below -->


## Overview

The row of action buttons that appears below an AI response message in a Genie chat panel:
like, dislike, copy, regenerate, and more-options icon buttons, plus an optional "N sources"
button.

## When to use
- Directly below an AI-generated response message in a Genie chat panel.

## When not to use
- Below a user's own message -- these actions (regenerate, like/dislike a response, etc.) only
  make sense for AI-generated content.

## Properties

| Property       | Attribute       | Description                                                                                                                                                                                                                                                                                                                 | Type      | Default     |
| -------------- | --------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------- | ----------- |
| `menuOpen`     | `menu-open`     | Whether the "more options" popup menu (the `menu` slot) is currently open. Mutable + reflected so the component can track/close itself (kebab click, click outside, Escape) the same way `bs-chatbot-header`'s `expanded` prop tracks its own toggle state, while still emitting `bsMenuOpen` for the consumer to react to. | `boolean` | `false`     |
| `sourcesCount` | `sources-count` | Number of sources backing the response. When set to a positive number, renders the "N sources" button (singular "1 source" / plural "N sources"). When unset or `0`, the button is not rendered at all.                                                                                                                     | `number`  | `undefined` |


## Events

| Event            | Description                                                                                                                   | Type                   |
| ---------------- | ----------------------------------------------------------------------------------------------------------------------------- | ---------------------- |
| `bsCopy`         | Fires when the "Copy" button is clicked.                                                                                      | `CustomEvent<void>`    |
| `bsDislike`      | Fires when the "Dislike" button is clicked.                                                                                   | `CustomEvent<void>`    |
| `bsLike`         | Fires when the "Like" button is clicked.                                                                                      | `CustomEvent<void>`    |
| `bsMenuOpen`     | Fires when the "More options" button is clicked or the menu is closed (click outside, Escape), with the new `menuOpen` value. | `CustomEvent<boolean>` |
| `bsRegenerate`   | Fires when the "Regenerate" button is clicked.                                                                                | `CustomEvent<void>`    |
| `bsSourcesClick` | Fires when the "N sources" button is clicked.                                                                                 | `CustomEvent<void>`    |


## Slots

| Slot                | Description                                                                                                                           |
| ------------------- | ------------------------------------------------------------------------------------------------------------------------------------- |
| `"copy-icon"`       | Overrides the default "Copy" button icon.                                                                                             |
| `"dislike-icon"`    | Overrides the default "Dislike" button icon.                                                                                          |
| `"like-icon"`       | Overrides the default "Like" button icon.                                                                                             |
| `"menu"`            | A `bs-menu` (or other content) rendered in a popup positioned below the "More options" button, shown only while `menuOpen` is `true`. |
| `"menu-icon"`       | Overrides the default "More options" button icon.                                                                                     |
| `"regenerate-icon"` | Overrides the default "Regenerate" button icon.                                                                                       |
| `"sources-icon"`    | Overrides the default icon in the "N sources" button.                                                                                 |


## Shadow Parts

| Part           | Description                                                        |
| -------------- | ------------------------------------------------------------------ |
| `"copy"`       | The "Copy" icon button.                                            |
| `"dislike"`    | The "Dislike" icon button.                                         |
| `"like"`       | The "Like" icon button.                                            |
| `"menu"`       | The "More options" icon button.                                    |
| `"regenerate"` | The "Regenerate" icon button.                                      |
| `"sources"`    | The "N sources" button (only rendered when `sourcesCount` is set). |


----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
