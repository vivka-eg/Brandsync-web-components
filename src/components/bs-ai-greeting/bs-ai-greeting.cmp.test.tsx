import { render, h, describe, it, expect } from '@stencil/vitest';

describe('bs-ai-greeting', () => {
  it('renders the default heading and a product-agnostic subtext', async () => {
    const { root } = await render(<bs-ai-greeting></bs-ai-greeting>);

    expect(root).toHaveTextContent("Hi. I'm Genie,");
    expect(root).toHaveTextContent('your AI assistant.');
    expect(root).toHaveTextContent('How can I help you today?');
  });

  it('uses a custom assistant name in the heading', async () => {
    const { root } = await render(<bs-ai-greeting assistant-name="Sasha"></bs-ai-greeting>);

    expect(root).toHaveTextContent("Hi. I'm Sasha,");
  });

  it('mentions the product name in the subtext when provided', async () => {
    const { root } = await render(<bs-ai-greeting product-name="Brandsync"></bs-ai-greeting>);

    expect(root).toHaveTextContent('How can I help you with Brandsync today?');
  });

  it('exposes heading and subtext parts', async () => {
    const { root } = await render(<bs-ai-greeting></bs-ai-greeting>);

    expect(root.shadowRoot.querySelector('[part="heading"]')).not.toBeNull();
    expect(root.shadowRoot.querySelector('[part="subtext"]')).not.toBeNull();
  });
});
