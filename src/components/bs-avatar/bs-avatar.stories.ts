import type { Meta, StoryObj } from '@storybook/web-components-vite';
import { html } from 'lit';
import { componentDescription, propDescription } from '../../stories-utils';
import type { BsAvatarType, BsAvatarSize } from './bs-avatar';

interface BsAvatarArgs {
  type: BsAvatarType;
  size: BsAvatarSize;
  initials: string;
  src: string;
  alt: string;
  ariaLabel: string;
  disabled: boolean;
}

const types: BsAvatarType[] = ['icon', 'initials', 'image'];
const sizes: BsAvatarSize[] = ['xs', 'sm', 'md', 'lg', 'xl', 'xxl'];

// A placeholder photo for the "image" demo stories -- this component never fetches a photo
// itself (see its own class doc), this is purely story content standing in for a real user photo
// a consuming app would supply.
const PLACEHOLDER_PHOTO = 'https://i.pravatar.cc/256?img=68';

const meta: Meta<BsAvatarArgs> = {
  title: 'Components/bs-avatar',
  parameters: { docs: { description: { component: componentDescription('bs-avatar') } } },
  render: args => html`
    <bs-avatar
      type=${args.type}
      size=${args.size}
      initials=${args.initials}
      src=${args.src}
      alt=${args.alt}
      aria-label=${args.ariaLabel}
      ?disabled=${args.disabled}
    ></bs-avatar>
  `,
  argTypes: {
    type: { control: 'select', options: types, description: propDescription('bs-avatar', 'type') },
    size: { control: 'select', options: sizes, description: propDescription('bs-avatar', 'size') },
    initials: { control: 'text', description: propDescription('bs-avatar', 'initials') },
    src: { control: 'text', description: propDescription('bs-avatar', 'src') },
    alt: { control: 'text', description: propDescription('bs-avatar', 'alt') },
    ariaLabel: { control: 'text', description: propDescription('bs-avatar', 'ariaLabel') },
    disabled: { control: 'boolean', description: propDescription('bs-avatar', 'disabled') },
  },
  args: {
    type: 'icon',
    size: 'md',
    initials: 'SL',
    src: '',
    alt: '',
    ariaLabel: 'Sam Lee',
    disabled: false,
  },
};

export default meta;
type Story = StoryObj<BsAvatarArgs>;

export const Icon: Story = {};

export const Initials: Story = {
  args: { type: 'initials' },
};

export const Image: Story = {
  args: { type: 'image', src: PLACEHOLDER_PHOTO, alt: 'Sam Lee' },
};

export const Sizes: Story = {
  render: args => html`
    <div style="display:flex; gap:16px; align-items:center;">
      ${sizes.map(size => html`<bs-avatar type=${args.type} size=${size} initials=${args.initials} aria-label=${args.ariaLabel}></bs-avatar>`)}
    </div>
  `,
};

export const Disabled: Story = {
  args: { disabled: true },
};

// Not a special prop -- this just sets tabindex="0" directly on the element (a consuming app's
// own choice to make an avatar interactive, e.g. an account-switcher trigger) to demonstrate that
// the real :hover/:focus-visible/:active CSS states apply with no extra wiring -- see the class
// doc in bs-avatar.tsx for why. Tab to it (or click/hold it) to see the states.
export const Interactive: Story = {
  args: { type: 'initials' },
  render: args => html`<bs-avatar type=${args.type} size=${args.size} initials=${args.initials} aria-label=${args.ariaLabel} tabindex="0"></bs-avatar>`,
};
