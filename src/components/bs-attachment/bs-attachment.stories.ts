import type { Meta, StoryObj } from '@storybook/web-components-vite';
import { html } from 'lit';
import { componentDescription, propDescription } from '../../stories-utils';

interface BsAttachmentArgs {
  type: 'image' | 'pdf' | 'document';
  fileName: string;
  imageSrc: string;
  loading: boolean;
  removable: boolean;
}

const SAMPLE_IMAGE = 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=200&h=200&fit=crop';

const meta: Meta<BsAttachmentArgs> = {
  title: 'Genie AI Components/bs-attachment',
  parameters: { docs: { description: { component: componentDescription('bs-attachment') } } },
  render: args => html`
    <bs-attachment
      type=${args.type}
      file-name=${args.fileName}
      image-src=${args.imageSrc}
      ?loading=${args.loading}
      ?removable=${args.removable}
    ></bs-attachment>
  `,
  argTypes: {
    type: { control: 'select', options: ['image', 'pdf', 'document'], description: propDescription('bs-attachment', 'type') },
    fileName: { control: 'text', description: propDescription('bs-attachment', 'fileName') },
    imageSrc: { control: 'text', description: propDescription('bs-attachment', 'imageSrc') },
    loading: { control: 'boolean', description: propDescription('bs-attachment', 'loading') },
    removable: { control: 'boolean', description: propDescription('bs-attachment', 'removable') },
  },
  args: {
    type: 'image',
    fileName: 'Dummy-pdf-in-here',
    imageSrc: SAMPLE_IMAGE,
    loading: false,
    removable: true,
  },
};

export default meta;
type Story = StoryObj<BsAttachmentArgs>;

export const Default: Story = {};

export const Pdf: Story = {
  args: { type: 'pdf' },
};

export const Document: Story = {
  args: { type: 'document' },
};

export const ImageLoading: Story = {
  name: 'Image (loading)',
  args: { loading: true },
};

export const PdfLoading: Story = {
  name: 'PDF (loading)',
  args: { type: 'pdf', loading: true },
};

export const Gallery: Story = {
  render: () => html`
    <div style="display: flex; gap: 8px; flex-wrap: wrap;">
      <bs-attachment type="image" image-src=${SAMPLE_IMAGE}></bs-attachment>
      <bs-attachment type="pdf" file-name="Dummy-pdf-in-here"></bs-attachment>
      <bs-attachment type="document" file-name="Dummy-pdf-in-here"></bs-attachment>
      <bs-attachment type="image" image-src=${SAMPLE_IMAGE} loading></bs-attachment>
      <bs-attachment type="pdf" file-name="Dummy-pdf-in-here" loading></bs-attachment>
      <bs-attachment type="document" file-name="Dummy-pdf-in-here" loading></bs-attachment>
    </div>
  `,
};
