import type { Meta, StoryObj } from '@storybook/web-components-vite';
import { html } from 'lit';
import { componentDescription, propDescription } from '../../../stories-utils';
import type { BsTabsOrientation, BsTabsType } from './bs-tabs';

const types: BsTabsType[] = ['bs-tab', 'bs-inline-tab'];
const orientations: BsTabsOrientation[] = ['horizontal', 'vertical'];

const tabLabels = ['Overview', 'Details', 'Settings', 'Archived'];

interface BsTabsArgs {
  type: BsTabsType;
  orientation: BsTabsOrientation;
  selectedTab: string;
}

const meta: Meta<BsTabsArgs> = {
  title: 'Components/bs-tab/bs-tabs',
  parameters: { docs: { description: { component: componentDescription('bs-tabs') } } },
  render: args => html`
    <bs-tabs type=${args.type} orientation=${args.orientation}>
      ${tabLabels.map(label =>
        args.type === 'bs-inline-tab'
          ? html`<bs-inline-tab ?selected=${label === args.selectedTab} ?disabled=${label === 'Archived'}>${label}</bs-inline-tab>`
          : html`<bs-tab ?selected=${label === args.selectedTab} ?disabled=${label === 'Archived'}>${label}</bs-tab>`,
      )}
    </bs-tabs>
  `,
  argTypes: {
    type: { control: 'select', options: types, description: propDescription('bs-tabs', 'type') },
    orientation: { control: 'select', options: orientations, description: propDescription('bs-tabs', 'orientation') },
    selectedTab: {
      control: 'select',
      options: tabLabels,
      description: 'Which tab is selected (Archived is disabled and cannot be selected).',
    },
  },
  args: {
    type: 'bs-tab',
    orientation: 'horizontal',
    selectedTab: 'Overview',
  },
};

export default meta;
type Story = StoryObj<BsTabsArgs>;

export const Default: Story = {};

export const InlineTabGroup: Story = {
  name: 'Inline tab group',
  args: { type: 'bs-inline-tab' },
};

export const Vertical: Story = {
  args: { orientation: 'vertical' },
};
