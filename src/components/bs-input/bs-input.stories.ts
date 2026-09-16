import type { Meta, StoryObj } from '@storybook/web-components-vite';
import { html } from 'lit';
import { componentDescription, propDescription } from '../../stories-utils';

type BsInputType =
  | 'text'
  | 'email'
  | 'password'
  | 'number'
  | 'search'
  | 'date'
  | 'dropdown'
  | 'select'
  | 'textarea'
  | 'chip'
  | 'initials'
  | 'country'
  | 'pin';

const inputTypes: BsInputType[] = [
  'text',
  'email',
  'password',
  'number',
  'search',
  'date',
  'dropdown',
  'select',
  'textarea',
  'chip',
  'initials',
  'country',
  'pin',
];

interface BsInputArgs {
  type: BsInputType;
  label: string;
  placeholder: string;
  description: string;
  error: string;
  disabled: boolean;
  required: boolean;
  icon: boolean;
  endIcon: boolean;
}

const mailIcon = html`
  <svg slot="icon" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
    <path
      d="M2 4L8 9L14 4M2 4H14V12H2V4Z"
      stroke="currentColor"
      stroke-width="1.3"
      stroke-linecap="round"
      stroke-linejoin="round"
    />
  </svg>
`;

const chevronIcon = html`
  <svg slot="end-icon" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
    <path d="M4 6L8 10L12 6" stroke="currentColor" stroke-width="1.3" stroke-linecap="round" stroke-linejoin="round" />
  </svg>
`;

const meta: Meta<BsInputArgs> = {
  title: 'Components/bs-input',
  parameters: { docs: { description: { component: componentDescription('bs-input') } } },
  render: args => html`
    <bs-input
      type=${args.type}
      label=${args.label}
      placeholder=${args.placeholder}
      description=${args.description}
      error=${args.error}
      ?disabled=${args.disabled}
      ?required=${args.required}
    >
      ${args.icon ? mailIcon : ''} ${args.endIcon ? chevronIcon : ''}
    </bs-input>
  `,
  argTypes: {
    type: { control: 'select', options: inputTypes, description: propDescription('bs-input', 'type') },
    label: { control: 'text', description: propDescription('bs-input', 'label') },
    placeholder: { control: 'text', description: propDescription('bs-input', 'placeholder') },
    description: { control: 'text', description: propDescription('bs-input', 'description') },
    error: { control: 'text', description: propDescription('bs-input', 'error') },
    disabled: { control: 'boolean', description: propDescription('bs-input', 'disabled') },
    required: { control: 'boolean', description: propDescription('bs-input', 'required') },
    icon: { control: 'boolean', description: 'Toggles a leading icon (not a real attribute -- see the `icon` slot).' },
    endIcon: {
      control: 'boolean',
      name: 'end-icon',
      description: 'Toggles a trailing icon (not a real attribute -- see the `end-icon` slot).',
    },
  },
  args: {
    type: 'text',
    label: 'Email address',
    placeholder: 'you@example.com',
    description: '',
    error: '',
    disabled: false,
    required: false,
    icon: false,
    endIcon: false,
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

export const WithIcon: Story = {
  name: 'With icon',
  args: { icon: true },
};

export const WithEndIcon: Story = {
  name: 'With end icon',
  args: { endIcon: true },
};

export const Required: Story = {
  args: { required: true },
};

export const Search: Story = {
  render: () => html`<bs-input type="search" label="Search" placeholder="Search..."></bs-input>`,
};

export const NumberInput: Story = {
  name: 'Number',
  render: () => html`<bs-input type="number" label="Quantity" value="1" min="0" max="10" step="1"></bs-input>`,
};

export const Password: Story = {
  render: () => html`<bs-input type="password" label="Password" placeholder="Enter your password"></bs-input>`,
};

export const DateInput: Story = {
  name: 'Date',
  render: () => html`<bs-input type="date" label="Date of birth"></bs-input>`,
};

export const Dropdown: Story = {
  render: () => html`
    <bs-input
      type="dropdown"
      label="Country"
      placeholder="Select a country"
      value="Denmark"
      .options=${[
        { label: 'Denmark', value: 'dk' },
        { label: 'Sweden', value: 'se' },
        { label: 'Norway', value: 'no' },
      ]}
    ></bs-input>
  `,
};

export const Select: Story = {
  render: () => html`
    <bs-input
      type="select"
      label="Role"
      .options=${[
        { label: 'Admin', value: 'admin' },
        { label: 'Editor', value: 'editor' },
        { label: 'Viewer', value: 'viewer' },
      ]}
    ></bs-input>
  `,
};

export const TextArea: Story = {
  name: 'Text area',
  render: () => html`<bs-input type="textarea" label="Comments" rows="4" placeholder="Type your comments here..."></bs-input>`,
};

export const Chip: Story = {
  render: () => html`<bs-input type="chip" label="Tags" .chips=${['design', 'frontend']} placeholder="Add a tag..."></bs-input>`,
};

export const Initials: Story = {
  render: () => html`<bs-input type="initials" label="Name" .titleOptions=${['Mrs.', 'Mr.', 'Dr.']} placeholder="Full name"></bs-input>`,
};

export const Country: Story = {
  render: () => html`
    <bs-input
      type="country"
      label="Phone number"
      .countryOptions=${[
        { code: 'DK', label: 'Denmark' },
        { code: 'US', label: 'United States' },
        { code: 'GB', label: 'United Kingdom' },
      ]}
      placeholder="Phone number"
    ></bs-input>
  `,
};

export const Pin: Story = {
  render: () => html`<bs-input type="pin" label="Verification code" length="4"></bs-input>`,
};
