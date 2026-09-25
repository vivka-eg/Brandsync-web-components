import { Component, Element, Prop, Watch, h } from '@stencil/core';
import type { BsBreadcrumbSize } from '../bs-breadcrumb/bs-breadcrumb';

/**
 * A breadcrumb trail container: a real `<nav>` landmark wrapping an `<ol>`, meant to be populated
 * with slotted `<bs-breadcrumb>` (and, where the consumer wants a collapsed-items disclosure,
 * `<bs-breadcrumb-overflow>`) children -- same composition-over-configuration architecture as
 * Carbon Design System's `cds-breadcrumb`/`cds-breadcrumb-item`/`cds-breadcrumb-link`.
 *
 * This component is intentionally thin: it owns only the `<nav>` landmark and list semantics.
 * Unlike an earlier `items`-array-driven design, there is no automatic collapsing here -- exactly
 * like Carbon, the consumer decides what's visible and manually places a `<bs-breadcrumb-overflow>`
 * wherever they want a collapsed-items disclosure. See `bs-breadcrumbs.mdx` for the consolidated
 * docs covering all three components in this feature area.
 *
 * ## When to use
 * - Showing a user's current location within a hierarchical page structure, with a path back to
 *   its ancestors.
 *
 * ## When not to use
 * - Primary in-app navigation -- use `bs-navigation-drawer`/`bs-navigation-header` instead.
 * - A flat set of unrelated pages with no hierarchy -- breadcrumbs imply ancestry, not just history.
 *
 * @slot - Default slot: the trail's crumbs, `<bs-breadcrumb>` and/or `<bs-breadcrumb-overflow>`
 * elements, in visual order.
 * @part list - The `<ol>` element.
 */
// Note: this component's CSS Custom Property (--bs-breadcrumbs-gap) is documented via an @prop
// comment in bs-breadcrumbs.css, not here -- see bs-tab.tsx's identical note.
@Component({
  tag: 'bs-breadcrumbs',
  styleUrl: 'bs-breadcrumbs.css',
  shadow: true,
})
export class BsBreadcrumbs {
  @Element() el: HTMLElement;

  /** Accessible name for the `<nav>` landmark, via `aria-label`. Same pattern as
   * `bs-navigation-drawer`'s `heading` prop. */
  @Prop() label = 'Breadcrumb';

  /** Size variant, propagated as a JS property to every slotted `bs-breadcrumb`/
   * `bs-breadcrumb-overflow` child -- this container has no visual sizing of its own (font/spacing
   * live on the item components, see `bs-breadcrumb.tsx`'s identical `size` prop), so propagation
   * is the only way setting `size` here reaches every crumb. CSS custom properties can't carry an
   * enum that switches rules on their own, which is why this is pushed via JS property instead of
   * CSS inheritance -- same reasoning as `bs-tabs` setting `selected` directly on its slotted
   * `bs-tab`/`bs-inline-tab` children. Re-propagated on `size` changes and whenever the slotted
   * children change (e.g. a crumb added later). */
  @Prop() size: BsBreadcrumbSize = 'md';

  @Watch('size')
  onSizeChange(size: BsBreadcrumbSize) {
    this.propagateSize(size);
  }

  componentDidLoad() {
    this.propagateSize(this.size);
  }

  private onSlotChange = () => {
    this.propagateSize(this.size);
  };

  private propagateSize(size: BsBreadcrumbSize) {
    this.el.querySelectorAll(':scope > bs-breadcrumb, :scope > bs-breadcrumb-overflow').forEach(child => {
      (child as HTMLElement & { size: BsBreadcrumbSize }).size = size;
    });
  }

  render() {
    return (
      <nav aria-label={this.label}>
        <ol part="list" class="bs-breadcrumbs__list">
          <slot onSlotchange={this.onSlotChange}></slot>
        </ol>
      </nav>
    );
  }
}
