import type { Meta, StoryObj } from '@storybook/web-components-vite';
import { html } from 'lit';
import { componentDescription, propDescription } from '../../stories-utils';

interface BsChatbotHeaderArgs {
  heading: string;
}

const meta: Meta<BsChatbotHeaderArgs> = {
  title: 'Genie AI Components/bs-chatbot-header',
  parameters: { docs: { description: { component: componentDescription('bs-chatbot-header') } } },
  render: args => html` <bs-chatbot-header heading=${args.heading}></bs-chatbot-header> `,
  argTypes: {
    heading: { control: 'text', description: propDescription('bs-chatbot-header', 'heading') },
  },
  args: {
    heading: 'Genie',
  },
};

export default meta;
type Story = StoryObj<BsChatbotHeaderArgs>;

export const Default: Story = {};

export const WithComposer: Story = {
  name: 'Chat panel (header + composer)',
  render: () => {
    // Demonstrates the intended integration pattern: bs-chatbot-header only tracks/emits the
    // expanded toggle -- it has no visibility into the surrounding layout, so it can't resize
    // anything itself. The consuming app (here, this story) owns the chat panel container and is
    // responsible for actually resizing it in response to bsExpand.
    const onExpand = (ev: CustomEvent<boolean>) => {
      const panel = (ev.currentTarget as HTMLElement).closest('.story-chat-panel') as HTMLElement;
      if (!panel) return;
      if (ev.detail) {
        panel.style.width = '100vw';
        panel.style.height = '100vh';
        panel.style.maxWidth = '100vw';
        panel.style.borderRadius = '0';
      } else {
        panel.style.width = '420px';
        panel.style.height = '600px';
        panel.style.maxWidth = '420px';
        panel.style.borderRadius = '12px';
      }
    };

    return html`
      <div
        class="story-chat-panel"
        style="display:flex; flex-direction:column; width: 420px; height: 600px; border: 1px solid #e5e5e5; border-radius: 12px; overflow: hidden; transition: width 0.2s, height 0.2s;"
      >
        <bs-chatbot-header heading="Genie" @bsExpand=${onExpand}></bs-chatbot-header>
        <div style="flex: 1; min-height: 0;"></div>
        <div style="padding: 16px;">
          <bs-composer variant="ai" aria-label="Message"></bs-composer>
        </div>
      </div>
    `;
  },
};
