import { render, h, describe, it, expect } from '@stencil/vitest';

describe('bs-button', () => {
  it('renders the default label slot and variant/size classes', async () => {
    const { root } = await render(<bs-button>Click me</bs-button>);
    expect(root).toHaveTextContent('Click me');
    const button = root.shadowRoot.querySelector('button');
    expect(button).toHaveClass('bs-button--primary');
    expect(button).toHaveClass('bs-button--md');
  });

  it('applies the disabled attribute to the native button', async () => {
    const { root } = await render(<bs-button disabled>Click me</bs-button>);
    const button = root.shadowRoot.querySelector('button');
    expect(button).toHaveAttribute('disabled');
  });

  it('reflects the variant prop to the internal class', async () => {
    const { root, setProps } = await render(<bs-button variant="neutral">Click me</bs-button>);
    expect(root.shadowRoot.querySelector('button')).toHaveClass('bs-button--neutral');

    await setProps({ variant: 'primary' });
    expect(root.shadowRoot.querySelector('button')).toHaveClass('bs-button--primary');
  });

  it('applies the error variant class and reflects on prop change', async () => {
    const { root, setProps } = await render(<bs-button variant="error">Delete</bs-button>);
    expect(root.shadowRoot.querySelector('button')).toHaveClass('bs-button--error');

    await setProps({ variant: 'primary' });
    expect(root.shadowRoot.querySelector('button')).toHaveClass('bs-button--primary');
    expect(root.shadowRoot.querySelector('button')).not.toHaveClass('bs-button--error');
  });

  it('applies the subtle variant class', async () => {
    const { root } = await render(<bs-button variant="subtle">Click me</bs-button>);
    expect(root.shadowRoot.querySelector('button')).toHaveClass('bs-button--subtle');
  });

  it('applies the outlined variant class', async () => {
    const { root } = await render(<bs-button variant="outlined">Click me</bs-button>);
    expect(root.shadowRoot.querySelector('button')).toHaveClass('bs-button--outlined');
  });

  it('applies the success variant class and reflects on prop change', async () => {
    const { root, setProps } = await render(<bs-button variant="success">Approve</bs-button>);
    expect(root.shadowRoot.querySelector('button')).toHaveClass('bs-button--success');

    await setProps({ variant: 'primary' });
    expect(root.shadowRoot.querySelector('button')).toHaveClass('bs-button--primary');
    expect(root.shadowRoot.querySelector('button')).not.toHaveClass('bs-button--success');
  });

  it('applies the warning variant class', async () => {
    const { root } = await render(<bs-button variant="warning">Proceed anyway</bs-button>);
    expect(root.shadowRoot.querySelector('button')).toHaveClass('bs-button--warning');
  });

  it('applies the info variant class', async () => {
    const { root } = await render(<bs-button variant="info">View details</bs-button>);
    expect(root.shadowRoot.querySelector('button')).toHaveClass('bs-button--info');
  });

  it('sets aria-label on the inner button from the ariaLabel prop', async () => {
    const { root } = await render(<bs-button ariaLabel="Delete">Click me</bs-button>);
    const button = root.shadowRoot.querySelector('button');
    expect(button).toEqualAttribute('aria-label', 'Delete');
  });

  it('applies bs-button--icon-only when the icon slot has content and the default slot does not', async () => {
    const { root } = await render(
      <bs-button ariaLabel="Delete">
        <svg slot="icon" viewBox="0 0 16 16"></svg>
      </bs-button>,
    );
    const button = root.shadowRoot.querySelector('button');
    expect(button).toHaveClass('bs-button--icon-only');
  });

  it('does not apply bs-button--icon-only when a label is present alongside the icon', async () => {
    const { root } = await render(
      <bs-button>
        <svg slot="icon" viewBox="0 0 16 16"></svg>
        Click me
      </bs-button>,
    );
    const button = root.shadowRoot.querySelector('button');
    expect(button).not.toHaveClass('bs-button--icon-only');
  });

  it('applies bs-button__end-icon--visible when the end-icon slot has assigned content', async () => {
    const { root } = await render(
      <bs-button>
        Next
        <svg slot="end-icon" viewBox="0 0 16 16"></svg>
      </bs-button>,
    );
    const endIcon = root.shadowRoot.querySelector('[part="end-icon"]');
    expect(endIcon).toHaveClass('bs-button__end-icon--visible');
  });

  it('does not apply bs-button__end-icon--visible when the end-icon slot is empty', async () => {
    const { root } = await render(<bs-button>Next</bs-button>);
    const endIcon = root.shadowRoot.querySelector('[part="end-icon"]');
    expect(endIcon).not.toHaveClass('bs-button__end-icon--visible');
  });

  it('applies bs-button--icon-only when only the end-icon slot has content and the default slot does not', async () => {
    const { root } = await render(
      <bs-button ariaLabel="Next">
        <svg slot="end-icon" viewBox="0 0 16 16"></svg>
      </bs-button>,
    );
    const button = root.shadowRoot.querySelector('button');
    expect(button).toHaveClass('bs-button--icon-only');
  });
});
