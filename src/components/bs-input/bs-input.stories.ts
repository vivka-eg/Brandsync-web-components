import type { Meta, StoryObj } from '@storybook/web-components-vite';
import { html } from 'lit';
import { componentDescription, propDescription } from '../../stories-utils';

interface BsInputArgs {
  label: string;
  placeholder: string;
  description: string;
  error: string;
  disabled: boolean;
}

const meta: Meta<BsInputArgs> = {
  title: 'Components/bs-input',
  parameters: { docs: { description: { component: componentDescription('bs-input') } } },
  render: args => html`
    <bs-input
      label=${args.label}
      placeholder=${args.placeholder}
      description=${args.description}
      error=${args.error}
      ?disabled=${args.disabled}
    ></bs-input>
  `,
  argTypes: {
    label: { control: 'text', description: propDescription('bs-input', 'label') },
    placeholder: { control: 'text', description: propDescription('bs-input', 'placeholder') },
    description: { control: 'text', description: propDescription('bs-input', 'description') },
    error: { control: 'text', description: propDescription('bs-input', 'error') },
    disabled: { control: 'boolean', description: propDescription('bs-input', 'disabled') },
  },
  args: {
    label: 'Email address',
    placeholder: 'you@example.com',
    description: '',
    error: '',
    disabled: false,
  },
};

export default meta;
type Story = StoryObj<BsInputArgs>;

export const Default: Story = {};

export const WithDescription: Story = {
  args: { description: "We'll never share your email." },
};

export const WithError: Story = {
  args: { error: 'Enter a valid email address.' },
};

export const Disabled: Story = {
  args: { disabled: true },
};
