import { render, h, describe, it, expect } from '@stencil/vitest';
import type { BsBreadcrumbOverflowItem } from './bs-breadcrumb-overflow';

const items: BsBreadcrumbOverflowItem[] = [
  { label: 'Products', href: '/products' },
  { label: 'Category', href: '/products/category' },
];

describe('bs-breadcrumb-overflow', () => {
  it('sets role="listitem" on the host', async () => {
    const { root } = await render(<bs-breadcrumb-overflow items={items}></bs-breadcrumb-overflow>);
    expect(root).toEqualAttribute('role', 'listitem');
  });

  it('is a real button with aria-haspopup="menu" and starts closed', async () => {
    const { root } = await render(<bs-breadcrumb-overflow items={items}></bs-breadcrumb-overflow>);
    const ellipsis = root.shadowRoot.querySelector('[part="ellipsis"]');
    expect(ellipsis).not.toBeNull();
    expect(ellipsis.tagName).toBe('BUTTON');
    expect(ellipsis).toEqualAttribute('aria-haspopup', 'menu');
    expect(ellipsis).toEqualAttribute('aria-expanded', 'false');
    expect(root.shadowRoot.querySelector('bs-menu')).toBeNull();
  });

  it('reflects the overflowLabel prop as the ellipsis button aria-label', async () => {
    const { root } = await render(
      <bs-breadcrumb-overflow items={items} overflowLabel="See hidden crumbs"></bs-breadcrumb-overflow>,
    );
    const ellipsis = root.shadowRoot.querySelector('[part="ellipsis"]');
    expect(ellipsis).toEqualAttribute('aria-label', 'See hidden crumbs');
  });

  it('clicking the ellipsis opens the popup with exactly the given items, in order', async () => {
    const { root, waitForChanges } = await render(<bs-breadcrumb-overflow items={items}></bs-breadcrumb-overflow>);
    const ellipsis = root.shadowRoot.querySelector('[part="ellipsis"]') as HTMLButtonElement;

    ellipsis.click();
    await waitForChanges();

    expect(ellipsis).toEqualAttribute('aria-expanded', 'true');
    const menu = root.shadowRoot.querySelector('bs-menu');
    expect(menu).not.toBeNull();

    const rows = menu.querySelectorAll('[part="link"]');
    expect(rows.length).toBe(items.length);
    rows.forEach((row: Element, index: number) => {
      expect(row.textContent.trim()).toBe(items[index].label);
    });
  });

  it('renders an item with href as a real <a href>, not a bs-menu-item/button', async () => {
    const { root, waitForChanges } = await render(<bs-breadcrumb-overflow items={items}></bs-breadcrumb-overflow>);
    const ellipsis = root.shadowRoot.querySelector('[part="ellipsis"]') as HTMLButtonElement;
    ellipsis.click();
    await waitForChanges();

    const rows = root.shadowRoot.querySelectorAll('[part="link"]');
    expect(rows[0].tagName).toBe('A');
    expect(rows[0]).toEqualAttribute('href', items[0].href);
    expect(root.shadowRoot.querySelector('bs-menu-item')).toBeNull();
    expect(root.shadowRoot.querySelector('bs-menu button')).toBeNull();
  });

  it('renders an item without href as plain non-interactive text', async () => {
    const noHrefItems: BsBreadcrumbOverflowItem[] = [{ label: 'No Link' }, { label: 'Category', href: '/products/category' }];
    const { root, waitForChanges } = await render(<bs-breadcrumb-overflow items={noHrefItems}></bs-breadcrumb-overflow>);
    const ellipsis = root.shadowRoot.querySelector('[part="ellipsis"]') as HTMLButtonElement;
    ellipsis.click();
    await waitForChanges();

    const rows = root.shadowRoot.querySelectorAll('[part="link"]');
    expect(rows[0].tagName).toBe('SPAN');
    expect(rows[0].hasAttribute('href')).toBe(false);
  });

  it('closes on Escape', async () => {
    const { root, waitForChanges } = await render(<bs-breadcrumb-overflow items={items}></bs-breadcrumb-overflow>);
    const ellipsis = root.shadowRoot.querySelector('[part="ellipsis"]') as HTMLButtonElement;
    ellipsis.click();
    await waitForChanges();
    expect(root.shadowRoot.querySelector('bs-menu')).not.toBeNull();

    root.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true, composed: true }));
    await waitForChanges();

    expect(ellipsis).toEqualAttribute('aria-expanded', 'false');
    expect(root.shadowRoot.querySelector('bs-menu')).toBeNull();
  });

  it('closes on focusout when relatedTarget is outside the host', async () => {
    const { root, waitForChanges } = await render(<bs-breadcrumb-overflow items={items}></bs-breadcrumb-overflow>);
    const ellipsis = root.shadowRoot.querySelector('[part="ellipsis"]') as HTMLButtonElement;
    ellipsis.click();
    await waitForChanges();

    const outside = document.createElement('div');
    document.body.appendChild(outside);
    root.dispatchEvent(new FocusEvent('focusout', { relatedTarget: outside, bubbles: true, composed: true }));
    await waitForChanges();

    expect(ellipsis).toEqualAttribute('aria-expanded', 'false');
    expect(root.shadowRoot.querySelector('bs-menu')).toBeNull();
    outside.remove();
  });

  it('does not close on focusout when relatedTarget is still inside the host', async () => {
    const { root, waitForChanges } = await render(<bs-breadcrumb-overflow items={items}></bs-breadcrumb-overflow>);
    const ellipsis = root.shadowRoot.querySelector('[part="ellipsis"]') as HTMLButtonElement;
    ellipsis.click();
    await waitForChanges();

    const insideLink = root.shadowRoot.querySelector('[part="link"]');
    root.dispatchEvent(new FocusEvent('focusout', { relatedTarget: insideLink, bubbles: true, composed: true }));
    await waitForChanges();

    expect(ellipsis).toEqualAttribute('aria-expanded', 'true');
    expect(root.shadowRoot.querySelector('bs-menu')).not.toBeNull();
  });

  describe('first-child separator hiding', () => {
    it("hides its own separator when it is the first child, even alone", async () => {
      const { root } = await render(<bs-breadcrumb-overflow items={items}></bs-breadcrumb-overflow>);
      const separator = root.shadowRoot.querySelector('[part="separator"]') as HTMLElement;
      expect(getComputedStyle(separator).display).toBe('none');
    });

    it('shows its separator when a bs-breadcrumb precedes it', async () => {
      const { root } = await render(
        <bs-breadcrumbs>
          <bs-breadcrumb href="/">Home</bs-breadcrumb>
          <bs-breadcrumb-overflow items={items}></bs-breadcrumb-overflow>
        </bs-breadcrumbs>,
      );
      const overflow = root.querySelector('bs-breadcrumb-overflow') as HTMLElement;
      const separator = overflow.shadowRoot.querySelector('[part="separator"]') as HTMLElement;
      expect(getComputedStyle(separator).display).not.toBe('none');
    });
  });

  describe('size', () => {
    it('defaults to "md" and reflects the attribute', async () => {
      const { root } = await render(<bs-breadcrumb-overflow items={items}></bs-breadcrumb-overflow>);
      expect(root).toEqualAttribute('size', 'md');
    });

    it('reflects a "sm" size', async () => {
      const { root } = await render(<bs-breadcrumb-overflow items={items} size="sm"></bs-breadcrumb-overflow>);
      expect(root).toEqualAttribute('size', 'sm');
    });
  });
});
