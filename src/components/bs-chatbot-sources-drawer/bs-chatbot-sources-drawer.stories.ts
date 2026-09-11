import type { Meta, StoryObj } from '@storybook/web-components-vite';
import { html } from 'lit';
import { componentDescription, propDescription } from '../../stories-utils';

interface BsChatbotSourcesDrawerArgs {
  heading: string;
}

const SAMPLE_SOURCES = html`
  <bs-source-link file-name="Employee Handbook 2026" source-name="HoltePortalen" version="v3.2"></bs-source-link>
  <bs-source-link file-name="Payroll Processing Guide" source-name="WorkdayHQ" version="v2.4"></bs-source-link>
  <bs-source-link file-name="Benefits & Leave Policy" source-name="PeopleOps Wiki" version="v1.8"></bs-source-link>
`;

const meta: Meta<BsChatbotSourcesDrawerArgs> = {
  title: 'Genie AI Components/bs-chatbot-sources-drawer',
  parameters: { docs: { description: { component: componentDescription('bs-chatbot-sources-drawer') } } },
  render: args => html`
    <div style="max-width: 380px; height: 400px; border: 1px solid var(--bs-border-default); border-radius: var(--bs-border-radius-150); overflow: hidden;">
      <bs-chatbot-sources-drawer heading=${args.heading}>${SAMPLE_SOURCES}</bs-chatbot-sources-drawer>
    </div>
  `,
  argTypes: {
    heading: { control: 'text', description: propDescription('bs-chatbot-sources-drawer', 'heading') },
  },
  args: {
    heading: 'Sources',
  },
};

export default meta;
type Story = StoryObj<BsChatbotSourcesDrawerArgs>;

export const Default: Story = {};

export const Empty: Story = {
  render: args => html`
    <div style="max-width: 380px; height: 200px; border: 1px solid var(--bs-border-default); border-radius: var(--bs-border-radius-150); overflow: hidden;">
      <bs-chatbot-sources-drawer heading=${args.heading}></bs-chatbot-sources-drawer>
    </div>
  `,
};

export const ManySources: Story = {
  name: 'Many sources (scrollable)',
  render: args => html`
    <div style="max-width: 380px; height: 300px; border: 1px solid var(--bs-border-default); border-radius: var(--bs-border-radius-150); overflow: hidden;">
      <bs-chatbot-sources-drawer heading=${args.heading}>
        ${SAMPLE_SOURCES}
        <bs-source-link file-name="Onboarding Checklist" source-name="HoltePortalen" version="v1.0"></bs-source-link>
        <bs-source-link file-name="IT Security Policy" source-name="WorkdayHQ" version="v4.1"></bs-source-link>
        <bs-source-link file-name="Remote Work Guidelines" source-name="PeopleOps Wiki" version="v2.0"></bs-source-link>
      </bs-chatbot-sources-drawer>
    </div>
  `,
};
