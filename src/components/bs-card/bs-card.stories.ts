import type { Meta, StoryObj } from '@storybook/web-components-vite';
import { html } from 'lit';
import { componentDescription, propDescription } from '../../stories-utils';

interface BsCardArgs {
  surface: 'base' | 'raised' | 'container';
}

const meta: Meta<BsCardArgs> = {
  title: 'Components/bs-card',
  parameters: { docs: { description: { component: componentDescription('bs-card') } } },
  render: args => html`
    <bs-card surface=${args.surface} style="max-width: 320px;">
      <strong slot="header">Booking confirmed</strong>
      <p>Meeting Room 4B is reserved for 2:00pm - 3:00pm.</p>
      <bs-button slot="footer" size="sm">View details</bs-button>
    </bs-card>
  `,
  argTypes: {
    surface: { control: 'select', options: ['base', 'raised', 'container'], description: propDescription('bs-card', 'surface') },
  },
  args: {
    surface: 'raised',
  },
};

export default meta;
type Story = StoryObj<BsCardArgs>;

export const Raised: Story = {};

export const Base: Story = {
  args: { surface: 'base' },
};

export const Container: Story = {
  args: { surface: 'container' },
};
