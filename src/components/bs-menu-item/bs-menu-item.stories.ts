import type { Meta, StoryObj } from '@storybook/web-components-vite';
import { html } from 'lit';
import { componentDescription } from '../../stories-utils';

const meta: Meta = {
  title: 'Components/bs-menu-item',
  parameters: { docs: { description: { component: componentDescription('bs-menu-item') } } },
  render: () => html` <bs-menu-item style="width: 210px;">Read aloud</bs-menu-item> `,
};

export default meta;
type Story = StoryObj;

export const Default: Story = {};

export const WithIcon: Story = {
  name: 'With an icon',
  render: () => html`
    <bs-menu-item style="width: 210px;">
      <svg slot="icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
        <path
          d="M7.5 15.75H3C2.80109 15.75 2.61032 15.671 2.46967 15.5303C2.32902 15.3897 2.25 15.1989 2.25 15V9C2.25 8.80109 2.32902 8.61032 2.46967 8.46967C2.61032 8.32902 2.80109 8.25 3 8.25H7.5L14.25 3V21L7.5 15.75Z"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
        <path d="M7.5 8.25V15.75" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
      </svg>
      Read aloud
    </bs-menu-item>
  `,
};

export const InAMenu: Story = {
  name: 'In a bs-menu',
  render: () => html`
    <bs-menu style="width: 210px;">
      <bs-menu-item>Read aloud</bs-menu-item>
      <bs-menu-item>Chat with a human</bs-menu-item>
      <bs-menu-item>Raise a ticket</bs-menu-item>
    </bs-menu>
  `,
};
