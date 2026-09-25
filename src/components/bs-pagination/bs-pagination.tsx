import { Component, Event, EventEmitter, Prop, h } from '@stencil/core';

type BsPaginationItem = number | 'ellipsis';

/**
 * A numbered page control -- previous/next chevrons, page-number buttons, and `...` overflow for
 * large page counts. Matches the Figma "Pagination" component's "Default" type (the classic
 * numbered pagination); its other type ("jumper" -- a rows-per-page dropdown plus a page-jump
 * input) is a structurally different composite widget and isn't covered by this component.
 *
 * `totalPages`/`currentPage` drive everything -- this computes which page numbers to show and
 * where to collapse into `...` itself, the consumer never builds the button list by hand.
 *
 * ## When to use
 * - Paging through a large, ordered result set (a table, a search results list) where jumping
 *   directly to a specific page number is useful.
 *
 * ## When not to use
 * - Infinite-scroll or "load more" patterns -- those don't have a fixed, addressable page number.
 * - A huge page count where users realistically only ever go forward/back one page at a time --
 *   plain prev/next controls (no numbers) are simpler there.
 *
 * @part list - The `<ul>` element.
 * @part item - Each `<li>` in the list.
 * @part prev - The previous-page button.
 * @part next - The next-page button.
 * @part page - Each page-number button.
 * @part current - The current page's button (in addition to `page`).
 * @part ellipsis - Each collapsed-range indicator.
 */
@Component({
  tag: 'bs-pagination',
  styleUrl: 'bs-pagination.css',
  shadow: true,
})
export class BsPagination {
  /** Total number of pages. Must be a positive integer -- there's always at least one page. */
  @Prop() totalPages = 1;

  /** The active page (1-indexed). Mutable + reflected so clicking a page button updates it
   * directly, the same way `bs-modal`'s `open` self-manages, while `bsPageChange` still fires for
   * the consumer to react to (e.g. fetching that page's data). */
  @Prop({ mutable: true, reflect: true }) currentPage = 1;

  /** How many page numbers to show on each side of the current page before collapsing the rest
   * into `...`. `1` (the default) reproduces the Figma spec's example exactly (page 1 of 12 shows
   * `1 2 3 ... 12`). */
  @Prop() siblingCount = 1;

  /** Accessible name for the previous-page button. */
  @Prop() previousLabel = 'Previous page';

  /** Accessible name for the next-page button. */
  @Prop() nextLabel = 'Next page';

  /** Fires whenever the active page changes as a result of the user clicking a page/prev/next
   * button -- not when `currentPage` is set programmatically from outside. */
  @Event() bsPageChange: EventEmitter<number>;

  // Defends against any non-finite/negative input reaching the render/list-building logic below --
  // e.g. an HTML attribute that failed to parse as a number resolves to an empty string, which
  // Stencil can't coerce into a valid `number` prop, leaving it `undefined`/`null` rather than
  // falling back to the class field's own default. `undefined * 2` is `NaN`, which silently
  // corrupted every comparison in `getPageList` (confirmed: it rendered as two adjacent `...`s with
  // pages 2/3 missing, not a crash) -- exactly the kind of quiet, hard-to-notice breakage a boundary
  // check here prevents outright. Computed once and reused by both `getPageList` and `render`'s
  // disabled checks, rather than repeating the same fallback logic in two places.
  private get safeTotalPages(): number {
    return Number.isFinite(this.totalPages) && this.totalPages >= 1 ? this.totalPages : 1;
  }

  private get safeSiblingCount(): number {
    return Number.isFinite(this.siblingCount) && this.siblingCount >= 0 ? this.siblingCount : 1;
  }

  private goToPage(page: number) {
    if (page === this.currentPage || page < 1 || page > this.safeTotalPages) return;
    this.currentPage = page;
    this.bsPageChange.emit(page);
  }

  private getPageList(): BsPaginationItem[] {
    const { currentPage } = this;
    const totalPages = this.safeTotalPages;
    const siblingCount = this.safeSiblingCount;
    const totalNumbersToShowBeforeCollapsing = siblingCount * 2 + 5;

    if (totalNumbersToShowBeforeCollapsing >= totalPages) {
      return range(1, totalPages);
    }

    const leftSiblingIndex = Math.max(currentPage - siblingCount, 1);
    const rightSiblingIndex = Math.min(currentPage + siblingCount, totalPages);

    const showLeftEllipsis = leftSiblingIndex > 2;
    const showRightEllipsis = rightSiblingIndex < totalPages - 1;

    if (!showLeftEllipsis && showRightEllipsis) {
      const leftItemCount = siblingCount * 2 + 1;
      return [...range(1, leftItemCount), 'ellipsis', totalPages];
    }

    if (showLeftEllipsis && !showRightEllipsis) {
      const rightItemCount = siblingCount * 2 + 1;
      return [1, 'ellipsis', ...range(totalPages - rightItemCount + 1, totalPages)];
    }

    return [1, 'ellipsis', ...range(leftSiblingIndex, rightSiblingIndex), 'ellipsis', totalPages];
  }

  render() {
    const pageList = this.getPageList();

    return (
      <nav aria-label="Pagination">
        <ul part="list" class="bs-pagination__list">
          <li part="item" class="bs-pagination__item">
            <button
              part="prev"
              type="button"
              class="bs-pagination__control"
              aria-label={this.previousLabel}
              disabled={this.currentPage <= 1}
              onClick={() => this.goToPage(this.currentPage - 1)}
            >
              <ChevronLeftIcon />
            </button>
          </li>
          {pageList.map((item, index) =>
            item === 'ellipsis' ? (
              <li part="item" class="bs-pagination__item" key={`ellipsis-${index}`}>
                <span part="ellipsis" class="bs-pagination__ellipsis" aria-hidden="true">
                  <EllipsisIcon />
                </span>
              </li>
            ) : (
              <li part="item" class="bs-pagination__item" key={item}>
                <button
                  part={item === this.currentPage ? 'page current' : 'page'}
                  type="button"
                  class={`bs-pagination__control bs-pagination__page ${item === this.currentPage ? 'bs-pagination__page--current' : ''}`}
                  aria-label={`Go to page ${item}`}
                  aria-current={item === this.currentPage ? 'page' : undefined}
                  onClick={() => this.goToPage(item)}
                >
                  {item}
                </button>
              </li>
            ),
          )}
          <li part="item" class="bs-pagination__item">
            <button
              part="next"
              type="button"
              class="bs-pagination__control"
              aria-label={this.nextLabel}
              disabled={this.currentPage >= this.safeTotalPages}
              onClick={() => this.goToPage(this.currentPage + 1)}
            >
              <ChevronRightIcon />
            </button>
          </li>
        </ul>
      </nav>
    );
  }
}

function range(start: number, end: number): number[] {
  const length = end - start + 1;
  return Array.from({ length }, (_, i) => start + i);
}

const ChevronLeftIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
    <path d="M15 18L9 12L15 6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
  </svg>
);

const ChevronRightIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
    <path d="M9 18L15 12L9 6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
  </svg>
);

const EllipsisIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
    <path
      d="M12 13C12.5523 13 13 12.5523 13 12C13 11.4477 12.5523 11 12 11C11.4477 11 11 11.4477 11 12C11 12.5523 11.4477 13 12 13Z"
      stroke="currentColor"
      stroke-width="2"
      stroke-linecap="round"
      stroke-linejoin="round"
    />
    <path
      d="M19 13C19.5523 13 20 12.5523 20 12C20 11.4477 19.5523 11 19 11C18.4477 11 18 11.4477 18 12C18 12.5523 18.4477 13 19 13Z"
      stroke="currentColor"
      stroke-width="2"
      stroke-linecap="round"
      stroke-linejoin="round"
    />
    <path
      d="M5 13C5.55228 13 6 12.5523 6 12C6 11.4477 5.55228 11 5 11C4.44772 11 4 11.4477 4 12C4 12.5523 4.44772 13 5 13Z"
      stroke="currentColor"
      stroke-width="2"
      stroke-linecap="round"
      stroke-linejoin="round"
    />
  </svg>
);
