import type { Meta, StoryObj } from '@storybook/web-components-vite';
import { html } from 'lit';
import { componentDescription } from '../../stories-utils';

interface BsAiDisclaimerArgs {
  text: string;
}

const meta: Meta<BsAiDisclaimerArgs> = {
  title: 'Genie AI Components/bs-ai-disclaimer',
  parameters: { docs: { description: { component: componentDescription('bs-ai-disclaimer') } } },
  render: args => html` <bs-ai-disclaimer>${args.text}</bs-ai-disclaimer> `,
  argTypes: {
    text: { control: 'text', description: 'Default slot: the disclaimer text/content.' },
  },
  args: {
    text: 'AI can make mistakes. Please verify important information.',
  },
};

export default meta;
type Story = StoryObj<BsAiDisclaimerArgs>;

export const Default: Story = {};
