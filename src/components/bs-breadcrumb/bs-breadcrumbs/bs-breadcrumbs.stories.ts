import type { Meta, StoryObj } from '@storybook/web-components-vite';
import { html } from 'lit';
import { componentDescription, propDescription } from '../../../stories-utils';
import type { BsBreadcrumbOverflowItem } from '../bs-breadcrumb-overflow/bs-breadcrumb-overflow';

type BsBreadcrumbsSize = 'sm' | 'md';
const sizes: BsBreadcrumbsSize[] = ['sm', 'md'];

interface BsBreadcrumbsArgs {
  label: string;
  size: BsBreadcrumbsSize;
}

const meta: Meta<BsBreadcrumbsArgs> = {
  title: 'Components/bs-breadcrumbs',
  parameters: { docs: { description: { component: componentDescription('bs-breadcrumbs') } } },
  argTypes: {
    label: { control: 'text', description: propDescription('bs-breadcrumbs', 'label') },
    size: { control: { type: 'select' }, options: sizes, description: propDescription('bs-breadcrumbs', 'size') },
  },
  args: {
    label: 'Breadcrumb',
    size: 'md',
  },
};

export default meta;
type Story = StoryObj<BsBreadcrumbsArgs>;

const overflowItems: BsBreadcrumbOverflowItem[] = [
  { label: 'Products', href: '/products' },
  { label: 'Category', href: '/products/category' },
];

// A short trail needs no overflow at all -- bs-breadcrumb-overflow is only placed by the consumer
// when there are actually hidden crumbs to disclose (there's no automatic maxItems collapsing).
export const Default: Story = {
  render: args => html`
    <bs-breadcrumbs label=${args.label} size=${args.size}>
      <bs-breadcrumb href="/">Home</bs-breadcrumb>
      <bs-breadcrumb href="/settings">Settings</bs-breadcrumb>
      <bs-breadcrumb current>Profile</bs-breadcrumb>
    </bs-breadcrumbs>
  `,
};

// size="sm" set once on the container, propagated as a JS property to every slotted crumb (and the
// overflow disclosure) -- see bs-breadcrumbs.tsx's propagateSize.
export const Small: Story = {
  args: { size: 'sm' },
  render: args => html`
    <bs-breadcrumbs label=${args.label} size=${args.size}>
      <bs-breadcrumb href="/">Home</bs-breadcrumb>
      <bs-breadcrumb-overflow .items=${overflowItems}></bs-breadcrumb-overflow>
      <bs-breadcrumb href="/settings/profile">Profile</bs-breadcrumb>
      <bs-breadcrumb current>Edit</bs-breadcrumb>
    </bs-breadcrumbs>
  `,
};

// A longer trail where the consumer has chosen to hide the middle crumbs behind a manually placed
// <bs-breadcrumb-overflow>, reachable via its ellipsis disclosure.
export const WithOverflow: Story = {
  name: 'With overflow',
  render: args => html`
    <bs-breadcrumbs label=${args.label}>
      <bs-breadcrumb href="/">Home</bs-breadcrumb>
      <bs-breadcrumb-overflow .items=${overflowItems}></bs-breadcrumb-overflow>
      <bs-breadcrumb href="/settings/profile">Profile</bs-breadcrumb>
      <bs-breadcrumb current>Edit</bs-breadcrumb>
    </bs-breadcrumbs>
  `,
};

// A crumb with neither `current` nor `href` -- not the current page, but also not navigable (e.g.
// an archived section heading). Renders as plain, non-interactive text with the same muted styling
// as a link.
export const NonLinkCrumb: Story = {
  args: {
    size: 'md',
  },

  name: 'Non-link crumb',

  render: args => html`
    <bs-breadcrumbs label=${args.label}>
      <bs-breadcrumb href="/">Home</bs-breadcrumb>
      <bs-breadcrumb>Archived section</bs-breadcrumb>
      <bs-breadcrumb current>Report</bs-breadcrumb>
    </bs-breadcrumbs>
  `,
};

// Sanity-checks the :host(:first-child) separator-hiding rule when a <bs-breadcrumb-overflow> --
// rather than a <bs-breadcrumb> -- is the visually first element in the trail.
export const OverflowFirst: Story = {
  name: 'Overflow first',
  render: () => html`
    <bs-breadcrumbs label="Breadcrumb">
      <bs-breadcrumb-overflow .items=${overflowItems}></bs-breadcrumb-overflow>
      <bs-breadcrumb current>Edit</bs-breadcrumb>
    </bs-breadcrumbs>
  `,
};
