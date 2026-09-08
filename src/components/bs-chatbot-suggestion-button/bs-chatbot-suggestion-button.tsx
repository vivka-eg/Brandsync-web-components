import { Component, Prop, Event, EventEmitter, h } from '@stencil/core';

/**
 * A pill-shaped clickable suggestion chip for a Genie AI chat panel (e.g. "How can I help you?").
 *
 * One instance renders one chip -- to show several suggestion prompts side by side, render
 * multiple `bs-chatbot-suggestion-button` elements inside a plain flex-wrap container; this
 * library doesn't ship a separate list/group component for that since a `<div>` with
 * `flex-wrap: wrap` is sufficient.
 *
 * ## When to use
 * - Quick-reply/starter prompts shown above or alongside `bs-composer` in a Genie AI chat panel.
 *
 * ## When not to use
 * - As a general-purpose button -- use `bs-button` instead, this component's pill shape and
 *   tonal color treatment are specific to Genie chat suggestion prompts.
 *
 * @slot - Default slot: the suggestion's label text.
 * @part button - The button element.
 * @prop --bs-chatbot-suggestion-button-radius - Corner radius. Aliased to `--bs-border-radius-full`.
 * @prop --bs-chatbot-suggestion-button-border-color - Border color. Aliased to `--bs-border-primary`.
 * @prop --bs-chatbot-suggestion-button-bg-default - Background in the default (enabled) state.
 *   Aliased to `--bs-color-primary-container`.
 * @prop --bs-chatbot-suggestion-button-bg-hover - Background on hover. Aliased to
 *   `--bs-color-primary-container-hover`.
 * @prop --bs-chatbot-suggestion-button-bg-pressed - Background when pressed. Aliased directly to
 *   the primitive `--bs-brand-200` -- there's no pre-built semantic "container-pressed" token
 *   matching this tonal button's lighter pressed shade progression (50 -> 100 -> 200), so this
 *   component aliases one locally (same situation `bs-button.css` documents for its
 *   subtle/outlined/success/warning/info variants).
 * @prop --bs-chatbot-suggestion-button-bg-focus - Background when focused. Aliased to
 *   `--bs-color-primary-container-hover` (same as hover).
 * @prop --bs-chatbot-suggestion-button-text-default - Text color in the default state. Aliased to
 *   `--bs-text-action`.
 * @prop --bs-chatbot-suggestion-button-text-hover - Text color on hover, pressed, and focus.
 *   Aliased to `--bs-text-action-hover`.
 * @prop --bs-chatbot-suggestion-button-focus-ring-color - Focus ring color. Aliased to
 *   `--bs-border-primary-focus`.
 */
@Component({
  tag: 'bs-chatbot-suggestion-button',
  styleUrl: 'bs-chatbot-suggestion-button.css',
  shadow: true,
})
export class BsChatbotSuggestionButton {
  /** Disables the button and applies a reduced-opacity treatment. */
  @Prop() disabled = false;

  /** Fires when the button is clicked. */
  @Event() bsSelect: EventEmitter<void>;

  private onClick = () => {
    this.bsSelect.emit();
  };

  render() {
    return (
      <button
        type="button"
        part="button"
        class="bs-chatbot-suggestion-button"
        disabled={this.disabled}
        onClick={this.onClick}
      >
        <slot></slot>
      </button>
    );
  }
}
