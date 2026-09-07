import { render, h, describe, it, expect } from '@stencil/vitest';

describe('bs-input', () => {
  it('renders a native text input with an empty value by default', async () => {
    const { root } = await render(<bs-input></bs-input>);
    const input = root.shadowRoot.querySelector('input') as HTMLInputElement;
    expect(input).toEqualAttribute('type', 'text');
    expect(input.value).toBe('');
    expect(input).not.toHaveAttribute('disabled');
  });

  it('reflects the value prop to the native input', async () => {
    const { root } = await render(<bs-input value="hello"></bs-input>);
    const input = root.shadowRoot.querySelector('input') as HTMLInputElement;
    expect(input.value).toBe('hello');
  });

  (['text', 'email', 'password', 'number'] as const).forEach(type => {
    it(`applies type="${type}" to the native input`, async () => {
      const { root } = await render(<bs-input type={type}></bs-input>);
      const input = root.shadowRoot.querySelector('input');
      expect(input).toEqualAttribute('type', type);
    });
  });

  it('passes the placeholder prop through to the native input', async () => {
    const { root } = await render(<bs-input placeholder="Enter your name"></bs-input>);
    const input = root.shadowRoot.querySelector('input');
    expect(input).toEqualAttribute('placeholder', 'Enter your name');
  });

  it('does not render a label when the label prop is not set', async () => {
    const { root } = await render(<bs-input></bs-input>);
    expect(root.shadowRoot.querySelector('label')).toBeNull();
  });

  it('renders a label wired to the control via htmlFor/id when the label prop is set', async () => {
    const { root } = await render(<bs-input label="Email address"></bs-input>);
    const label = root.shadowRoot.querySelector('label');
    const input = root.shadowRoot.querySelector('input');
    expect(label).toHaveTextContent('Email address');
    expect(label).toEqualAttribute('for', 'control');
    expect(input).toEqualAttribute('id', 'control');
    expect(label).toEqualAttribute('part', 'label');
  });

  it('disables the native input when disabled is set', async () => {
    const { root } = await render(<bs-input disabled></bs-input>);
    const input = root.shadowRoot.querySelector('input');
    expect(input).toHaveAttribute('disabled');
  });

  it('renders the description when set and no error is present', async () => {
    const { root } = await render(<bs-input description="Must be a valid email"></bs-input>);
    const description = root.shadowRoot.querySelector('[part="description"]');
    const input = root.shadowRoot.querySelector('input');
    expect(description).toHaveTextContent('Must be a valid email');
    expect(root.shadowRoot.querySelector('[part="error"]')).toBeNull();
    expect(input).toEqualAttribute('aria-describedby', 'description-or-error');
    expect(input).not.toHaveAttribute('aria-invalid');
  });

  it('renders the error message instead of the description, applies the error class, and sets aria-invalid', async () => {
    const { root } = await render(<bs-input description="Must be a valid email" error="This field is required"></bs-input>);
    const error = root.shadowRoot.querySelector('[part="error"]');
    expect(error).toHaveTextContent('This field is required');
    expect(root.shadowRoot.querySelector('[part="description"]')).toBeNull();

    const wrapper = root.shadowRoot.querySelector('.bs-input');
    expect(wrapper).toHaveClass('bs-input--error');

    const input = root.shadowRoot.querySelector('input');
    expect(input).toEqualAttribute('aria-invalid', 'true');
    expect(input).toEqualAttribute('aria-describedby', 'description-or-error');
  });

  it('emits bsInput with the current value as the user types', async () => {
    const { root, spyOnEvent } = await render(<bs-input></bs-input>);
    const bsInputSpy = spyOnEvent('bsInput');
    const input = root.shadowRoot.querySelector('input') as HTMLInputElement;

    input.value = 'a';
    input.dispatchEvent(new Event('input', { bubbles: true, composed: true }));

    expect(bsInputSpy).toHaveReceivedEventTimes(1);
    expect(bsInputSpy).toHaveReceivedEventDetail('a');
  });

  it('emits bsChange with the current value on native change', async () => {
    const { root, spyOnEvent } = await render(<bs-input></bs-input>);
    const bsChangeSpy = spyOnEvent('bsChange');
    const input = root.shadowRoot.querySelector('input') as HTMLInputElement;

    input.value = 'final value';
    input.dispatchEvent(new Event('change', { bubbles: true, composed: true }));

    expect(bsChangeSpy).toHaveReceivedEventTimes(1);
    expect(bsChangeSpy).toHaveReceivedEventDetail('final value');
  });

  it('does not emit bsChange on input, or bsInput on change', async () => {
    const { root, spyOnEvent } = await render(<bs-input></bs-input>);
    const bsInputSpy = spyOnEvent('bsInput');
    const bsChangeSpy = spyOnEvent('bsChange');
    const input = root.shadowRoot.querySelector('input') as HTMLInputElement;

    input.value = 'x';
    input.dispatchEvent(new Event('input', { bubbles: true, composed: true }));
    expect(bsChangeSpy.length).toBe(0);

    input.dispatchEvent(new Event('change', { bubbles: true, composed: true }));
    expect(bsInputSpy).toHaveReceivedEventTimes(1);
  });

  it('delegates focus from the host to the native input (delegatesFocus)', async () => {
    const { root } = await render(<bs-input label="Name"></bs-input>);
    const input = root.shadowRoot.querySelector('input') as HTMLInputElement;

    (root as unknown as HTMLElement).focus();

    expect(root.shadowRoot.activeElement).toBe(input);
    expect(document.activeElement).toBe(root);
  });
});
