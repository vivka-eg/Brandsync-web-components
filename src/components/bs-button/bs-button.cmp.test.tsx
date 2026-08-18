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
});
