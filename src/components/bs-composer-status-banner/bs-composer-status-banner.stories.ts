import type { Meta, StoryObj } from '@storybook/web-components-vite';
import { html } from 'lit';
import { componentDescription, propDescription } from '../../stories-utils';
import type { BsComposerStatusBannerType } from './bs-composer-status-banner';

interface BsComposerStatusBannerArgs {
  type: BsComposerStatusBannerType;
  message: string;
  showIcon: boolean;
  showButton: boolean;
  actionLabel: string;
  allowClose: boolean;
}

const types: BsComposerStatusBannerType[] = ['error', 'info', 'neutral', 'warning'];

const meta: Meta<BsComposerStatusBannerArgs> = {
  title: 'Genie AI Components/bs-composer-status-banner',
  parameters: { docs: { description: { component: componentDescription('bs-composer-status-banner') } } },
  render: args => html`
    <bs-composer-status-banner
      type=${args.type}
      message=${args.message}
      ?show-icon=${args.showIcon}
      ?show-button=${args.showButton}
      action-label=${args.actionLabel}
      ?allow-close=${args.allowClose}
    ></bs-composer-status-banner>
  `,
  argTypes: {
    type: { control: 'select', options: types, description: propDescription('bs-composer-status-banner', 'type') },
    message: { control: 'text', description: propDescription('bs-composer-status-banner', 'message') },
    showIcon: { control: 'boolean', description: propDescription('bs-composer-status-banner', 'showIcon') },
    showButton: { control: 'boolean', description: propDescription('bs-composer-status-banner', 'showButton') },
    actionLabel: { control: 'text', description: propDescription('bs-composer-status-banner', 'actionLabel') },
    allowClose: { control: 'boolean', description: propDescription('bs-composer-status-banner', 'allowClose') },
  },
  args: {
    type: 'error',
    message: 'This is a message',
    showIcon: true,
    showButton: false,
    actionLabel: 'Continue',
    allowClose: true,
  },
};

export default meta;
type Story = StoryObj<BsComposerStatusBannerArgs>;

export const Default: Story = {};

export const Info: Story = {
  args: { type: 'info' },
};

export const Neutral: Story = {
  args: { type: 'neutral' },
};

export const Warning: Story = {
  args: { type: 'warning' },
};

export const WithAction: Story = {
  name: 'With action button',
  args: { showButton: true },
};

export const AllTypes: Story = {
  name: 'All types',
  render: () => html`
    <div style="display:flex; flex-direction:column; gap:8px; max-width: 600px;">
      ${types.map(type => html` <bs-composer-status-banner type=${type} show-button></bs-composer-status-banner> `)}
    </div>
  `,
};

const SAMPLE_IMAGE = 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=200&h=200&fit=crop';

export const AboveComposer: Story = {
  name: 'Above bs-composer',
  render: () => html`
    <div style="display:flex; flex-direction:column; max-width: 420px;">
      <bs-composer-status-banner
        type="info"
        message="Uploading files, please wait."
        style="margin-bottom: calc(-1 * var(--bs-spacing-150));"
      ></bs-composer-status-banner>
      <bs-composer aria-label="Message">
        <bs-attachment-list slot="attachments">
          <bs-attachment type="image" image-src=${SAMPLE_IMAGE} loading></bs-attachment>
          <bs-attachment type="pdf" file-name="Dummy-pdf-in-here" loading></bs-attachment>
        </bs-attachment-list>
      </bs-composer>
    </div>
  `,
};
