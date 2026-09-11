import type { Meta, StoryObj } from '@storybook/web-components-vite';
import { html } from 'lit';
import { componentDescription, propDescription } from '../../stories-utils';

interface BsSourceLinkArgs {
  fileName: string;
  sourceName: string;
  version: string;
  href: string;
}

const meta: Meta<BsSourceLinkArgs> = {
  title: 'Genie AI Components/bs-source-link',
  parameters: { docs: { description: { component: componentDescription('bs-source-link') } } },
  render: args => html`
    <bs-source-link file-name=${args.fileName} source-name=${args.sourceName} version=${args.version} href=${args.href}></bs-source-link>
  `,
  argTypes: {
    fileName: { control: 'text', description: propDescription('bs-source-link', 'fileName') },
    sourceName: { control: 'text', description: propDescription('bs-source-link', 'sourceName') },
    version: { control: 'text', description: propDescription('bs-source-link', 'version') },
    href: { control: 'text', description: propDescription('bs-source-link', 'href') },
  },
  args: {
    fileName: 'Employee Handbook 2026',
    sourceName: 'HoltePortalen',
    version: 'v3.2',
    // No href by default -- renders as a button (bsOpen only) instead of a real link, so clicking
    // it in Storybook doesn't navigate away. Set one via the control to see the <a> rendering.
    href: '',
  },
};

export default meta;
type Story = StoryObj<BsSourceLinkArgs>;

export const Default: Story = {};

export const WithoutVersion: Story = {
  name: 'Without version',
  args: { version: '' },
};

export const WithoutSourceOrVersion: Story = {
  name: 'Without source or version',
  args: { sourceName: '', version: '' },
};
