import { Component, h } from '@stencil/core';

/**
 * A centered caption disclaimer for Genie AI surfaces, e.g. "AI can make mistakes. Please verify
 * important information."
 *
 * ## When to use
 * - Below or above `bs-composer` in a Genie AI chat panel, to remind users AI output can be wrong.
 *
 * ## When not to use
 * - A general-purpose caption/helper text — use plain text or `bs-input`'s description slot for
 *   non-AI-related helper copy.
 *
 * The default slot (rather than a fixed prop) is intentional: Figma only specifies plain text, but
 * some consuming apps link out to a policy/help page from this copy, and a slot supports that
 * without inventing an unconfirmed `href`/link prop.
 *
 * @slot - The disclaimer text/content, centered. Defaults to no content -- the consumer supplies
 *   the copy, e.g. "AI can make mistakes. Please verify important information."
 * @part text - The disclaimer text container.
 * @prop --bs-ai-disclaimer-padding-x - Horizontal padding. Aliased to `--bs-spacing-200`.
 * @prop --bs-ai-disclaimer-text-color - Text color. Aliased to `--bs-text-secondary`.
 * @prop --bs-ai-disclaimer-font-size - Text font size. Aliased to `--bs-font-size-sm`.
 * @prop --bs-ai-disclaimer-line-height - Text line height. Aliased to `--bs-line-height-body-sm`.
 */
@Component({
  tag: 'bs-ai-disclaimer',
  styleUrl: 'bs-ai-disclaimer.css',
  shadow: true,
})
export class BsAiDisclaimer {
  render() {
    return (
      <div class="bs-ai-disclaimer">
        <p part="text" class="bs-ai-disclaimer__text">
          <slot></slot>
        </p>
      </div>
    );
  }
}
