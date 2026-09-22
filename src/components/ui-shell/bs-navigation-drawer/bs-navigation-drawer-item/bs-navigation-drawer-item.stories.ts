import type { Meta, StoryObj } from '@storybook/web-components-vite';
import { html } from 'lit';
import { componentDescription, propDescription } from '../../../../stories-utils';

const bookIcon = html`
  <svg slot="icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
    <path
      d="M4 4.5C4 3.67157 4.67157 3 5.5 3H18.5C19.3284 3 20 3.67157 20 4.5V19.5C20 20.3284 19.3284 21 18.5 21H5.5C4.67157 21 4 20.3284 4 19.5V4.5Z"
      stroke="currentColor"
      stroke-width="1.5"
    />
    <path d="M8 3V21" stroke="currentColor" stroke-width="1.5" />
  </svg>
`;

interface BsNavigationDrawerItemArgs {
  label: string;
  selected: boolean;
  expandable: boolean;
  expanded: boolean;
  nested: boolean;
  icon: boolean;
  collapsed: boolean;
}

const meta: Meta<BsNavigationDrawerItemArgs> = {
  title: 'UI Shell/bs-navigation-drawer/bs-navigation-drawer-item',
  parameters: { docs: { description: { component: componentDescription('bs-navigation-drawer-item') } } },
  render: args => html`
    <bs-navigation-drawer-item
      ?selected=${args.selected}
      ?expandable=${args.expandable}
      ?expanded=${args.expanded}
      ?nested=${args.nested}
      ?collapsed=${args.collapsed}
      style="width: ${args.collapsed ? '85px' : '248px'}; display: block;"
    >
      ${args.icon ? bookIcon : ''}${args.label}
    </bs-navigation-drawer-item>
  `,
  argTypes: {
    label: { control: 'text', description: 'Slotted label content (not a real attribute -- see the default slot).' },
    selected: { control: 'boolean', description: propDescription('bs-navigation-drawer-item', 'selected') },
    expandable: { control: 'boolean', description: propDescription('bs-navigation-drawer-item', 'expandable') },
    expanded: { control: 'boolean', description: propDescription('bs-navigation-drawer-item', 'expanded') },
    nested: { control: 'boolean', description: propDescription('bs-navigation-drawer-item', 'nested') },
    icon: { control: 'boolean', description: 'Toggles a leading icon (not a real attribute -- see the `icon` slot).' },
    collapsed: { control: 'boolean', description: propDescription('bs-navigation-drawer-item', 'collapsed') },
  },
  args: {
    label: 'Introduction',
    selected: false,
    expandable: false,
    expanded: false,
    nested: false,
    icon: true,
    collapsed: false,
  },
};

export default meta;
type Story = StoryObj<BsNavigationDrawerItemArgs>;

export const Default: Story = {};

export const Selected: Story = {
  args: { selected: true },
};

export const Expandable: Story = {
  name: 'Expandable (group header)',
  args: { expandable: true, icon: true, label: 'Components' },
};

export const ExpandableWithChildren: Story = {
  name: 'Expandable with nested children',
  render: () => html`
    <bs-navigation-drawer-item expandable expanded style="width: 248px; display: block;">
      ${bookIcon} Components
      <bs-navigation-drawer-item slot="children" nested>Button</bs-navigation-drawer-item>
      <bs-navigation-drawer-item slot="children" nested selected>Checkbox</bs-navigation-drawer-item>
      <bs-navigation-drawer-item slot="children" nested>Switch</bs-navigation-drawer-item>
    </bs-navigation-drawer-item>
  `,
};

export const Nested: Story = {
  name: 'Nested (child row)',
  args: { nested: true, icon: false, label: 'Button' },
};

export const IconOnlyLabelSpace: Story = {
  name: 'No icon (space not reserved)',
  args: { icon: false, label: 'Accessibility' },
};

export const Collapsed: Story = {
  name: 'Collapsed (icon above caption)',
  args: { collapsed: true, selected: true, label: 'Introduction' },
};
