import type { Meta, StoryObj } from '@storybook/web-components-vite';
import { html } from 'lit';
import { componentDescription, propDescription } from '../../stories-utils';

interface BsRadioArgs {
  name: string;
  value: string;
  checked: boolean;
  disabled: boolean;
  label: string;
}

const meta: Meta<BsRadioArgs> = {
  title: 'Components/bs-radio',
  parameters: { docs: { description: { component: componentDescription('bs-radio') } } },
  render: args => html`
    <bs-radio name=${args.name} value=${args.value} ?checked=${args.checked} ?disabled=${args.disabled}>
      ${args.label}
    </bs-radio>
  `,
  argTypes: {
    name: { control: 'text', description: propDescription('bs-radio', 'name') },
    value: { control: 'text', description: propDescription('bs-radio', 'value') },
    checked: { control: 'boolean', description: propDescription('bs-radio', 'checked') },
    disabled: { control: 'boolean', description: propDescription('bs-radio', 'disabled') },
    label: { control: 'text' },
  },
  args: {
    name: 'default-group',
    value: 'option-1',
    checked: false,
    disabled: false,
    label: 'Option 1',
  },
};

export default meta;
type Story = StoryObj<BsRadioArgs>;

export const Default: Story = {};

export const Checked: Story = {
  args: { checked: true },
};

export const Disabled: Story = {
  args: { disabled: true },
};

export const DisabledChecked: Story = {
  name: 'Disabled + checked',
  args: { disabled: true, checked: true },
};

// Native same-name radio grouping doesn't extend across separate <bs-radio> instances (each has
// its own shadow root -- see bs-radio.mdx's Accessibility section), so this story manages mutual
// exclusivity itself by listening for bsChange and unchecking the siblings.
const onGroupChange = (ev: CustomEvent<string>) => {
  const group = (ev.target as HTMLElement).closest('[data-radio-group]');
  group?.querySelectorAll('bs-radio').forEach(radio => {
    (radio as HTMLElement & { checked: boolean; value: string }).checked = radio === ev.target;
  });
};

export const Group: Story = {
  name: 'Radio group',
  render: () => html`
    <div data-radio-group style="display: flex; flex-direction: column; gap: 8px;" @bsChange=${onGroupChange}>
      <bs-radio name="group-story" value="option-1" checked>Option 1</bs-radio>
      <bs-radio name="group-story" value="option-2">Option 2</bs-radio>
      <bs-radio name="group-story" value="option-3">Option 3</bs-radio>
    </div>
  `,
};
