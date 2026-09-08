import { render, h, describe, it, expect } from '@stencil/vitest';

describe('bs-chatbot-suggestion-button', () => {
  it('renders the default slot label content and the button part', async () => {
    const { root } = await render(<bs-chatbot-suggestion-button>How can I help you?</bs-chatbot-suggestion-button>);

    expect(root).toHaveTextContent('How can I help you?');
    const button = root.shadowRoot.querySelector('[part="button"]');
    expect(button).not.toBeNull();
    expect(button.tagName).toBe('BUTTON');
  });

  it('emits bsSelect exactly once on a normal click', async () => {
    const { root, spyOnEvent } = await render(<bs-chatbot-suggestion-button>Suggestion</bs-chatbot-suggestion-button>);
    const selectSpy = spyOnEvent('bsSelect');

    (root.shadowRoot.querySelector('[part="button"]') as HTMLButtonElement).click();

    expect(selectSpy).toHaveReceivedEventTimes(1);
  });

  it('applies the native disabled attribute and does not fire bsSelect on click when disabled', async () => {
    const { root, spyOnEvent } = await render(
      <bs-chatbot-suggestion-button disabled>Suggestion</bs-chatbot-suggestion-button>,
    );
    const selectSpy = spyOnEvent('bsSelect');

    const button = root.shadowRoot.querySelector('[part="button"]') as HTMLButtonElement;
    expect(button.disabled).toBe(true);

    button.click();

    expect(selectSpy.length).toBe(0);
  });
});
