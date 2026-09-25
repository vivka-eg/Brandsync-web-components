import { Component, Prop, State, h } from '@stencil/core';

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
 * @slot image - Optional hero image across the top of the card, flush with its edges and clipped
 * to its top corners. Presence of assigned content is what shows it -- doesn't affect layout when
 * empty.
 * @slot header - Optional heading content above the body.
 * @slot - Default slot: the card's main body content.
 * @slot footer - Optional actions/content below the body (e.g. a button).
 * @part container - The outer surface element.
 * @part image - The hero image wrapper (only visible when the `image` slot has content).
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

  /** Tracks whether the `image` slot has assigned content, so the image wrapper only reserves
   * layout space (and clips its top corners) when there's actually an image -- same pattern as
   * `bs-dialog`'s `hasImage`. */
  @State() hasImage = false;

  private onImageSlotchange = (ev: Event) => {
    this.hasImage = (ev.target as HTMLSlotElement).assignedNodes().length > 0;
  };

  render() {
    return (
      <div part="container" class={`bs-card bs-card--${this.surface}`}>
        <div part="image" class={`bs-card__image ${this.hasImage ? 'bs-card__image--visible' : ''}`}>
          <slot name="image" onSlotchange={this.onImageSlotchange}></slot>
        </div>
        <div class="bs-card__content">
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
      </div>
    );
  }
}
