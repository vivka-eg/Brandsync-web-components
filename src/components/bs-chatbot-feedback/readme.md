# bs-chatbot-feedback



<!-- Auto Generated Below -->


## Overview

A star-rating feedback card shown at the end of a Genie AI chat: a heading/subtitle, a 5-star
rating, an optional comment, and either "Submit feedback" + "Start new chat" (before
submitting) or just "Start new chat" (after).

## When to use
- Prompting for feedback on a Genie response or chat session, typically after the user ends or
  restarts a conversation.

## When not to use
- A generic star-rating input elsewhere in the product -- this component's copy and layout are
  purpose-built for the Genie feedback flow, not a reusable rating control.

The heading and subtitle are not freeform props: before submitting, they're always the fixed
"How was your experience..." copy; after submitting, they're determined entirely by `rating`
(1-2 stars reads apologetic, 3 neutral, 4-5 positive), matching the Figma source exactly. Use
`heading`/`subtitle` only if a consuming app genuinely needs to override that copy.

## Properties

| Property    | Attribute   | Description                                                                                                   | Type      | Default     |
| ----------- | ----------- | ------------------------------------------------------------------------------------------------------------- | --------- | ----------- |
| `comment`   | `comment`   | The comment text.                                                                                             | `string`  | `''`        |
| `heading`   | `heading`   | Overrides the computed heading (see the class doc for why this is computed by default).                       | `string`  | `undefined` |
| `rating`    | `rating`    | Current star rating, 0-5. 0 means no rating has been given yet.                                               | `number`  | `0`         |
| `submitted` | `submitted` | Whether feedback has been submitted. Switches the card from the editable form to the read-only "thanks" view. | `boolean` | `false`     |
| `subtitle`  | `subtitle`  | Overrides the computed subtitle.                                                                              | `string`  | `undefined` |


## Events

| Event            | Description                                                                                                  | Type                                                |
| ---------------- | ------------------------------------------------------------------------------------------------------------ | --------------------------------------------------- |
| `bsClose`        | Fires when the close button is clicked. The consuming app owns actually hiding the card.                     | `CustomEvent<void>`                                 |
| `bsCommentInput` | Fires on every keystroke in the comment textarea, with the current value.                                    | `CustomEvent<string>`                               |
| `bsNewChat`      | Fires when "Start new chat" is clicked. The consuming app owns actually starting a new chat.                 | `CustomEvent<void>`                                 |
| `bsRatingChange` | Fires when a star is clicked, with the new rating.                                                           | `CustomEvent<number>`                               |
| `bsSubmit`       | Fires when "Submit feedback" is clicked, with the current rating and comment. Also sets `submitted` to true. | `CustomEvent<{ rating: number; comment: string; }>` |


## Shadow Parts

| Part         | Description                                                                                |
| ------------ | ------------------------------------------------------------------------------------------ |
| `"close"`    | The close button.                                                                          |
| `"comment"`  | The submitted comment, read-only (only rendered after submitting, if a comment was given). |
| `"heading"`  | The heading text.                                                                          |
| `"label"`    | The "Tell us what you think" label (only rendered before submitting).                      |
| `"new-chat"` | The "Start new chat" button.                                                               |
| `"star"`     | A single star button (`::part(star)` matches all five).                                    |
| `"submit"`   | The "Submit feedback" button (only rendered before submitting).                            |
| `"subtitle"` | The subtitle text.                                                                         |
| `"textarea"` | The comment textarea (only rendered before submitting).                                    |


----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
