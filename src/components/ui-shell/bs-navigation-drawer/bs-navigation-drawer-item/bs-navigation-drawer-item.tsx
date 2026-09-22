import { Component, Element, Prop, State, Event, EventEmitter, h } from '@stencil/core';

/**
 * A single row within a `bs-navigation-drawer`'s item list -- either a plain leaf nav item, or an
 * `expandable` group header that discloses nested `bs-navigation-drawer-item` children.
 *
 * ## When to use
 * - Every row inside a `bs-navigation-drawer`'s default slot.
 *
 * ## When not to use
 * - A standalone action outside a navigation drawer -- use `bs-button`/`bs-menu-item` instead.
 *
 * Click behavior is mutually exclusive, based on `expandable`:
 * - `expandable = false` (a plain leaf item): clicking only emits `bsSelect`. `selected` is NOT
 *   self-toggling -- same non-self-toggling precedent as `bs-tab`'s `selected` (see `bs-tab.tsx`'s
 *   class doc): coordinating which sibling row is selected needs cross-item state a
 *   consumer/wrapper owns, not something this component can reason about on its own.
 * - `expandable = true` (a group header, never shown with a `selected` tint): clicking toggles
 *   `this.expanded` directly and emits `bsToggle` with the new value, and does NOT emit
 *   `bsSelect`. This IS self-toggling, unlike `selected` above -- it's simple local disclosure
 *   state with no cross-item coordination needed, closer to `bs-switch`'s self-toggling `checked`
 *   than `bs-tab`'s non-self-toggling `selected`.
 *
 * Nesting: put child `<bs-navigation-drawer-item nested>` elements inside a parent
 * `<bs-navigation-drawer-item expandable>` with `slot="children"`. The parent shows/hides that
 * slot's content based on its own `expanded` prop, via a pure-CSS attribute selector (no JS
 * visibility toggling needed, since `expanded` is reflected).
 *
 * `collapsed` switches this row from its normal icon-beside-label row layout to a compact
 * icon-above-caption column (per Figma node 8028:135374, the drawer's "Type=Collapsed" state) --
 * you don't need to set this yourself on every item: a parent `bs-navigation-drawer` keeps its own
 * top-level items' `collapsed` prop in sync with its own `collapsed` state automatically (see
 * `bs-navigation-drawer.tsx`'s `syncItemsCollapsed`, the same direct-children-prop-sync approach
 * `bs-tabs` uses for coordinating `selected` across its own `bs-tab` children). It's still a public
 * prop so a standalone item (or this component's own stories) can be demoed without the parent.
 *
 * @slot - Default slot: the row's label text.
 * @slot icon - Optional leading icon (24x24). Only rendered (and only reserves layout space) when
 *   populated -- same "only take up space if slotted" pattern as `bs-tab`'s `icon` slot. Not
 *   rendered at all for `nested` rows (Figma's nested rows never have icons).
 * @slot children - `expandable` only: nested `bs-navigation-drawer-item` rows, shown/hidden based
 *   on `expanded`.
 * @part item - The row's root `<button>` element.
 * @part icon - The icon wrapper (top-level, non-`nested` rows only).
 * @part label - The label text wrapper.
 * @part chevron - The trailing expand/collapse chevron wrapper (`expandable` only).
 * @part children - The wrapper around the `children` slot.
 */
// Note: this component's CSS Custom Properties are documented via @prop comments in
// bs-navigation-drawer-item.css, not here -- see bs-navigation-header.css's identical note.
@Component({
  tag: 'bs-navigation-drawer-item',
  styleUrl: 'bs-navigation-drawer-item.css',
  shadow: true,
})
export class BsNavigationDrawerItem {
  @Element() el: HTMLElement;

  /** Tints the row's background/text to indicate it's the current destination. NOT
   * self-toggling -- see the class doc above for why. Ignored (never applied) when `expandable`
   * is true. Reflected so consumers/CSS can target `bs-navigation-drawer-item[selected]`. */
  @Prop({ reflect: true }) selected = false;

  /** Renders this row as a disclosure/group header (trailing chevron, self-toggling `expanded`,
   * `bsToggle` instead of `bsSelect` on click) instead of a plain navigable leaf item. See the
   * class doc above for the full click-behavior split. */
  @Prop() expandable = false;

  /** Whether an `expandable` row's `children` slot is shown. Mutable and reflected -- clicking an
   * `expandable` row toggles this directly (self-toggling, unlike `selected` above), and CSS
   * shows/hides the `children` slot wrapper based on the reflected attribute. Ignored when
   * `expandable` is false. */
  @Prop({ mutable: true, reflect: true }) expanded = false;

  /** Marks this as a child row nested under an `expandable` parent (via `slot="children"`) --
   * deepens the left indent and stops reserving `icon` slot space entirely (Figma's nested rows
   * never have icons). */
  @Prop() nested = false;

  /**
   * Optional accessible name override. Not required for `collapsed` rows -- unlike an
   * icon-only button, the label caption stays visible (just restyled smaller, under the icon) in
   * that mode per Figma, so the button's default accessible-name computation (its own text
   * content) already works. Set this if you want a fuller/different name than the visible caption
   * (e.g. truncated captions, or matching `bs-switch`/`bs-slider`'s `ariaLabel` convention for
   * consistency).
   */
  @Prop() ariaLabel: string | null = null;

  /**
   * Switches this row to the compact icon-above-caption column layout used when its parent
   * `bs-navigation-drawer` is `collapsed` (see the class doc above). Reflected so
   * `bs-navigation-drawer-item[collapsed]` is CSS-targetable. Also forces `expandable` rows'
   * chevron and `children` slot to stay hidden regardless of `expanded` -- Figma's collapsed rail
   * never shows a nested tree.
   */
  @Prop({ reflect: true }) collapsed = false;

  /** Fires on click, only when `expandable` is false. See the class doc above. */
  @Event() bsSelect: EventEmitter<void>;

  /** Fires with the new `expanded` value on click, only when `expandable` is true. See the class
   * doc above. */
  @Event() bsToggle: EventEmitter<boolean>;

  /** Tracks whether the `icon` slot has assigned content, so the icon wrapper only reserves
   * layout space when there's actually an icon -- same pattern as `bs-tab`'s `hasIcon`. Not used
   * at all for `nested` rows, which never render an icon wrapper in the first place. */
  @State() hasIcon = false;

  /**
   * Computes the initial `hasIcon` state directly from the host's light DOM children, before
   * first render -- same reasoning as `bs-tab.componentWillLoad`'s identical comment (a slot with
   * zero assigned nodes from the start never fires `slotchange`).
   */
  componentWillLoad() {
    this.hasIcon = this.hasSlottedContent('icon');
  }

  private hasSlottedContent(slotName: string): boolean {
    return Array.from(this.el.childNodes).some(node => node.nodeType === Node.ELEMENT_NODE && (node as Element).getAttribute('slot') === slotName);
  }

  private onIconSlotchange = (ev: Event) => {
    this.hasIcon = (ev.target as HTMLSlotElement).assignedNodes().length > 0;
  };

  private onClick = () => {
    if (this.expandable) {
      this.expanded = !this.expanded;
      this.bsToggle.emit(this.expanded);
    } else {
      this.bsSelect.emit();
    }
  };

  render() {
    const rowClasses = [
      'bs-navigation-drawer-item',
      this.selected && !this.expandable ? 'bs-navigation-drawer-item--selected' : '',
      this.nested ? 'bs-navigation-drawer-item--nested' : '',
    ]
      .filter(Boolean)
      .join(' ');

    // The `children` slot wrapper is deliberately a SIBLING of the <button>, not nested inside
    // it -- a nested child row's own shadow DOM renders its own real <button>, and putting that
    // inside this row's <button> would produce invalid nested interactive controls (button inside
    // button). Nested buttons also break click handling in practice: a click on the child bubbles
    // through this outer <button> too (it's a real ancestor in the flattened tree), which would
    // incorrectly also toggle this parent row on every child click. Both are wrapped in a
    // `display: contents` container so render() still returns a single root node (this codebase's
    // convention, e.g. bs-input.tsx) without that wrapper affecting layout at all.
    return (
      <div class="bs-navigation-drawer-item__root">
        <button
          type="button"
          part="item"
          class={rowClasses}
          aria-expanded={this.expandable ? String(this.expanded) : undefined}
          aria-label={this.ariaLabel ?? undefined}
          onClick={this.onClick}
        >
          {!this.nested && (
            <span part="icon" class={`bs-navigation-drawer-item__icon ${this.hasIcon ? 'bs-navigation-drawer-item__icon--has-content' : ''}`}>
              <slot name="icon" onSlotchange={this.onIconSlotchange}></slot>
            </span>
          )}
          <span part="label" class="bs-navigation-drawer-item__label">
            <slot></slot>
          </span>
          {this.expandable && (
            <span part="chevron" class={`bs-navigation-drawer-item__chevron ${this.expanded ? 'bs-navigation-drawer-item__chevron--expanded' : ''}`}>
              <ChevronDownIcon />
            </span>
          )}
        </button>
        {this.expandable && (
          <span part="children" class="bs-navigation-drawer-item__children">
            <slot name="children"></slot>
          </span>
        )}
      </div>
    );
  }
}

// 16x16 native viewBox (not a 24x24 icon scaled down) -- authored directly at display size, per
// the class doc's note on this being the author's choice between the two options offered.
const ChevronDownIcon = () => (
  <svg viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
    <path d="M4 6L8 10L12 6" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
  </svg>
);
