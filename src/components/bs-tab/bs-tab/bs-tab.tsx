import { Component, Element, Prop, State, Event, EventEmitter, h } from '@stencil/core';

export type BsTabIconPosition = 'start' | 'top';

/**
 * A single tab button -- an optional icon plus a text label, rendered as a real `<button>` so it
 * participates correctly in tab order and native click/keyboard activation.
 *
 * ## When to use
 * - As one button within a tab bar, where exactly one tab is selected/active at a time.
 *
 * ## When not to use
 * - As a standalone action button -- use `bs-button` instead, `bs-tab`'s visual language (muted
 *   until selected/hovered, underline indicator) only makes sense as part of a set.
 *
 * `selected` is NOT self-toggling -- clicking a `bs-tab` only emits `bsSelect`, it does not set its
 * own `selected` prop, and it does not unselect any sibling tabs. Wrap your `<bs-tab>` elements in
 * `<bs-tabs type="bs-tab">` -- it owns `role="tablist"` and coordinates selection (listening for
 * `bsSelect` and setting `selected`/`false` across siblings) for you. Using `bs-tab` standalone,
 * outside a `<bs-tabs>` wrapper, still means `selected` doesn't self-toggle and `role="tablist"`
 * isn't provided automatically -- a consumer doing that would still need to coordinate `selected`
 * and supply `role="tablist"` manually, same as `bs-radio.mdx` documents for `bs-radio`'s missing
 * `bs-radio-group`. See `bs-tab.mdx`'s Accessibility section for the full requirement, including
 * `role="tabpanel"` on the corresponding content panels.
 *
 * @slot - Default slot: the tab's label text. When empty (icon-only), no space is reserved for it.
 * @slot icon - Optional icon (24x24). When empty (text-only), no space is reserved for it.
 * @slot badge - Optional trailing badge, rendered after the label (e.g. an unread count). Typically
 * a `bs-badge` element -- consumer's responsibility to style/populate, this component just reserves
 * a slot for it. Only rendered for text-only and icon+text-horizontal layouts, per the design spec
 * (not icon-only or icon+text-vertical).
 * @part tab - The button element.
 * @part icon - The icon wrapper.
 * @part label - The label wrapper.
 * @part badge - The badge wrapper.
 * @part indicator - The selection/hover underline indicator.
 */
// Note: this component's CSS Custom Properties (--bs-tab-*) are documented via @prop comments in
// bs-tab.css, not here -- Stencil's docs generator only parses @prop out of CSS file comments, not
// the class-level JSDoc (see bs-checkbox.tsx's/bs-radio.tsx's equivalent note).
@Component({
  tag: 'bs-tab',
  styleUrl: 'bs-tab.css',
  shadow: true,
})
export class BsTab {
  @Element() el: HTMLElement;

  /** Whether this tab is the currently active one. NOT mutable and NOT self-toggling -- see the
   * "Known gap" note in the class JSDoc. Still reflected as an attribute so consumers/CSS can
   * target `bs-tab[selected]`. */
  @Prop({ reflect: true }) selected = false;

  /** Disables the tab: sets the native `disabled` attribute, suppresses hover/focus styling, and
   * prevents clicking from emitting `bsSelect`. */
  @Prop() disabled = false;

  /** Where the icon sits relative to the label, when both `icon` and the default slot are
   * populated. Ignored for icon-only/text-only layouts. */
  @Prop() iconPosition: BsTabIconPosition = 'start';

  /** Accessible name for the tab. Required for icon-only usage (no visible label text via the
   * default slot) so screen readers still announce what the tab does -- without it, an icon-only
   * tab has no discernible name at all (axe-core flags this as a critical `button-name`
   * violation). Stencil reflects this camelCase prop to the `aria-label` HTML attribute
   * automatically, same as `bs-button`'s identical prop. */
  @Prop() ariaLabel: string | null = null;

  /** Tracks whether the `icon` slot has assigned content. */
  @State() hasIcon = false;

  /** Tracks whether the default (label) slot has assigned content. */
  @State() hasLabel = false;

  /** Tracks whether the `badge` slot has assigned content. */
  @State() hasBadge = false;

  /** Fires when the tab is clicked. Does not toggle `selected` itself -- see the class JSDoc. */
  @Event() bsSelect: EventEmitter<void>;

  /**
   * Computes the initial `hasIcon`/`hasLabel`/`hasBadge` state directly from the host's light DOM
   * children, before first render -- same reasoning as `bs-button.componentWillLoad` (a slot with
   * zero assigned nodes from the start never fires `slotchange`).
   */
  componentWillLoad() {
    this.hasIcon = this.hasSlottedContent('icon');
    this.hasLabel = this.hasSlottedContent(null);
    this.hasBadge = this.hasSlottedContent('badge');
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

  private onLabelSlotchange = (ev: Event) => {
    this.hasLabel = (ev.target as HTMLSlotElement).assignedNodes().length > 0;
  };

  private onBadgeSlotchange = (ev: Event) => {
    this.hasBadge = (ev.target as HTMLSlotElement).assignedNodes().length > 0;
  };

  private onClick = () => {
    if (this.disabled) return;
    this.bsSelect.emit();
  };

  render() {
    const iconOnly = this.hasIcon && !this.hasLabel;
    const vertical = this.hasIcon && this.hasLabel && this.iconPosition === 'top';
    const showBadge = this.hasBadge && !iconOnly && !vertical;

    return (
      <button
        type="button"
        part="tab"
        role="tab"
        class={`bs-tab ${this.selected ? 'bs-tab--selected' : ''} ${this.disabled ? 'bs-tab--disabled' : ''} ${
          iconOnly ? 'bs-tab--icon-only' : ''
        } ${vertical ? 'bs-tab--vertical' : ''}`}
        disabled={this.disabled}
        aria-selected={String(this.selected)}
        aria-disabled={this.disabled ? 'true' : undefined}
        aria-label={this.ariaLabel}
        onClick={this.onClick}
      >
        <span part="icon" class={`bs-tab__icon ${this.hasIcon ? 'bs-tab__icon--has-content' : ''}`}>
          <slot name="icon" onSlotchange={this.onIconSlotchange}></slot>
        </span>
        <span part="label" class={`bs-tab__label ${this.hasLabel ? 'bs-tab__label--has-content' : ''}`}>
          <slot onSlotchange={this.onLabelSlotchange}></slot>
        </span>
        <span part="badge" class={`bs-tab__badge ${showBadge ? 'bs-tab__badge--has-content' : ''}`}>
          <slot name="badge" onSlotchange={this.onBadgeSlotchange}></slot>
        </span>
        <span part="indicator" class="bs-tab__indicator"></span>
      </button>
    );
  }
}
