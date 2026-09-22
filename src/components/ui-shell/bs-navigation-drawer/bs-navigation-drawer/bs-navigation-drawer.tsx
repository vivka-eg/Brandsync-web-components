import { Component, Element, Prop, Watch, Event, EventEmitter, h } from '@stencil/core';

/**
 * A left-side persistent navigation sidebar: the BrandSync logo, a "Main Menu" title with a
 * collapse toggle, a reserved slot for a search field, and a scrollable list of nav items.
 *
 * ## When to use
 * - The primary in-app navigation, shown alongside `bs-navigation-header` (typically that
 *   header's `with-navigation-drawer` alignment, which omits its own logo since this component
 *   already renders one).
 *
 * ## When not to use
 * - The top navigation bar itself -- use `bs-navigation-header` instead.
 *
 * This component renders a real `<nav>` landmark (no explicit `role` needed -- `<nav>` already
 * carries the implicit `navigation` role), labeled via `aria-label={heading}` so the landmark
 * still has a name even when collapsed (see below).
 *
 * `collapsed` narrows the drawer to a 96px icon-only rail, per Figma node 8028:135374
 * ("Type=Collapsed"): the title text disappears, the logo swaps from the full "EG BrandSync"
 * wordmark (`bs-logo variant="full"`) to the real icon-only mark (`bs-logo variant="mark"` -- a
 * second, properly-designed asset, not a CSS crop of the full one) via CSS visibility toggling on
 * both, the same `:host([collapsed])` attribute-selector pattern already used for the
 * `search`/`search-trigger` swap below, the `search` slot is replaced by a compact built-in
 * search-trigger button (this component can't meaningfully shrink arbitrary slotted search-field
 * content down to icon size itself, so it emits `bsSearchClick` instead -- e.g. to open a full
 * search overlay), and every top-level
 * `bs-navigation-drawer-item`'s layout switches from icon-beside-label to icon-above-caption.
 * That last part is real prop propagation, not a CSS trick: this component keeps each direct-child
 * item's own `collapsed` prop in sync with its own (see `syncItemsCollapsed` below), the same
 * direct-children-prop-sync approach `bs-tabs` already uses for coordinating `selected` across its
 * `bs-tab` children. Clicking the toggle self-toggles `collapsed` (simple local UI state, not
 * something needing cross-component coordination -- closer to `bs-switch`'s self-toggling
 * `checked` than `bs-tab`'s non-self-toggling `selected`) and emits `bsCollapse` with the new
 * value. The toggle's own caret icon does NOT rotate when collapsed -- Figma's collapsed mock
 * reuses the identical left-pointing "CaretLeft" asset unchanged, confirmed by directly inspecting
 * that state, so this deliberately does not add the same "flip on toggle" idiom the drawer item's
 * own disclosure chevron does (that one really is an unconfirmed addition; this one was checked).
 *
 * @slot search - Reserved for a search field, e.g. a `bs-input type="search"`. This component
 *   does not build one itself. Hidden while `collapsed` (see above).
 * @slot - Default slot: the scrollable list of nav items, typically one or more
 *   `bs-navigation-drawer-item` elements.
 * @part logo - The wrapper around the BrandSync brand mark. Two of these exist in the shadow DOM
 *   at once (one wrapping a `bs-logo variant="full"`, one wrapping a `bs-logo variant="mark"`),
 *   both carrying this same part name (the same "multiple elements, one shared part name"
 *   approach `bs-attachment`'s `star` part uses) -- only one is visible at a time, toggled by
 *   plain CSS on `collapsed` (see above), so `::part(logo)` always reaches whichever is showing.
 * @part title - The "Main Menu" heading text wrapper.
 * @part collapse - The collapse toggle button.
 * @part search - The wrapper around the `search` slot.
 * @part search-trigger - The compact search button shown instead of the `search` slot while `collapsed`.
 * @part items - The wrapper around the default (items) slot.
 */
// Note: this component's CSS Custom Properties are documented via @prop comments in
// bs-navigation-drawer.css, not here -- see bs-navigation-header.css's identical note.
@Component({
  tag: 'bs-navigation-drawer',
  styleUrl: 'bs-navigation-drawer.css',
  shadow: true,
})
export class BsNavigationDrawer {
  @Element() el: HTMLElement;

  /** Heading text shown next to the collapse toggle, and used as the `<nav>` landmark's
   * `aria-label` (so the landmark keeps a name even when `collapsed` hides the visible text). */
  @Prop() heading = 'Main Menu';

  /** Whether this drawer can be collapsed at all. `false` renders no collapse toggle/chevron --
   * a "fixed" side nav (Carbon's terminology: a `Fixed Side Nav` never collapses, as opposed to a
   * rail-capable one) that's always fully expanded. `collapsed` is ignored while this is `false`. */
  @Prop() collapsible = true;

  /** Narrows the drawer to a 96px icon-only rail (Figma node 8028:135374). Mutable and reflected
   * -- clicking the collapse toggle toggles this directly (self-toggling, see the class doc above
   * for why), and this component keeps every direct-child `bs-navigation-drawer-item`'s own
   * `collapsed` prop synced to match (see `syncItemsCollapsed`). */
  @Prop({ mutable: true, reflect: true }) collapsed = false;

  /** Fires with the new `collapsed` value when the collapse toggle button is clicked. */
  @Event() bsCollapse: EventEmitter<boolean>;

  /** Fires when the compact search-trigger button (shown instead of the `search` slot while
   * `collapsed`) is clicked -- e.g. to open a full search overlay. This component has no
   * visibility into what the `search` slot actually contains, so it can't drive a real search
   * itself once shrunk to icon size. */
  @Event() bsSearchClick: EventEmitter<void>;

  /** Forwarded straight to both internal `bs-logo` elements' own `background` prop. Defaults to
   * `"auto"`, which follows the ambient `[data-theme="dark"]` state automatically (see `bs-logo`'s
   * own docs) -- so if this drawer ends up on a dark surface via the normal theming mechanism, the
   * logo switches to its dedicated dark-background asset with no wiring needed. Set
   * `"light"`/`"dark"` explicitly only if you've overridden `--bs-navigation-drawer-bg` to
   * something dark yourself *without* setting `[data-theme="dark"]`, and need to pin the logo
   * regardless of theme. Has no visible effect on the `variant="mark"` logo shown while
   * `collapsed` (see `bs-logo`'s own docs -- there's only one real designed mark asset, it's
   * background-agnostic). */
  @Prop() logoBackground: 'auto' | 'light' | 'dark' = 'auto';

  @Watch('collapsed')
  onCollapsedChange(collapsed: boolean) {
    this.syncItemsCollapsed(collapsed);
  }

  componentDidLoad() {
    this.syncItemsCollapsed(this.collapsed);
  }

  /** Keeps every direct-child `bs-navigation-drawer-item`'s `collapsed` prop in sync with this
   * component's own -- same direct-children-prop-sync approach `bs-tabs` uses for `selected`
   * across its `bs-tab` children. Only direct children (top-level items): Figma's collapsed rail
   * never shows nested/expanded children in the first place (see bs-navigation-drawer-item.css's
   * `:host([collapsed])` rule forcing those hidden), so there's nothing to sync on them. */
  private syncItemsCollapsed(collapsed: boolean) {
    const items = this.el.querySelectorAll(':scope > bs-navigation-drawer-item');
    items.forEach(item => {
      (item as HTMLElement & { collapsed: boolean }).collapsed = collapsed;
    });
  }

  private onCollapseClick = () => {
    this.collapsed = !this.collapsed;
    this.bsCollapse.emit(this.collapsed);
  };

  private onSearchTriggerClick = () => {
    this.bsSearchClick.emit();
  };

  render() {
    return (
      <nav class="bs-navigation-drawer" aria-label={this.heading}>
        <div part="logo" class="bs-navigation-drawer__logo bs-navigation-drawer__logo--full">
          <bs-logo variant="full" background={this.logoBackground}></bs-logo>
        </div>
        <div part="logo" class="bs-navigation-drawer__logo bs-navigation-drawer__logo--mark">
          <bs-logo variant="mark" background={this.logoBackground}></bs-logo>
        </div>
        <div class="bs-navigation-drawer__title-row">
          <span part="title" class="bs-navigation-drawer__title">
            {this.heading}
          </span>
          {this.collapsible && (
            <button
              type="button"
              part="collapse"
              class="bs-navigation-drawer__collapse"
              aria-label={this.collapsed ? 'Expand' : 'Collapse'}
              aria-pressed={this.collapsed ? 'true' : 'false'}
              onClick={this.onCollapseClick}
            >
              <CaretLeftIcon />
            </button>
          )}
        </div>
        <div part="search" class="bs-navigation-drawer__search">
          <slot name="search"></slot>
        </div>
        <button
          type="button"
          part="search-trigger"
          class="bs-navigation-drawer__search-trigger"
          aria-label="Search"
          onClick={this.onSearchTriggerClick}
        >
          <SearchIcon />
        </button>
        <div part="items" class="bs-navigation-drawer__items">
          <slot></slot>
        </div>
      </nav>
    );
  }
}

// Same inline-icon-helper-function pattern as bs-chatbot-header.tsx's NewChatIcon/ExpandIcon/etc.
const CaretLeftIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
    <path d="M15 18L9 12L15 6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
  </svg>
);

const SearchIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
    <circle cx="11" cy="11" r="7" stroke="currentColor" stroke-width="2" />
    <path d="M16.5 16.5L21 21" stroke="currentColor" stroke-width="2" stroke-linecap="round" />
  </svg>
);
