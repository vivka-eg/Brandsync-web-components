import { Component, Host, Prop, h } from '@stencil/core';

export type BsBreadcrumbSize = 'sm' | 'md';

/**
 * A single crumb within a `<bs-breadcrumbs>` trail: a leading separator icon plus either a link,
 * plain text, or the current-page label, depending on `current`/`href`.
 *
 * Rendering follows the W3C ARIA Authoring Practices breadcrumb pattern
 * (https://www.w3.org/WAI/ARIA/apg/patterns/breadcrumb/): the current page is marked
 * `aria-current="page"` and is never a link -- this holds even when `href` is also set, unlike
 * Carbon Design System's `cds-breadcrumb-item`, which allows a link on the current item.
 *
 * Sets `role="listitem"` on the host, mirroring Carbon's own `CDSBreadcrumbItem.connectedCallback()`
 * -- since this is a custom-element child of a real `<ol>` rather than a real `<li>`, the
 * accessibility tree needs this explicit role to preserve the list's semantics.
 *
 * ## When to use
 * - As one crumb inside a `<bs-breadcrumbs>` trail.
 *
 * ## When not to use
 * - Standalone, outside a `<bs-breadcrumbs>` wrapper -- its `<ol>`/`<nav>` context and
 *   first-child-aware separator hiding depend on that parent structure.
 *
 * @slot - Default slot: the crumb's label content/text.
 * @part separator - The leading separator icon wrapper.
 * @part link - The anchor (or, when there's no `href`, plain `<span>`) for a non-current crumb.
 * @part current - The current-page text element.
 */
// Note: this component's CSS Custom Properties (--bs-breadcrumb-*) are documented via @prop
// comments in bs-breadcrumb.css, not here -- see bs-tab.tsx's identical note.
@Component({
  tag: 'bs-breadcrumb',
  styleUrl: 'bs-breadcrumb.css',
  shadow: true,
})
export class BsBreadcrumb {
  /** Destination for a non-current crumb. Ignored when `current` is true -- the current page is
   * never a link, even if `href` is set (see the class JSDoc). */
  @Prop() href?: string;

  /** Whether this crumb is the current page. Renders as plain (non-link) text marked
   * `aria-current="page"`, reflected as an attribute so consumers/CSS can target
   * `bs-breadcrumb[current]`. */
  @Prop({ reflect: true }) current = false;

  /** Size variant. Normally set automatically by a parent `<bs-breadcrumbs size="...">` -- the
   * container propagates its own `size` as a JS property to every slotted `bs-breadcrumb`/
   * `bs-breadcrumb-overflow` child (see `bs-breadcrumbs.tsx`'s `propagateSize`), since CSS custom
   * properties can't carry an enum that switches rules on their own. Can also be set directly on a
   * standalone crumb. `sm` scales down font-size/line-height only -- the separator icon's pixel
   * size is unchanged, since Figma didn't specify a `sm` icon size and guessing one risked drifting
   * off-brand. Reflected so consumers/CSS can target `bs-breadcrumb[size="sm"]`. */
  @Prop({ reflect: true }) size: BsBreadcrumbSize = 'md';

  render() {
    return (
      <Host role="listitem">
        <span part="separator" class="bs-breadcrumb__separator" aria-hidden="true">
          <CaretRightIcon />
        </span>
        {this.current ? (
          <span part="current" class="bs-breadcrumb__current" aria-current="page">
            <slot></slot>
          </span>
        ) : this.href ? (
          <a part="link" class="bs-breadcrumb__link" href={this.href}>
            <slot></slot>
          </a>
        ) : (
          <span part="link" class="bs-breadcrumb__link">
            <slot></slot>
          </span>
        )}
      </Host>
    );
  }
}

const CaretRightIcon = () => (
  <svg viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
    <path d="M6 3L11 8L6 13" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
  </svg>
);
