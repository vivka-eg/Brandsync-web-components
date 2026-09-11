import { render, h, describe, it, expect } from '@stencil/vitest';

describe('bs-ai-disclaimer', () => {
  it('renders the default slot content inside the text part', async () => {
    const { root } = await render(
      <bs-ai-disclaimer>AI can make mistakes. Please verify important information.</bs-ai-disclaimer>,
    );

    expect(root).toHaveTextContent('AI can make mistakes. Please verify important information.');
    const text = root.shadowRoot.querySelector('[part="text"]');
    expect(text).not.toBeNull();
    expect(text.tagName).toBe('P');
  });

  it('renders arbitrary slotted content, e.g. a link', async () => {
    const { root } = await render(
      <bs-ai-disclaimer>
        AI can make mistakes. <a href="/policy">Learn more</a>
      </bs-ai-disclaimer>,
    );

    expect(root.querySelector('a')).not.toBeNull();
  });
});
