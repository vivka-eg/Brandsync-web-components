import type { Meta, StoryObj } from '@storybook/web-components-vite';
import { html } from 'lit';
import { componentDescription, propDescription } from '../../stories-utils';

interface BsAiGreetingArgs {
  assistantName: string;
  productName: string;
}

const meta: Meta<BsAiGreetingArgs> = {
  title: 'Genie AI Components/bs-ai-greeting',
  parameters: { docs: { description: { component: componentDescription('bs-ai-greeting') } } },
  render: args => html`
    <bs-ai-greeting assistant-name=${args.assistantName} product-name=${args.productName || undefined}></bs-ai-greeting>
  `,
  argTypes: {
    assistantName: { control: 'text', description: propDescription('bs-ai-greeting', 'assistantName') },
    productName: { control: 'text', description: propDescription('bs-ai-greeting', 'productName') },
  },
  args: {
    assistantName: 'Genie',
    productName: 'Brandsync',
  },
};

export default meta;
type Story = StoryObj<BsAiGreetingArgs>;

export const Default: Story = {};

export const WithoutProductName: Story = {
  name: 'Without product name',
  args: { productName: '' },
};
