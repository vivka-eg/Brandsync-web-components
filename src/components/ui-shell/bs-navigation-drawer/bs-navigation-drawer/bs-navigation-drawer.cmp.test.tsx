import { render, h, describe, it, expect } from '@stencil/vitest';

describe('bs-navigation-drawer', () => {
  it('renders a <nav> landmark with the logo', async () => {
    const { root } = await render(<bs-navigation-drawer></bs-navigation-drawer>);
    expect(root.shadowRoot.querySelector('nav')).not.toBeNull();
    expect(root.shadowRoot.querySelector('[part="logo"]')).not.toBeNull();
  });

  it('renders the default "Main Menu" heading', async () => {
    const { root } = await render(<bs-navigation-drawer></bs-navigation-drawer>);
    const title = root.shadowRoot.querySelector('[part="title"]');
    expect(title.textContent).toBe('Main Menu');
  });

  it('sets the <nav> landmark aria-label from heading', async () => {
    const { root } = await render(<bs-navigation-drawer heading="Admin Menu"></bs-navigation-drawer>);
    expect(root.shadowRoot.querySelector('nav')).toEqualAttribute('aria-label', 'Admin Menu');
  });

  it('renders a custom heading', async () => {
    const { root } = await render(<bs-navigation-drawer heading="Admin Menu"></bs-navigation-drawer>);
    const title = root.shadowRoot.querySelector('[part="title"]');
    expect(title.textContent).toBe('Admin Menu');
  });

  it('renders the search and default (items) slots', async () => {
    const { root } = await render(<bs-navigation-drawer></bs-navigation-drawer>);
    expect(root.shadowRoot.querySelector('slot[name="search"]')).not.toBeNull();
    expect(root.shadowRoot.querySelector('[part="items"] slot:not([name])')).not.toBeNull();
  });

  it('projects light-DOM content into the search and items slots', async () => {
    const { root } = await render(
      <bs-navigation-drawer>
        <input slot="search" />
        <button>Item one</button>
      </bs-navigation-drawer>,
    );
    const searchSlot = root.shadowRoot.querySelector('slot[name="search"]') as HTMLSlotElement;
    const itemsSlot = root.shadowRoot.querySelector('[part="items"] slot:not([name])') as HTMLSlotElement;
    expect(searchSlot.assignedElements()[0].tagName).toBe('INPUT');
    expect(itemsSlot.assignedElements()[0].textContent).toBe('Item one');
  });

  describe('collapsible', () => {
    it('renders the collapse toggle by default', async () => {
      const { root } = await render(<bs-navigation-drawer></bs-navigation-drawer>);
      expect(root.shadowRoot.querySelector('[part="collapse"]')).not.toBeNull();
    });

    it('renders no collapse toggle at all when collapsible is false', async () => {
      const { root } = await render(<bs-navigation-drawer collapsible={false}></bs-navigation-drawer>);
      expect(root.shadowRoot.querySelector('[part="collapse"]')).toBeNull();
    });
  });

  describe('collapse toggle', () => {
    it('renders a real button with an accessible label', async () => {
      const { root } = await render(<bs-navigation-drawer></bs-navigation-drawer>);
      const button = root.shadowRoot.querySelector('[part="collapse"]');
      expect(button.tagName).toBe('BUTTON');
      expect(button).toEqualAttribute('type', 'button');
      expect(button).toEqualAttribute('aria-label', 'Collapse');
      expect(button).toEqualAttribute('aria-pressed', 'false');
    });

    it('self-toggles collapsed and emits bsCollapse with the new value when clicked', async () => {
      const { root, waitForChanges, spyOnEvent } = await render(<bs-navigation-drawer></bs-navigation-drawer>);
      const collapseSpy = spyOnEvent('bsCollapse');
      (root.shadowRoot.querySelector('[part="collapse"]') as HTMLButtonElement).click();
      await waitForChanges();

      expect(root.hasAttribute('collapsed')).toBe(true);
      expect(collapseSpy).toHaveReceivedEventTimes(1);
      expect(collapseSpy).toHaveReceivedEventDetail(true);

      const button = root.shadowRoot.querySelector('[part="collapse"]');
      expect(button).toEqualAttribute('aria-label', 'Expand');
      expect(button).toEqualAttribute('aria-pressed', 'true');
    });

    it('toggles back to expanded on a second click', async () => {
      const { root, waitForChanges, spyOnEvent } = await render(<bs-navigation-drawer collapsed></bs-navigation-drawer>);
      const collapseSpy = spyOnEvent('bsCollapse');
      (root.shadowRoot.querySelector('[part="collapse"]') as HTMLButtonElement).click();
      await waitForChanges();

      expect(root.hasAttribute('collapsed')).toBe(false);
      expect(collapseSpy).toHaveReceivedEventDetail(false);
    });
  });

  describe('collapsed', () => {
    it('sets the nav landmark aria-label from heading, even when collapsed hides the visible title', async () => {
      const { root } = await render(<bs-navigation-drawer heading="Admin Menu" collapsed></bs-navigation-drawer>);
      expect(root.shadowRoot.querySelector('nav')).toEqualAttribute('aria-label', 'Admin Menu');
    });

    it('syncs collapsed onto direct-child bs-navigation-drawer-item elements', async () => {
      const { root, waitForChanges } = await render(
        <bs-navigation-drawer collapsed>
          <bs-navigation-drawer-item>Introduction</bs-navigation-drawer-item>
        </bs-navigation-drawer>,
      );
      await waitForChanges();
      const item = root.querySelector('bs-navigation-drawer-item');
      expect(item.hasAttribute('collapsed')).toBe(true);
    });

    it('syncs collapsed=false back onto items once turned back off', async () => {
      const { root, waitForChanges } = await render(
        <bs-navigation-drawer collapsed>
          <bs-navigation-drawer-item>Introduction</bs-navigation-drawer-item>
        </bs-navigation-drawer>,
      );
      root.removeAttribute('collapsed');
      await waitForChanges();
      const item = root.querySelector('bs-navigation-drawer-item');
      expect(item.hasAttribute('collapsed')).toBe(false);
    });

    it('does not sync collapsed onto nested (non-direct-child) items', async () => {
      const { root, waitForChanges } = await render(
        <bs-navigation-drawer collapsed>
          <bs-navigation-drawer-item expandable expanded>
            Foundation
            <bs-navigation-drawer-item slot="children" nested>
              Colors
            </bs-navigation-drawer-item>
          </bs-navigation-drawer-item>
        </bs-navigation-drawer>,
      );
      await waitForChanges();
      const nestedItem = root.querySelector('[slot="children"]');
      expect(nestedItem.hasAttribute('collapsed')).toBe(false);
    });

    it('shows a search-trigger button instead of the search slot', async () => {
      const { root, waitForChanges } = await render(<bs-navigation-drawer collapsed></bs-navigation-drawer>);
      await waitForChanges();
      const trigger = root.shadowRoot.querySelector('[part="search-trigger"]');
      expect(getComputedStyle(trigger as Element).display).not.toBe('none');
    });

    it('emits bsSearchClick when the search-trigger button is clicked', async () => {
      const { root, waitForChanges, spyOnEvent } = await render(<bs-navigation-drawer collapsed></bs-navigation-drawer>);
      await waitForChanges();
      const searchClickSpy = spyOnEvent('bsSearchClick');
      (root.shadowRoot.querySelector('[part="search-trigger"]') as HTMLButtonElement).click();
      expect(searchClickSpy).toHaveReceivedEventTimes(1);
    });

    it('hides the search-trigger button when not collapsed', async () => {
      const { root } = await render(<bs-navigation-drawer></bs-navigation-drawer>);
      const trigger = root.shadowRoot.querySelector('[part="search-trigger"]');
      expect(getComputedStyle(trigger as Element).display).toBe('none');
    });
  });

  describe('logoBackground', () => {
    it('forwards the default "auto" background to both internal bs-logo elements', async () => {
      const { root } = await render(<bs-navigation-drawer></bs-navigation-drawer>);
      const logos = root.shadowRoot.querySelectorAll('bs-logo') as NodeListOf<HTMLElement & { background: string }>;
      expect(logos).toHaveLength(2);
      logos.forEach(logo => expect(logo.background).toBe('auto'));
    });

    it('forwards logoBackground="dark" to both internal bs-logo elements', async () => {
      const { root } = await render(<bs-navigation-drawer logoBackground="dark"></bs-navigation-drawer>);
      const logos = root.shadowRoot.querySelectorAll('bs-logo') as NodeListOf<HTMLElement & { background: string }>;
      expect(logos).toHaveLength(2);
      logos.forEach(logo => expect(logo.background).toBe('dark'));
    });
  });

  describe('showLogo', () => {
    it('renders both internal bs-logo elements by default', async () => {
      const { root } = await render(<bs-navigation-drawer></bs-navigation-drawer>);
      expect(root.shadowRoot.querySelectorAll('bs-logo')).toHaveLength(2);
      expect(root.shadowRoot.querySelector('[part="logo"]')).not.toBeNull();
    });

    it('renders no bs-logo elements at all when showLogo is false', async () => {
      const { root } = await render(<bs-navigation-drawer showLogo={false}></bs-navigation-drawer>);
      expect(root.shadowRoot.querySelectorAll('bs-logo')).toHaveLength(0);
      expect(root.shadowRoot.querySelector('[part="logo"]')).toBeNull();
    });
  });
});
