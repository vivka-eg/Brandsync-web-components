# bs-pagination



<!-- Auto Generated Below -->


## Overview

A numbered page control -- previous/next chevrons, page-number buttons, and `...` overflow for
large page counts. Matches the Figma "Pagination" component's "Default" type (the classic
numbered pagination); its other type ("jumper" -- a rows-per-page dropdown plus a page-jump
input) is a structurally different composite widget and isn't covered by this component.

`totalPages`/`currentPage` drive everything -- this computes which page numbers to show and
where to collapse into `...` itself, the consumer never builds the button list by hand.

## When to use
- Paging through a large, ordered result set (a table, a search results list) where jumping
  directly to a specific page number is useful.

## When not to use
- Infinite-scroll or "load more" patterns -- those don't have a fixed, addressable page number.
- A huge page count where users realistically only ever go forward/back one page at a time --
  plain prev/next controls (no numbers) are simpler there.

## Properties

| Property        | Attribute        | Description                                                                                                                                                                                                                                    | Type     | Default           |
| --------------- | ---------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------- | ----------------- |
| `currentPage`   | `current-page`   | The active page (1-indexed). Mutable + reflected so clicking a page button updates it directly, the same way `bs-modal`'s `open` self-manages, while `bsPageChange` still fires for the consumer to react to (e.g. fetching that page's data). | `number` | `1`               |
| `nextLabel`     | `next-label`     | Accessible name for the next-page button.                                                                                                                                                                                                      | `string` | `'Next page'`     |
| `previousLabel` | `previous-label` | Accessible name for the previous-page button.                                                                                                                                                                                                  | `string` | `'Previous page'` |
| `siblingCount`  | `sibling-count`  | How many page numbers to show on each side of the current page before collapsing the rest into `...`. `1` (the default) reproduces the Figma spec's example exactly (page 1 of 12 shows `1 2 3 ... 12`).                                       | `number` | `1`               |
| `totalPages`    | `total-pages`    | Total number of pages. Must be a positive integer -- there's always at least one page.                                                                                                                                                         | `number` | `1`               |


## Events

| Event          | Description                                                                                                                                                     | Type                  |
| -------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------- |
| `bsPageChange` | Fires whenever the active page changes as a result of the user clicking a page/prev/next button -- not when `currentPage` is set programmatically from outside. | `CustomEvent<number>` |


## Shadow Parts

| Part         | Description                                        |
| ------------ | -------------------------------------------------- |
| `"current"`  | The current page's button (in addition to `page`). |
| `"ellipsis"` | Each collapsed-range indicator.                    |
| `"item"`     | Each `<li>` in the list.                           |
| `"list"`     | The `<ul>` element.                                |
| `"next"`     | The next-page button.                              |
| `"page"`     | Each page-number button.                           |
| `"prev"`     | The previous-page button.                          |


## CSS Custom Properties

| Name                                 | Description                                                                                                       |
| ------------------------------------ | ----------------------------------------------------------------------------------------------------------------- |
| `--bs-pagination-color`              | Icon/page-number color, unselected. Aliased to --bs-text-secondary.                                               |
| `--bs-pagination-color-disabled`     | Prev/next icon color when at the first/last page. Aliased to --bs-icon-disabled.                                  |
| `--bs-pagination-current-bg`         | Background of the current page's button. Aliased to --bs-color-primary-default.                                   |
| `--bs-pagination-current-bg-hover`   | Background of the current page's button on hover. Aliased to --bs-color-primary-hover.                            |
| `--bs-pagination-current-bg-pressed` | Background of the current page's button when pressed. Aliased to --bs-color-primary-pressed.                      |
| `--bs-pagination-current-color`      | Text color of the current page's button. Aliased to --bs-text-on-action.                                          |
| `--bs-pagination-focus-ring-color`   | Focus ring color. Aliased to --bs-border-neutral-focus.                                                           |
| `--bs-pagination-font-size`          | Aliased to --bs-font-size-md.                                                                                     |
| `--bs-pagination-gap`                | Gap between items. Aliased to --bs-spacing-50.                                                                    |
| `--bs-pagination-hover`              | Background of an unselected page button on hover. Aliased to --bs-color-neutral-container-hover.                  |
| `--bs-pagination-line-height`        | Aliased to --bs-line-height-body-md.                                                                              |
| `--bs-pagination-pressed`            | Background of an unselected page button when pressed. Aliased to --bs-color-neutral-container-pressed.            |
| `--bs-pagination-radius`             | Corner radius of each control. Aliased to --bs-border-radius-100.                                                 |
| `--bs-pagination-size`               | Width/height of each control (prev/next/page/ellipsis). Aliased to --bs-spacing-550 (44px, exact match to Figma). |


----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
