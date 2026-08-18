import type { Meta, StoryObj } from '@storybook/web-components-vite';
import { html } from 'lit';
import { componentDescription, propDescription } from '../../stories-utils';

interface BsBadgeArgs {
  variant: 'default' | 'primary' | 'success' | 'warning' | 'info' | 'error' | 'neutral' | 'inverse';
  label: string;
}

const meta: Meta<BsBadgeArgs> = {
  title: 'Components/bs-badge',
  parameters: { docs: { description: { component: componentDescription('bs-badge') } } },
  render: args => html`<bs-badge variant=${args.variant}>${args.label}</bs-badge>`,
  argTypes: {
    variant: {
      control: 'select',
      options: ['default', 'primary', 'success', 'warning', 'info', 'error', 'neutral', 'inverse'],
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
