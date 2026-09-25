import type { Meta, StoryObj } from '@storybook/web-components-vite';
import { componentDescription, propDescription } from '../../stories-utils';

interface BsDialogArgs {
  heading: string;
  size: 'sm' | 'md' | 'lg';
}

const meta: Meta<BsDialogArgs> = {
  title: 'Components/bs-dialog',
  parameters: {
    docs: {
      description: { component: componentDescription('bs-dialog') },
      // bs-dialog's backdrop/dialog are `position: fixed`, which resolves against the nearest
      // *viewport*. Storybook's Docs page normally inlines every story's markup directly into the
      // long, single-scroll Docs page itself -- so "fixed" ends up relative to that entire page's
      // iframe (which Storybook grows to fit ALL of it, often several thousand px tall), not the
      // small visible slice of it a reader is actually looking at. That's what produced a phantom
      // page-level scrollbar with the dialog rendering off in the wrong spot when reviewed on the
      // Docs page (worked fine on each story's own isolated Canvas view, which doesn't have this
      // problem). `inline: false` renders each Canvas in its own separate, normally-sized iframe
      // instead, giving `position: fixed` the correctly-scoped small viewport to resolve against.
      story: { inline: false, height: '650px' },
    },
  },
  argTypes: {
    heading: { control: 'text', description: propDescription('bs-dialog', 'heading') },
    size: { control: 'select', options: ['sm', 'md', 'lg'], description: propDescription('bs-dialog', 'size') },
  },
  args: {
    heading: 'Confirm booking',
    size: 'md',
  },
};

export default meta;
type Story = StoryObj<BsDialogArgs>;

export const Default: Story = {
  render: args => {
    const container = document.createElement('div');

    const trigger = document.createElement('bs-button');
    trigger.textContent = 'Open dialog';

    const dialog = document.createElement('bs-dialog') as HTMLElement & { open: boolean; heading: string; size: string };
    dialog.heading = args.heading;
    dialog.size = args.size;
    dialog.innerHTML = `
      <p>Meeting Room 4B, 2:00pm - 3:00pm. This will send a calendar invite to all attendees.</p>
      <bs-button slot="footer" variant="subtle" size="sm">Cancel</bs-button>
      <bs-button slot="footer" size="sm">Confirm</bs-button>
    `;

    trigger.addEventListener('click', () => {
      dialog.open = true;
    });
    dialog.addEventListener('bsClose', () => {
      dialog.open = false;
    });

    container.appendChild(trigger);
    container.appendChild(dialog);
    return container;
  },
};

// A real photo (Unsplash, free-to-use license) matching the "premium commercial space" copy below
// -- trades the previous inline-SVG placeholder's zero-network-dependency guarantee for a demo that
// actually looks like the Figma spec's hero image. Verified this URL resolves (200, image/jpeg)
// before using it.
const placeholderImage =
  'https://images.unsplash.com/photo-1660496247667-3fb697c396af?fm=jpg&q=80&w=920&h=400&fit=crop&auto=format';

export const WithImage: Story = {
  name: 'With image',
  render: args => {
    const container = document.createElement('div');

    const trigger = document.createElement('bs-button');
    trigger.textContent = 'Open dialog';

    const dialog = document.createElement('bs-dialog') as HTMLElement & { open: boolean; heading: string; size: string };
    dialog.heading = args.heading;
    dialog.size = args.size;
    dialog.innerHTML = `
      <img slot="image" src="${placeholderImage}" alt="" />
      <p>Sunset Towers is a premium commercial space located in the heart of the city. It offers flexible office layouts, modern amenities, and 24/7 security.</p>
      <bs-button slot="footer" variant="subtle" size="sm">Cancel</bs-button>
      <bs-button slot="footer" size="sm">Confirm</bs-button>
    `;

    trigger.addEventListener('click', () => {
      dialog.open = true;
    });
    dialog.addEventListener('bsClose', () => {
      dialog.open = false;
    });

    container.appendChild(trigger);
    container.appendChild(dialog);
    return container;
  },
};

const checkCircleIcon = `
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
    <circle cx="12" cy="12" r="9" stroke="currentColor" stroke-width="1.5" />
    <path d="M8 12.5L10.5 15L16 9" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
  </svg>
`;

export const Centered: Story = {
  render: args => {
    const container = document.createElement('div');

    const trigger = document.createElement('bs-button');
    trigger.textContent = 'Open dialog';

    const dialog = document.createElement('bs-dialog') as HTMLElement & {
      open: boolean;
      heading: string;
      size: string;
      centered: boolean;
    };
    dialog.heading = args.heading;
    dialog.size = args.size;
    dialog.centered = true;
    dialog.innerHTML = `
      <span slot="icon" style="color: var(--bs-color-primary-default)">${checkCircleIcon}</span>
      <p>Sunset Towers is a premium commercial space located in the heart of the city. It offers flexible office layouts, modern amenities, and 24/7 security.</p>
      <bs-button slot="footer" variant="subtle" size="sm">Cancel</bs-button>
      <bs-button slot="footer" size="sm">Confirm</bs-button>
    `;

    trigger.addEventListener('click', () => {
      dialog.open = true;
    });
    dialog.addEventListener('bsClose', () => {
      dialog.open = false;
    });

    container.appendChild(trigger);
    container.appendChild(dialog);
    return container;
  },
};
