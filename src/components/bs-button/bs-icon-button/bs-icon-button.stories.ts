import type { Meta, StoryObj } from '@storybook/web-components-vite';
import { html } from 'lit';
import { componentDescription, propDescription } from '../../../stories-utils';
import type { BsIconButtonVariant, BsIconButtonSize } from './bs-icon-button';

interface BsIconButtonArgs {
  variant: BsIconButtonVariant;
  size: BsIconButtonSize;
  disabled: boolean;
  type: 'button' | 'submit' | 'reset';
  ariaLabel: string;
}

const variants: BsIconButtonVariant[] = ['primary', 'neutral', 'subtle', 'outlined', 'success', 'warning', 'info', 'error'];
const sizes: BsIconButtonSize[] = ['sm', 'md', 'lg'];

const checkIcon = html`
  <svg viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
    <path d="M13 4L6 11L3 8" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
  </svg>
`;

const meta: Meta<BsIconButtonArgs> = {
  title: 'Components/bs-button/bs-icon-button',
  parameters: { docs: { description: { component: componentDescription('bs-icon-button') } } },
  render: args => html`
    <bs-icon-button variant=${args.variant} size=${args.size} type=${args.type} aria-label=${args.ariaLabel} ?disabled=${args.disabled}>
      ${checkIcon}
    </bs-icon-button>
  `,
  argTypes: {
    variant: { control: 'select', options: variants, description: propDescription('bs-icon-button', 'variant') },
    size: { control: 'select', options: sizes, description: propDescription('bs-icon-button', 'size') },
    disabled: { control: 'boolean', description: propDescription('bs-icon-button', 'disabled') },
    type: { control: 'select', options: ['button', 'submit', 'reset'], description: propDescription('bs-icon-button', 'type') },
    ariaLabel: { control: 'text', description: propDescription('bs-icon-button', 'ariaLabel') },
  },
  args: {
    variant: 'primary',
    size: 'md',
    disabled: false,
    type: 'button',
    ariaLabel: 'Confirm',
  },
};

export default meta;
type Story = StoryObj<BsIconButtonArgs>;

export const Primary: Story = {};

export const Sizes: Story = {
  render: args => html`
    <div style="display:flex; gap:12px; align-items:center;">
      <bs-icon-button size="sm" aria-label=${args.ariaLabel}>${checkIcon}</bs-icon-button>
      <bs-icon-button size="md" aria-label=${args.ariaLabel}>${checkIcon}</bs-icon-button>
      <bs-icon-button size="lg" aria-label=${args.ariaLabel}>${checkIcon}</bs-icon-button>
    </div>
  `,
};

export const Disabled: Story = {
  args: { disabled: true },
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
              ${sizes.map(
                size =>
                  html`<td style="padding: 8px 12px;">
                    <bs-icon-button variant=${variant} size=${size} aria-label="Confirm">${checkIcon}</bs-icon-button>
                  </td>`,
              )}
              ${sizes.map(
                size =>
                  html`<td style="padding: 8px 12px;">
                    <bs-icon-button variant=${variant} size=${size} aria-label="Confirm" disabled>${checkIcon}</bs-icon-button>
                  </td>`,
              )}
            </tr>
          `,
        )}
      </tbody>
    </table>
  `,
};
