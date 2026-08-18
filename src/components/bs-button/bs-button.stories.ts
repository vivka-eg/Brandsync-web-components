import type { Meta, StoryObj } from '@storybook/web-components-vite';
import { html } from 'lit';
import { componentDescription, propDescription } from '../../stories-utils';

interface BsButtonArgs {
  variant: 'primary' | 'neutral';
  size: 'sm' | 'md' | 'lg';
  disabled: boolean;
  label: string;
}

const meta: Meta<BsButtonArgs> = {
  title: 'Components/bs-button',
  parameters: { docs: { description: { component: componentDescription('bs-button') } } },
  render: args => html`
    <bs-button variant=${args.variant} size=${args.size} ?disabled=${args.disabled}>
      ${args.label}
    </bs-button>
  `,
  argTypes: {
    variant: { control: 'select', options: ['primary', 'neutral'], description: propDescription('bs-button', 'variant') },
    size: { control: 'select', options: ['sm', 'md', 'lg'], description: propDescription('bs-button', 'size') },
    disabled: { control: 'boolean', description: propDescription('bs-button', 'disabled') },
    label: { control: 'text', description: 'Slotted label content (not a real attribute -- see the default slot).' },
  },
  args: {
    variant: 'primary',
    size: 'md',
    disabled: false,
    label: 'Click me',
  },
};

export default meta;
type Story = StoryObj<BsButtonArgs>;

export const Primary: Story = {};

export const Neutral: Story = {
  args: { variant: 'neutral' },
};

export const Disabled: Story = {
  args: { disabled: true },
};

export const Sizes: Story = {
  render: () => html`
    <div style="display:flex; gap:12px; align-items:center;">
      <bs-button size="sm">Small</bs-button>
      <bs-button size="md">Medium</bs-button>
      <bs-button size="lg">Large</bs-button>
    </div>
  `,
};
