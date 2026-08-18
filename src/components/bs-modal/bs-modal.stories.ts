import type { Meta, StoryObj } from '@storybook/web-components-vite';
import { componentDescription, propDescription } from '../../stories-utils';

interface BsModalArgs {
  heading: string;
  size: 'sm' | 'md' | 'lg';
}

const meta: Meta<BsModalArgs> = {
  title: 'Components/bs-modal',
  parameters: { docs: { description: { component: componentDescription('bs-modal') } } },
  argTypes: {
    heading: { control: 'text', description: propDescription('bs-modal', 'heading') },
    size: { control: 'select', options: ['sm', 'md', 'lg'], description: propDescription('bs-modal', 'size') },
  },
  args: {
    heading: 'Confirm booking',
    size: 'md',
  },
};

export default meta;
type Story = StoryObj<BsModalArgs>;

export const Default: Story = {
  render: args => {
    const container = document.createElement('div');

    const trigger = document.createElement('bs-button');
    trigger.textContent = 'Open modal';

    const modal = document.createElement('bs-modal') as HTMLElement & { open: boolean; heading: string; size: string };
    modal.heading = args.heading;
    modal.size = args.size;
    modal.innerHTML = `
      <p>Meeting Room 4B, 2:00pm - 3:00pm. This will send a calendar invite to all attendees.</p>
      <bs-button slot="footer" variant="neutral" size="sm">Cancel</bs-button>
      <bs-button slot="footer" size="sm">Confirm</bs-button>
    `;

    trigger.addEventListener('click', () => {
      modal.open = true;
    });
    modal.addEventListener('bsClose', () => {
      modal.open = false;
    });

    container.appendChild(trigger);
    container.appendChild(modal);
    return container;
  },
};
