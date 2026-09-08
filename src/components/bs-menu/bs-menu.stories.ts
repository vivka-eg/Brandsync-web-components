import type { Meta, StoryObj } from '@storybook/web-components-vite';
import { html } from 'lit';
import { componentDescription } from '../../stories-utils';

const meta: Meta = {
  title: 'Components/bs-menu',
  parameters: { docs: { description: { component: componentDescription('bs-menu') } } },
  render: () => html`
    <bs-menu style="width: 210px;">
      <bs-menu-item>Read aloud</bs-menu-item>
      <bs-menu-item>Chat with a human</bs-menu-item>
      <bs-menu-item>Raise a ticket</bs-menu-item>
    </bs-menu>
  `,
};

export default meta;
type Story = StoryObj;

export const Default: Story = {};
