import type { Meta, StoryObj } from '@storybook/web-components-vite';
import { html } from 'lit';
import { componentDescription, propDescription } from '../../../stories-utils';
import type { BsCheckboxSize } from '../bs-checkbox';

interface BsCheckboxSkeletonArgs {
  size: BsCheckboxSize;
}

const sizes: BsCheckboxSize[] = ['sm', 'md', 'lg'];

const meta: Meta<BsCheckboxSkeletonArgs> = {
  title: 'Components/bs-checkbox-skeleton',
  parameters: { docs: { description: { component: componentDescription('bs-checkbox-skeleton') } } },
  render: args => html`<bs-checkbox-skeleton size=${args.size}></bs-checkbox-skeleton>`,
  argTypes: {
    size: { control: 'select', options: sizes, description: propDescription('bs-checkbox-skeleton', 'size') },
  },
  args: {
    size: 'lg',
  },
};

export default meta;
type Story = StoryObj<BsCheckboxSkeletonArgs>;

export const Default: Story = {};

export const Sizes: Story = {
  render: () => html`
    <div style="display:flex; flex-direction:column; gap:12px; align-items:flex-start;">
      <bs-checkbox-skeleton size="sm"></bs-checkbox-skeleton>
      <bs-checkbox-skeleton size="md"></bs-checkbox-skeleton>
      <bs-checkbox-skeleton size="lg"></bs-checkbox-skeleton>
    </div>
  `,
};
