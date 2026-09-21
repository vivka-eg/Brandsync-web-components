import type { Meta, StoryObj } from '@storybook/web-components-vite';
import { html } from 'lit';
import { ifDefined } from 'lit/directives/if-defined.js';
import { componentDescription, propDescription } from '../../stories-utils';

type BsNavigationHeaderAlignment = 'default' | 'center' | 'with-navigation-drawer';
type LeftContentType = 'buttons' | 'tabs';

const alignments: BsNavigationHeaderAlignment[] = ['default', 'center', 'with-navigation-drawer'];
const leftContentTypes: LeftContentType[] = ['buttons', 'tabs'];

interface BsNavigationHeaderArgs {
  alignment: BsNavigationHeaderAlignment;
  skipToContentHref: string;
  leftContentType: LeftContentType;
}

const searchIcon = html`
  <svg viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
    <circle cx="7" cy="7" r="5" stroke="currentColor" stroke-width="1.5" />
    <path d="M11 11L14.5 14.5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" />
  </svg>
`;

const bellIcon = html`
  <svg viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
    <path
      d="M3 12.5H13L11.5 10.5V6.5C11.5 4.29086 9.98528 2.5 8 2.5C6.01472 2.5 4.5 4.29086 4.5 6.5V10.5L3 12.5Z"
      stroke="currentColor"
      stroke-width="1.5"
      stroke-linejoin="round"
    />
    <path d="M6.5 13.5C6.5 14.3284 7.17157 15 8 15C8.82843 15 9.5 14.3284 9.5 13.5" stroke="currentColor" stroke-width="1.5" />
  </svg>
`;

const LEFT_SLOT_BUTTONS = html`
  <bs-button variant="subtle" size="sm">Products</bs-button>
  <bs-button variant="subtle" size="sm">Solutions</bs-button>
  <bs-button variant="subtle" size="sm">Pricing</bs-button>
`;

const LEFT_SLOT_TABS = html`
  <bs-tabs type="bs-tab">
    <bs-tab selected>Products</bs-tab>
    <bs-tab>Solutions</bs-tab>
    <bs-tab>Pricing</bs-tab>
  </bs-tabs>
`;

// This is a Storybook-only demo toggle, not a real prop on bs-navigation-header itself -- the
// component's `left`/`right` slots already accept arbitrary content (buttons, tabs, links,
// anything), so baking a specific content choice into the actual component's API would narrow it
// unnecessarily. This just switches what the story slots in.
const leftSlotContent = (type: LeftContentType) => (type === 'tabs' ? LEFT_SLOT_TABS : LEFT_SLOT_BUTTONS);

// Icon-only buttons (no visible text label) get a hover/focus tooltip repeating their
// aria-label, same convention as bs-chatbot-header's own action buttons -- bs-tooltip is purely
// presentational (see its own class doc), so the show/hide-on-hover/focus-within CSS below is this
// story's responsibility, not something bs-navigation-header or bs-tooltip provide automatically.
const RIGHT_SLOT = html`
  <style>
    .story-nav-header-tooltip-wrapper {
      position: relative;
      display: inline-flex;
    }
    .story-nav-header-tooltip {
      position: absolute;
      top: 100%;
      left: 50%;
      transform: translateX(-50%);
      margin-top: var(--bs-spacing-100);
      opacity: 0;
      visibility: hidden;
      transition: opacity var(--bs-duration-fast) var(--bs-easing-standard);
      transition-delay: 0s;
      white-space: nowrap;
      z-index: 1;
    }
    .story-nav-header-tooltip-wrapper:hover .story-nav-header-tooltip,
    .story-nav-header-tooltip-wrapper:focus-within .story-nav-header-tooltip {
      opacity: 1;
      visibility: visible;
      transition-delay: var(--bs-duration-slow);
    }
  </style>
  <span class="story-nav-header-tooltip-wrapper">
    <bs-icon-button size="sm" variant="subtle" aria-label="Search">${searchIcon}</bs-icon-button>
    <bs-tooltip class="story-nav-header-tooltip" placement="top" aria-hidden="true">Search</bs-tooltip>
  </span>
  <span class="story-nav-header-tooltip-wrapper">
    <bs-icon-button size="sm" variant="subtle" aria-label="Notifications">${bellIcon}</bs-icon-button>
    <bs-tooltip class="story-nav-header-tooltip" placement="top" aria-hidden="true">Notifications</bs-tooltip>
  </span>
  <bs-button variant="primary" size="sm">Sign in</bs-button>
`;

const meta: Meta<BsNavigationHeaderArgs> = {
  title: 'Components/bs-navigation-header',
  parameters: { docs: { description: { component: componentDescription('bs-navigation-header') } }, layout: 'fullscreen' },
  render: args => html`
    <bs-navigation-header alignment=${args.alignment} skip-to-content-href=${ifDefined(args.skipToContentHref || undefined)}>
      <div slot="left" style="display: contents;">${leftSlotContent(args.leftContentType)}</div>
      <div slot="right" style="display: contents;">${RIGHT_SLOT}</div>
    </bs-navigation-header>
  `,
  argTypes: {
    alignment: { control: 'select', options: alignments, description: propDescription('bs-navigation-header', 'alignment') },
    skipToContentHref: { control: 'text', description: propDescription('bs-navigation-header', 'skipToContentHref') },
    leftContentType: {
      control: 'select',
      options: leftContentTypes,
      description: 'Storybook-only demo toggle: what to render in the `left` slot (not a real prop on bs-navigation-header -- the slot accepts anything).',
    },
  },
  args: {
    alignment: 'default',
    skipToContentHref: '',
    leftContentType: 'buttons',
  },
};

export default meta;
type Story = StoryObj<BsNavigationHeaderArgs>;

export const Default: Story = {};

export const Center: Story = {
  args: { alignment: 'center' },
};

export const WithNavigationDrawer: Story = {
  name: 'With navigation drawer',
  args: { alignment: 'with-navigation-drawer' },
};

export const WithTabs: Story = {
  name: 'Left slot as tabs',
  args: { leftContentType: 'tabs' },
};

export const SkipToContent: Story = {
  name: 'Skip to content',
  // Press Tab from the top of this story to focus the (normally offscreen) skip link and see it
  // come into view, then Enter/Space to jump straight to the #main-content landmark below,
  // bypassing the left/right slot content in between.
  args: { skipToContentHref: '#main-content' },
  render: args => html`
    <div>
      <bs-navigation-header alignment=${args.alignment} skip-to-content-href=${ifDefined(args.skipToContentHref || undefined)}>
        <div slot="left" style="display: contents;">${leftSlotContent(args.leftContentType)}</div>
        <div slot="right" style="display: contents;">${RIGHT_SLOT}</div>
      </bs-navigation-header>
      <main id="main-content" tabindex="-1" style="padding: 24px; font-family: sans-serif;">
        <h1 style="margin: 0;">Main content</h1>
        <p>This is the landmark the skip link jumps to.</p>
      </main>
    </div>
  `,
};
