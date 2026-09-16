import { Component, Element, Prop, State, Event, EventEmitter, h } from '@stencil/core';

/**
 * A pill-shaped tab button -- an optional leading icon plus a text label, rendered as a real
 * `<button>` so it participates correctly in tab order and native click/keyboard activation.
 * Unlike `bs-tab`'s underline indicator, selection here is communicated entirely by the pill's
 * background fill color -- there is no separate indicator element.
 *
 * ## When to use
 * - As one button within a segmented-control-style tab bar, where exactly one tab is
 *   selected/active at a time.
 *
 * ## When not to use
 * - As a standalone action button -- use `bs-button` instead, `bs-inline-tab`'s visual language
 *   (muted pill until selected/hovered) only makes sense as part of a set.
 *
 * `selected` is NOT self-toggling -- clicking a `bs-inline-tab` only emits `bsSelect`, it does not
 * set its own `selected` prop, and it does not unselect any sibling tabs. Wrap your
 * `<bs-inline-tab>` elements in `<bs-tabs type="bs-inline-tab">` -- it owns `role="tablist"` and
 * coordinates selection (listening for `bsSelect` and setting `selected`/`false` across siblings)
 * for you. Using `bs-inline-tab` standalone, outside a `<bs-tabs>` wrapper, still means `selected`
 * doesn't self-toggle and `role="tablist"` isn't provided automatically -- a consumer doing that
 * would still need to coordinate `selected` and supply `role="tablist"` manually, same as
 * `bs-tab.mdx`/`bs-radio.mdx` document for their own components. See `bs-inline-tab.mdx`'s
 * Accessibility section for the full requirement, including `role="tabpanel"` on the corresponding
 * content panels.
 *
 * @slot - Default slot: the tab's label text. When empty (icon-only), no space is reserved for it.
 * @slot icon - Optional leading icon (24x24). When empty (text-only), no space is reserved for it.
 * @part tab - The button element.
 * @part icon - The icon wrapper.
 * @part label - The label wrapper.
 */
// Note: this component's CSS Custom Properties (--bs-inline-tab-*) are documented via @prop
// comments in bs-inline-tab.css, not here -- Stencil's docs generator only parses @prop out of CSS
// file comments, not the class-level JSDoc (see bs-tab.tsx's equivalent note).
@Component({
  tag: 'bs-inline-tab',
  styleUrl: 'bs-inline-tab.css',
  shadow: true,
})
export class BsInlineTab {
  @Element() el: HTMLElement;

  /** Whether this tab is the currently active one. NOT mutable and NOT self-toggling -- see the
   * "Known gap" note in the class JSDoc. Still reflected as an attribute so consumers/CSS can
   * target `bs-inline-tab[selected]`. */
  @Prop({ reflect: true }) selected = false;

  /** Disables the tab: sets the native `disabled` attribute, suppresses hover/focus styling, and
   * prevents clicking from emitting `bsSelect`. */
  @Prop() disabled = false;

  /** Accessible name for the tab. Required for icon-only usage (no visible label text via the
   * default slot) so screen readers still announce what the tab does -- without it, an icon-only
   * tab has no discernible name at all (axe-core flags this as a critical `button-name`
   * violation). Stencil reflects this camelCase prop to the `aria-label` HTML attribute
   * automatically, same as `bs-tab`'s identical prop. */
  @Prop() ariaLabel: string | null = null;

  /** Tracks whether the `icon` slot has assigned content. */
  @State() hasIcon = false;

  /** Tracks whether the default (label) slot has assigned content. */
  @State() hasLabel = false;

  /** Fires when the tab is clicked. Does not toggle `selected` itself -- see the class JSDoc. */
  @Event() bsSelect: EventEmitter<void>;

  /**
   * Computes the initial `hasIcon`/`hasLabel` state directly from the host's light DOM children,
   * before first render -- same reasoning as `bs-tab.componentWillLoad` (a slot with zero assigned
   * nodes from the start never fires `slotchange`).
   */
  componentWillLoad() {
    this.hasIcon = this.hasSlottedContent('icon');
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

  private onLabelSlotchange = (ev: Event) => {
    this.hasLabel = (ev.target as HTMLSlotElement).assignedNodes().length > 0;
  };

  private onClick = () => {
    if (this.disabled) return;
    this.bsSelect.emit();
  };

  render() {
    const iconOnly = this.hasIcon && !this.hasLabel;

    return (
      <button
        type="button"
        part="tab"
        role="tab"
        class={`bs-inline-tab ${this.selected ? 'bs-inline-tab--selected' : ''} ${
          this.disabled ? 'bs-inline-tab--disabled' : ''
        } ${iconOnly ? 'bs-inline-tab--icon-only' : ''} ${this.hasIcon ? 'bs-inline-tab--has-icon' : ''}`}
        disabled={this.disabled}
        aria-selected={String(this.selected)}
        aria-disabled={this.disabled ? 'true' : undefined}
        aria-label={this.ariaLabel}
        onClick={this.onClick}
      >
        <span part="icon" class={`bs-inline-tab__icon ${this.hasIcon ? 'bs-inline-tab__icon--has-content' : ''}`}>
          <slot name="icon" onSlotchange={this.onIconSlotchange}></slot>
        </span>
        <span part="label" class={`bs-inline-tab__label ${this.hasLabel ? 'bs-inline-tab__label--has-content' : ''}`}>
          <slot onSlotchange={this.onLabelSlotchange}></slot>
        </span>
      </button>
    );
  }
}
