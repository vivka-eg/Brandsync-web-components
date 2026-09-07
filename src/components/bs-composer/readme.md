# bs-composer



<!-- Auto Generated Below -->


## Overview

A chat composer input for Genie AI-style conversational interfaces: a text field
plus an attach button, a mic/voice-recording toggle, and a single primary action button whose
icon and behavior change with `state` (send, stop generating, or confirm a voice recording).

## When to use
- The message-entry bar for an AI chat/assistant or human support conversation.

## When not to use
- A general-purpose text field — use `bs-input` instead; this component's layout and states are
  purpose-built for a chat composer, not a generic form field.

## Properties

| Property      | Attribute     | Description                                                                                                                                                                                                                                                                                                                           | Type                                                  | Default     |
| ------------- | ------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------- | ----------- |
| `ariaLabel`   | `aria-label`  | Accessible name for the text field. This component has no visible `<label>` (chat composers don't show one in the design), so `ariaLabel` is the only way a consumer gives the textbox an accessible name -- set it in every real usage.                                                                                              | `string`                                              | `null`      |
| `placeholder` | `placeholder` | Overrides the variant's default placeholder.                                                                                                                                                                                                                                                                                          | `string`                                              | `undefined` |
| `state`       | `state`       | Which of the four mutually-exclusive composer states to render: `idle` (send, enabled), `generating` (stop, while the AI is responding), `disabled` (send, but not interactive), or `recording` (voice input in progress -- shows a waveform and a confirm action).                                                                   | `"disabled" \| "generating" \| "idle" \| "recording"` | `'idle'`    |
| `value`       | `value`       | Current text value. Native `input` events don't cross the Shadow DOM boundary, so this component re-dispatches them as a `bsInput` custom event instead.                                                                                                                                                                              | `string`                                              | `''`        |
| `variant`     | `variant`     | Which flavor of composer this is: changes the *default* placeholder text (set `placeholder` directly to override it) and, per the Figma design, renders the container border dashed instead of solid for `'human'` -- a deliberate visual cue distinguishing a human-support composer from the AI one, not a layout/token difference. | `"ai" \| "human"`                                     | `'ai'`      |


## Events

| Event            | Description                                                                                                                                                                        | Type                  |
| ---------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------- |
| `bsAttach`       | Fires when the "+" attach button is clicked.                                                                                                                                       | `CustomEvent<void>`   |
| `bsInput`        | Fires on every keystroke in the text field, with the current value.                                                                                                                | `CustomEvent<string>` |
| `bsMicToggle`    | Fires when the mic/stop-recording button is clicked. The consumer decides what that means (e.g. start recording when idle/generating, or stop recording when `state="recording"`). | `CustomEvent<void>`   |
| `bsStop`         | Fires when the primary action button is clicked while `state="generating"`.                                                                                                        | `CustomEvent<void>`   |
| `bsSubmit`       | Fires when the primary action button is clicked while `state="idle"`.                                                                                                              | `CustomEvent<void>`   |
| `bsVoiceConfirm` | Fires when the primary action button is clicked while `state="recording"`.                                                                                                         | `CustomEvent<void>`   |


## Shadow Parts

| Part       | Description                                                                                     |
| ---------- | ----------------------------------------------------------------------------------------------- |
| `"action"` | The primary circular action button (send, stop, or confirm depending on `state`).               |
| `"attach"` | The "+" attach button.                                                                          |
| `"input"`  | The native text `<input>`.                                                                      |
| `"mic"`    | The secondary icon button (microphone, or the stop-recording square while `state="recording"`). |


----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
