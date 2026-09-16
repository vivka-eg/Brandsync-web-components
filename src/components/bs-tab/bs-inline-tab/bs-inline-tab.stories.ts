import type { Meta, StoryObj } from '@storybook/web-components-vite';
import { html, nothing } from 'lit';
import { componentDescription, propDescription } from '../../../stories-utils';

const homeIcon = html`
  <svg slot="icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
    <path d="M3 10.5L12 3L21 10.5" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
    <path d="M5 9V20H19V9" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
  </svg>
`;

interface BsInlineTabArgs {
  selected: boolean;
  disabled: boolean;
  icon: boolean;
  label: string;
  ariaLabel: string;
}

const meta: Meta<BsInlineTabArgs> = {
  title: 'Components/bs-tab/bs-inline-tab',
  parameters: { docs: { description: { component: componentDescription('bs-inline-tab') } } },
  // role="tab" is only valid ARIA inside a role="tablist" ancestor (axe-core flags a lone
  // bs-inline-tab as a critical aria-required-parent violation otherwise -- see
  // bs-inline-tab.mdx's Accessibility section). NOT display: contents -- that has a known
  // Chromium accessibility-tree quirk where it can strip the element's own role. A plain
  // block-level div has no visual effect worth avoiding here (each story below is a single
  // isolated demo, not part of a larger page layout).
  //
  // aria-label uses lit's `nothing` sentinel below, not null/'' -- a plain (non-boolean) lit
  // attribute binding renders null/'' as aria-label="" (present but empty), not an absent
  // attribute. axe-core then treats the light-DOM <bs-inline-tab> host as ARIA-meaningful in its
  // own right and stops looking inside its shadow root for the real role="tab", which surfaces as
  // an aria-required-children violation on the *parent* tablist -- a very confusing place to look.
  render: args => html`
    <div role="tablist">
      <bs-inline-tab ?selected=${args.selected} ?disabled=${args.disabled} aria-label=${args.ariaLabel || nothing}>
        ${args.icon ? homeIcon : ''}${args.label}
      </bs-inline-tab>
    </div>
  `,
  argTypes: {
    selected: { control: 'boolean', description: propDescription('bs-inline-tab', 'selected') },
    disabled: { control: 'boolean', description: propDescription('bs-inline-tab', 'disabled') },
    icon: { control: 'boolean', description: 'Toggles a leading icon (not a real attribute -- see the `icon` slot).' },
    label: { control: 'text', description: "Slotted label content (not a real attribute -- see the default slot)." },
    ariaLabel: { control: 'text', description: propDescription('bs-inline-tab', 'ariaLabel') },
  },
  args: {
    selected: false,
    disabled: false,
    icon: false,
    label: 'Overview',
    ariaLabel: '',
  },
};

export default meta;
type Story = StoryObj<BsInlineTabArgs>;

export const Default: Story = {};

export const WithIcon: Story = {
  name: 'With icon',
  args: { icon: true },
};

export const IconOnly: Story = {
  name: 'Icon only',
  args: { icon: true, label: '', ariaLabel: 'Home' },
};

export const Selected: Story = {
  args: { selected: true },
};

export const SelectedWithIcon: Story = {
  name: 'Selected with icon',
  args: { selected: true, icon: true },
};

export const Disabled: Story = {
  args: { disabled: true },
};

const groupTabLabels = ['Overview', 'Details', 'Settings', 'Archived'];

interface BsInlineTabGroupArgs {
  selectedTab: string;
  icon: boolean;
}

// A separate args shape from the single-tab stories above (this story renders 4 instances, not
// one) -- StoryObj is typed independently per export, so this doesn't need to fit BsInlineTabArgs.
export const Group: StoryObj<BsInlineTabGroupArgs> = {
  name: 'Tab group',
  argTypes: {
    selectedTab: {
      control: 'select',
      options: groupTabLabels,
      description: 'Which tab is selected (Archived is disabled and cannot be selected).',
    },
    icon: { control: 'boolean', description: 'Toggles a leading icon on every tab in the group (not a real attribute -- see the `icon` slot).' },
  },
  args: {
    selectedTab: 'Overview',
    icon: false,
  },
  // The group bar itself (background, pill-shaped padding/radius) is now owned by <bs-tabs
  // type="bs-inline-tab">, not styled by hand here -- see bs-tabs.mdx for the redline this
  // reproduces.
  render: args => html`
    <bs-tabs type="bs-inline-tab">
      ${groupTabLabels.map(
        label => html`
          <bs-inline-tab ?selected=${label === args.selectedTab} ?disabled=${label === 'Archived'}>
            ${args.icon ? homeIcon : ''}${label}
          </bs-inline-tab>
        `,
      )}
    </bs-tabs>
  `,
};
