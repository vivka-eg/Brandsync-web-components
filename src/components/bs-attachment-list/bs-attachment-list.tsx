import { Component, Element, State, Prop, h } from '@stencil/core';

/**
 * A horizontally-scrolling row wrapper for one or more `bs-attachment` previews, for slotting into
 * `bs-composer`'s `attachments` slot when a Genie AI chat message has file attachments.
 *
 * ## When to use
 * - Wrapping any number of `bs-attachment` elements the user has attached to a message, so they
 *   lay out in a single row and scroll horizontally instead of wrapping/overflowing once there
 *   are more than fit the available width.
 *
 * ## When not to use
 * - A single attachment on its own — just render `bs-attachment` directly, this wrapper's
 *   scroll/fade affordance only matters once there's more content than fits.
 *
 * @slot - One or more `bs-attachment` elements.
 * @part row - The scrollable flex row containing the slotted attachments.
 * @part fade - The right-edge fade-out overlay shown only while the row has more content to
 *   scroll to.
 * @prop --bs-attachment-list-gap - Gap between attachments. Matches the 10px Figma spec (not tied
 *   to the `--bs-spacing-*` scale, which only has 8px/12px neighbors).
 * @prop --bs-attachment-list-padding - Padding around the row. Aliased to `--bs-spacing-150`.
 * @prop --bs-attachment-list-fade-color - Color the right-edge fade blends into. Aliased to
 *   `--bs-static-white`.
 * @prop --bs-attachment-list-fade-width - Width of the right-edge fade overlay. Aliased to
 *   `--bs-spacing-800`.
 * @prop --bs-attachment-list-scrollbar-thumb - Color of the scrollbar thumb that appears on
 *   hover/focus once the row is scrollable. Aliased to `--bs-neutral-300`.
 */
@Component({
  tag: 'bs-attachment-list',
  styleUrl: 'bs-attachment-list.css',
  shadow: true,
})
export class BsAttachmentList {
  @Element() el: HTMLElement;

  /** Accessible name for the scrollable region. */
  @Prop() ariaLabel: string | null = 'Attachments';

  /** Whether the row currently has more content than fits (drives the fade + scrollbar-on-hover). */
  @State() canScrollRight = false;

  private row?: HTMLDivElement;
  private resizeObserver?: ResizeObserver;

  componentDidLoad() {
    this.updateScrollState();
    this.resizeObserver = new ResizeObserver(() => this.updateScrollState());
    this.resizeObserver.observe(this.el);
  }

  disconnectedCallback() {
    this.resizeObserver?.disconnect();
  }

  private onSlotchange = () => {
    this.updateScrollState();
  };

  private onScroll = () => {
    this.updateScrollState();
  };

  private updateScrollState = () => {
    const row = this.row;
    if (!row) return;
    // +1 tolerance: some browsers report fractional scrollWidth/clientWidth that differ by less
    // than a pixel even when there's nothing left to scroll, which would otherwise leave the fade
    // stuck on permanently.
    this.canScrollRight = row.scrollWidth - row.clientWidth - row.scrollLeft > 1;
  };

  render() {
    return (
      <div class="bs-attachment-list">
        <div
          part="row"
          class="bs-attachment-list__row"
          ref={el => (this.row = el)}
          onScroll={this.onScroll}
          role="group"
          aria-label={this.ariaLabel}
          tabIndex={0}
        >
          <slot onSlotchange={this.onSlotchange}></slot>
        </div>
        {this.canScrollRight && <div part="fade" class="bs-attachment-list__fade" aria-hidden="true"></div>}
      </div>
    );
  }
}
