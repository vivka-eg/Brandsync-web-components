import { render, h, describe, it, expect } from '@stencil/vitest';

describe('bs-ai-thinking', () => {
  it('renders the default label with icon and label parts', async () => {
    const { root } = await render(<bs-ai-thinking></bs-ai-thinking>);

    expect(root).toHaveTextContent('Thinking');
    const icon = root.shadowRoot.querySelector('[part="icon"]');
    const label = root.shadowRoot.querySelector('[part="label"]');
    expect(icon).not.toBeNull();
    expect(icon.tagName).toBe('IMG');
    expect(label).not.toBeNull();
  });

  it('renders a custom label', async () => {
    const { root } = await render(<bs-ai-thinking label="Retrieving"></bs-ai-thinking>);

    expect(root).toHaveTextContent('Retrieving');
  });

  it('exposes an accessible status region', async () => {
    const { root } = await render(<bs-ai-thinking label="Searching"></bs-ai-thinking>);

    const status = root.shadowRoot.querySelector('[role="status"]');
    expect(status).not.toBeNull();
    expect(status.getAttribute('aria-live')).toBe('polite');
  });

  it('marks the icon as decorative', async () => {
    const { root } = await render(<bs-ai-thinking></bs-ai-thinking>);

    const icon = root.shadowRoot.querySelector('[part="icon"]') as HTMLImageElement;
    expect(icon.getAttribute('alt')).toBe('');
    expect(icon.getAttribute('aria-hidden')).toBe('true');
  });
});
