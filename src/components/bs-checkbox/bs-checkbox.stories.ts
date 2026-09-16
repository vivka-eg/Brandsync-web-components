import type { Meta, StoryObj } from '@storybook/web-components-vite';
import { html } from 'lit';
import { componentDescription, propDescription } from '../../stories-utils';

type BsCheckboxSize = 'sm' | 'md' | 'lg';

const sizes: BsCheckboxSize[] = ['sm', 'md', 'lg'];

interface BsCheckboxArgs {
  size: BsCheckboxSize;
  checked: boolean;
  indeterminate: boolean;
  disabled: boolean;
  error: boolean;
  label: string;
}

const meta: Meta<BsCheckboxArgs> = {
  title: 'Components/bs-checkbox',
  parameters: { docs: { description: { component: componentDescription('bs-checkbox') } } },
  render: args => html`
    <bs-checkbox
      size=${args.size}
      ?checked=${args.checked}
      .indeterminate=${args.indeterminate}
      ?disabled=${args.disabled}
      ?error=${args.error}
    >
      ${args.label}
    </bs-checkbox>
  `,
  argTypes: {
    size: { control: 'select', options: sizes, description: propDescription('bs-checkbox', 'size') },
    checked: { control: 'boolean', description: propDescription('bs-checkbox', 'checked') },
    indeterminate: { control: 'boolean', description: propDescription('bs-checkbox', 'indeterminate') },
    disabled: { control: 'boolean', description: propDescription('bs-checkbox', 'disabled') },
    error: { control: 'boolean', description: propDescription('bs-checkbox', 'error') },
    label: { control: 'text' },
  },
  args: {
    size: 'lg',
    checked: false,
    indeterminate: false,
    disabled: false,
    error: false,
    label: 'Accept terms and conditions',
  },
};

export default meta;
type Story = StoryObj<BsCheckboxArgs>;

export const Default: Story = {};

export const Checked: Story = {
  args: { checked: true },
};

export const Indeterminate: Story = {
  args: { indeterminate: true },
};

export const Disabled: Story = {
  args: { disabled: true },
};

export const DisabledChecked: Story = {
  name: 'Disabled + checked',
  args: { disabled: true, checked: true },
};

export const Error: Story = {
  args: { error: true },
};

export const ErrorChecked: Story = {
  name: 'Error + checked',
  args: { error: true, checked: true },
};

export const Small: Story = {
  args: { size: 'sm', checked: true },
};

export const Medium: Story = {
  args: { size: 'md', checked: true },
};

export const Large: Story = {
  args: { size: 'lg', checked: true },
};
