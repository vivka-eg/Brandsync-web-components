import type { Meta, StoryObj } from '@storybook/web-components-vite';
import { html } from 'lit';
import { componentDescription, propDescription } from '../../stories-utils';
import type { BsBadgeVariant } from './bs-badge';

interface BsBadgeArgs {
  variant: BsBadgeVariant;
  label: string;
}

const variants: BsBadgeVariant[] = ['default', 'primary', 'success', 'warning', 'info', 'error', 'neutral', 'inverse'];

const meta: Meta<BsBadgeArgs> = {
  title: 'Components/bs-badge',
  parameters: { docs: { description: { component: componentDescription('bs-badge') } } },
  render: args => html`<bs-badge variant=${args.variant}>${args.label}</bs-badge>`,
  argTypes: {
    variant: {
      control: 'select',
      options: variants,
      description: propDescription('bs-badge', 'variant'),
    },
    label: { control: 'text', description: 'Slotted label content (not a real attribute -- see the default slot).' },
  },
  args: {
    variant: 'primary',
    label: 'New',
  },
};

export default meta;
type Story = StoryObj<BsBadgeArgs>;

export const Primary: Story = {};

export const DefaultVariant: Story = {
  args: { variant: 'default', label: 'Default' },
};

export const Success: Story = {
  args: { variant: 'success', label: 'Active' },
};

export const Warning: Story = {
  args: { variant: 'warning', label: 'Pending' },
};

export const Info: Story = {
  args: { variant: 'info', label: 'Info' },
};

export const Error: Story = {
  args: { variant: 'error', label: 'Failed' },
};

export const Neutral: Story = {
  args: { variant: 'neutral', label: 'Archived' },
};

export const Inverse: Story = {
  args: { variant: 'inverse', label: 'Inverse' },
  parameters: {
    // Inverse pairs a light label with a dark background -- render it on a dark surface so it's
    // legible in the docs canvas instead of looking like an accessibility bug against the default
    // (light) Storybook canvas background.
    backgrounds: { default: 'dark' },
  },
};

export const AllVariants: Story = {
  render: () => html`
    <div style="display:flex; gap:8px; flex-wrap:wrap;">
      <bs-badge variant="default">Default</bs-badge>
      <bs-badge variant="primary">Primary</bs-badge>
      <bs-badge variant="success">Success</bs-badge>
      <bs-badge variant="warning">Warning</bs-badge>
      <bs-badge variant="info">Info</bs-badge>
      <bs-badge variant="error">Error</bs-badge>
      <bs-badge variant="neutral">Neutral</bs-badge>
      <bs-badge variant="inverse">Inverse</bs-badge>
    </div>
  `,
};

export const LongText: Story = {
  name: 'Long text (edge case)',
  args: {
    variant: 'primary',
    label: 'This is a much longer status label than a badge is designed to hold',
  },
  render: args => html`
    <div style="max-width: 160px;">
      <bs-badge variant=${args.variant}>${args.label}</bs-badge>
    </div>
  `,
};
