import type { Meta, StoryObj } from '@storybook/web-components-vite';
import type { BsDataTableColumn, BsDataTableRow } from './bs-data-table';
import { componentDescription } from '../../stories-utils';

const meta: Meta = {
  title: 'Components/bs-data-table',
  parameters: { docs: { description: { component: componentDescription('bs-data-table') } } },
};

export default meta;
type Story = StoryObj;

const columns: BsDataTableColumn[] = [
  { key: 'name', label: 'Name', sortable: true },
  { key: 'department', label: 'Department', sortable: true },
  { key: 'status', label: 'Status' },
];

const rows: BsDataTableRow[] = [
  { id: 1, name: 'Amelia Torres', department: 'Facilities', status: 'Active' },
  { id: 2, name: 'Noah Whitfield', department: 'Engineering', status: 'Active' },
  { id: 3, name: 'Priya Nair', department: 'Design', status: 'On leave' },
];

export const Default: Story = {
  render: () => {
    const table = document.createElement('bs-data-table') as HTMLElement & {
      columns: BsDataTableColumn[];
      rows: BsDataTableRow[];
    };
    table.columns = columns;
    table.rows = rows;
    table.addEventListener('bsSort', (ev: Event) => {
      // eslint-disable-next-line no-console
      console.log('bsSort', (ev as CustomEvent).detail);
    });
    return table;
  },
};

export const Selectable: Story = {
  render: () => {
    const table = document.createElement('bs-data-table') as HTMLElement & {
      columns: BsDataTableColumn[];
      rows: BsDataTableRow[];
      selectable: boolean;
    };
    table.columns = columns;
    table.rows = rows;
    table.selectable = true;
    table.addEventListener('bsRowSelect', (ev: Event) => {
      // eslint-disable-next-line no-console
      console.log('bsRowSelect', (ev as CustomEvent).detail);
    });
    return table;
  },
};

export const WithCustomCellRenderer: Story = {
  render: () => {
    const table = document.createElement('bs-data-table') as HTMLElement & {
      columns: BsDataTableColumn[];
      rows: BsDataTableRow[];
      cellRenderer: (row: BsDataTableRow, column: BsDataTableColumn) => string;
    };
    table.columns = [...columns, { key: 'actions', label: 'Actions' }];
    table.rows = rows;
    table.cellRenderer = (row, column) => {
      if (column.key === 'actions') {
        return `<button type="button">Edit</button>`;
      }
      return String(row[column.key] ?? '');
    };
    return table;
  },
};
