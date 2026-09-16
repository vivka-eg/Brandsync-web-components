import type { Meta, StoryObj } from '@storybook/web-components-vite';
import { html, nothing } from 'lit';
import { componentDescription, propDescription } from '../../../stories-utils';
import type { BsTabIconPosition } from './bs-tab';

const iconPositions: BsTabIconPosition[] = ['start', 'top'];
// `start`/`top` are the real prop values, but "Horizontal"/"Vertical" is what the layout actually
// looks like -- Storybook's select control supports a separate display-label map for this.
const iconPositionLabels: Record<BsTabIconPosition, string> = { start: 'Horizontal', top: 'Vertical' };

const homeIcon = html`
  <svg slot="icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
    <path d="M3 10.5L12 3L21 10.5" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
    <path d="M5 9V20H19V9" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
  </svg>
`;

interface BsTabArgs {
  selected: boolean;
  disabled: boolean;
  icon: boolean;
  iconPosition: BsTabIconPosition;
  badge: boolean;
  label: string;
  ariaLabel: string;
}

const meta: Meta<BsTabArgs> = {
  title: 'Components/bs-tab/bs-tab',
  parameters: { docs: { description: { component: componentDescription('bs-tab') } } },
  // role="tab" is only valid ARIA inside a role="tablist" ancestor (axe-core flags a lone bs-tab
  // as a critical aria-required-parent violation otherwise -- see bs-tab.mdx's Accessibility
  // section). NOT display: contents -- that has a known Chromium accessibility-tree quirk where
  // it can strip the element's own role. A plain block-level div has no visual effect worth
  // avoiding here (each story below is a single isolated demo, not part of a larger page layout).
  //
  // aria-label uses lit's `nothing` sentinel below, not null/'' -- a plain (non-boolean) lit
  // attribute binding renders null/'' as aria-label="" (present but empty), not an absent
  // attribute. axe-core then treats the light-DOM <bs-tab> host as ARIA-meaningful in its own
  // right and stops looking inside its shadow root for the real role="tab", which surfaces as an
  // aria-required-children violation on the *parent* tablist -- a very confusing place to look.
  render: args => html`
    <div role="tablist">
      <bs-tab
        ?selected=${args.selected}
        ?disabled=${args.disabled}
        icon-position=${args.iconPosition}
        aria-label=${args.ariaLabel || nothing}
      >
        ${args.icon ? homeIcon : ''}${args.label}
        ${args.badge ? html`<bs-badge slot="badge" variant="primary">3</bs-badge>` : ''}
      </bs-tab>
    </div>
  `,
  argTypes: {
    selected: { control: 'boolean', description: propDescription('bs-tab', 'selected') },
    disabled: { control: 'boolean', description: propDescription('bs-tab', 'disabled') },
    icon: { control: 'boolean', description: 'Toggles an icon (not a real attribute -- see the `icon` slot).' },
    iconPosition: {
      control: { type: 'select', labels: iconPositionLabels },
      options: iconPositions,
      description: propDescription('bs-tab', 'iconPosition'),
    },
    badge: { control: 'boolean', description: 'Toggles a trailing badge (not a real attribute -- see the `badge` slot).' },
    label: { control: 'text', description: "Slotted label content (not a real attribute -- see the default slot)." },
    ariaLabel: { control: 'text', description: propDescription('bs-tab', 'ariaLabel') },
  },
  args: {
    selected: false,
    disabled: false,
    icon: false,
    iconPosition: 'start',
    badge: false,
    label: 'Overview',
    ariaLabel: '',
  },
};

export default meta;
type Story = StoryObj<BsTabArgs>;

export const Default: Story = {};

export const IconOnly: Story = {
  name: 'Icon only',
  args: { icon: true, label: '', ariaLabel: 'Home' },
};

export const IconAndTextHorizontal: Story = {
  name: 'Icon and text (horizontal)',
  args: { icon: true },
};

export const IconAndTextVertical: Story = {
  name: 'Icon and text (vertical)',
  args: { icon: true, iconPosition: 'top' },
};

export const Selected: Story = {
  args: { selected: true },
};

export const Disabled: Story = {
  args: { disabled: true },
};

export const WithBadge: Story = {
  name: 'With a badge',
  args: { badge: true, label: 'Inbox' },
};

const groupTabLabels = ['Overview', 'Details', 'Settings', 'Archived'];

type BsTabGroupOrientation = 'horizontal' | 'vertical';
const groupOrientations: BsTabGroupOrientation[] = ['horizontal', 'vertical'];
const groupOrientationLabels: Record<BsTabGroupOrientation, string> = { horizontal: 'Horizontal', vertical: 'Vertical' };

interface BsTabGroupArgs {
  selectedTab: string;
  icon: boolean;
  iconPosition: BsTabIconPosition;
  badge: boolean;
  groupOrientation: BsTabGroupOrientation;
}

// A separate args shape from the single-tab stories above (this story renders 4 instances, not
// one) -- StoryObj is typed independently per export, so this doesn't need to fit BsTabArgs.
//
// `groupOrientation` is a story-only concept, not a bs-tab prop: it's the layout direction of the
// TAB BAR itself (a horizontal row of tabs across the top vs. a vertical stack, e.g. a sidebar
// tab list) -- distinct from `iconPosition`, which is about the icon/label arrangement WITHIN one
// tab. It's fed straight into <bs-tabs orientation=...>, which owns this layout.
export const Group: StoryObj<BsTabGroupArgs> = {
  name: 'Tab group',
  argTypes: {
    selectedTab: {
      control: 'select',
      options: groupTabLabels,
      description: 'Which tab is selected (Archived is disabled and cannot be selected).',
    },
    icon: { control: 'boolean', description: 'Toggles an icon on every tab in the group (not a real attribute -- see the `icon` slot).' },
    iconPosition: {
      control: { type: 'select', labels: iconPositionLabels },
      options: iconPositions,
      description: propDescription('bs-tab', 'iconPosition'),
    },
    badge: {
      control: 'boolean',
      description: 'Toggles a badge on every tab in the group (not a real attribute -- see the `badge` slot).',
    },
    groupOrientation: {
      control: { type: 'select', labels: groupOrientationLabels },
      options: groupOrientations,
      description: 'Layout direction of the tab bar itself (not a bs-tab prop -- see the note above this story).',
    },
  },
  args: {
    selectedTab: 'Overview',
    icon: false,
    iconPosition: 'start',
    badge: false,
    groupOrientation: 'horizontal',
  },
  render: args => html`
    <bs-tabs type="bs-tab" orientation=${args.groupOrientation}>
      ${groupTabLabels.map(
        label => html`
          <bs-tab ?selected=${label === args.selectedTab} ?disabled=${label === 'Archived'} icon-position=${args.iconPosition}>
            ${args.icon ? homeIcon : ''}${label}
            ${args.badge ? html`<bs-badge slot="badge" variant="primary">3</bs-badge>` : ''}
          </bs-tab>
        `,
      )}
    </bs-tabs>
  `,
};
