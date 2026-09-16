import { render, h, describe, it, expect } from '@stencil/vitest';

describe('bs-checkbox', () => {
  it('renders an unchecked native checkbox by default', async () => {
    const { root } = await render(<bs-checkbox></bs-checkbox>);
    const input = root.shadowRoot.querySelector('input') as HTMLInputElement;
    expect(input).toEqualAttribute('type', 'checkbox');
    expect(input.checked).toBe(false);
    expect(root.shadowRoot.querySelector('[part="box"] [part="icon"]')).toBeNull();
  });

  it('reflects ariaLabel to the native input, for label-less accessible names', async () => {
    const { root } = await render(<bs-checkbox ariaLabel="Select all rows"></bs-checkbox>);
    const input = root.shadowRoot.querySelector('input') as HTMLInputElement;
    expect(input).toEqualAttribute('aria-label', 'Select all rows');
  });

  it('does not set aria-label on the native input when ariaLabel is not provided', async () => {
    const { root } = await render(<bs-checkbox></bs-checkbox>);
    const input = root.shadowRoot.querySelector('input') as HTMLInputElement;
    expect(input).not.toHaveAttribute('aria-label');
  });

  it('reflects the checked prop to the native input and shows the check icon', async () => {
    const { root } = await render(<bs-checkbox checked></bs-checkbox>);
    const input = root.shadowRoot.querySelector('input') as HTMLInputElement;
    expect(input.checked).toBe(true);
    expect(root.shadowRoot.querySelector('[part="box"]')).toHaveClass('bs-checkbox__box--selected');
    expect(root.shadowRoot.querySelector('[part="icon"]')).not.toBeNull();
  });

  it('clicking the input toggles checked and emits bsChange with the new value', async () => {
    const { root, waitForChanges, spyOnEvent } = await render(<bs-checkbox></bs-checkbox>);
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

  describe('indeterminate', () => {
    it('sets the native input .indeterminate JS property, not an HTML attribute', async () => {
      const { root } = await render(<bs-checkbox indeterminate></bs-checkbox>);
      const input = root.shadowRoot.querySelector('input') as HTMLInputElement;
      expect(input.indeterminate).toBe(true);
      expect(input).not.toHaveAttribute('indeterminate');
    });

    it('takes visual precedence over checked, showing the minus icon', async () => {
      const { root } = await render(<bs-checkbox checked indeterminate></bs-checkbox>);
      const box = root.shadowRoot.querySelector('[part="box"]');
      expect(box).toHaveClass('bs-checkbox__box--selected');
      const icon = root.shadowRoot.querySelector('[part="icon"]');
      expect(icon.querySelector('path')).not.toBeNull();
      // Minus icon is a single horizontal line; check icon has two line segments in its path data.
      expect(icon.innerHTML).toContain('M3 8H13');
    });

    it('updates the native .indeterminate property when the prop changes after initial render', async () => {
      const { root, waitForChanges } = await render(<bs-checkbox></bs-checkbox>);
      const input = root.shadowRoot.querySelector('input') as HTMLInputElement;
      expect(input.indeterminate).toBe(false);

      (root as HTMLBsCheckboxElement).indeterminate = true;
      await waitForChanges();

      expect(input.indeterminate).toBe(true);
    });

    it('clears indeterminate when the user toggles the checkbox', async () => {
      const { root, waitForChanges } = await render(<bs-checkbox indeterminate></bs-checkbox>);
      const input = root.shadowRoot.querySelector('input') as HTMLInputElement;

      input.click();
      await waitForChanges();

      expect(input.indeterminate).toBe(false);
      expect((root as HTMLBsCheckboxElement).indeterminate).toBe(false);
    });
  });

  describe('disabled', () => {
    it('sets the disabled attribute on the native input', async () => {
      const { root } = await render(<bs-checkbox disabled></bs-checkbox>);
      const input = root.shadowRoot.querySelector('input');
      expect(input).toHaveAttribute('disabled');
    });

    it('prevents toggling via click', async () => {
      const { root, waitForChanges, spyOnEvent } = await render(<bs-checkbox disabled></bs-checkbox>);
      const bsChangeSpy = spyOnEvent('bsChange');
      const input = root.shadowRoot.querySelector('input') as HTMLInputElement;

      input.click();
      await waitForChanges();

      expect(input.checked).toBe(false);
      expect(bsChangeSpy).toHaveReceivedEventTimes(0);
    });
  });

  describe('error', () => {
    it('applies the error class to the box', async () => {
      const { root } = await render(<bs-checkbox error></bs-checkbox>);
      const box = root.shadowRoot.querySelector('[part="box"]');
      expect(box).toHaveClass('bs-checkbox__box--error');
    });
  });

  (['sm', 'md', 'lg'] as const).forEach(size => {
    it(`renders size="${size}" with the matching box modifier class`, async () => {
      const { root } = await render(<bs-checkbox size={size}></bs-checkbox>);
      const box = root.shadowRoot.querySelector('[part="box"]');
      if (size === 'lg') {
        expect(box).not.toHaveClass('bs-checkbox__box--sm');
        expect(box).not.toHaveClass('bs-checkbox__box--md');
      } else {
        expect(box).toHaveClass(`bs-checkbox__box--${size}`);
      }
    });
  });

  it('renders label slot content', async () => {
    const { root } = await render(<bs-checkbox>Accept terms</bs-checkbox>);
    expect(root).toHaveTextContent('Accept terms');
    const label = root.shadowRoot.querySelector('[part="label"]');
    expect(label.querySelector('slot')).not.toBeNull();
  });
});
