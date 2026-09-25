import { Component, Element, Host, Listen, Prop, State, h } from '@stencil/core';
import type { BsBreadcrumbSize } from '../bs-breadcrumb/bs-breadcrumb';

export interface BsBreadcrumbOverflowItem {
  label: string;
  href?: string;
}

/**
 * A manually-placed collapsed-items disclosure for a `<bs-breadcrumbs>` trail: a leading separator
 * plus an icon-only ellipsis button that reveals a `bs-menu` popup listing every hidden crumb.
 *
 * `items` is JS-property-only -- must be set as a JS property (`el.items = [...]`), not an HTML
 * attribute, since attributes can only carry strings. See CONVENTIONS.md.
 *
 * Unlike an earlier `bs-breadcrumbs`-owned automatic `maxItems` collapse, this component does no
 * collapsing logic itself -- the consumer decides which crumbs to hide and places this element
 * wherever they want the disclosure, exactly matching Carbon Design System's own approach (Carbon
 * doesn't auto-collapse breadcrumbs either; a consumer there manually decides what's visible).
 *
 * Hidden items with an `href` render as real `<a href>` rows inside the popup, not `bs-menu-item`
 * (which renders a `<button>`) -- this matters because consuming apps commonly use client-side
 * routers that intercept clicks on real `<a>` tags to do `preventDefault` + push-state navigation.
 * Rendering hidden links any other way (e.g. `window.location`) would silently break client-side
 * routing for hidden crumbs while working fine for visible ones. Hidden items without an `href`
 * render as plain non-interactive text, matching how `bs-breadcrumb` itself handles link vs.
 * no-link crumbs.
 *
 * Sets `role="listitem"` on the host, mirroring Carbon's own `CDSBreadcrumbItem.connectedCallback()`
 * -- since this is a custom-element child of a real `<ol>` rather than a real `<li>`, the
 * accessibility tree needs this explicit role to preserve the list's semantics.
 *
 * ## When to use
 * - Inside a `<bs-breadcrumbs>` trail, wherever the consumer wants an interactive disclosure for
 *   crumbs they've chosen not to render directly.
 *
 * ## When not to use
 * - As an automatic collapsing mechanism -- there is none; the consumer decides what's hidden.
 *
 * @slot - None: `items` fully drives the popup's contents.
 * @part separator - The leading separator icon wrapper.
 * @part ellipsis - The icon-only disclosure button.
 * @part menu - The `bs-menu` popup revealed by the ellipsis button.
 * @part link - Each anchor/span row inside the popup.
 */
// Note: this component's CSS Custom Properties (--bs-breadcrumb-overflow-*) are documented via
// @prop comments in bs-breadcrumb-overflow.css, not here -- see bs-tab.tsx's identical note.
@Component({
  tag: 'bs-breadcrumb-overflow',
  styleUrl: 'bs-breadcrumb-overflow.css',
  shadow: true,
})
export class BsBreadcrumbOverflow {
  @Element() el: HTMLElement;

  /** Array prop -- must be set as a JS property (`el.items = [...]`), not an HTML attribute, since
   * attributes can only carry strings. See CONVENTIONS.md. The hidden crumbs reachable via this
   * disclosure -- no collapsing logic here, the consumer decides what goes in this list. */
  @Prop() items: BsBreadcrumbOverflowItem[] = [];

  /** Accessible name (`aria-label`) for the icon-only ellipsis trigger button. */
  @Prop() overflowLabel = 'Show hidden breadcrumbs';

  /** Size variant. Normally set automatically by a parent `<bs-breadcrumbs size="...">` -- see
   * `bs-breadcrumb`'s identical `size` prop doc comment for why this is propagated as a JS
   * property rather than inherited via CSS. Scales the popup rows' font-size/line-height only; the
   * separator/ellipsis icons' pixel sizes are unchanged. Reflected so consumers/CSS can target
   * `bs-breadcrumb-overflow[size="sm"]`. */
  @Prop({ reflect: true }) size: BsBreadcrumbSize = 'md';

  /** Whether the overflow popup is open. */
  @State() open = false;

  private onEllipsisToggle = () => {
    this.open = !this.open;
  };

  /** Closes the overflow popup on Escape, from anywhere within the component -- host is the
   * default @Listen target, so this fires whether focus is on the ellipsis button itself or on a
   * link inside the popup. Mirrors `bs-input`'s `type="dropdown"` `onHostKeydown`. */
  @Listen('keydown')
  onHostKeydown(ev: KeyboardEvent) {
    if (this.open && ev.key === 'Escape') {
      this.open = false;
    }
  }

  /** Closes the overflow popup once focus leaves the component entirely (e.g. Tab away, or a click
   * outside that moves focus elsewhere) -- `focusout` is composed, so it bubbles across the
   * `bs-menu` shadow boundary too. Mirrors `bs-input`'s `type="dropdown"` `onHostFocusOut`. */
  @Listen('focusout')
  onHostFocusOut(ev: FocusEvent) {
    if (!this.open) return;
    const related = ev.relatedTarget as Node | null;
    if (!related || !this.el.contains(related)) {
      this.open = false;
    }
  }

  render() {
    return (
      <Host role="listitem">
        <span part="separator" class="bs-breadcrumb-overflow__separator" aria-hidden="true">
          <CaretRightIcon />
        </span>
        <span class="bs-breadcrumb-overflow__wrapper">
          <button
            type="button"
            part="ellipsis"
            class="bs-breadcrumb-overflow__ellipsis"
            aria-haspopup="menu"
            aria-expanded={String(this.open)}
            aria-label={this.overflowLabel}
            onClick={this.onEllipsisToggle}
          >
            <DotsThreeIcon />
          </button>
          {this.open && this.items.length > 0 && (
            <bs-menu part="menu" class="bs-breadcrumb-overflow__menu">
              {this.items.map(item =>
                item.href ? (
                  <a part="link" class="bs-breadcrumb-overflow__link" href={item.href}>
                    {item.label}
                  </a>
                ) : (
                  <span part="link" class="bs-breadcrumb-overflow__link">
                    {item.label}
                  </span>
                ),
              )}
            </bs-menu>
          )}
        </span>
      </Host>
    );
  }
}

const CaretRightIcon = () => (
  <svg viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
    <path d="M6 3L11 8L6 13" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
  </svg>
);

const DotsThreeIcon = () => (
  <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
    <path
      fill="currentColor"
      d="M12 13.125C12.6213 13.125 13.125 12.6213 13.125 12C13.125 11.3787 12.6213 10.875 12 10.875C11.3787 10.875 10.875 11.3787 10.875 12C10.875 12.6213 11.3787 13.125 12 13.125Z"
    />
    <path
      fill="currentColor"
      d="M18.375 13.125C18.9963 13.125 19.5 12.6213 19.5 12C19.5 11.3787 18.9963 10.875 18.375 10.875C17.7537 10.875 17.25 11.3787 17.25 12C17.25 12.6213 17.7537 13.125 18.375 13.125Z"
    />
    <path
      fill="currentColor"
      d="M5.625 13.125C6.24632 13.125 6.75 12.6213 6.75 12C6.75 11.3787 6.24632 10.875 5.625 10.875C5.00368 10.875 4.5 11.3787 4.5 12C4.5 12.6213 5.00368 13.125 5.625 13.125Z"
    />
  </svg>
);
