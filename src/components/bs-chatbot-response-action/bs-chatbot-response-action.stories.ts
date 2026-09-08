import type { Meta, StoryObj } from '@storybook/web-components-vite';
import { html } from 'lit';
import { componentDescription, propDescription } from '../../stories-utils';

interface BsChatbotResponseActionArgs {
  sourcesCount: number;
}

const meta: Meta<BsChatbotResponseActionArgs> = {
  title: 'Genie AI Components/bs-chatbot-response-action',
  parameters: { docs: { description: { component: componentDescription('bs-chatbot-response-action') } } },
  render: args => html` <bs-chatbot-response-action sources-count=${args.sourcesCount || undefined}></bs-chatbot-response-action> `,
  argTypes: {
    sourcesCount: { control: 'number', description: propDescription('bs-chatbot-response-action', 'sources-count') },
  },
  args: {
    sourcesCount: 3,
  },
};

export default meta;
type Story = StoryObj<BsChatbotResponseActionArgs>;

export const Default: Story = {};

export const NoSources: Story = {
  name: 'Without sources',
  args: {
    sourcesCount: 0,
  },
};

export const InResponseMessage: Story = {
  name: 'In an AI response message',
  render: () => html`
    <div style="max-width: 480px; font-family: sans-serif;">
      <p style="margin: 0; color: #1a1a1a; font-size: 14px; line-height: 20px;">
        This is a placeholder AI response message. It demonstrates how the action row sits directly below the
        response text, aligned to the left edge of the message.
      </p>
      <bs-chatbot-response-action sources-count="3"></bs-chatbot-response-action>
    </div>
  `,
};
