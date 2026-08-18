import { Component, Prop, h } from '@stencil/core';

export type BsCardSurface = 'base' | 'raised' | 'container';

/**
 * A bounded surface for grouping related content — a summary, a form section, a list item.
 *
 * ## When to use
 * - Grouping a self-contained piece of content that needs visual separation from the page
 *   background (e.g. a booking summary, a settings section).
 *
 * ## When not to use
 * - As the only structural element on a page — cards group content, they don't replace layout.
 * - For a dismissible/transient message — use a modal or a dedicated notification component.
 *
 * @slot header - Optional heading content above the body.
 * @slot - Default slot: the card's main body content.
 * @slot footer - Optional actions/content below the body (e.g. a button).
 * @part container - The outer bordered surface element.
 * @part header - The header wrapper.
 * @part body - The body wrapper.
 * @part footer - The footer wrapper.
 */
@Component({
  tag: 'bs-card',
  styleUrl: 'bs-card.css',
  shadow: true,
})
export class BsCard {
  /** Maps to the brandsync-tokens `--bs-paper-bg-*` set — Brandsync's tokens don't have a
   * dedicated "card" component yet, so this reuses the existing Paper surface tokens. */
  @Prop() surface: BsCardSurface = 'raised';

  render() {
    return (
      <div part="container" class={`bs-card bs-card--${this.surface}`}>
        <div part="header" class="bs-card__header">
          <slot name="header"></slot>
        </div>
        <div part="body" class="bs-card__body">
          <slot></slot>
        </div>
        <div part="footer" class="bs-card__footer">
          <slot name="footer"></slot>
        </div>
      </div>
    );
  }
}
