import type { Meta, StoryObj } from '@storybook/web-components-vite';
import { html } from 'lit';
import { ifDefined } from 'lit/directives/if-defined.js';
import { componentDescription, propDescription } from '../../stories-utils';

type BsSliderType = 'default' | 'segmented' | 'range';

const types: BsSliderType[] = ['default', 'segmented', 'range'];

interface BsSliderArgs {
  type: BsSliderType;
  showLabel: boolean;
  label: string;
  min: number;
  max: number;
  step: number;
  value: number;
  valueStart: number;
  valueEnd: number;
  segments: number;
  disabled: boolean;
  ariaLabel: string;
}

const meta: Meta<BsSliderArgs> = {
  title: 'Components/bs-slider',
  parameters: { docs: { description: { component: componentDescription('bs-slider') } } },
  render: args => html`
    <bs-slider
      type=${args.type}
      show-label=${args.showLabel}
      label=${args.label}
      min=${args.min}
      max=${args.max}
      step=${args.step}
      value=${args.value}
      value-start=${args.valueStart}
      value-end=${args.valueEnd}
      segments=${args.segments}
      ?disabled=${args.disabled}
      aria-label=${ifDefined(args.ariaLabel || undefined)}
    ></bs-slider>
  `,
  argTypes: {
    type: { control: 'select', options: types, description: propDescription('bs-slider', 'type') },
    showLabel: { control: 'boolean', description: propDescription('bs-slider', 'showLabel') },
    label: { control: 'text', description: propDescription('bs-slider', 'label') },
    min: { control: 'number', description: propDescription('bs-slider', 'min') },
    max: { control: 'number', description: propDescription('bs-slider', 'max') },
    step: { control: 'number', description: propDescription('bs-slider', 'step') },
    value: { control: 'number', description: propDescription('bs-slider', 'value') },
    valueStart: { control: 'number', description: propDescription('bs-slider', 'valueStart') },
    valueEnd: { control: 'number', description: propDescription('bs-slider', 'valueEnd') },
    segments: { control: 'number', description: propDescription('bs-slider', 'segments') },
    disabled: { control: 'boolean', description: propDescription('bs-slider', 'disabled') },
    ariaLabel: { control: 'text', description: propDescription('bs-slider', 'ariaLabel') },
  },
  args: {
    type: 'default',
    showLabel: true,
    label: 'Label',
    min: 0,
    max: 100,
    step: 1,
    value: 40,
    valueStart: 25,
    valueEnd: 75,
    segments: 10,
    disabled: false,
    ariaLabel: '',
  },
};

export default meta;
type Story = StoryObj<BsSliderArgs>;

export const Default: Story = {};

export const Segmented: Story = {
  args: { type: 'segmented', value: 30 },
};

export const Range: Story = {
  args: { type: 'range' },
};

export const Disabled: Story = {
  args: { disabled: true },
};

export const BareTrack: Story = {
  name: 'showLabel=false',
  // ariaLabel is required here: with showLabel false there's no visible "Label" text left to
  // associate via aria-labelledby, so the native range input would otherwise have no accessible
  // name at all (a real WCAG 4.1.2 violation caught via axe-core against this exact story).
  args: { showLabel: false, ariaLabel: 'Volume' },
};
