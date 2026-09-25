import { Component, Prop, h } from '@stencil/core';
import type { BsCheckboxSize } from '../bs-checkbox';

/**
 * A shape-matched loading placeholder for `bs-checkbox`, shown while the real label text isn't
 * known yet (e.g. still being fetched from an API). Renders a small square (matching the
 * checkbox's own box) beside a text-bar placeholder (standing in for the label), both pulsing
 * together, sized to match `bs-checkbox`'s `sm`/`md`/`lg` box dimensions so layout doesn't shift
 * once the real checkbox renders.
 *
 * ## When to use
 * - In place of a `bs-checkbox` whose label/checked state depends on data that hasn't loaded yet.
 *
 * ## When not to use
 * - While a checkbox's own change handler is running (e.g. a save request in flight) -- render the
 *   real `bs-checkbox` itself; this component is not a saving-in-progress spinner.
 *
 * @part container - The outer wrapper holding both placeholder pieces.
 * @part box - The pulsing placeholder standing in for the checkbox's own box.
 * @part label - The pulsing placeholder bar standing in for the label text.
 * @prop --bs-checkbox-skeleton-size-sm - Box width/height at `size="sm"`. Aliased to
 *   `--bs-spacing-200`, mirroring `bs-checkbox`'s own `--bs-checkbox-size-sm` -- not read directly
 *   from it, since these are two separate shadow roots.
 * @prop --bs-checkbox-skeleton-size-md - Box width/height at `size="md"`. Aliased to
 *   `--bs-spacing-250`.
 * @prop --bs-checkbox-skeleton-size-lg - Box width/height at `size="lg"`. Aliased to
 *   `--bs-spacing-300`.
 * @prop --bs-checkbox-skeleton-gap - Gap between the box and label placeholders. Aliased to
 *   `--bs-spacing-100`, mirroring `bs-checkbox`'s own `--bs-checkbox-gap`.
 * @prop --bs-checkbox-skeleton-label-width - Width of the label placeholder bar. Defaults to
 *   `96px`.
 */
@Component({
  tag: 'bs-checkbox-skeleton',
  styleUrl: 'bs-checkbox-skeleton.css',
  shadow: true,
})
export class BsCheckboxSkeleton {
  /** Sizing scale, matching the `bs-checkbox` size it stands in for. Defaults to `lg`, the same
   * (unusual) default `bs-checkbox` itself uses. */
  @Prop() size: BsCheckboxSize = 'lg';

  render() {
    return (
      <span part="container" class="bs-checkbox-skeleton" role="status" aria-label="Loading">
        <span part="box" class={`bs-checkbox-skeleton__box bs-checkbox-skeleton__box--${this.size}`}></span>
        <span part="label" class="bs-checkbox-skeleton__label"></span>
      </span>
    );
  }
}
