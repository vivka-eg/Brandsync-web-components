import type { Meta, StoryObj } from '@storybook/web-components-vite';
import { html } from 'lit';
import { componentDescription, propDescription } from '../../stories-utils';

interface BsPaginationArgs {
  totalPages: number;
  currentPage: number;
  siblingCount: number;
}

const meta: Meta<BsPaginationArgs> = {
  title: 'Components/bs-pagination',
  parameters: { docs: { description: { component: componentDescription('bs-pagination') } } },
  render: args => html`
    <bs-pagination
      total-pages=${args.totalPages}
      current-page=${args.currentPage}
      sibling-count=${args.siblingCount}
      @bsPageChange=${(ev: CustomEvent<number>) => console.log('bsPageChange', ev.detail)}
    ></bs-pagination>
  `,
  argTypes: {
    totalPages: { control: { type: 'number', min: 1 }, description: propDescription('bs-pagination', 'totalPages') },
    currentPage: { control: { type: 'number', min: 1 }, description: propDescription('bs-pagination', 'currentPage') },
    siblingCount: { control: { type: 'number', min: 0 }, description: propDescription('bs-pagination', 'siblingCount') },
  },
  args: {
    totalPages: 12,
    currentPage: 1,
    siblingCount: 1,
  },
};

export default meta;
type Story = StoryObj<BsPaginationArgs>;

// Matches the Figma spec's own example exactly: 1 2 3 ... 12.
export const Default: Story = {};

export const MiddlePage: Story = {
  name: 'Middle page (both ellipses)',
  args: { currentPage: 6 },
};

export const LastPage: Story = {
  name: 'Last page',
  args: { currentPage: 12 },
};

export const FewPages: Story = {
  name: 'Few pages (no ellipsis)',
  args: { totalPages: 5, currentPage: 1 },
};

export const WiderSiblingCount: Story = {
  name: 'Wider sibling count',
  args: { currentPage: 6, siblingCount: 2 },
};
