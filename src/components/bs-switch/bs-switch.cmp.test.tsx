import { render, h, describe, it, expect } from '@stencil/vitest';

describe('bs-switch', () => {
  it('renders an unchecked native switch input by default', async () => {
    const { root } = await render(<bs-switch></bs-switch>);
    const input = root.shadowRoot.querySelector('input') as HTMLInputElement;
    expect(input).toEqualAttribute('type', 'checkbox');
    expect(input).toEqualAttribute('role', 'switch');
    expect(input.checked).toBe(false);
    expect(root.shadowRoot.querySelector('[part="track"]')).not.toHaveClass('bs-switch__track--checked');
  });

  it('reflects ariaLabel to the native input, for label-less accessible names', async () => {
    const { root } = await render(<bs-switch ariaLabel="Enable notifications"></bs-switch>);
    const input = root.shadowRoot.querySelector('input') as HTMLInputElement;
    expect(input).toEqualAttribute('aria-label', 'Enable notifications');
  });

  it('does not set aria-label on the native input when ariaLabel is not provided', async () => {
    const { root } = await render(<bs-switch></bs-switch>);
    const input = root.shadowRoot.querySelector('input') as HTMLInputElement;
    expect(input).not.toHaveAttribute('aria-label');
  });

  it('reflects the checked prop to the native input and the track', async () => {
    const { root } = await render(<bs-switch checked></bs-switch>);
    const input = root.shadowRoot.querySelector('input') as HTMLInputElement;
    expect(input.checked).toBe(true);
    expect(root.shadowRoot.querySelector('[part="track"]')).toHaveClass('bs-switch__track--checked');
  });

  it('clicking the input toggles checked and emits bsChange with the new value', async () => {
    const { root, waitForChanges, spyOnEvent } = await render(<bs-switch></bs-switch>);
    const bsChangeSpy = spyOnEvent('bsChange');
    const input = root.shadowRoot.querySelector('input') as HTMLInputElement;

    input.click();
    await waitForChanges();

    expect(input.checked).toBe(true);
    expect(bsChangeSpy).toHaveReceivedEventTimes(1);
    expect(bsChangeSpy).toHaveReceivedEventDetail(true);

    input.click();
    await waitForChanges();

    expect(input.checked).toBe(false);
    expect(bsChangeSpy).toHaveReceivedEventTimes(2);
    expect(bsChangeSpy).toHaveReceivedEventDetail(false);
  });

  describe('disabled', () => {
    it('sets the disabled attribute on the native input', async () => {
      const { root } = await render(<bs-switch disabled></bs-switch>);
      const input = root.shadowRoot.querySelector('input');
      expect(input).toHaveAttribute('disabled');
    });

    it('prevents toggling via click', async () => {
      const { root, waitForChanges, spyOnEvent } = await render(<bs-switch disabled></bs-switch>);
      const bsChangeSpy = spyOnEvent('bsChange');
      const input = root.shadowRoot.querySelector('input') as HTMLInputElement;

      input.click();
      await waitForChanges();

      expect(input.checked).toBe(false);
      expect(bsChangeSpy).toHaveReceivedEventTimes(0);
    });
  });

  (['md', 'lg'] as const).forEach(size => {
    it(`renders size="${size}" with the matching track modifier class`, async () => {
      const { root } = await render(<bs-switch size={size}></bs-switch>);
      const track = root.shadowRoot.querySelector('[part="track"]');
      expect(track).toHaveClass(`bs-switch__track--${size}`);
    });
  });

  it('renders label slot content', async () => {
    const { root } = await render(<bs-switch>Enable notifications</bs-switch>);
    expect(root).toHaveTextContent('Enable notifications');
    const label = root.shadowRoot.querySelector('[part="label"]');
    expect(label.querySelector('slot')).not.toBeNull();
  });
});
