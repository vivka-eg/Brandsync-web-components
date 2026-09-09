import type { Meta, StoryObj } from '@storybook/web-components-vite';
import { html } from 'lit';
import { componentDescription } from '../../stories-utils';

interface BsTooltipArgs {
  message: string;
}

const meta: Meta<BsTooltipArgs> = {
  title: 'Components/bs-tooltip',
  parameters: { docs: { description: { component: componentDescription('bs-tooltip') } } },
  render: args => html`<bs-tooltip>${args.message}</bs-tooltip>`,
  argTypes: {
    message: { control: 'text', description: 'Slotted message content (not a real attribute -- see the default slot).' },
  },
  args: {
    message: "I'm a tooltip. I show extra information when you hover or focus.",
  },
};

export default meta;
type Story = StoryObj<BsTooltipArgs>;

export const Default: Story = {};

export const WithTrigger: Story = {
  name: 'Positioned against a trigger (consumer pattern)',
  render: () => html`
    <div style="position: relative; display: inline-block;">
      <bs-button>Hover me</bs-button>
      <div style="position: absolute; top: calc(100% + 6px); left: 50%; transform: translateX(-50%);">
        <bs-tooltip>I'm a tooltip. I show extra information when you hover or focus.</bs-tooltip>
      </div>
    </div>
  `,
};
