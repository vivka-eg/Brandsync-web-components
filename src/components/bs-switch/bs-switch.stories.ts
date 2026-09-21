import type { Meta, StoryObj } from '@storybook/web-components-vite';
import { html } from 'lit';
import { componentDescription, propDescription } from '../../stories-utils';

type BsSwitchSize = 'md' | 'lg';

const sizes: BsSwitchSize[] = ['md', 'lg'];

interface BsSwitchArgs {
  size: BsSwitchSize;
  checked: boolean;
  disabled: boolean;
  label: string;
}

const meta: Meta<BsSwitchArgs> = {
  title: 'Components/bs-switch',
  parameters: { docs: { description: { component: componentDescription('bs-switch') } } },
  render: args => html`
    <bs-switch size=${args.size} ?checked=${args.checked} ?disabled=${args.disabled}>
      ${args.label}
    </bs-switch>
  `,
  argTypes: {
    size: { control: 'select', options: sizes, description: propDescription('bs-switch', 'size') },
    checked: { control: 'boolean', description: propDescription('bs-switch', 'checked') },
    disabled: { control: 'boolean', description: propDescription('bs-switch', 'disabled') },
    label: { control: 'text' },
  },
  args: {
    size: 'lg',
    checked: false,
    disabled: false,
    label: 'Enable notifications',
  },
};

export default meta;
type Story = StoryObj<BsSwitchArgs>;

export const Default: Story = {};

export const Checked: Story = {
  args: { checked: true },
};

export const Disabled: Story = {
  args: { disabled: true },
};

export const Medium: Story = {
  args: { size: 'md', checked: true },
};

export const Large: Story = {
  args: { size: 'lg', checked: true },
};

export const AllCombinations: Story = {
  name: 'All combinations',
  render: () => html`
    <div style="display: grid; grid-template-columns: repeat(5, auto); gap: 24px; align-items: center;">
      <span></span>
      <strong>Unchecked</strong>
      <strong>Checked</strong>
      <strong>Disabled</strong>
      <strong>Disabled + checked</strong>
      <strong>Md</strong>
      <bs-switch size="md"></bs-switch>
      <bs-switch size="md" checked></bs-switch>
      <bs-switch size="md" disabled></bs-switch>
      <bs-switch size="md" disabled checked></bs-switch>
      <strong>Lg</strong>
      <bs-switch size="lg"></bs-switch>
      <bs-switch size="lg" checked></bs-switch>
      <bs-switch size="lg" disabled></bs-switch>
      <bs-switch size="lg" disabled checked></bs-switch>
    </div>
  `,
};
