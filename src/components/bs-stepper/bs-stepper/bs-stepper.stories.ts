import type { Meta, StoryObj } from '@storybook/web-components-vite';
import { html } from 'lit';
import { componentDescription, propDescription } from '../../../stories-utils';

interface BsStepperArgs {
  currentStep: number;
  direction: 'horizontal' | 'vertical';
  showDescription: boolean;
}

const meta: Meta<BsStepperArgs> = {
  title: 'Components/bs-stepper',
  parameters: { docs: { description: { component: componentDescription('bs-stepper') } } },
  render: args => html`
    <bs-stepper current-step=${args.currentStep} direction=${args.direction} show-description=${args.showDescription}>
      <bs-stepper-step name="Cart" description="Review items"></bs-stepper-step>
      <bs-stepper-step name="Shipping" description="Delivery address"></bs-stepper-step>
      <bs-stepper-step name="Payment" description="Card details"></bs-stepper-step>
      <bs-stepper-step name="Confirm" description="Review order"></bs-stepper-step>
    </bs-stepper>
  `,
  argTypes: {
    currentStep: { control: { type: 'number', min: 0, max: 3 }, description: propDescription('bs-stepper', 'currentStep') },
    direction: { control: { type: 'select' }, options: ['horizontal', 'vertical'], description: propDescription('bs-stepper', 'direction') },
    showDescription: { control: 'boolean', description: propDescription('bs-stepper', 'showDescription') },
  },
  args: {
    currentStep: 1,
    direction: 'horizontal',
    showDescription: true,
  },
};

export default meta;
type Story = StoryObj<BsStepperArgs>;

export const Default: Story = {};

export const Vertical: Story = {
  args: { direction: 'vertical' },
};

// A step's own `error` attribute overrides its position-derived state -- Shipping shows the error
// treatment even though it's before currentStep (which would normally read as "done").
export const WithError: Story = {
  name: 'With an error step',
  args: { currentStep: 2 },
  render: args => html`
    <bs-stepper current-step=${args.currentStep} direction=${args.direction} show-description=${args.showDescription}>
      <bs-stepper-step name="Cart" description="Review items"></bs-stepper-step>
      <bs-stepper-step name="Shipping" description="Delivery address" error></bs-stepper-step>
      <bs-stepper-step name="Payment" description="Card details"></bs-stepper-step>
      <bs-stepper-step name="Confirm" description="Review order"></bs-stepper-step>
    </bs-stepper>
  `,
};

export const WithDisabledStep: Story = {
  name: 'With a disabled step',
  args: { currentStep: 2 },
  render: args => html`
    <bs-stepper current-step=${args.currentStep} direction=${args.direction} show-description=${args.showDescription}>
      <bs-stepper-step name="Cart" description="Review items"></bs-stepper-step>
      <bs-stepper-step name="Shipping" description="Delivery address"></bs-stepper-step>
      <bs-stepper-step name="Payment" description="Card details"></bs-stepper-step>
      <bs-stepper-step name="Confirm" description="Review order" disabled></bs-stepper-step>
    </bs-stepper>
  `,
};

export const NoDescription: Story = {
  name: 'No description',
  args: { showDescription: false },
};
