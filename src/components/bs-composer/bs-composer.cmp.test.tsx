import { render, h, describe, it, expect } from '@stencil/vitest';

describe('bs-composer', () => {
  it('renders with idle state defaults: ai variant placeholder, enabled mic/action buttons', async () => {
    const { root } = await render(<bs-composer></bs-composer>);
    const input = root.shadowRoot.querySelector('input') as HTMLInputElement;
    expect(input).toEqualAttribute('placeholder', 'Ask Genie something...');
    expect(input).not.toHaveAttribute('disabled');

    const mic = root.shadowRoot.querySelector('[part="mic"]');
    const action = root.shadowRoot.querySelector('[part="action"]');
    expect(mic).not.toHaveAttribute('disabled');
    expect(action).not.toHaveAttribute('disabled');
    expect(action).toEqualAttribute('aria-label', 'Send');
  });

  it('uses the human variant default placeholder', async () => {
    const { root } = await render(<bs-composer variant="human"></bs-composer>);
    const input = root.shadowRoot.querySelector('input');
    expect(input).toEqualAttribute('placeholder', 'Message your support agent...');
  });

  it('overrides the variant default placeholder when placeholder is set', async () => {
    const { root } = await render(<bs-composer variant="ai" placeholder="Custom prompt"></bs-composer>);
    const input = root.shadowRoot.querySelector('input');
    expect(input).toEqualAttribute('placeholder', 'Custom prompt');
  });

  it('reflects the value prop to the native input', async () => {
    const { root } = await render(<bs-composer value="hello there"></bs-composer>);
    const input = root.shadowRoot.querySelector('input') as HTMLInputElement;
    expect(input.value).toBe('hello there');
  });

  it('sets aria-label on the input from the ariaLabel prop', async () => {
    const { root } = await render(<bs-composer ariaLabel="Message"></bs-composer>);
    const input = root.shadowRoot.querySelector('input');
    expect(input).toEqualAttribute('aria-label', 'Message');
  });

  it('renders consumer-supplied content in the actions-end slot, after the primary action button', async () => {
    const { root } = await render(
      <bs-composer>
        <button slot="actions-end" aria-label="Tools">
          Tools
        </button>
      </bs-composer>,
    );
    const slot = root.shadowRoot.querySelector('slot[name="actions-end"]') as HTMLSlotElement;
    expect(slot).not.toBeNull();
    const assigned = slot.assignedElements();
    expect(assigned).toHaveLength(1);
    expect(assigned[0]).toEqualAttribute('aria-label', 'Tools');

    const controlsRow = root.shadowRoot.querySelector('.bs-composer__controls-row');
    const children = Array.from(controlsRow.children);
    const slotIndex = children.indexOf(slot);
    const actionIndex = children.findIndex(el => el.getAttribute('part') === 'action');
    expect(slotIndex).toBeGreaterThan(actionIndex);
  });

  it('emits bsInput with the current value as the user types', async () => {
    const { root, spyOnEvent } = await render(<bs-composer></bs-composer>);
    const spy = spyOnEvent('bsInput');
    const input = root.shadowRoot.querySelector('input') as HTMLInputElement;

    input.value = 'a';
    input.dispatchEvent(new Event('input', { bubbles: true, composed: true }));

    expect(spy).toHaveReceivedEventTimes(1);
    expect(spy).toHaveReceivedEventDetail('a');
  });

  it('emits bsAttach when the attach button is clicked', async () => {
    const { root, spyOnEvent } = await render(<bs-composer></bs-composer>);
    const spy = spyOnEvent('bsAttach');
    (root.shadowRoot.querySelector('[part="attach"]') as HTMLButtonElement).click();
    expect(spy).toHaveReceivedEventTimes(1);
  });

  describe('state="idle"', () => {
    it('shows the send icon and enabled action/mic buttons, and emits bsSubmit on action click', async () => {
      const { root, spyOnEvent } = await render(<bs-composer state="idle"></bs-composer>);
      const submitSpy = spyOnEvent('bsSubmit');
      const stopSpy = spyOnEvent('bsStop');
      const confirmSpy = spyOnEvent('bsVoiceConfirm');

      const action = root.shadowRoot.querySelector('[part="action"]') as HTMLButtonElement;
      expect(action).not.toHaveAttribute('disabled');
      action.click();

      expect(submitSpy).toHaveReceivedEventTimes(1);
      expect(stopSpy.length).toBe(0);
      expect(confirmSpy.length).toBe(0);
    });

    it('emits bsMicToggle when the mic button is clicked', async () => {
      const { root, spyOnEvent } = await render(<bs-composer state="idle"></bs-composer>);
      const spy = spyOnEvent('bsMicToggle');
      (root.shadowRoot.querySelector('[part="mic"]') as HTMLButtonElement).click();
      expect(spy).toHaveReceivedEventTimes(1);
    });
  });

  describe('state="generating"', () => {
    it('shows an enabled action button and emits bsStop (not bsSubmit) on click', async () => {
      const { root, spyOnEvent } = await render(<bs-composer state="generating"></bs-composer>);
      const submitSpy = spyOnEvent('bsSubmit');
      const stopSpy = spyOnEvent('bsStop');

      const action = root.shadowRoot.querySelector('[part="action"]') as HTMLButtonElement;
      expect(action).not.toHaveAttribute('disabled');
      expect(action).toEqualAttribute('aria-label', 'Stop');
      action.click();

      expect(stopSpy).toHaveReceivedEventTimes(1);
      expect(submitSpy.length).toBe(0);
    });
  });

  describe('state="disabled"', () => {
    it('natively disables both the mic and action buttons and the text input', async () => {
      const { root } = await render(<bs-composer state="disabled"></bs-composer>);
      expect(root.shadowRoot.querySelector('input')).toHaveAttribute('disabled');
      expect(root.shadowRoot.querySelector('[part="mic"]')).toHaveAttribute('disabled');
      expect(root.shadowRoot.querySelector('[part="action"]')).toHaveAttribute('disabled');
    });

    it('does not emit bsSubmit, bsStop, or bsVoiceConfirm when the disabled action button is clicked', async () => {
      const { root, spyOnEvent } = await render(<bs-composer state="disabled"></bs-composer>);
      const submitSpy = spyOnEvent('bsSubmit');
      const stopSpy = spyOnEvent('bsStop');
      const confirmSpy = spyOnEvent('bsVoiceConfirm');

      (root.shadowRoot.querySelector('[part="action"]') as HTMLButtonElement).click();

      expect(submitSpy.length).toBe(0);
      expect(stopSpy.length).toBe(0);
      expect(confirmSpy.length).toBe(0);
    });

    it('does not emit bsMicToggle when the disabled mic button is clicked', async () => {
      const { root, spyOnEvent } = await render(<bs-composer state="disabled"></bs-composer>);
      const spy = spyOnEvent('bsMicToggle');
      (root.shadowRoot.querySelector('[part="mic"]') as HTMLButtonElement).click();
      expect(spy.length).toBe(0);
    });
  });

  describe('state="recording"', () => {
    it('renders the waveform visualization and an enabled confirm action button', async () => {
      const { root, spyOnEvent } = await render(<bs-composer state="recording" value="already typed"></bs-composer>);
      const confirmSpy = spyOnEvent('bsVoiceConfirm');
      const submitSpy = spyOnEvent('bsSubmit');

      expect(root.shadowRoot.querySelector('.bs-composer__waveform')).not.toBeNull();

      const action = root.shadowRoot.querySelector('[part="action"]') as HTMLButtonElement;
      expect(action).not.toHaveAttribute('disabled');
      expect(action).toEqualAttribute('aria-label', 'Confirm');
      action.click();

      expect(confirmSpy).toHaveReceivedEventTimes(1);
      expect(submitSpy.length).toBe(0);
    });

    it('emits bsMicToggle when the stop-recording button is clicked', async () => {
      const { root, spyOnEvent } = await render(<bs-composer state="recording"></bs-composer>);
      const spy = spyOnEvent('bsMicToggle');
      const mic = root.shadowRoot.querySelector('[part="mic"]') as HTMLButtonElement;
      expect(mic).toEqualAttribute('aria-label', 'Stop recording');
      mic.click();
      expect(spy).toHaveReceivedEventTimes(1);
    });
  });

  it('does not render the waveform outside of the recording state', async () => {
    const { root } = await render(<bs-composer state="idle"></bs-composer>);
    expect(root.shadowRoot.querySelector('.bs-composer__waveform')).toBeNull();
  });
});
