import type { Meta, StoryObj } from '@storybook/web-components-vite';
import { html } from 'lit';
import { componentDescription, propDescription } from '../../stories-utils';
import type { BsButtonSize } from '../bs-button/bs-button';

interface BsButtonSkeletonArgs {
  size: BsButtonSize;
}

const sizes: BsButtonSize[] = ['sm', 'md', 'lg'];

const meta: Meta<BsButtonSkeletonArgs> = {
  title: 'Components/bs-button-skeleton',
  parameters: { docs: { description: { component: componentDescription('bs-button-skeleton') } } },
  render: args => html`<bs-button-skeleton size=${args.size}></bs-button-skeleton>`,
  argTypes: {
    size: { control: 'select', options: sizes, description: propDescription('bs-button-skeleton', 'size') },
  },
  args: {
    size: 'md',
  },
};

export default meta;
type Story = StoryObj<BsButtonSkeletonArgs>;

export const Default: Story = {};

export const Sizes: Story = {
  render: () => html`
    <div style="display:flex; gap:12px; align-items:center;">
      <bs-button-skeleton size="sm"></bs-button-skeleton>
      <bs-button-skeleton size="md"></bs-button-skeleton>
      <bs-button-skeleton size="lg"></bs-button-skeleton>
    </div>
  `,
};
