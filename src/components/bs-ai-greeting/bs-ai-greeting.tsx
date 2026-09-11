import { Component, Prop, h } from '@stencil/core';

/**
 * The centered welcome heading shown at the top of an empty Genie AI chat panel, e.g.
 * "Hi. I'm Genie, your AI assistant." + "How can I help you with [product] today?"
 *
 * ## When to use
 * - The empty/initial state of a Genie AI chat panel, before the user has sent a message.
 *
 * ## When not to use
 * - Once a conversation has started -- this is a one-time empty-state greeting, not a persistent
 *   header (see `bs-chatbot-header` for that).
 *
 * `productName` is optional: Figma's copy has a `[product_name]` placeholder the consuming app is
 * expected to fill in, but a component shouldn't force a product name to exist, so leaving it
 * unset falls back to a product-agnostic "How can I help you today?".
 *
 * @part heading - The bold "Hi. I'm {assistantName}, your AI assistant." heading.
 * @part subtext - The "How can I help you..." subtext.
 * @prop --bs-ai-greeting-gap - Gap between heading and subtext. Aliased to `--bs-spacing-200`.
 * @prop --bs-ai-greeting-max-width - Max width of the centered content block. Matches Figma's
 *   490px.
 * @prop --bs-ai-greeting-heading-color - Heading text color. Aliased to `--bs-text-default`.
 * @prop --bs-ai-greeting-heading-font-size - Heading font size. Aliased to `--bs-font-size-4xl`.
 * @prop --bs-ai-greeting-heading-line-height - Heading line height. Figma specifies 28px, which
 *   doesn't match any `--bs-line-height-heading-*` token (h4 is 32) -- aliased directly to
 *   `--bs-line-height-body-lg`, the token that happens to share the same numeric value.
 * @prop --bs-ai-greeting-heading-weight - Heading font weight. Aliased to `--bs-font-weight-bold`.
 * @prop --bs-ai-greeting-heading-gap - Gap between the two heading lines. Aliased to
 *   `--bs-spacing-200`.
 * @prop --bs-ai-greeting-subtext-color - Subtext color. Aliased to `--bs-text-secondary`.
 * @prop --bs-ai-greeting-subtext-font-size - Subtext font size. Figma specifies 20px, which
 *   doesn't match the semantic `--bs-text-style-body-lg-size` (18px) -- aliased directly to the
 *   raw `--bs-font-size-xl` primitive instead.
 * @prop --bs-ai-greeting-subtext-line-height - Subtext line height. Aliased to
 *   `--bs-line-height-body-lg`.
 */
@Component({
  tag: 'bs-ai-greeting',
  styleUrl: 'bs-ai-greeting.css',
  shadow: true,
})
export class BsAiGreeting {
  /** The assistant's name, used in the heading ("Hi. I'm {assistantName},"). */
  @Prop() assistantName = 'Genie';

  /** The product name mentioned in the subtext. Omit to use a product-agnostic subtext. */
  @Prop() productName?: string;

  render() {
    const subtext = this.productName
      ? `How can I help you with ${this.productName} today?`
      : 'How can I help you today?';

    return (
      <div class="bs-ai-greeting">
        <div part="heading" class="bs-ai-greeting__heading">
          <p class="bs-ai-greeting__heading-line">Hi. I'm {this.assistantName},</p>
          <p class="bs-ai-greeting__heading-line">your AI assistant.</p>
        </div>
        <p part="subtext" class="bs-ai-greeting__subtext">
          {subtext}
        </p>
      </div>
    );
  }
}
