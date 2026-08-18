# bs-data-table



<!-- Auto Generated Below -->


## Overview

A sortable, optionally row-selectable table for tabular data.

`columns`, `rows`, and `cellRenderer` are JS-property-only — HTML attributes can only carry
strings, so arrays/objects/functions must be set via `element.rows = [...]` etc., not as
attributes. See CONVENTIONS.md.

## When to use
- Comparing structured records across the same set of fields (a list of people, bookings, etc.).

## When not to use
- A handful of unrelated key/value pairs — a simple list or card is lighter-weight.
- Deeply nested/hierarchical data — this component renders one flat row per record.

## Properties

| Property        | Attribute        | Description                                                                                                                                                                                | Type                                                         | Default     |
| --------------- | ---------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------ | ----------- |
| `cellRenderer`  | --               | Optional custom cell renderer, e.g. for an actions column. Function props are JS-property-only, same as array props -- there is no attribute equivalent. Falls back to the raw cell value. | `(row: BsDataTableRow, column: BsDataTableColumn) => string` | `undefined` |
| `columns`       | --               | Array prop -- must be set as a JS property (`el.columns = [...]`), not an HTML attribute, since attributes can only carry strings. See CONVENTIONS.md.                                     | `BsDataTableColumn[]`                                        | `[]`        |
| `rows`          | --               | Array prop -- same JS-property-only rule as `columns`.                                                                                                                                     | `BsDataTableRow[]`                                           | `[]`        |
| `selectable`    | `selectable`     |                                                                                                                                                                                            | `boolean`                                                    | `false`     |
| `sortColumn`    | `sort-column`    |                                                                                                                                                                                            | `string`                                                     | `undefined` |
| `sortDirection` | `sort-direction` |                                                                                                                                                                                            | `"asc" \| "desc"`                                            | `'asc'`     |


## Events

| Event         | Description | Type                                                           |
| ------------- | ----------- | -------------------------------------------------------------- |
| `bsRowSelect` |             | `CustomEvent<{ id: string \| number; selected: boolean; }>`    |
| `bsSort`      |             | `CustomEvent<{ column: string; direction: "desc" \| "asc"; }>` |


## Shadow Parts

| Part            | Description                    |
| --------------- | ------------------------------ |
| `"body"`        | The `<tbody>` element.         |
| `"cell"`        | Each `<td>` in a body row.     |
| `"head"`        | The `<thead>` element.         |
| `"header-cell"` | Each `<th>` in the header row. |
| `"row"`         | Each `<tr>` in the body.       |
| `"table"`       | The `<table>` element.         |


----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
