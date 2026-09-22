import type { Meta, StoryObj } from '@storybook/web-components-vite';
import { html } from 'lit';
import { componentDescription, propDescription } from '../../../../stories-utils';

interface BsNavigationDrawerArgs {
  heading: string;
  collapsible: boolean;
  logoBackground: 'auto' | 'light' | 'dark';
}

const bookIcon = html`
  <svg slot="icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
    <path
      d="M4 4.5C4 3.67157 4.67157 3 5.5 3H18.5C19.3284 3 20 3.67157 20 4.5V19.5C20 20.3284 19.3284 21 18.5 21H5.5C4.67157 21 4 20.3284 4 19.5V4.5Z"
      stroke="currentColor"
      stroke-width="1.5"
    />
    <path d="M8 3V21" stroke="currentColor" stroke-width="1.5" />
  </svg>
`;

const gridIcon = html`
  <svg slot="icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
    <rect x="3.5" y="3.5" width="7" height="7" rx="1" stroke="currentColor" stroke-width="1.5" />
    <rect x="13.5" y="3.5" width="7" height="7" rx="1" stroke="currentColor" stroke-width="1.5" />
    <rect x="3.5" y="13.5" width="7" height="7" rx="1" stroke="currentColor" stroke-width="1.5" />
    <rect x="13.5" y="13.5" width="7" height="7" rx="1" stroke="currentColor" stroke-width="1.5" />
  </svg>
`;

const accessibilityIcon = html`
  <svg slot="icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
    <circle cx="12" cy="12" r="9" stroke="currentColor" stroke-width="1.5" />
    <circle cx="12" cy="8" r="1.25" fill="currentColor" />
    <path d="M6.5 10.5H17.5M12 10.5V17M9.5 17L11 13M14.5 17L13 13" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" />
  </svg>
`;

// The items list, shared across stories -- one plain leaf item (selected), one plain leaf item
// (unselected), and one expandable group header with nested children, matching the task spec's
// requirement of demonstrating all three states assembled together.
// ariaLabel is optional (the visible caption stays visible even when collapsed), set here anyway
// just to demonstrate the prop exists.
const ITEMS = html`
  <bs-navigation-drawer-item selected ariaLabel="Introduction">${accessibilityIcon} Introduction</bs-navigation-drawer-item>
  <bs-navigation-drawer-item ariaLabel="Accessibility">${bookIcon} Accessibility</bs-navigation-drawer-item>
  <bs-navigation-drawer-item expandable expanded ariaLabel="Foundation">
    ${gridIcon} Foundation
    <bs-navigation-drawer-item slot="children" nested>Colors</bs-navigation-drawer-item>
    <bs-navigation-drawer-item slot="children" nested>Typography</bs-navigation-drawer-item>
    <bs-navigation-drawer-item slot="children" nested>Spacing</bs-navigation-drawer-item>
  </bs-navigation-drawer-item>
  <bs-navigation-drawer-item expandable ariaLabel="Components">
    ${gridIcon} Components
    <bs-navigation-drawer-item slot="children" nested>Button</bs-navigation-drawer-item>
    <bs-navigation-drawer-item slot="children" nested>Checkbox</bs-navigation-drawer-item>
    <bs-navigation-drawer-item slot="children" nested>Switch</bs-navigation-drawer-item>
  </bs-navigation-drawer-item>
`;

// Same items, without any icon slot content -- bs-navigation-drawer-item's icon wrapper only
// reserves space when populated, so these render as plain text rows (Figma's own "nested" rows
// already never have icons; this additionally omits them from the top-level rows too, for the
// icon-less "Fixed Side Nav" stories below).
const ITEMS_NO_ICONS = html`
  <bs-navigation-drawer-item selected>Introduction</bs-navigation-drawer-item>
  <bs-navigation-drawer-item>Accessibility</bs-navigation-drawer-item>
  <bs-navigation-drawer-item expandable expanded>
    Foundation
    <bs-navigation-drawer-item slot="children" nested>Colors</bs-navigation-drawer-item>
    <bs-navigation-drawer-item slot="children" nested>Typography</bs-navigation-drawer-item>
    <bs-navigation-drawer-item slot="children" nested>Spacing</bs-navigation-drawer-item>
  </bs-navigation-drawer-item>
  <bs-navigation-drawer-item expandable>
    Components
    <bs-navigation-drawer-item slot="children" nested>Button</bs-navigation-drawer-item>
    <bs-navigation-drawer-item slot="children" nested>Checkbox</bs-navigation-drawer-item>
    <bs-navigation-drawer-item slot="children" nested>Switch</bs-navigation-drawer-item>
  </bs-navigation-drawer-item>
`;

// A plain divider between item groups (e.g. Carbon's cds-side-nav-divider: a 1px rule with 8px
// vertical / 16px horizontal margin) -- not a Figma-specified element in this design system, so
// it's kept as story-only markup rather than a new formal bs-* component.
const DIVIDER = html`<hr style="width: 100%; border: none; border-top: 1px solid var(--bs-border-default); margin: var(--bs-spacing-100) 0;" />`;

const ITEMS_WITH_DIVIDER = html`
  <bs-navigation-drawer-item selected>Introduction</bs-navigation-drawer-item>
  <bs-navigation-drawer-item>Accessibility</bs-navigation-drawer-item>
  ${DIVIDER}
  <bs-navigation-drawer-item expandable expanded>
    Foundation
    <bs-navigation-drawer-item slot="children" nested>Colors</bs-navigation-drawer-item>
    <bs-navigation-drawer-item slot="children" nested>Typography</bs-navigation-drawer-item>
    <bs-navigation-drawer-item slot="children" nested>Spacing</bs-navigation-drawer-item>
  </bs-navigation-drawer-item>
  <bs-navigation-drawer-item expandable>
    Components
    <bs-navigation-drawer-item slot="children" nested>Button</bs-navigation-drawer-item>
    <bs-navigation-drawer-item slot="children" nested>Checkbox</bs-navigation-drawer-item>
    <bs-navigation-drawer-item slot="children" nested>Switch</bs-navigation-drawer-item>
  </bs-navigation-drawer-item>
`;

const meta: Meta<BsNavigationDrawerArgs> = {
  title: 'UI Shell/bs-navigation-drawer/bs-navigation-drawer',
  parameters: { docs: { description: { component: componentDescription('bs-navigation-drawer') } }, layout: 'fullscreen' },
  // "Fixed Side Nav" (Carbon's own naming) means never collapsible, so args.collapsible defaults
  // to false below for this default render every "Fixed Side Nav*" story shares. The dedicated
  // Collapsed story further down opts back in explicitly.
  //
  // Plain attribute binding (collapsible=${args.collapsible}), NOT lit's ?collapsible= boolean
  // directive -- collapsible defaults to true on the component, and ?attr= booleans OMIT the
  // attribute for a falsy value. Stencil can't tell "never set" apart from "explicitly false" for
  // a prop that defaults true, so it would silently keep its own default (true) -- the exact same
  // bug found and fixed in bs-slider's showLabel earlier this session.
  render: args => html`
    <div style="height: 100vh; display: flex;">
      <bs-navigation-drawer heading=${args.heading} collapsible=${args.collapsible} logo-background=${args.logoBackground}>
        <bs-input slot="search" type="search" placeholder="Search"></bs-input>
        ${ITEMS_NO_ICONS}
      </bs-navigation-drawer>
    </div>
  `,
  argTypes: {
    heading: { control: 'text', description: propDescription('bs-navigation-drawer', 'heading') },
    collapsible: { control: 'boolean', description: propDescription('bs-navigation-drawer', 'collapsible') },
    logoBackground: { control: 'select', options: ['auto', 'light', 'dark'], description: propDescription('bs-navigation-drawer', 'logoBackground') },
  },
  args: {
    heading: 'Main Menu',
    collapsible: false,
    logoBackground: 'auto',
  },
};

export default meta;
type Story = StoryObj<BsNavigationDrawerArgs>;

// Story naming follows the same "[Base] [with X]" convention as bs-navigation-header's stories,
// matching Carbon's own side-nav story names (Fixed Side Nav / with Divider / with Icons) as a
// naming convention reference -- not a design/token match, just the naming pattern.

export const FixedSideNav: Story = {
  name: 'Fixed Side Nav',
};

export const FixedSideNavWithDivider: Story = {
  name: 'Fixed Side Nav with Divider',
  render: args => html`
    <div style="height: 100vh; display: flex;">
      <bs-navigation-drawer heading=${args.heading} collapsible=${args.collapsible}>
        <bs-input slot="search" type="search" placeholder="Search"></bs-input>
        ${ITEMS_WITH_DIVIDER}
      </bs-navigation-drawer>
    </div>
  `,
};

export const FixedSideNavWithIcons: Story = {
  name: 'Fixed Side Nav with Icons',
  render: args => html`
    <div style="height: 100vh; display: flex;">
      <bs-navigation-drawer heading=${args.heading} collapsible=${args.collapsible}>
        <bs-input slot="search" type="search" placeholder="Search"></bs-input>
        ${ITEMS}
      </bs-navigation-drawer>
    </div>
  `,
};

export const Collapsed: Story = {
  name: 'Collapsed',
  // Click the collapse toggle (the caret button next to the heading) to see it expand back --
  // `collapsed` is mutable/self-toggling, so this works with no extra story wiring.
  render: args => html`
    <div style="height: 100vh; display: flex;">
      <bs-navigation-drawer heading=${args.heading} collapsed>
        <bs-input slot="search" type="search" placeholder="Search"></bs-input>
        ${ITEMS}
      </bs-navigation-drawer>
    </div>
  `,
};

export const Dark: Story = {
  name: 'Fixed Side Nav (Dark)',
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
    <div data-theme="dark" style="height: 100vh; display: flex; background: var(--bs-surface-base);">
      <bs-navigation-drawer heading=${args.heading} collapsible=${args.collapsible} logo-background=${args.logoBackground}>
        <bs-input slot="search" type="search" placeholder="Search"></bs-input>
        ${ITEMS_NO_ICONS}
      </bs-navigation-drawer>
    </div>
  `,
};

export const WithoutSearch: Story = {
  name: 'Without a search slot',
  render: args => html`
    <div style="height: 100vh; display: flex;">
      <bs-navigation-drawer heading=${args.heading}>${ITEMS}</bs-navigation-drawer>
    </div>
  `,
};

export const EmptyItems: Story = {
  name: 'Empty items list',
  render: args => html`
    <div style="height: 100vh; display: flex;">
      <bs-navigation-drawer heading=${args.heading}>
        <bs-input slot="search" type="search" placeholder="Search"></bs-input>
      </bs-navigation-drawer>
    </div>
  `,
};
