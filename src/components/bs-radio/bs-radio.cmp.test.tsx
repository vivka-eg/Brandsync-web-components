import { render, h, describe, it, expect } from '@stencil/vitest';

describe('bs-radio', () => {
  it('renders an unchecked native radio by default', async () => {
    const { root } = await render(<bs-radio></bs-radio>);
    const input = root.shadowRoot.querySelector('input') as HTMLInputElement;
    expect(input).toEqualAttribute('type', 'radio');
    expect(input.checked).toBe(false);
    expect(root.shadowRoot.querySelector('[part="dot"]')).toBeNull();
  });

  it('reflects the checked prop to the native input and shows the center dot', async () => {
    const { root } = await render(<bs-radio checked></bs-radio>);
    const input = root.shadowRoot.querySelector('input') as HTMLInputElement;
    expect(input.checked).toBe(true);
    expect(root.shadowRoot.querySelector('[part="circle"]')).toHaveClass('bs-radio__circle--selected');
    expect(root.shadowRoot.querySelector('[part="dot"]')).not.toBeNull();
  });

  it('clicking the input checks it and emits bsChange with the value', async () => {
    const { root, waitForChanges, spyOnEvent } = await render(<bs-radio value="one"></bs-radio>);
    const bsChangeSpy = spyOnEvent('bsChange');
    const input = root.shadowRoot.querySelector('input') as HTMLInputElement;

    input.click();
    await waitForChanges();

    expect(input.checked).toBe(true);
    expect(bsChangeSpy).toHaveReceivedEventTimes(1);
    expect(bsChangeSpy).toHaveReceivedEventDetail('one');
  });

  it('passes name and value attributes through to the native input', async () => {
    const { root } = await render(<bs-radio name="fruit" value="apple"></bs-radio>);
    const input = root.shadowRoot.querySelector('input') as HTMLInputElement;
    expect(input).toEqualAttribute('name', 'fruit');
    expect(input).toEqualAttribute('value', 'apple');
  });

  // NOTE: each <bs-radio> has its own shadow root, so its native <input> lives in its own separate
  // DOM tree. Per the HTML spec, a "radio button group" is scoped to a single tree -- shadow DOM
  // boundaries mean same-`name` inputs in *different* <bs-radio> instances are NOT part of the same
  // native radio group, so clicking one does not natively uncheck another. This is a real, tested
  // limitation of composing native <input type="radio"> inside separate shadow roots, not a bug in
  // this component -- see bs-radio.mdx's Accessibility section for the documented gap. Within a
  // single instance's own shadow root the native input still behaves like a normal radio input.
  it('same-name bs-radio instances do NOT natively uncheck each other, since each lives in its own shadow root', async () => {
    const { root, waitForChanges } = await render(
      <div>
        <bs-radio name="fruit" value="apple"></bs-radio>
        <bs-radio name="fruit" value="banana"></bs-radio>
      </div>,
    );
    const [first, second] = Array.from(root.querySelectorAll('bs-radio'));

    const firstInput = first.shadowRoot.querySelector('input') as HTMLInputElement;
    const secondInput = second.shadowRoot.querySelector('input') as HTMLInputElement;

    firstInput.click();
    await waitForChanges();
    expect(firstInput.checked).toBe(true);

    secondInput.click();
    await waitForChanges();
    expect(secondInput.checked).toBe(true);
    // Real (shadow-DOM-scoped) native behavior: the first input is untouched, not unchecked.
    expect(firstInput.checked).toBe(true);
  });

  describe('disabled', () => {
    it('sets the disabled attribute on the native input', async () => {
      const { root } = await render(<bs-radio disabled></bs-radio>);
      const input = root.shadowRoot.querySelector('input');
      expect(input).toHaveAttribute('disabled');
    });

    it('prevents toggling via click', async () => {
      const { root, waitForChanges, spyOnEvent } = await render(<bs-radio disabled></bs-radio>);
      const bsChangeSpy = spyOnEvent('bsChange');
      const input = root.shadowRoot.querySelector('input') as HTMLInputElement;

      input.click();
      await waitForChanges();

      expect(input.checked).toBe(false);
      expect(bsChangeSpy).toHaveReceivedEventTimes(0);
    });
  });

  it('renders label slot content', async () => {
    const { root } = await render(<bs-radio>Option A</bs-radio>);
    expect(root).toHaveTextContent('Option A');
    const label = root.shadowRoot.querySelector('[part="label"]');
    expect(label.querySelector('slot')).not.toBeNull();
  });
});
