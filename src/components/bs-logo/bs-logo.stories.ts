import type { Meta, StoryObj } from '@storybook/web-components-vite';
import { html } from 'lit';
import { componentDescription, propDescription } from '../../stories-utils';

type BsLogoVariant = 'full' | 'mark' | 'custom';
type BsLogoBackground = 'auto' | 'light' | 'dark';

const variants: BsLogoVariant[] = ['full', 'mark', 'custom'];
const backgrounds: BsLogoBackground[] = ['auto', 'light', 'dark'];

interface BsLogoArgs {
  variant: BsLogoVariant;
  background: BsLogoBackground;
  src: string;
  alt: string;
}

const meta: Meta<BsLogoArgs> = {
  title: 'Components/bs-logo',
  parameters: { docs: { description: { component: componentDescription('bs-logo') } } },
  render: args => html`<bs-logo variant=${args.variant} background=${args.background} src=${args.src} alt=${args.alt}></bs-logo>`,
  argTypes: {
    variant: { control: 'select', options: variants, description: propDescription('bs-logo', 'variant') },
    background: { control: 'select', options: backgrounds, description: propDescription('bs-logo', 'background') },
    src: { control: 'text', description: propDescription('bs-logo', 'src') },
    alt: { control: 'text', description: propDescription('bs-logo', 'alt') },
  },
  args: {
    variant: 'full',
    background: 'auto',
    src: '',
    alt: '',
  },
};

export default meta;
type Story = StoryObj<BsLogoArgs>;

export const Full: Story = {
  name: 'Full (light)',
};

// `data-theme="dark"` is set on a wrapper scoped to just this story, NOT via a globals override on
// the toolbar's Theme switch -- that switch's decorator (see .storybook/preview.ts) sets the
// attribute on the shared document root, which breaks down on this component's Docs page (every
// story renders together in one document there, so one story forcing a document-wide theme while
// its siblings render under the *other* theme thrashes). A local wrapper gets the identical CSS
// custom property cascade (tokens.css's dark block matches any `[data-theme="dark"]` element, not
// specifically <html>) without touching shared state. background is left at its "auto" default
// (via args below) so this demonstrates the logo following the ambient theme on its own, the same
// way every other --bs-* token already does (see the CSS bridge in src/global/base.css).
export const FullAutoDark: Story = {
  name: 'Full (auto, dark theme)',
  render: args => html`
    <div data-theme="dark" style="background: var(--bs-surface-base); padding: 24px; display: inline-flex;">
      <bs-logo variant=${args.variant} background=${args.background}></bs-logo>
    </div>
  `,
};

// Pins the dark asset explicitly via background="dark", regardless of the page's own theme --
// for a consumer that places this on a dark surface without setting [data-theme="dark"] itself.
// Rendered on a manually dark canvas (not the global theme switch) to prove the override doesn't
// depend on that switch at all.
export const FullDark: Story = {
  name: 'Full (dark, explicit)',
  args: { background: 'dark' },
  render: args => html`
    <div style="background: var(--bs-surface-inverse); padding: 24px; display: inline-flex;">
      <bs-logo variant=${args.variant} background=${args.background}></bs-logo>
    </div>
  `,
};

export const Mark: Story = {
  name: 'Mark',
  args: { variant: 'mark' },
};

// A consumer-supplied logo (e.g. fetched at runtime from a service like brand.dev) instead of the
// built-in BrandSync assets -- this component only renders the image, it never fetches it itself.
export const Custom: Story = {
  name: 'Custom (consumer-supplied image)',
  args: {
    variant: 'custom',
    src: 'https://placehold.co/160x44/0062c1/white?text=Acme+Co',
    alt: 'Acme Co',
  },
};
