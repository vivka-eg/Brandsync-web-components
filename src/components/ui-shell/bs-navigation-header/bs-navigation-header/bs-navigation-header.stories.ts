import type { Meta, StoryObj } from '@storybook/web-components-vite';
import { html } from 'lit';
import { ifDefined } from 'lit/directives/if-defined.js';
import { componentDescription, propDescription } from '../../../../stories-utils';

type BsNavigationHeaderAlignment = 'default' | 'center' | 'with-navigation-drawer';
type LeftContentType = 'buttons' | 'tabs';

const alignments: BsNavigationHeaderAlignment[] = ['default', 'center', 'with-navigation-drawer'];
const leftContentTypes: LeftContentType[] = ['buttons', 'tabs'];

interface BsNavigationHeaderArgs {
  alignment: BsNavigationHeaderAlignment;
  skipToContentHref: string;
  leftContentType: LeftContentType;
  logoBackground: 'auto' | 'light' | 'dark';
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

const switcherIcon = html`
  <svg viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
    <rect x="2" y="2" width="4.5" height="4.5" rx="1" stroke="currentColor" stroke-width="1.5" />
    <rect x="9.5" y="2" width="4.5" height="4.5" rx="1" stroke="currentColor" stroke-width="1.5" />
    <rect x="2" y="9.5" width="4.5" height="4.5" rx="1" stroke="currentColor" stroke-width="1.5" />
    <rect x="9.5" y="9.5" width="4.5" height="4.5" rx="1" stroke="currentColor" stroke-width="1.5" />
  </svg>
`;

// appShell()'s own item icons -- same slot="icon"/viewBox="0 0 24 24"/stroke-width="1.5" convention
// as bs-navigation-drawer.stories.ts's own bookIcon/gridIcon/accessibilityIcon (not reused directly
// -- that's a different file/module, and these are semantically matched to "Dashboard"/"Reports"/
// "Settings" specifically rather than the Foundation/Components docs-nav labels those were drawn
// for).
const dashboardIcon = html`
  <svg slot="icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
    <rect x="3.5" y="3.5" width="8" height="8" rx="1" stroke="currentColor" stroke-width="1.5" />
    <rect x="13.5" y="3.5" width="7" height="4" rx="1" stroke="currentColor" stroke-width="1.5" />
    <rect x="13.5" y="9.5" width="7" height="8.5" rx="1" stroke="currentColor" stroke-width="1.5" />
    <rect x="3.5" y="13.5" width="8" height="4.5" rx="1" stroke="currentColor" stroke-width="1.5" />
  </svg>
`;

const reportsIcon = html`
  <svg slot="icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
    <path d="M4 20V10M4 20H20M10 20V6M16 20V13" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
  </svg>
`;

const settingsIcon = html`
  <svg slot="icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
    <circle cx="12" cy="12" r="3" stroke="currentColor" stroke-width="1.5" />
    <path
      d="M12 2.5V5M12 19V21.5M4.22 4.22L5.94 5.94M18.06 18.06L19.78 19.78M2.5 12H5M19 12H21.5M4.22 19.78L5.94 18.06M18.06 5.94L19.78 4.22"
      stroke="currentColor"
      stroke-width="1.5"
      stroke-linecap="round"
    />
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
    /* bs-badge's default shape is a pill sized for label text (32px tall, 16px side padding) --
       too large for a compact unread-count overlay. Restyled via its own ::part(container) (the
       sanctioned external-customization surface for shadow-DOM parts, per CONVENTIONS.md), not a
       new component or a fork of bs-badge -- same component, same "error" color variant, just a
       tighter shape for this corner-badge placement, matching the "Numeric" badge shape shown in
       the Brandsync design system's own Badge spec.
       Absolutely positioned relative to the shared tooltip wrapper above so it doesn't shift icon
       layout. bs-icon-button size="sm" is a 40px hit area around a 16px icon glyph (12px of
       padding on each side), so top/right are offset from the WRAPPER's own corner, not the
       button's -- centering the badge on the visible bell glyph's corner (12px inset, minus half
       the badge's own 16px) instead of the button's much larger outer edge, which left it looking
       like a disconnected, oversized blob floating in the button's padding. */
    .story-nav-header-badge {
      /* bs-badge's "error" variant reads --bs-badge-bg-error-container/--bs-badge-text-error --
         the subtle/light error style. A notification count needs the solid, high-contrast look
         instead, and the vendored tokens already define exactly that pairing
         (--bs-badge-bg-error, --text-inverse) -- this just points the two custom properties
         bs-badge.css actually reads at those solid values instead, for this one instance. */
      --bs-badge-bg-error-container: var(--bs-badge-bg-error);
      --bs-badge-text-error: var(--bs-text-inverse);
    }
    .story-nav-header-badge::part(container) {
      position: absolute;
      top: 4px;
      right: 4px;
      height: var(--bs-font-size-md);
      min-width: var(--bs-font-size-md);
      padding: 0 3px;
      font-size: var(--bs-font-size-2xs);
      line-height: var(--bs-font-size-md);
      border: 2px solid var(--bs-surface-base);
      box-sizing: border-box;
    }
  </style>
  <span class="story-nav-header-tooltip-wrapper">
    <bs-icon-button size="sm" variant="subtle" aria-label="Search">${searchIcon}</bs-icon-button>
    <bs-tooltip class="story-nav-header-tooltip" placement="top" aria-hidden="true">Search</bs-tooltip>
  </span>
  <span class="story-nav-header-tooltip-wrapper">
    <bs-icon-button size="sm" variant="subtle" aria-label="Notifications, 4 unread">${bellIcon}</bs-icon-button>
    <bs-badge class="story-nav-header-badge" variant="error" aria-hidden="true">4</bs-badge>
    <bs-tooltip class="story-nav-header-tooltip" placement="top" aria-hidden="true">Notifications</bs-tooltip>
  </span>
  <bs-button variant="primary" size="sm">Sign in</bs-button>
`;

// "Switcher" here means a workspace/account switcher panel that slides in from the right edge of
// the viewport when its trigger icon is clicked -- not a real bs-* component (no generic
// slide-in-from-right panel exists in this library yet; bs-modal is a centered dialog, not this),
// so this is plain story-only markup: a fixed-position aside toggled via a direct classList
// change on click, not lit's own reactive re-render (a Storybook `render` function re-runs on
// args changes, not on arbitrary DOM events, so state that needs to survive a click has to live in
// the DOM itself here, the same way the tooltip hover states above are pure CSS rather than JS
// state).
const SWITCHER_PANEL = html`
  <style>
    .story-switcher-backdrop {
      position: fixed;
      inset: 0;
      background: rgb(0 0 0 / 32%);
      opacity: 0;
      visibility: hidden;
      transition:
        opacity var(--bs-duration-default) var(--bs-easing-standard),
        visibility var(--bs-duration-default) var(--bs-easing-standard);
      z-index: 10;
    }
    .story-switcher-panel {
      position: fixed;
      top: 0;
      right: 0;
      bottom: 0;
      width: 320px;
      max-width: 100%;
      background: var(--bs-surface-base);
      box-shadow: var(--bs-shadow-lg, 0 8px 24px rgb(0 0 0 / 20%));
      transform: translateX(100%);
      transition: transform var(--bs-duration-default) var(--bs-easing-standard);
      z-index: 11;
      display: flex;
      flex-direction: column;
      padding: var(--bs-spacing-300);
      gap: var(--bs-spacing-200);
      box-sizing: border-box;
    }
    .story-switcher-backdrop.story-switcher--open {
      opacity: 1;
      visibility: visible;
    }
    .story-switcher-panel.story-switcher--open {
      transform: translateX(0);
    }
    .story-switcher-heading {
      display: flex;
      align-items: center;
      justify-content: space-between;
      font-family: var(--bs-typography-font-family-heading);
      font-weight: var(--bs-font-weight-bold);
      font-size: var(--bs-font-size-md);
      color: var(--bs-text-default);
    }
    .story-switcher-list {
      display: flex;
      flex-direction: column;
      gap: var(--bs-spacing-100);
    }
  </style>
  <div class="story-switcher-backdrop" @click=${(e: Event) => toggleSwitcher(e, false)}></div>
  <aside class="story-switcher-panel" aria-label="Switch workspace">
    <div class="story-switcher-heading">
      Switch workspace
      <bs-icon-button size="sm" variant="subtle" aria-label="Close" @click=${(e: Event) => toggleSwitcher(e, false)}>
        <svg viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
          <path d="M3 3L13 13M13 3L3 13" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" />
        </svg>
      </bs-icon-button>
    </div>
    <div class="story-switcher-list">
      <bs-button variant="subtle">Acme Corp</bs-button>
      <bs-button variant="subtle">Acme Corp -- Staging</bs-button>
      <bs-button variant="subtle">Personal Workspace</bs-button>
    </div>
  </aside>
`;

// Shared by both the backdrop and every open/close trigger -- walks up to the common app-shell
// wrapper so this works regardless of which story renders it in, then toggles both halves in
// lockstep (only the panel needs the open class for its slide-in transform, but the backdrop
// needs its own visibility toggle too since a transparent-but-still-fixed backdrop would
// otherwise keep eating clicks).
function toggleSwitcher(e: Event, open: boolean) {
  const root = (e.currentTarget as HTMLElement).closest('.story-nav-header-shell, body') ?? document.body;
  root.querySelector('.story-switcher-backdrop')?.classList.toggle('story-switcher--open', open);
  root.querySelector('.story-switcher-panel')?.classList.toggle('story-switcher--open', open);
}

const RIGHT_SLOT_WITH_SWITCHER = html`
  ${RIGHT_SLOT}
  <span class="story-nav-header-tooltip-wrapper">
    <bs-icon-button size="sm" variant="subtle" aria-label="Switch workspace" @click=${(e: Event) => toggleSwitcher(e, true)}>
      ${switcherIcon}
    </bs-icon-button>
    <bs-tooltip class="story-nav-header-tooltip" placement="top" aria-hidden="true">Switch workspace</bs-tooltip>
  </span>
  ${SWITCHER_PANEL}
`;

// Shared by the "with Side Nav" stories below -- a real app-shell layout, not just the header in
// isolation: this header spans the FULL viewport width across the top (a plain flex column), with
// a row below it holding the full-height bs-navigation-drawer on the left and the content area
// filling the rest. The drawer is left at its default `collapsible=true` here (no attribute set at
// all) so its own collapse toggle renders and actually works in these demos, same as any other
// real page using both components together.
//
// `?collapsed=` -- lit's boolean directive, NOT plain `collapsed=` interpolation. This ONLY sets
// the drawer's *initial* collapsed state; once mounted, the drawer's own mutable `collapsed` prop
// takes over (clicking its toggle flips it directly, per that component's own docs), independent
// of this story's args. bs-navigation-drawer.css's collapsed styling is a plain CSS
// attribute-presence selector (`:host([collapsed])`), which matches on the attribute merely
// EXISTING, regardless of its value -- plain interpolation stringifies `false` to the literal
// attribute `collapsed="false"`, which is still *present*, so the drawer rendered as its 96px
// collapsed rail even when passed `false` (no visible title/search/items), until this was caught.
// The boolean directive is the only one of the two forms that actually omits the attribute for a
// falsy value.
//
// `drawerShowLogo` defaults `true` and maps to `show-logo`, which -- unlike `collapsed` above -- is
// a plain JS conditional in bs-navigation-drawer.tsx's render(), not a CSS presence selector, so
// plain interpolation (not the `?attr=` boolean directive) is the correct form here instead.
function appShell(headerContent: ReturnType<typeof html>, drawerCollapsed = false, drawerShowLogo = true) {
  return html`
    <div class="story-nav-header-shell" style="height: 100vh; display: flex; flex-direction: column;">
      ${headerContent}
      <div style="flex: 1; min-height: 0; display: flex;">
        <bs-navigation-drawer heading="Main Menu" ?collapsed=${drawerCollapsed} show-logo=${drawerShowLogo}>
          <bs-input slot="search" type="search" placeholder="Search"></bs-input>
          <bs-navigation-drawer-item selected>${dashboardIcon} Dashboard</bs-navigation-drawer-item>
          <bs-navigation-drawer-item>${reportsIcon} Reports</bs-navigation-drawer-item>
          <bs-navigation-drawer-item>${settingsIcon} Settings</bs-navigation-drawer-item>
        </bs-navigation-drawer>
        <main style="flex: 1; min-width: 0; overflow: auto; padding: var(--bs-spacing-400); font-family: sans-serif; color: var(--bs-text-muted);">
          Page content
        </main>
      </div>
    </div>
  `;
}

const meta: Meta<BsNavigationHeaderArgs> = {
  title: 'UI Shell/bs-navigation-header',
  parameters: { docs: { description: { component: componentDescription('bs-navigation-header') } }, layout: 'fullscreen' },
  render: args => html`
    <bs-navigation-header
      alignment=${args.alignment}
      skip-to-content-href=${ifDefined(args.skipToContentHref || undefined)}
      logo-background=${args.logoBackground}
    >
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
    logoBackground: { control: 'select', options: ['auto', 'light', 'dark'], description: propDescription('bs-navigation-header', 'logoBackground') },
  },
  args: {
    alignment: 'default',
    skipToContentHref: '',
    leftContentType: 'buttons',
    logoBackground: 'auto',
  },
};

export default meta;
type Story = StoryObj<BsNavigationHeaderArgs>;

// Story naming follows the "Header Base [with X [and Y]]" convention: the bare bar first, then
// each slot added on its own, then combined, then the alignment/content variants layered on top
// of the fully-populated ("Navigation and Actions") bar.

export const HeaderBase: Story = {
  name: 'Header Base',
  render: args => html`<bs-navigation-header alignment=${args.alignment}></bs-navigation-header>`,
};

export const HeaderBaseWithNavigation: Story = {
  name: 'Header Base with Navigation',
  render: args => html`
    <bs-navigation-header alignment=${args.alignment}>
      <div slot="left" style="display: contents;">${leftSlotContent(args.leftContentType)}</div>
    </bs-navigation-header>
  `,
};

export const HeaderBaseWithActions: Story = {
  name: 'Header Base with Actions',
  render: args => html`
    <bs-navigation-header alignment=${args.alignment}>
      <div slot="right" style="display: contents;">${RIGHT_SLOT}</div>
    </bs-navigation-header>
  `,
};

export const HeaderBaseWithNavigationAndActions: Story = {
  name: 'Header Base with Navigation and Actions',
};

export const HeaderBaseWithNavigationAndActionsCentered: Story = {
  name: 'Header Base with Navigation and Actions, Centered',
  args: { alignment: 'center' },
};

export const HeaderBaseWithNavigationAndActionsNoLogo: Story = {
  name: 'Header Base with Navigation and Actions (No Logo)',
  args: { alignment: 'with-navigation-drawer' },
};

export const HeaderBaseWithNavigationAndActionsTabs: Story = {
  name: 'Header Base with Navigation and Actions, Tabs',
  args: { leftContentType: 'tabs' },
};

export const HeaderBaseDark: Story = {
  name: 'Header Base with Navigation and Actions (Dark)',
  // `data-theme="dark"` is set on a wrapper scoped to just this story, NOT via a globals override
  // on the toolbar's Theme switch -- that switch's decorator (see .storybook/preview.ts) sets the
  // attribute on the shared document root, which is fine in isolation but breaks down on this
  // component's Docs page: every story renders together in one document there, so one story
  // forcing a document-wide theme while its siblings render alongside it under the *other* theme
  // causes exactly the kind of thrash/hang a shared mutable global produces. A local wrapper gets
  // the identical CSS custom property cascade (tokens.css's dark block matches any
  // `[data-theme="dark"]` element, not specifically <html>) without touching shared state.
  // logoBackground is left at its "auto" default here deliberately -- this story demonstrates that
  // no manual prop is needed for the logo to follow the theme; see logoBackground's own docs for
  // the explicit-override case.
  render: args => html`
    <div data-theme="dark" style="background: var(--bs-surface-base);">
      <bs-navigation-header alignment=${args.alignment} logo-background=${args.logoBackground}>
        <div slot="left" style="display: contents;">${leftSlotContent(args.leftContentType)}</div>
        <div slot="right" style="display: contents;">${RIGHT_SLOT}</div>
      </bs-navigation-header>
    </div>
  `,
};

export const HeaderBaseWithSkipLink: Story = {
  name: 'Header Base with Skip Link',
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

export const HeaderBaseWithActionsAndSwitcher: Story = {
  name: 'Header Base with Actions and Switcher',
  // Click the grid icon (the rightmost action, next to Notifications) to open the "switcher"
  // panel -- a workspace/account switcher that slides in from the right edge of the viewport. See
  // RIGHT_SLOT_WITH_SWITCHER's own comment for why this is plain story markup rather than a new
  // library component.
  render: args => html`
    <bs-navigation-header alignment=${args.alignment}>
      <div slot="left" style="display: contents;">${leftSlotContent(args.leftContentType)}</div>
      <div slot="right" style="display: contents;">${RIGHT_SLOT_WITH_SWITCHER}</div>
    </bs-navigation-header>
  `,
};

export const HeaderBaseWithSideNav: Story = {
  name: 'Header Base with Side Nav',
  // The real app-shell composition: this header (alignment="with-navigation-drawer", so it
  // doesn't render its own logo -- the drawer's logo already covers that) alongside a full,
  // expanded bs-navigation-drawer. Bare header otherwise (no left/right slot content) to isolate
  // just the layout; see "Header Base with Navigation, Actions and Side Nav" below for the fully
  // populated version.
  args: { alignment: 'with-navigation-drawer' },
  render: args => appShell(html`<bs-navigation-header alignment=${args.alignment}></bs-navigation-header>`),
};

export const HeaderBaseWithNavigationActionsAndSideNav: Story = {
  name: 'Header Base with Navigation, Actions and Side Nav',
  // Same app-shell composition as "Header Base with Side Nav", but with the header's own
  // left/right slots populated too -- the fully-assembled real-world shape of this layout.
  args: { alignment: 'with-navigation-drawer' },
  render: args =>
    appShell(html`
      <bs-navigation-header alignment=${args.alignment}>
        <div slot="left" style="display: contents;">${leftSlotContent(args.leftContentType)}</div>
        <div slot="right" style="display: contents;">${RIGHT_SLOT}</div>
      </bs-navigation-header>
    `),
};

export const HeaderBaseWithSideNavHeaderLogo: Story = {
  name: 'Header Base with Side Nav (Header Owns Logo)',
  // The inverse pairing from the two stories above: this header keeps its OWN logo
  // (alignment="default", not "with-navigation-drawer") and the drawer's is turned off instead
  // (bs-navigation-drawer's showLogo={false}) -- so the brand mark still only ever appears once,
  // just on the other side of the pairing. Useful when the header, not the drawer, is the piece
  // that should carry brand identity in a given app's shell.
  args: { alignment: 'default' },
  render: args =>
    appShell(
      html`
        <bs-navigation-header alignment=${args.alignment}>
          <div slot="right" style="display: contents;">${RIGHT_SLOT}</div>
        </bs-navigation-header>
      `,
      false,
      false,
    ),
};
