import { Component, Element, Prop, State, h } from '@stencil/core';

export type BsButtonVariant = 'primary' | 'neutral' | 'error' | 'subtle' | 'outlined' | 'success' | 'warning' | 'info';
export type BsButtonSize = 'sm' | 'md' | 'lg';

/**
 * A clickable action element for the single most important action in a given context.
 *
 * ## When to use
 * - The primary call to action on a screen or within a card/modal (e.g. "Book room", "Confirm").
 * - Secondary, lower-emphasis actions alongside it (use `variant="neutral"`).
 * - `variant="error"` for destructive/irreversible actions (e.g. "Delete account") — per
 *   BrandSync guidance, destructive actions should always use the error variant, never
 *   `neutral`, so the visual weight matches the risk of the action.
 *
 * ## When not to use
 * - For navigation between pages — use a link/nav component instead, a button implies an
 *   in-page action, not a destination change.
 * - For more than one primary-emphasis action in the same view — pick one, demote the rest to
 *   `neutral`.
 * - `error` purely for visual emphasis — it signals a destructive action to the user, so reserve
 *   it for actions that actually delete/revoke/undo something.
 *
 * @slot - Default slot: the button's label content.
 * @slot icon - Optional leading icon, rendered before the label.
 * @slot end-icon - Optional trailing icon, rendered after the label.
 * @part icon - The icon wrapper element.
 * @part label - The text label element.
 * @part end-icon - The trailing icon wrapper element.
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
  @Element() el: HTMLElement;

  /**
   * Visual style. Maps directly to the brandsync-tokens `--bs-button-*` semantic set.
   * `error` is for destructive/irreversible actions per BrandSync guidance, not a stronger
   * emphasis alternative to `primary`.
   */
  @Prop() variant: BsButtonVariant = 'primary';

  /** Sizing scale. */
  @Prop() size: BsButtonSize = 'md';

  /** Disables the button and applies the disabled token set. */
  @Prop() disabled = false;

  /** Native `<button>` type. */
  @Prop() type: 'button' | 'submit' | 'reset' = 'button';

  /**
   * Accessible name for the button. Required for icon-only usage (no visible label text via the
   * default slot) so screen readers still announce what the button does. Stencil reflects this
   * camelCase prop to the `aria-label` HTML attribute automatically.
   */
  @Prop() ariaLabel: string | null = null;

  /** Tracks whether the `icon` slot has assigned content, so the icon/label gap only
   * applies when there's actually an icon. */
  @State() hasIcon = false;

  /** Tracks whether the `end-icon` slot has assigned content, so the icon/label gap only
   * applies when there's actually a trailing icon. */
  @State() hasEndIcon = false;

  /**
   * Tracks whether the default (label) slot has assigned content, so an icon-only button can be
   * styled/sized differently (see `bs-button--icon-only`).
   *
   * Known edge case (not fixed, same simplification `hasIcon`/similar flags elsewhere in this
   * codebase already make): a default slot containing only whitespace (e.g. a lone space text
   * node) still counts as `hasLabel = true`, since checking for assigned nodes doesn't
   * distinguish whitespace-only text nodes from real content.
   */
  @State() hasLabel = false;

  /**
   * Computes the initial `hasIcon`/`hasEndIcon`/`hasLabel` state directly from the host's light
   * DOM children, before first render.
   *
   * This can't be left to the `slotchange` handlers below alone: `slotchange` only fires when a
   * slot's *assigned nodes* change, and a slot that starts out with zero assigned nodes and stays
   * that way never fires it (nothing changed). Relying on `slotchange` alone left an icon-only
   * button (default slot empty from the start) permanently stuck on its initial `hasLabel`
   * default, so `bs-button--icon-only` never applied.
   */
  componentWillLoad() {
    this.hasIcon = this.hasSlottedContent('icon');
    this.hasEndIcon = this.hasSlottedContent('end-icon');
    this.hasLabel = this.hasSlottedContent(null);
  }

  private hasSlottedContent(slotName: string | null): boolean {
    return Array.from(this.el.childNodes).some(node => {
      if (node.nodeType === Node.ELEMENT_NODE) {
        return (node as Element).getAttribute('slot') === slotName;
      }
      // Only elements can carry a `slot` attribute -- any other node type (text, comments) can
      // only ever be assigned to the default slot.
      return slotName === null;
    });
  }

  private onIconSlotchange = (ev: Event) => {
    this.hasIcon = (ev.target as HTMLSlotElement).assignedNodes().length > 0;
  };

  private onEndIconSlotchange = (ev: Event) => {
    this.hasEndIcon = (ev.target as HTMLSlotElement).assignedNodes().length > 0;
  };

  private onLabelSlotchange = (ev: Event) => {
    this.hasLabel = (ev.target as HTMLSlotElement).assignedNodes().length > 0;
  };

  render() {
    const iconOnly = (this.hasIcon || this.hasEndIcon) && !this.hasLabel;
    return (
      <button
        class={`bs-button bs-button--${this.variant} bs-button--${this.size} ${iconOnly ? 'bs-button--icon-only' : ''}`}
        type={this.type}
        disabled={this.disabled}
        aria-label={this.ariaLabel}
      >
        <span part="icon" class={`bs-button__icon ${this.hasIcon ? 'bs-button__icon--visible' : ''}`}>
          <slot name="icon" onSlotchange={this.onIconSlotchange}></slot>
        </span>
        <span part="label" class="bs-button__label">
          <slot onSlotchange={this.onLabelSlotchange}></slot>
        </span>
        <span part="end-icon" class={`bs-button__end-icon ${this.hasEndIcon ? 'bs-button__end-icon--visible' : ''}`}>
          <slot name="end-icon" onSlotchange={this.onEndIconSlotchange}></slot>
        </span>
      </button>
    );
  }
}
