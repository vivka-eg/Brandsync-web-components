# bs-ai-disclaimer



<!-- Auto Generated Below -->


## Overview

A centered caption disclaimer for Genie AI surfaces, e.g. "AI can make mistakes. Please verify
important information."

## When to use
- Below or above `bs-composer` in a Genie AI chat panel, to remind users AI output can be wrong.

## When not to use
- A general-purpose caption/helper text — use plain text or `bs-input`'s description slot for
  non-AI-related helper copy.

The default slot (rather than a fixed prop) is intentional: Figma only specifies plain text, but
some consuming apps link out to a policy/help page from this copy, and a slot supports that
without inventing an unconfirmed `href`/link prop.

## Slots

| Slot | Description                                                                                                                                                        |
| ---- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
|      | The disclaimer text/content, centered. Defaults to no content -- the consumer supplies the copy, e.g. "AI can make mistakes. Please verify important information." |


## Shadow Parts

| Part     | Description                    |
| -------- | ------------------------------ |
| `"text"` | The disclaimer text container. |


----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
