import type { Meta, StoryObj } from '@storybook/web-components-vite';
import { html } from 'lit';
import { componentDescription, propDescription } from '../../stories-utils';

interface BsAiThinkingArgs {
  label: string;
}

const meta: Meta<BsAiThinkingArgs> = {
  title: 'Genie AI Components/bs-ai-thinking',
  parameters: { docs: { description: { component: componentDescription('bs-ai-thinking') } } },
  render: args => html` <bs-ai-thinking label=${args.label}></bs-ai-thinking> `,
  argTypes: {
    label: { control: 'text', description: propDescription('bs-ai-thinking', 'label') },
  },
  args: {
    label: 'Retrieving',
  },
};

export default meta;
type Story = StoryObj<BsAiThinkingArgs>;

export const Default: Story = {};

export const Thinking: Story = {
  args: { label: 'Thinking' },
};

export const Searching: Story = {
  args: { label: 'Searching' },
};
