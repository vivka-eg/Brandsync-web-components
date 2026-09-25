import type { Meta, StoryObj } from '@storybook/web-components-vite';
import { html } from 'lit';
import { componentDescription, propDescription } from '../../stories-utils';
import type { BsSnackbarVariant } from './bs-snackbar';

const variants: BsSnackbarVariant[] = ['default', 'info', 'warning', 'success', 'error'];

interface BsSnackbarArgs {
  variant: BsSnackbarVariant;
  loading: boolean;
  actionLabel: string;
  message: string;
}

// Demonstrates a real consumer reaction to bsDismiss -- the component itself doesn't remove or
// hide anything on dismiss (see the class JSDoc: that's deliberately left to the consumer). Without
// this, clicking the close button visibly does nothing in the story, which reads as "the button
// doesn't work" even though the click handler did fire (see the bsDismiss test coverage).
const hideOnDismiss = (ev: Event) => {
  (ev.currentTarget as HTMLElement).style.display = 'none';
};

const meta: Meta<BsSnackbarArgs> = {
  title: 'Components/bs-snackbar',
  parameters: { docs: { description: { component: componentDescription('bs-snackbar') } } },
  render: args => html`
    <bs-snackbar
      variant=${args.variant}
      ?loading=${args.loading}
      action-label=${args.actionLabel || undefined}
      @bsDismiss=${hideOnDismiss}
    >
      ${args.message}
    </bs-snackbar>
  `,
  argTypes: {
    variant: { control: { type: 'select' }, options: variants, description: propDescription('bs-snackbar', 'variant') },
    loading: { control: 'boolean', description: propDescription('bs-snackbar', 'loading') },
    actionLabel: { control: 'text', description: propDescription('bs-snackbar', 'actionLabel') },
    message: { control: 'text', description: 'Slotted message content (not a real attribute -- see the default slot).' },
  },
  args: {
    variant: 'default',
    loading: false,
    actionLabel: 'Click me',
    message: 'Files uploaded successfully.',
  },
};

export default meta;
type Story = StoryObj<BsSnackbarArgs>;

export const Default: Story = {};

// One instance per variant, side by side, matching the Figma spec's column layout.
export const AllVariants: Story = {
  name: 'All variants',
  render: () => html`
    <div style="display: flex; flex-direction: column; gap: 12px;">
      ${variants.map(
        variant => html`
          <bs-snackbar variant=${variant} action-label="Click me" @bsDismiss=${hideOnDismiss}>Files uploaded successfully.</bs-snackbar>
        `,
      )}
    </div>
  `,
};

export const Overflow: Story = {
  args: { message: 'Your changes were saved, but some fields may fail.' },
};

export const Loading: Story = {
  args: { loading: true, message: 'Uploading files...', actionLabel: '' },
};

export const NoAction: Story = {
  name: 'No action',
  args: { actionLabel: '' },
};
