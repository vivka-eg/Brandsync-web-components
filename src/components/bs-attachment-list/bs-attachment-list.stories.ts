import type { Meta, StoryObj } from '@storybook/web-components-vite';
import { html } from 'lit';
import { componentDescription, propDescription } from '../../stories-utils';

interface BsAttachmentListArgs {
  ariaLabel: string;
}

const SAMPLE_IMAGE = 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=200&h=200&fit=crop';

const meta: Meta<BsAttachmentListArgs> = {
  title: 'Genie AI Components/bs-attachment-list',
  parameters: { docs: { description: { component: componentDescription('bs-attachment-list') } } },
  argTypes: {
    ariaLabel: { control: 'text', description: propDescription('bs-attachment-list', 'ariaLabel') },
  },
  args: {
    ariaLabel: 'Attachments',
  },
};

export default meta;
type Story = StoryObj<BsAttachmentListArgs>;

export const OneAttachment: Story = {
  name: 'One attachment',
  render: args => html`
    <bs-attachment-list aria-label=${args.ariaLabel}>
      <bs-attachment type="image" image-src=${SAMPLE_IMAGE}></bs-attachment>
    </bs-attachment-list>
  `,
};

export const ThreeAttachments: Story = {
  name: 'Three attachments',
  render: args => html`
    <bs-attachment-list aria-label=${args.ariaLabel}>
      <bs-attachment type="image" image-src=${SAMPLE_IMAGE}></bs-attachment>
      <bs-attachment type="pdf" file-name="Dummy-pdf-in-here"></bs-attachment>
      <bs-attachment type="document" file-name="Dummy-pdf-in-here"></bs-attachment>
    </bs-attachment-list>
  `,
};

export const ManyAttachments: Story = {
  name: 'Many attachments (scrollable)',
  render: args => html`
    <div style="max-width: 400px; border: 1px dashed #c2c7d3;">
      <bs-attachment-list aria-label=${args.ariaLabel}>
        <bs-attachment type="pdf" file-name="Dummy-pdf-in-here"></bs-attachment>
        <bs-attachment type="pdf" file-name="Dummy-pdf-in-here"></bs-attachment>
        <bs-attachment type="document" file-name="Dummy-pdf-in-here"></bs-attachment>
        <bs-attachment type="document" file-name="Dummy-pdf-in-here"></bs-attachment>
        <bs-attachment type="document" file-name="Dummy-pdf-in-here"></bs-attachment>
        <bs-attachment type="image" image-src=${SAMPLE_IMAGE}></bs-attachment>
      </bs-attachment-list>
    </div>
  `,
};
