# bs-breadcrumb



<!-- Auto Generated Below -->


## Overview

A single crumb within a `<bs-breadcrumbs>` trail: a leading separator icon plus either a link,
plain text, or the current-page label, depending on `current`/`href`.

Rendering follows the W3C ARIA Authoring Practices breadcrumb pattern
(https://www.w3.org/WAI/ARIA/apg/patterns/breadcrumb/): the current page is marked
`aria-current="page"` and is never a link -- this holds even when `href` is also set, unlike
Carbon Design System's `cds-breadcrumb-item`, which allows a link on the current item.

Sets `role="listitem"` on the host, mirroring Carbon's own `CDSBreadcrumbItem.connectedCallback()`
-- since this is a custom-element child of a real `<ol>` rather than a real `<li>`, the
accessibility tree needs this explicit role to preserve the list's semantics.

## When to use
- As one crumb inside a `<bs-breadcrumbs>` trail.

## When not to use
- Standalone, outside a `<bs-breadcrumbs>` wrapper -- its `<ol>`/`<nav>` context and
  first-child-aware separator hiding depend on that parent structure.

## Properties

| Property  | Attribute | Description                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                            | Type           | Default     |
| --------- | --------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | -------------- | ----------- |
| `current` | `current` | Whether this crumb is the current page. Renders as plain (non-link) text marked `aria-current="page"`, reflected as an attribute so consumers/CSS can target `bs-breadcrumb[current]`.                                                                                                                                                                                                                                                                                                                                                                                                                                                                 | `boolean`      | `false`     |
| `href`    | `href`    | Destination for a non-current crumb. Ignored when `current` is true -- the current page is never a link, even if `href` is set (see the class JSDoc).                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                  | `string`       | `undefined` |
| `size`    | `size`    | Size variant. Normally set automatically by a parent `<bs-breadcrumbs size="...">` -- the container propagates its own `size` as a JS property to every slotted `bs-breadcrumb`/ `bs-breadcrumb-overflow` child (see `bs-breadcrumbs.tsx`'s `propagateSize`), since CSS custom properties can't carry an enum that switches rules on their own. Can also be set directly on a standalone crumb. `sm` scales down font-size/line-height only -- the separator icon's pixel size is unchanged, since Figma didn't specify a `sm` icon size and guessing one risked drifting off-brand. Reflected so consumers/CSS can target `bs-breadcrumb[size="sm"]`. | `"md" \| "sm"` | `'md'`      |


## Slots

| Slot | Description                                   |
| ---- | --------------------------------------------- |
|      | Default slot: the crumb's label content/text. |


## Shadow Parts

| Part          | Description                                                                      |
| ------------- | -------------------------------------------------------------------------------- |
| `"current"`   | The current-page text element.                                                   |
| `"link"`      | The anchor (or, when there's no `href`, plain `<span>`) for a non-current crumb. |
| `"separator"` | The leading separator icon wrapper.                                              |


## CSS Custom Properties

| Name                                  | Description                                                                              |
| ------------------------------------- | ---------------------------------------------------------------------------------------- |
| `--bs-breadcrumb-color-current`       | Text color, the current-page crumb. Aliased to --bs-text-default.                        |
| `--bs-breadcrumb-color-default`       | Text color, non-current crumb. Aliased to --bs-text-muted.                               |
| `--bs-breadcrumb-color-hover`         | Text color, non-current link crumb on hover/focus. Aliased to --bs-text-default.         |
| `--bs-breadcrumb-focus-ring-color`    | Focus ring color for a link crumb. Aliased to --bs-border-neutral-focus.                 |
| `--bs-breadcrumb-font-size`           | Aliased to --bs-font-size-md.                                                            |
| `--bs-breadcrumb-font-size-sm`        | Font size at size="sm". Aliased to --bs-font-size-sm.                                    |
| `--bs-breadcrumb-font-weight-current` | Font weight, the current-page crumb. Aliased to --bs-font-weight-semibold.               |
| `--bs-breadcrumb-font-weight-default` | Font weight, non-current crumb. Aliased to --bs-font-weight-regular.                     |
| `--bs-breadcrumb-gap`                 | Gap between the separator icon and this crumb's own content. Aliased to --bs-spacing-50. |
| `--bs-breadcrumb-line-height`         | Aliased to --bs-line-height-body-md.                                                     |
| `--bs-breadcrumb-line-height-sm`      | Line height at size="sm". Aliased to --bs-line-height-body-sm.                           |
| `--bs-breadcrumb-radius`              | Border radius for a link crumb's focus ring. Aliased to --bs-border-radius-50.           |
| `--bs-breadcrumb-separator-color`     | Separator icon color. Aliased to --bs-icon-default.                                      |


----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
