import { render, h, describe, it, expect } from '@stencil/vitest';

describe('bs-stepper-step', () => {
  it('defaults to enabled/horizontal/showDescription=true when used standalone', async () => {
    const { root } = await render(<bs-stepper-step name="Cart"></bs-stepper-step>);
    expect(root.shadowRoot.querySelector('[part="icon"]')).toHaveClass('bs-stepper-step__icon--enabled');
    expect(root).toHaveClass('bs-stepper-step--horizontal');
  });

  it('renders the name text', async () => {
    const { root } = await render(<bs-stepper-step name="Shipping"></bs-stepper-step>);
    expect(root.shadowRoot.querySelector('[part="name"]').textContent.trim()).toBe('Shipping');
  });

  describe('state resolution', () => {
    it('error overrides computedState', async () => {
      const { root } = await render(<bs-stepper-step name="A" computedState="done" error></bs-stepper-step>);
      expect(root.shadowRoot.querySelector('[part="icon"]')).toHaveClass('bs-stepper-step__icon--error');
    });

    it('disabled overrides both computedState and error', async () => {
      const { root } = await render(<bs-stepper-step name="A" computedState="current" error disabled></bs-stepper-step>);
      expect(root.shadowRoot.querySelector('[part="icon"]')).toHaveClass('bs-stepper-step__icon--disabled');
    });

    it('falls back to computedState when neither error nor disabled is set', async () => {
      const { root } = await render(<bs-stepper-step name="A" computedState="done"></bs-stepper-step>);
      expect(root.shadowRoot.querySelector('[part="icon"]')).toHaveClass('bs-stepper-step__icon--done');
    });
  });

  describe('icon content per state', () => {
    it('done shows a checkmark', async () => {
      const { root } = await render(<bs-stepper-step name="A" computedState="done"></bs-stepper-step>);
      expect(root.shadowRoot.querySelector('[part="icon"] svg')).not.toBeNull();
    });

    it('current shows an inner dot, no svg', async () => {
      const { root } = await render(<bs-stepper-step name="A" computedState="current"></bs-stepper-step>);
      expect(root.shadowRoot.querySelector('.bs-stepper-step__icon-dot')).not.toBeNull();
      expect(root.shadowRoot.querySelector('[part="icon"] svg')).toBeNull();
    });

    it('enabled shows neither', async () => {
      const { root } = await render(<bs-stepper-step name="A" computedState="enabled"></bs-stepper-step>);
      expect(root.shadowRoot.querySelector('.bs-stepper-step__icon-dot')).toBeNull();
      expect(root.shadowRoot.querySelector('[part="icon"] svg')).toBeNull();
    });

    it('error shows an exclamation icon', async () => {
      const { root } = await render(<bs-stepper-step name="A" error></bs-stepper-step>);
      expect(root.shadowRoot.querySelector('[part="icon"] svg')).not.toBeNull();
    });
  });

  describe('showDescription', () => {
    it('renders the description when set and showDescription is true', async () => {
      const { root } = await render(<bs-stepper-step name="A" description="Some detail" showDescription></bs-stepper-step>);
      expect(root.shadowRoot.querySelector('[part="description"]').textContent.trim()).toBe('Some detail');
    });

    it('does not render a description when showDescription is false', async () => {
      const { root } = await render(<bs-stepper-step name="A" description="Some detail" showDescription={false}></bs-stepper-step>);
      expect(root.shadowRoot.querySelector('[part="description"]')).toBeNull();
    });

    it('does not render a description that was never set, even with showDescription true', async () => {
      const { root } = await render(<bs-stepper-step name="A" showDescription></bs-stepper-step>);
      expect(root.shadowRoot.querySelector('[part="description"]')).toBeNull();
    });
  });

  it('hides its own trailing connector when last in its parent, regardless of tag mix', async () => {
    const container = document.createElement('div');
    container.innerHTML = '<bs-stepper-step name="A"></bs-stepper-step><bs-stepper-step name="B"></bs-stepper-step>';
    document.body.appendChild(container);
    await new Promise(resolve => requestAnimationFrame(resolve));
    await new Promise(resolve => requestAnimationFrame(resolve));
    const [first, second] = Array.from(container.querySelectorAll('bs-stepper-step')) as HTMLElement[];
    const firstConnector = first.shadowRoot.querySelector('.bs-stepper-step__connector') as HTMLElement;
    const secondConnector = second.shadowRoot.querySelector('.bs-stepper-step__connector') as HTMLElement;
    expect(getComputedStyle(firstConnector).visibility).not.toBe('hidden');
    expect(getComputedStyle(secondConnector).visibility).toBe('hidden');
    container.remove();
  });
});
