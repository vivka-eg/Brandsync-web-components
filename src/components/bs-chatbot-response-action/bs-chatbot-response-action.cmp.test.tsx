import { render, h, describe, it, expect } from '@stencil/vitest';

describe('bs-chatbot-response-action', () => {
  it('renders all five icon buttons with the correct parts, and no sources button by default', async () => {
    const { root } = await render(<bs-chatbot-response-action></bs-chatbot-response-action>);

    expect(root.shadowRoot.querySelector('[part="like"]')).not.toBeNull();
    expect(root.shadowRoot.querySelector('[part="dislike"]')).not.toBeNull();
    expect(root.shadowRoot.querySelector('[part="copy"]')).not.toBeNull();
    expect(root.shadowRoot.querySelector('[part="regenerate"]')).not.toBeNull();
    expect(root.shadowRoot.querySelector('[part="menu"]')).not.toBeNull();
    expect(root.shadowRoot.querySelector('[part="sources"]')).toBeNull();
  });

  it('does not render the sources button when sourcesCount is 0', async () => {
    const { root } = await render(<bs-chatbot-response-action sourcesCount={0}></bs-chatbot-response-action>);
    expect(root.shadowRoot.querySelector('[part="sources"]')).toBeNull();
  });

  it('renders the sources button with singular text when sourcesCount is 1', async () => {
    const { root } = await render(<bs-chatbot-response-action sourcesCount={1}></bs-chatbot-response-action>);
    const sources = root.shadowRoot.querySelector('[part="sources"]');
    expect(sources).not.toBeNull();
    expect(sources).toHaveTextContent('1 source');
  });

  it('renders the sources button with plural text when sourcesCount is greater than 1', async () => {
    const { root } = await render(<bs-chatbot-response-action sourcesCount={3}></bs-chatbot-response-action>);
    const sources = root.shadowRoot.querySelector('[part="sources"]');
    expect(sources).not.toBeNull();
    expect(sources).toHaveTextContent('3 sources');
  });

  it('emits bsLike when the like button is clicked, and not the other events', async () => {
    const { root, spyOnEvent } = await render(<bs-chatbot-response-action sourcesCount={3}></bs-chatbot-response-action>);
    const likeSpy = spyOnEvent('bsLike');
    const dislikeSpy = spyOnEvent('bsDislike');
    const copySpy = spyOnEvent('bsCopy');
    const regenerateSpy = spyOnEvent('bsRegenerate');
    const menuSpy = spyOnEvent('bsMenuOpen');
    const sourcesSpy = spyOnEvent('bsSourcesClick');

    (root.shadowRoot.querySelector('[part="like"]') as HTMLButtonElement).click();

    expect(likeSpy).toHaveReceivedEventTimes(1);
    expect(dislikeSpy.length).toBe(0);
    expect(copySpy.length).toBe(0);
    expect(regenerateSpy.length).toBe(0);
    expect(menuSpy.length).toBe(0);
    expect(sourcesSpy.length).toBe(0);
  });

  it('emits bsDislike when the dislike button is clicked, and not the other events', async () => {
    const { root, spyOnEvent } = await render(<bs-chatbot-response-action sourcesCount={3}></bs-chatbot-response-action>);
    const likeSpy = spyOnEvent('bsLike');
    const dislikeSpy = spyOnEvent('bsDislike');
    const copySpy = spyOnEvent('bsCopy');
    const regenerateSpy = spyOnEvent('bsRegenerate');
    const menuSpy = spyOnEvent('bsMenuOpen');
    const sourcesSpy = spyOnEvent('bsSourcesClick');

    (root.shadowRoot.querySelector('[part="dislike"]') as HTMLButtonElement).click();

    expect(dislikeSpy).toHaveReceivedEventTimes(1);
    expect(likeSpy.length).toBe(0);
    expect(copySpy.length).toBe(0);
    expect(regenerateSpy.length).toBe(0);
    expect(menuSpy.length).toBe(0);
    expect(sourcesSpy.length).toBe(0);
  });

  it('emits bsCopy when the copy button is clicked, and not the other events', async () => {
    const { root, spyOnEvent } = await render(<bs-chatbot-response-action sourcesCount={3}></bs-chatbot-response-action>);
    const likeSpy = spyOnEvent('bsLike');
    const dislikeSpy = spyOnEvent('bsDislike');
    const copySpy = spyOnEvent('bsCopy');
    const regenerateSpy = spyOnEvent('bsRegenerate');
    const menuSpy = spyOnEvent('bsMenuOpen');
    const sourcesSpy = spyOnEvent('bsSourcesClick');

    (root.shadowRoot.querySelector('[part="copy"]') as HTMLButtonElement).click();

    expect(copySpy).toHaveReceivedEventTimes(1);
    expect(likeSpy.length).toBe(0);
    expect(dislikeSpy.length).toBe(0);
    expect(regenerateSpy.length).toBe(0);
    expect(menuSpy.length).toBe(0);
    expect(sourcesSpy.length).toBe(0);
  });

  it('emits bsRegenerate when the regenerate button is clicked, and not the other events', async () => {
    const { root, spyOnEvent } = await render(<bs-chatbot-response-action sourcesCount={3}></bs-chatbot-response-action>);
    const likeSpy = spyOnEvent('bsLike');
    const dislikeSpy = spyOnEvent('bsDislike');
    const copySpy = spyOnEvent('bsCopy');
    const regenerateSpy = spyOnEvent('bsRegenerate');
    const menuSpy = spyOnEvent('bsMenuOpen');
    const sourcesSpy = spyOnEvent('bsSourcesClick');

    (root.shadowRoot.querySelector('[part="regenerate"]') as HTMLButtonElement).click();

    expect(regenerateSpy).toHaveReceivedEventTimes(1);
    expect(likeSpy.length).toBe(0);
    expect(dislikeSpy.length).toBe(0);
    expect(copySpy.length).toBe(0);
    expect(menuSpy.length).toBe(0);
    expect(sourcesSpy.length).toBe(0);
  });

  it('emits bsMenuOpen with true when the more-options button is clicked, and not the other events', async () => {
    const { root, waitForChanges, spyOnEvent } = await render(<bs-chatbot-response-action sourcesCount={3}></bs-chatbot-response-action>);
    const likeSpy = spyOnEvent('bsLike');
    const dislikeSpy = spyOnEvent('bsDislike');
    const copySpy = spyOnEvent('bsCopy');
    const regenerateSpy = spyOnEvent('bsRegenerate');
    const menuSpy = spyOnEvent('bsMenuOpen');
    const sourcesSpy = spyOnEvent('bsSourcesClick');

    (root.shadowRoot.querySelector('[part="menu"]') as HTMLButtonElement).click();
    await waitForChanges();

    expect(menuSpy).toHaveReceivedEventTimes(1);
    expect(menuSpy).toHaveReceivedEventDetail(true);
    expect((root as HTMLBsChatbotResponseActionElement).menuOpen).toBe(true);
    expect(likeSpy.length).toBe(0);
    expect(dislikeSpy.length).toBe(0);
    expect(copySpy.length).toBe(0);
    expect(regenerateSpy.length).toBe(0);
    expect(sourcesSpy.length).toBe(0);
  });

  it('emits bsMenuOpen with false when the more-options button is clicked again to close it', async () => {
    const { root, waitForChanges, spyOnEvent } = await render(<bs-chatbot-response-action sourcesCount={3}></bs-chatbot-response-action>);
    const menuSpy = spyOnEvent('bsMenuOpen');
    const menuButton = root.shadowRoot.querySelector('[part="menu"]') as HTMLButtonElement;

    menuButton.click();
    await waitForChanges();
    menuButton.click();
    await waitForChanges();

    expect(menuSpy).toHaveReceivedEventTimes(2);
    expect(menuSpy).toHaveReceivedEventDetail(false);
    expect((root as HTMLBsChatbotResponseActionElement).menuOpen).toBe(false);
  });

  it('does not render the menu slot wrapper when menuOpen is false', async () => {
    const { root } = await render(<bs-chatbot-response-action></bs-chatbot-response-action>);
    expect(root.shadowRoot.querySelector('slot[name="menu"]')).toBeNull();
  });

  it('renders the menu slot wrapper when menuOpen is true', async () => {
    const { root } = await render(<bs-chatbot-response-action menuOpen={true}></bs-chatbot-response-action>);
    expect(root.shadowRoot.querySelector('slot[name="menu"]')).not.toBeNull();
  });

  it('closes the menu and emits bsMenuOpen(false) on a click outside the host', async () => {
    const { root, waitForChanges, spyOnEvent } = await render(<bs-chatbot-response-action menuOpen={true}></bs-chatbot-response-action>);
    const menuSpy = spyOnEvent('bsMenuOpen');

    document.body.click();
    await waitForChanges();

    expect((root as HTMLBsChatbotResponseActionElement).menuOpen).toBe(false);
    expect(menuSpy).toHaveReceivedEventTimes(1);
    expect(menuSpy).toHaveReceivedEventDetail(false);
  });

  it('closes the menu on Escape', async () => {
    const { root, waitForChanges, spyOnEvent } = await render(<bs-chatbot-response-action menuOpen={true}></bs-chatbot-response-action>);
    const menuSpy = spyOnEvent('bsMenuOpen');

    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }));
    await waitForChanges();

    expect((root as HTMLBsChatbotResponseActionElement).menuOpen).toBe(false);
    expect(menuSpy).toHaveReceivedEventTimes(1);
    expect(menuSpy).toHaveReceivedEventDetail(false);
  });

  it('emits bsSourcesClick when the sources button is clicked, and not the other events', async () => {
    const { root, spyOnEvent } = await render(<bs-chatbot-response-action sourcesCount={3}></bs-chatbot-response-action>);
    const likeSpy = spyOnEvent('bsLike');
    const dislikeSpy = spyOnEvent('bsDislike');
    const copySpy = spyOnEvent('bsCopy');
    const regenerateSpy = spyOnEvent('bsRegenerate');
    const menuSpy = spyOnEvent('bsMenuOpen');
    const sourcesSpy = spyOnEvent('bsSourcesClick');

    (root.shadowRoot.querySelector('[part="sources"]') as HTMLButtonElement).click();

    expect(sourcesSpy).toHaveReceivedEventTimes(1);
    expect(likeSpy.length).toBe(0);
    expect(dislikeSpy.length).toBe(0);
    expect(copySpy.length).toBe(0);
    expect(regenerateSpy.length).toBe(0);
    expect(menuSpy.length).toBe(0);
  });

  it('renders consumer-supplied content in the like-icon slot instead of the default icon', async () => {
    const { root } = await render(
      <bs-chatbot-response-action>
        <span slot="like-icon">CUSTOM</span>
      </bs-chatbot-response-action>,
    );
    const likeButton = root.shadowRoot.querySelector('[part="like"]');
    const slot = likeButton.querySelector('slot[name="like-icon"]') as HTMLSlotElement;
    expect(slot).not.toBeNull();
    const assigned = slot.assignedElements();
    expect(assigned).toHaveLength(1);
    expect(assigned[0]).toHaveTextContent('CUSTOM');
  });
});
