import { render, h, describe, it, expect } from '@stencil/vitest';

describe('bs-chatbot-header', () => {
  it('renders the inline logo with the default heading as its accessible name, and all four action buttons with the correct parts', async () => {
    const { root } = await render(<bs-chatbot-header></bs-chatbot-header>);

    const logo = root.shadowRoot.querySelector('[part="logo"]');
    expect(logo).not.toBeNull();
    expect(logo).toEqualAttribute('role', 'img');
    expect(logo).toEqualAttribute('aria-label', 'Genie');
    expect(logo.querySelector('svg')).not.toBeNull();

    expect(root.shadowRoot.querySelector('[part="new-chat"]')).not.toBeNull();
    expect(root.shadowRoot.querySelector('[part="history"]')).not.toBeNull();
    expect(root.shadowRoot.querySelector('[part="expand"]')).not.toBeNull();
    expect(root.shadowRoot.querySelector('[part="close"]')).not.toBeNull();
  });

  it('overrides the default heading, reflected in the logo accessible name and the aria-label of the header landmark', async () => {
    const { root } = await render(<bs-chatbot-header heading="Support"></bs-chatbot-header>);

    const logo = root.shadowRoot.querySelector('[part="logo"]');
    expect(logo).toEqualAttribute('aria-label', 'Support');

    const banner = root.shadowRoot.querySelector('[role="banner"]');
    expect(banner).toEqualAttribute('aria-label', 'Support');
  });

  it('emits bsNewChat when the new-chat button is clicked, and not the other events', async () => {
    const { root, spyOnEvent } = await render(<bs-chatbot-header></bs-chatbot-header>);
    const newChatSpy = spyOnEvent('bsNewChat');
    const historySpy = spyOnEvent('bsHistory');
    const expandSpy = spyOnEvent('bsExpand');
    const closeSpy = spyOnEvent('bsClose');

    (root.shadowRoot.querySelector('[part="new-chat"]') as HTMLButtonElement).click();

    expect(newChatSpy).toHaveReceivedEventTimes(1);
    expect(historySpy.length).toBe(0);
    expect(expandSpy.length).toBe(0);
    expect(closeSpy.length).toBe(0);
  });

  it('emits bsHistory when the history button is clicked, and not the other events', async () => {
    const { root, spyOnEvent } = await render(<bs-chatbot-header></bs-chatbot-header>);
    const newChatSpy = spyOnEvent('bsNewChat');
    const historySpy = spyOnEvent('bsHistory');
    const expandSpy = spyOnEvent('bsExpand');
    const closeSpy = spyOnEvent('bsClose');

    (root.shadowRoot.querySelector('[part="history"]') as HTMLButtonElement).click();

    expect(historySpy).toHaveReceivedEventTimes(1);
    expect(newChatSpy.length).toBe(0);
    expect(expandSpy.length).toBe(0);
    expect(closeSpy.length).toBe(0);
  });

  it('toggles the expanded prop and emits bsExpand with the new value when the expand button is clicked, and not the other events', async () => {
    const { root, waitForChanges, spyOnEvent } = await render(<bs-chatbot-header></bs-chatbot-header>);
    const newChatSpy = spyOnEvent('bsNewChat');
    const historySpy = spyOnEvent('bsHistory');
    const expandSpy = spyOnEvent('bsExpand');
    const closeSpy = spyOnEvent('bsClose');

    const header = root as HTMLBsChatbotHeaderElement;
    expect(header.expanded).toBe(false);
    const expandButton = root.shadowRoot.querySelector('[part="expand"]') as HTMLButtonElement;
    expect(expandButton).toEqualAttribute('aria-label', 'Expand');
    expect(expandButton).toEqualAttribute('aria-pressed', 'false');

    expandButton.click();
    await waitForChanges();

    expect(header.expanded).toBe(true);
    expect(expandSpy).toHaveReceivedEventTimes(1);
    expect(expandSpy).toHaveReceivedEventDetail(true);
    expect(expandButton).toEqualAttribute('aria-label', 'Collapse');
    expect(expandButton).toEqualAttribute('aria-pressed', 'true');
    expect(newChatSpy.length).toBe(0);
    expect(historySpy.length).toBe(0);
    expect(closeSpy.length).toBe(0);

    expandButton.click();
    await waitForChanges();

    expect(header.expanded).toBe(false);
    expect(expandSpy).toHaveReceivedEventTimes(2);
    expect(expandSpy).toHaveReceivedEventDetail(false);
  });

  it('renders consumer-supplied content in the expand-icon slot instead of the default icon', async () => {
    const { root } = await render(
      <bs-chatbot-header>
        <span slot="expand-icon">CUSTOM</span>
      </bs-chatbot-header>,
    );
    const expandButton = root.shadowRoot.querySelector('[part="expand"]');
    const slot = expandButton.querySelector('slot[name="expand-icon"]') as HTMLSlotElement;
    expect(slot).not.toBeNull();
    const assigned = slot.assignedElements();
    expect(assigned).toHaveLength(1);
    expect(assigned[0]).toHaveTextContent('CUSTOM');
  });

  it('emits bsClose when the close button is clicked, and not the other events', async () => {
    const { root, spyOnEvent } = await render(<bs-chatbot-header></bs-chatbot-header>);
    const newChatSpy = spyOnEvent('bsNewChat');
    const historySpy = spyOnEvent('bsHistory');
    const expandSpy = spyOnEvent('bsExpand');
    const closeSpy = spyOnEvent('bsClose');

    (root.shadowRoot.querySelector('[part="close"]') as HTMLButtonElement).click();

    expect(closeSpy).toHaveReceivedEventTimes(1);
    expect(newChatSpy.length).toBe(0);
    expect(historySpy.length).toBe(0);
    expect(expandSpy.length).toBe(0);
  });
});
