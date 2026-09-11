import type { Meta, StoryObj } from '@storybook/web-components-vite';
import { html } from 'lit';
import { componentDescription, propDescription } from '../../stories-utils';

interface BsChatbotFeedbackArgs {
  rating: number;
  submitted: boolean;
  comment: string;
}

const meta: Meta<BsChatbotFeedbackArgs> = {
  title: 'Genie AI Components/bs-chatbot-feedback',
  parameters: { docs: { description: { component: componentDescription('bs-chatbot-feedback') } } },
  render: args => html`
    <bs-chatbot-feedback rating=${args.rating} ?submitted=${args.submitted} comment=${args.comment}></bs-chatbot-feedback>
  `,
  argTypes: {
    rating: { control: { type: 'range', min: 0, max: 5, step: 1 }, description: propDescription('bs-chatbot-feedback', 'rating') },
    submitted: { control: 'boolean', description: propDescription('bs-chatbot-feedback', 'submitted') },
    comment: { control: 'text', description: propDescription('bs-chatbot-feedback', 'comment') },
  },
  args: {
    rating: 0,
    submitted: false,
    comment: '',
  },
};

export default meta;
type Story = StoryObj<BsChatbotFeedbackArgs>;

export const Default: Story = {};

export const OneStarSubmitted: Story = {
  name: '1 star (submitted)',
  args: { rating: 1, submitted: true, comment: 'The response was helpful ....' },
};

export const TwoStarsSubmitted: Story = {
  name: '2 stars (submitted)',
  args: { rating: 2, submitted: true, comment: 'The response was helpful ....' },
};

export const ThreeStarsSubmitted: Story = {
  name: '3 stars (submitted)',
  args: { rating: 3, submitted: true, comment: 'The response was helpful ....' },
};

export const FourStarsSubmitted: Story = {
  name: '4 stars (submitted)',
  args: { rating: 4, submitted: true, comment: 'The response was helpful ....' },
};

export const FiveStarsSubmitted: Story = {
  name: '5 stars (submitted)',
  args: { rating: 5, submitted: true, comment: 'The response was helpful ....' },
};

export const AllStates: Story = {
  name: 'All states',
  render: () => html`
    <div style="display: grid; grid-template-columns: repeat(3, minmax(280px, 1fr)); gap: 16px;">
      <bs-chatbot-feedback></bs-chatbot-feedback>
      <bs-chatbot-feedback rating="1" submitted comment="The response was helpful ...."></bs-chatbot-feedback>
      <bs-chatbot-feedback rating="2" submitted comment="The response was helpful ...."></bs-chatbot-feedback>
      <bs-chatbot-feedback rating="3" submitted comment="The response was helpful ...."></bs-chatbot-feedback>
      <bs-chatbot-feedback rating="4" submitted comment="The response was helpful ...."></bs-chatbot-feedback>
      <bs-chatbot-feedback rating="5" submitted comment="The response was helpful ...."></bs-chatbot-feedback>
    </div>
  `,
};
