import { Component, Element, State, Prop, Event, EventEmitter, h } from '@stencil/core';

/**
 * The "Sources" panel shown alongside a Genie AI chat response -- a header with a title, a count
 * badge, and a collapse chevron, above a stack of `bs-source-link` citation rows.
 *
 * ## When to use
 * - Displaying the documents/sources a Genie response cited, typically opened from a "view
 *   sources" action on a `bs-chatbot-response-action` bar.
 *
 * ## When not to use
 * - A generic list container -- this component's header (title + count + collapse) is
 *   purpose-built for the sources use case.
 *
 * @slot - One or more `bs-source-link` rows.
 * @slot collapse-icon - Overrides the default collapse chevron icon.
 * @part heading - The "Sources" title text.
 * @part count - The count badge next to the title.
 * @part collapse - The collapse chevron button.
 * @part list - The scrollable container of slotted `bs-source-link` rows.
 * @prop --bs-chatbot-sources-drawer-bg - Background of the whole panel. Aliased to `--bs-surface-raised`.
 * @prop --bs-chatbot-sources-drawer-header-shadow - Drop shadow under the header, separating it
 *   from the scrolled list. Aliased to `--bs-shadow-xs`.
 * @prop --bs-chatbot-sources-drawer-header-padding-x - Aliased to `--bs-spacing-200`.
 * @prop --bs-chatbot-sources-drawer-header-padding-top - Aliased to `--bs-spacing-150`.
 * @prop --bs-chatbot-sources-drawer-header-padding-bottom - Aliased to `--bs-spacing-100`.
 * @prop --bs-chatbot-sources-drawer-heading-color - Aliased to `--bs-text-default`.
 * @prop --bs-chatbot-sources-drawer-count-bg - Count badge background. Aliased to
 *   `--bs-badge-bg-neutral-container`.
 * @prop --bs-chatbot-sources-drawer-count-color - Count badge text color. Aliased to
 *   `--bs-badge-text-neutral`.
 * @prop --bs-chatbot-sources-drawer-collapse-hover - Collapse button background on hover. Aliased
 *   to `--bs-surface-hover`.
 * @prop --bs-chatbot-sources-drawer-section-gap - Gap between the header and the list. Aliased to
 *   `--bs-spacing-200`.
 * @prop --bs-chatbot-sources-drawer-list-padding - Horizontal/bottom padding of the list. Aliased
 *   to `--bs-spacing-200`.
 * @prop --bs-chatbot-sources-drawer-list-gap - Gap between rows. Aliased to `--bs-spacing-50`.
 */
@Component({
  tag: 'bs-chatbot-sources-drawer',
  styleUrl: 'bs-chatbot-sources-drawer.css',
  shadow: true,
})
export class BsChatbotSourcesDrawer {
  @Element() el: HTMLElement;

  /** The panel title. */
  @Prop() heading = 'Sources';

  /**
   * Overrides the auto-detected count badge. By default the badge reflects the number of slotted
   * `bs-source-link` children, so most consumers don't need to set this.
   */
  @Prop() count?: number;

  /** Fires when the collapse chevron is clicked. The consuming app owns actually hiding the panel. */
  @Event() bsCollapse: EventEmitter<void>;

  @State() private slottedCount = 0;

  private onSlotchange = (event: Event) => {
    const slot = event.target as HTMLSlotElement;
    this.slottedCount = slot.assignedElements().filter(el => el.tagName.toLowerCase() === 'bs-source-link').length;
  };

  private onCollapseClick = () => {
    this.bsCollapse.emit();
  };

  render() {
    const displayCount = this.count ?? this.slottedCount;

    return (
      <div class="bs-chatbot-sources-drawer" role="region" aria-label={this.heading}>
        <div class="bs-chatbot-sources-drawer__header">
          <div class="bs-chatbot-sources-drawer__title-group">
            <h2 part="heading" class="bs-chatbot-sources-drawer__heading">
              {this.heading}
            </h2>
            {displayCount > 0 && (
              <span part="count" class="bs-chatbot-sources-drawer__count">
                {displayCount}
              </span>
            )}
          </div>
          <button type="button" part="collapse" class="bs-chatbot-sources-drawer__collapse" aria-label="Collapse sources" onClick={this.onCollapseClick}>
            <slot name="collapse-icon">
              <CaretRightIcon />
            </slot>
          </button>
        </div>
        <div part="list" class="bs-chatbot-sources-drawer__list">
          <slot onSlotchange={this.onSlotchange}></slot>
        </div>
      </div>
    );
  }
}

const CaretRightIcon = () => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
    <path d="M7.5 4.375L13.125 10L7.5 15.625" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
  </svg>
);
