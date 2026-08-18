import { Component, Prop, h } from '@stencil/core';

export type BsBadgeVariant = 'default' | 'primary' | 'success' | 'warning' | 'info' | 'error' | 'neutral' | 'inverse';

/**
 * A small status or category pill, usually paired with a label or list item.
 *
 * ## When to use
 * - Communicating a short, fixed status (e.g. "Active", "On leave") or category label.
 *
 * ## When not to use
 * - As an interactive/clickable element — a badge is a label, not a control. Use a button
 *   or chip component if it needs to be clickable.
 * - For long text — badges are sized for one or two words.
 *
 * @slot - Default slot: the badge's label text.
 * @part container - The pill element.
 */
@Component({
  tag: 'bs-badge',
  styleUrl: 'bs-badge.css',
  shadow: true,
})
export class BsBadge {
  /** Maps directly to the brandsync-tokens `--bs-badge-bg-*` / `--bs-badge-text-*` sets. */
  @Prop() variant: BsBadgeVariant = 'default';

  render() {
    return (
      <span part="container" class={`bs-badge bs-badge--${this.variant}`}>
        <slot></slot>
      </span>
    );
  }
}
