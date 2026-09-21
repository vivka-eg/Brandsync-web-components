import { Component, Element, Prop, h } from '@stencil/core';

export type BsIconButtonVariant = 'primary' | 'neutral' | 'error' | 'subtle' | 'outlined' | 'success' | 'warning' | 'info';
export type BsIconButtonSize = 'xs' | 'sm' | 'md' | 'lg';

/**
 * A clickable, icon-only action element -- the icon-only sibling of `bs-button`, sharing the same
 * 8 visual variants and color language, but ALWAYS rendering just a single icon, never a label.
 *
 * ## When to use
 * - A compact action where the icon alone is unambiguous (e.g. a close/dismiss control, a toolbar
 *   action) and adding a text label would take up more space than the context allows.
 * - The same variant guidance as `bs-button` applies: `primary` for the single most important
 *   action, `neutral`/`subtle`/`outlined` for lower-emphasis alternatives, `error` reserved for
 *   destructive/irreversible actions (never `neutral`, per BrandSync guidance), `success`/
 *   `warning`/`info` only when the action's own outcome is predictable and clearly communicated.
 *
 * ## When not to use
 * - When the action isn't self-evident from the icon alone -- use `bs-button` with a visible label
 *   instead, don't rely on a tooltip to compensate for an unclear icon.
 * - For navigation between pages -- use a link/nav component instead.
 *
 * Because this component is always icon-only, `ariaLabel` is required for every real usage (not
 * just conditionally, unlike `bs-button`) -- there's no visible label text to fall back on for an
 * accessible name.
 *
 * @slot - Default slot: the icon content. Exactly one icon, no label.
 * @part icon - The icon wrapper element.
 */
// Note: this component's CSS Custom Properties (--bs-icon-button-*) are documented via @prop
// comments in bs-icon-button.css, not here -- Stencil's docs generator only parses @prop out of
// CSS file comments, not the class-level JSDoc (see bs-tab.css's/bs-inline-tab.css's equivalent note).
@Component({
  tag: 'bs-icon-button',
  styleUrl: 'bs-icon-button.css',
  // delegatesFocus, not just shadow:true -- same reasoning as bs-button: without it, calling
  // .focus() on the <bs-icon-button> host silently no-ops, because a shadow host isn't itself
  // focusable by default and focus doesn't automatically enter its shadow root.
  shadow: { delegatesFocus: true },
})
export class BsIconButton {
  @Element() el: HTMLElement;

  /**
   * Visual style. Maps to the same semantic token families as `bs-button`'s `variant`.
   * `error` is for destructive/irreversible actions per BrandSync guidance, not a stronger
   * emphasis alternative to `primary`.
   */
  @Prop() variant: BsIconButtonVariant = 'primary';

  /** Sizing scale. `xs` (16px, an 8px icon) is a distinct, much smaller tier meant for compact
   * chip/tag "remove" controls, not just a smaller toolbar button -- verified against a separate
   * Figma redline (EG BrandSync UI Kit v1.5, node 20731:18427) from the one `sm`/`md`/`lg` were
   * built against. */
  @Prop() size: BsIconButtonSize = 'md';

  /** Disables the button and applies the disabled token set. */
  @Prop() disabled = false;

  /** Native `<button>` type. */
  @Prop() type: 'button' | 'submit' | 'reset' = 'button';

  /**
   * Accessible name for the button. Required -- this component is always icon-only, so there's
   * no visible label text for screen readers to fall back on. Stencil reflects this camelCase
   * prop to the `aria-label` HTML attribute automatically.
   */
  @Prop() ariaLabel: string | null = null;

  render() {
    return (
      <button
        class={`bs-icon-button bs-icon-button--${this.variant} bs-icon-button--${this.size}`}
        type={this.type}
        disabled={this.disabled}
        aria-label={this.ariaLabel}
      >
        <span part="icon" class="bs-icon-button__icon">
          <slot></slot>
        </span>
      </button>
    );
  }
}
