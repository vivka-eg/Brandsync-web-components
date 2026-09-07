import type { Meta, StoryObj } from '@storybook/web-components-vite';
import { html } from 'lit';
import { componentDescription, propDescription } from '../../stories-utils';
import type { BsButtonVariant, BsButtonSize } from './bs-button';

interface BsButtonArgs {
  variant: BsButtonVariant;
  size: BsButtonSize;
  disabled: boolean;
  type: 'button' | 'submit' | 'reset';
  label: string;
}

const variants: BsButtonVariant[] = ['primary', 'neutral', 'subtle', 'outlined', 'success', 'warning', 'info', 'error'];
const sizes: BsButtonSize[] = ['sm', 'md', 'lg'];

const meta: Meta<BsButtonArgs> = {
  title: 'Components/bs-button',
  parameters: { docs: { description: { component: componentDescription('bs-button') } } },
  render: args => html`
    <bs-button variant=${args.variant} size=${args.size} type=${args.type} ?disabled=${args.disabled}>
      ${args.label}
    </bs-button>
  `,
  argTypes: {
    variant: { control: 'select', options: variants, description: propDescription('bs-button', 'variant') },
    size: { control: 'select', options: sizes, description: propDescription('bs-button', 'size') },
    disabled: { control: 'boolean', description: propDescription('bs-button', 'disabled') },
    type: { control: 'select', options: ['button', 'submit', 'reset'], description: propDescription('bs-button', 'type') },
    label: { control: 'text', description: 'Slotted label content (not a real attribute -- see the default slot).' },
  },
  args: {
    variant: 'primary',
    size: 'md',
    disabled: false,
    type: 'button',
    label: 'Click me',
  },
};

export default meta;
type Story = StoryObj<BsButtonArgs>;

export const Primary: Story = {};

export const Neutral: Story = {
  args: { variant: 'neutral' },
};

export const Subtle: Story = {
  args: { variant: 'subtle' },
};

export const Outlined: Story = {
  args: { variant: 'outlined' },
};

export const Success: Story = {
  args: { variant: 'success' },
};

export const Warning: Story = {
  args: { variant: 'warning' },
};

export const Info: Story = {
  args: { variant: 'info' },
};

export const Error: Story = {
  args: { variant: 'error' },
};

export const Disabled: Story = {
  args: { disabled: true },
};

export const NeutralDisabled: Story = {
  name: 'Neutral, disabled',
  args: { variant: 'neutral', disabled: true },
};

export const Sizes: Story = {
  render: () => html`
    <div style="display:flex; gap:12px; align-items:center;">
      <bs-button size="sm">Small</bs-button>
      <bs-button size="md">Medium</bs-button>
      <bs-button size="lg">Large</bs-button>
    </div>
  `,
};

export const WithIcon: Story = {
  name: 'With icon',
  render: args => html`
    <bs-button variant=${args.variant} size=${args.size} ?disabled=${args.disabled}>
      <svg slot="icon" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
        <path d="M13 4L6 11L3 8" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
      </svg>
      ${args.label}
    </bs-button>
  `,
};

export const WithEndIcon: Story = {
  name: 'With end icon',
  render: args => html`
    <bs-button variant=${args.variant} size=${args.size} ?disabled=${args.disabled}>
      ${args.label}
      <svg slot="end-icon" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
        <path d="M6 3L11 8L6 13" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
      </svg>
    </bs-button>
  `,
};

export const IconOnly: Story = {
  name: 'Icon-only',
  render: args => html`
    <bs-button variant=${args.variant} size=${args.size} ?disabled=${args.disabled} aria-label="Delete">
      <svg slot="icon" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
        <path
          d="M2 4H14M6 4V2.5C6 2.22386 6.22386 2 6.5 2H9.5C9.77614 2 10 2.22386 10 2.5V4M12.5 4L12 13.5C12 13.7761 11.7761 14 11.5 14H4.5C4.22386 14 4 13.7761 4 13.5L3.5 4"
          stroke="currentColor"
          stroke-width="1.3"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
      </svg>
    </bs-button>
  `,
};

export const LongLabel: Story = {
  name: 'Long label (edge case)',
  args: { label: 'This button has a much longer label than the icon-and-text layout was designed for' },
  render: args => html`
    <div style="max-width: 220px;">
      <bs-button variant=${args.variant} size=${args.size} ?disabled=${args.disabled}> ${args.label} </bs-button>
    </div>
  `,
};

export const AllCombinations: Story = {
  name: 'All variant × size × disabled combinations',
  render: () => html`
    <table style="border-collapse: collapse;">
      <thead>
        <tr>
          <th style="text-align:left; padding: 4px 12px;">Variant</th>
          ${sizes.map(size => html`<th style="text-align:left; padding: 4px 12px;">${size}</th>`)}
          ${sizes.map(size => html`<th style="text-align:left; padding: 4px 12px;">${size} (disabled)</th>`)}
        </tr>
      </thead>
      <tbody>
        ${variants.map(
          variant => html`
            <tr>
              <td style="padding: 8px 12px; font-family: monospace;">${variant}</td>
              ${sizes.map(size => html`<td style="padding: 8px 12px;"><bs-button variant=${variant} size=${size}>Button</bs-button></td>`)}
              ${sizes.map(
                size =>
                  html`<td style="padding: 8px 12px;"><bs-button variant=${variant} size=${size} disabled>Button</bs-button></td>`,
              )}
            </tr>
          `,
        )}
      </tbody>
    </table>
  `,
};

export const Skeleton: Story = {
  render: () => html`
    <div style="display:flex; gap:12px; align-items:center;">
      <bs-button-skeleton size="sm"></bs-button-skeleton>
      <bs-button-skeleton size="md"></bs-button-skeleton>
      <bs-button-skeleton size="lg"></bs-button-skeleton>
    </div>
  `,
};
