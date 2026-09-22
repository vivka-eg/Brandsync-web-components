import { render, h, describe, it, expect } from '@stencil/vitest';

describe('bs-navigation-header', () => {
  it('renders a <header> landmark with the logo by default', async () => {
    const { root } = await render(<bs-navigation-header></bs-navigation-header>);
    expect(root.shadowRoot.querySelector('header')).not.toBeNull();
    expect(root.shadowRoot.querySelector('[part="logo"]')).not.toBeNull();
  });

  it('applies the "default" alignment class by default', async () => {
    const { root } = await render(<bs-navigation-header></bs-navigation-header>);
    expect(root.shadowRoot.querySelector('header')).toHaveClass('bs-navigation-header--default');
  });

  it('renders the logo for "center" alignment', async () => {
    const { root } = await render(<bs-navigation-header alignment="center"></bs-navigation-header>);
    expect(root.shadowRoot.querySelector('[part="logo"]')).not.toBeNull();
    expect(root.shadowRoot.querySelector('header')).toHaveClass('bs-navigation-header--center');
  });

  it('does not render the logo for "with-navigation-drawer" alignment', async () => {
    const { root } = await render(<bs-navigation-header alignment="with-navigation-drawer"></bs-navigation-header>);
    expect(root.shadowRoot.querySelector('[part="logo"]')).toBeNull();
    expect(root.shadowRoot.querySelector('header')).toHaveClass('bs-navigation-header--with-navigation-drawer');
  });

  it('renders the left and right slots', async () => {
    const { root } = await render(<bs-navigation-header></bs-navigation-header>);
    expect(root.shadowRoot.querySelector('slot[name="left"]')).not.toBeNull();
    expect(root.shadowRoot.querySelector('slot[name="right"]')).not.toBeNull();
  });

  it('projects light-DOM content into the left/right slots', async () => {
    const { root } = await render(
      <bs-navigation-header>
        <button slot="left">Left action</button>
        <button slot="right">Right action</button>
      </bs-navigation-header>,
    );
    const leftSlot = root.shadowRoot.querySelector('slot[name="left"]') as HTMLSlotElement;
    const rightSlot = root.shadowRoot.querySelector('slot[name="right"]') as HTMLSlotElement;
    expect(leftSlot.assignedElements()[0].textContent).toBe('Left action');
    expect(rightSlot.assignedElements()[0].textContent).toBe('Right action');
  });

  it('sets aria-label on the header when ariaLabel is provided', async () => {
    const { root } = await render(<bs-navigation-header ariaLabel="Main navigation"></bs-navigation-header>);
    expect(root.shadowRoot.querySelector('header')).toEqualAttribute('aria-label', 'Main navigation');
  });

  it('omits aria-label when ariaLabel is not provided', async () => {
    const { root } = await render(<bs-navigation-header></bs-navigation-header>);
    expect(root.shadowRoot.querySelector('header').hasAttribute('aria-label')).toBe(false);
  });

  describe('skip-to-content link', () => {
    it('does not render a skip link when skipToContentHref is not set', async () => {
      const { root } = await render(<bs-navigation-header></bs-navigation-header>);
      expect(root.shadowRoot.querySelector('[part="skip-link"]')).toBeNull();
    });

    it('renders a skip link pointing at skipToContentHref, with a default label', async () => {
      const { root } = await render(<bs-navigation-header skipToContentHref="#main-content"></bs-navigation-header>);
      const link = root.shadowRoot.querySelector('[part="skip-link"]') as HTMLAnchorElement;
      expect(link).not.toBeNull();
      expect(link).toEqualAttribute('href', '#main-content');
      expect(link.textContent).toBe('Skip to main content');
    });

    it('uses a custom skipToContentLabel when provided', async () => {
      const { root } = await render(
        <bs-navigation-header skipToContentHref="#main-content" skipToContentLabel="Jump to content"></bs-navigation-header>,
      );
      const link = root.shadowRoot.querySelector('[part="skip-link"]') as HTMLAnchorElement;
      expect(link.textContent).toBe('Jump to content');
    });

    it('renders the skip link before the logo, so it is the first focusable element', async () => {
      const { root } = await render(<bs-navigation-header skipToContentHref="#main-content"></bs-navigation-header>);
      const header = root.shadowRoot.querySelector('header');
      expect(header.firstElementChild).toEqualAttribute('part', 'skip-link');
    });
  });

  describe('logoBackground', () => {
    it('forwards the default "auto" background to the internal bs-logo', async () => {
      const { root } = await render(<bs-navigation-header></bs-navigation-header>);
      const logo = root.shadowRoot.querySelector('bs-logo') as HTMLElement & { background: string };
      expect(logo.background).toBe('auto');
    });

    it('forwards logoBackground="dark" to the internal bs-logo', async () => {
      const { root } = await render(<bs-navigation-header logoBackground="dark"></bs-navigation-header>);
      const logo = root.shadowRoot.querySelector('bs-logo') as HTMLElement & { background: string };
      expect(logo.background).toBe('dark');
    });
  });
});
