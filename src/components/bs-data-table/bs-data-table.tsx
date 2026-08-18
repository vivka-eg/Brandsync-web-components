import { Component, Prop, State, Event, EventEmitter, h } from '@stencil/core';

export interface BsDataTableColumn {
  key: string;
  label: string;
  sortable?: boolean;
}

export type BsDataTableRow = Record<string, unknown> & { id: string | number };

/**
 * A sortable, optionally row-selectable table for tabular data.
 *
 * `columns`, `rows`, and `cellRenderer` are JS-property-only — HTML attributes can only carry
 * strings, so arrays/objects/functions must be set via `element.rows = [...]` etc., not as
 * attributes. See CONVENTIONS.md.
 *
 * ## When to use
 * - Comparing structured records across the same set of fields (a list of people, bookings, etc.).
 *
 * ## When not to use
 * - A handful of unrelated key/value pairs — a simple list or card is lighter-weight.
 * - Deeply nested/hierarchical data — this component renders one flat row per record.
 *
 * @part table - The `<table>` element.
 * @part head - The `<thead>` element.
 * @part body - The `<tbody>` element.
 * @part row - Each `<tr>` in the body.
 * @part header-cell - Each `<th>` in the header row.
 * @part cell - Each `<td>` in a body row.
 */
@Component({
  tag: 'bs-data-table',
  styleUrl: 'bs-data-table.css',
  shadow: true,
})
export class BsDataTable {
  /** Array prop -- must be set as a JS property (`el.columns = [...]`), not an HTML attribute,
   * since attributes can only carry strings. See CONVENTIONS.md. */
  @Prop() columns: BsDataTableColumn[] = [];

  /** Array prop -- same JS-property-only rule as `columns`. */
  @Prop() rows: BsDataTableRow[] = [];

  @Prop() sortColumn?: string;
  @Prop() sortDirection: 'asc' | 'desc' = 'asc';
  @Prop() selectable = false;

  /** Optional custom cell renderer, e.g. for an actions column. Function props are JS-property-only,
   * same as array props -- there is no attribute equivalent. Falls back to the raw cell value. */
  @Prop() cellRenderer?: (row: BsDataTableRow, column: BsDataTableColumn) => string;

  @Event() bsSort: EventEmitter<{ column: string; direction: 'asc' | 'desc' }>;
  @Event() bsRowSelect: EventEmitter<{ id: string | number; selected: boolean }>;

  @State() private selectedIds = new Set<string | number>();

  private onHeaderClick = (column: BsDataTableColumn) => {
    if (!column.sortable) return;
    const direction: 'asc' | 'desc' = this.sortColumn === column.key && this.sortDirection === 'asc' ? 'desc' : 'asc';
    this.bsSort.emit({ column: column.key, direction });
  };

  private onRowCheckboxChange = (row: BsDataTableRow, ev: Event) => {
    const selected = (ev.target as HTMLInputElement).checked;
    const next = new Set(this.selectedIds);
    if (selected) {
      next.add(row.id);
    } else {
      next.delete(row.id);
    }
    this.selectedIds = next;
    this.bsRowSelect.emit({ id: row.id, selected });
  };


  render() {
    return (
      <table part="table" class="bs-data-table">
        <thead part="head">
          <tr>
            {this.selectable && <th class="bs-data-table__select-col"></th>}
            {this.columns.map(column => {
              const isSorted = this.sortColumn === column.key;
              const ariaSort = column.sortable ? (isSorted ? (this.sortDirection === 'asc' ? 'ascending' : 'descending') : 'none') : undefined;
              return (
                <th part="header-cell" class="bs-data-table__header-cell" aria-sort={ariaSort}>
                  {column.sortable ? (
                    <button type="button" class="bs-data-table__sort-button" onClick={() => this.onHeaderClick(column)}>
                      {column.label}
                      {isSorted && <span class="bs-data-table__sort-indicator">{this.sortDirection === 'asc' ? ' ▲' : ' ▼'}</span>}
                    </button>
                  ) : (
                    column.label
                  )}
                </th>
              );
            })}
          </tr>
        </thead>
        <tbody part="body">
          {this.rows.map(row => (
            <tr part="row" class="bs-data-table__row">
              {this.selectable && (
                <td class="bs-data-table__select-col">
                  <input type="checkbox" checked={this.selectedIds.has(row.id)} onChange={ev => this.onRowCheckboxChange(row, ev)} />
                </td>
              )}
              {this.columns.map(column =>
                this.cellRenderer ? (
                  // cellRenderer is a developer-supplied, trusted function (JS-property-only, never
                  // derived from untrusted input) -- its HTML output is intentionally not escaped,
                  // same trust model as React's dangerouslySetInnerHTML.
                  <td part="cell" class="bs-data-table__cell" innerHTML={this.cellRenderer(row, column)}></td>
                ) : (
                  // Default path renders raw cell values as plain text so untrusted row data
                  // (e.g. user-submitted names) can never be interpreted as HTML.
                  <td part="cell" class="bs-data-table__cell">
                    {String(row[column.key] ?? '')}
                  </td>
                ),
              )}
            </tr>
          ))}
        </tbody>
      </table>
    );
  }
}
