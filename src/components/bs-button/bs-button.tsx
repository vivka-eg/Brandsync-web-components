import { Component, Prop, State, h } from '@stencil/core';

export type BsButtonVariant = 'primary' | 'neutral';
export type BsButtonSize = 'sm' | 'md' | 'lg';

/**
 * A clickable action element for the single most important action in a given context.
 *
 * ## When to use
 * - The primary call to action on a screen or within a card/modal (e.g. "Book room", "Confirm").
 * - Secondary, lower-emphasis actions alongside it (use `variant="neutral"`).
 *
 * ## When not to use
 * - For navigation between pages — use a link/nav component instead, a button implies an
 *   in-page action, not a destination change.
 * - For more than one primary-emphasis action in the same view — pick one, demote the rest to
 *   `neutral`.
 *
 * @slot - Default slot: the button's label content.
 * @slot icon - Optional leading icon, rendered before the label.
 * @part icon - The icon wrapper element.
 * @part label - The text label element.
 * @prop --bs-button-radius - Corner radius. Aliased to `--bs-border-radius-100` by default.
 * @prop --bs-button-height-sm - Height at `size="sm"`. Aliased to `--bs-spacing-500`.
 * @prop --bs-button-height-md - Height at `size="md"`. Aliased to `--bs-spacing-600`.
 * @prop --bs-button-height-lg - Height at `size="lg"`. Aliased to `--bs-spacing-700`.
 */
@Component({
  tag: 'bs-button',
  styleUrl: 'bs-button.css',
  // delegatesFocus, not just shadow:true -- without it, calling .focus() on the <bs-button> host
  // (e.g. bs-modal restoring focus to whatever triggered it) silently no-ops, because a shadow
  // host isn't itself focusable by default and focus doesn't automatically enter its shadow root.
  shadow: { delegatesFocus: true },
})
export class BsButton {
  /** Visual style. Maps directly to the brandsync-tokens `--bs-button-*` semantic set. */
  @Prop() variant: BsButtonVariant = 'primary';

  /** Sizing scale. */
  @Prop() size: BsButtonSize = 'md';

  /** Disables the button and applies the disabled token set. */
  @Prop() disabled = false;

  /** Native `<button>` type. */
  @Prop() type: 'button' | 'submit' | 'reset' = 'button';

  /** Tracks whether the `icon` slot has assigned content, so the icon/label gap only
   * applies when there's actually an icon. */
  @State() hasIcon = false;

  private onIconSlotchange = (ev: Event) => {
    this.hasIcon = (ev.target as HTMLSlotElement).assignedNodes().length > 0;
  };

  render() {
    return (
      <button class={`bs-button bs-button--${this.variant} bs-button--${this.size}`} type={this.type} disabled={this.disabled}>
        <span part="icon" class={`bs-button__icon ${this.hasIcon ? 'bs-button__icon--visible' : ''}`}>
          <slot name="icon" onSlotchange={this.onIconSlotchange}></slot>
        </span>
        <span part="label" class="bs-button__label">
          <slot></slot>
        </span>
      </button>
    );
  }
}
