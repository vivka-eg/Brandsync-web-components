import { render, h, describe, it, expect } from '@stencil/vitest';

describe('bs-button-skeleton', () => {
  it('renders with role="status" and aria-label="Loading" by default', async () => {
    const { root } = await render(<bs-button-skeleton></bs-button-skeleton>);
    const container = root.shadowRoot.querySelector('.bs-button-skeleton');
    expect(container).toEqualAttribute('role', 'status');
    expect(container).toEqualAttribute('aria-label', 'Loading');
    expect(container).toHaveClass('bs-button-skeleton--md');
  });

  it('applies the correct size class for each size value', async () => {
    const { root, setProps } = await render(<bs-button-skeleton size="sm"></bs-button-skeleton>);
    expect(root.shadowRoot.querySelector('.bs-button-skeleton')).toHaveClass('bs-button-skeleton--sm');

    await setProps({ size: 'md' });
    expect(root.shadowRoot.querySelector('.bs-button-skeleton')).toHaveClass('bs-button-skeleton--md');

    await setProps({ size: 'lg' });
    expect(root.shadowRoot.querySelector('.bs-button-skeleton')).toHaveClass('bs-button-skeleton--lg');
  });
});
