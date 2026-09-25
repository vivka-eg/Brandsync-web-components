import { render, h, describe, it, expect } from '@stencil/vitest';

describe('bs-avatar', () => {
  it('defaults to type="icon" size="md"', async () => {
    const { root } = await render(<bs-avatar></bs-avatar>);
    const container = root.shadowRoot.querySelector('[part="container"]');
    expect(container).toHaveClass('bs-avatar--icon');
    expect(container).toHaveClass('bs-avatar--md');
    expect(container).toEqualAttribute('role', 'img');
  });

  it('renders the fallback user icon for type="icon"', async () => {
    const { root } = await render(<bs-avatar type="icon"></bs-avatar>);
    expect(root.shadowRoot.querySelector('[part="icon"]')).not.toBeNull();
    expect(root.shadowRoot.querySelector('[part="initials"]')).toBeNull();
    expect(root.shadowRoot.querySelector('[part="image"]')).toBeNull();
  });

  it('renders the initials text for type="initials"', async () => {
    const { root } = await render(<bs-avatar type="initials" initials="SL"></bs-avatar>);
    const initials = root.shadowRoot.querySelector('[part="initials"]');
    expect(initials).not.toBeNull();
    expect(initials.textContent).toBe('SL');
    expect(root.shadowRoot.querySelector('[part="icon"]')).toBeNull();
  });

  it('renders a real <img> with src/alt for type="image", with no outer role/aria-label', async () => {
    const { root } = await render(<bs-avatar type="image" src="https://example.com/photo.jpg" alt="Sam Lee"></bs-avatar>);
    const img = root.shadowRoot.querySelector('[part="image"]') as HTMLImageElement;
    expect(img).not.toBeNull();
    expect(img.tagName).toBe('IMG');
    expect(img).toEqualAttribute('src', 'https://example.com/photo.jpg');
    expect(img).toEqualAttribute('alt', 'Sam Lee');
    const container = root.shadowRoot.querySelector('[part="container"]');
    expect(container.hasAttribute('role')).toBe(false);
    expect(container.hasAttribute('aria-label')).toBe(false);
  });

  it('falls back to alt="" (not a missing attribute) when alt is not provided for type="image"', async () => {
    const { root } = await render(<bs-avatar type="image" src="https://example.com/photo.jpg"></bs-avatar>);
    const img = root.shadowRoot.querySelector('[part="image"]');
    expect(img).toEqualAttribute('alt', '');
  });

  it('sets aria-label from ariaLabel for type="icon"/"initials"', async () => {
    const { root } = await render(<bs-avatar type="initials" initials="SL" ariaLabel="Sam Lee"></bs-avatar>);
    expect(root.shadowRoot.querySelector('[part="container"]')).toEqualAttribute('aria-label', 'Sam Lee');
  });

  it('applies the correct size class for every size value', async () => {
    const sizes = ['xs', 'sm', 'md', 'lg', 'xl', 'xxl'] as const;
    for (const size of sizes) {
      const { root } = await render(<bs-avatar size={size}></bs-avatar>);
      expect(root.shadowRoot.querySelector('[part="container"]')).toHaveClass(`bs-avatar--${size}`);
    }
  });

  it('reflects disabled as a host attribute', async () => {
    const { root } = await render(<bs-avatar disabled></bs-avatar>);
    expect(root.hasAttribute('disabled')).toBe(true);
  });
});
