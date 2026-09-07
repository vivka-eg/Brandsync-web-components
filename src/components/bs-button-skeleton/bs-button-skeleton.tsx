import { Component, Prop, h } from '@stencil/core';
import type { BsButtonSize } from '../bs-button/bs-button';

/**
 * A shape-matched loading placeholder for `bs-button`, shown while the real label/action isn't
 * known yet (e.g. still being fetched from an API). Sized to match `bs-button`'s `sm`/`md`/`lg`
 * heights so layout doesn't shift once the real button renders.
 *
 * This is not a submit-in-progress spinner — that's a different concern (a button that's
 * already rendered but waiting on an async action it triggered). Use this component only when
 * the button itself doesn't exist yet.
 *
 * ## When to use
 * - In place of a `bs-button` whose label/visibility depends on data that hasn't loaded yet.
 *
 * ## When not to use
 * - While a button's own click handler is running (e.g. a submit request in flight) — render the
 *   real `bs-button` and show its own busy/spinner state instead.
 *
 * @part container - The pulsing placeholder element.
 * @prop --bs-button-skeleton-height-sm - Height at `size="sm"`. Aliased to `--bs-spacing-500`.
 * @prop --bs-button-skeleton-height-md - Height at `size="md"`. Aliased to `--bs-spacing-600`.
 * @prop --bs-button-skeleton-height-lg - Height at `size="lg"`. Aliased to `--bs-spacing-700`.
 * @prop --bs-button-skeleton-width - Placeholder width. Defaults to `96px`.
 */
@Component({
  tag: 'bs-button-skeleton',
  styleUrl: 'bs-button-skeleton.css',
  shadow: true,
})
export class BsButtonSkeleton {
  /** Sizing scale, matching the `bs-button` size it stands in for. */
  @Prop() size: BsButtonSize = 'md';

  render() {
    return <span part="container" class={`bs-button-skeleton bs-button-skeleton--${this.size}`} role="status" aria-label="Loading"></span>;
  }
}
