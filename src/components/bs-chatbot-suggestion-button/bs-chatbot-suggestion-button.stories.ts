import type { Meta, StoryObj } from '@storybook/web-components-vite';
import { html } from 'lit';
import { componentDescription, propDescription } from '../../stories-utils';

interface BsChatbotSuggestionButtonArgs {
  label: string;
  disabled: boolean;
}

const meta: Meta<BsChatbotSuggestionButtonArgs> = {
  title: 'Genie AI Components/bs-chatbot-suggestion-button',
  parameters: { docs: { description: { component: componentDescription('bs-chatbot-suggestion-button') } } },
  render: args => html`
    <bs-chatbot-suggestion-button ?disabled=${args.disabled}>${args.label}</bs-chatbot-suggestion-button>
  `,
  argTypes: {
    label: { control: 'text', description: 'Default slot: the suggestion label text.' },
    disabled: { control: 'boolean', description: propDescription('bs-chatbot-suggestion-button', 'disabled') },
  },
  args: {
    label: 'How can I help you?',
    disabled: false,
  },
};

export default meta;
type Story = StoryObj<BsChatbotSuggestionButtonArgs>;

export const Default: Story = {};

export const SuggestionRow: Story = {
  name: 'Multiple suggestions (flex-wrap row)',
  render: () => html`
    <div style="display: flex; flex-wrap: wrap; gap: 8px; max-width: 420px;">
      <bs-chatbot-suggestion-button>How can I help you?</bs-chatbot-suggestion-button>
      <bs-chatbot-suggestion-button>Summarize this document</bs-chatbot-suggestion-button>
      <bs-chatbot-suggestion-button>Draft a follow-up email</bs-chatbot-suggestion-button>
      <bs-chatbot-suggestion-button>Explain this in simple terms</bs-chatbot-suggestion-button>
    </div>
  `,
};
