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
      <bs-button slot="footer" variant="subtle" size="sm">Cancel</bs-button>
      <bs-button slot="footer" variant="outlined" size="sm">View details</bs-button>
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

// A real photo (Unsplash, free-to-use license) -- verified this URL resolves (200, image/jpeg)
// before using it. Presence of the image slot's content is what shows the hero image, not a prop.
const heroImage = 'https://images.unsplash.com/photo-1660496247667-3fb697c396af?fm=jpg&q=80&w=640&h=360&fit=crop&auto=format';

export const WithImage: Story = {
  name: 'With image',
  render: args => html`
    <bs-card surface=${args.surface} style="max-width: 320px;">
      <img slot="image" src=${heroImage} alt="" />
      <strong slot="header">Booking confirmed</strong>
      <p>Meeting Room 4B is reserved for 2:00pm - 3:00pm.</p>
      <bs-button slot="footer" variant="subtle" size="sm">Cancel</bs-button>
      <bs-button slot="footer" variant="outlined" size="sm">View details</bs-button>
    </bs-card>
  `,
};
