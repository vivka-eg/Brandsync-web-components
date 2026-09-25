import { render, h, describe, it, expect } from '@stencil/vitest';

describe('bs-checkbox-skeleton', () => {
  it('renders with role="status" and aria-label="Loading" by default', async () => {
    const { root } = await render(<bs-checkbox-skeleton></bs-checkbox-skeleton>);
    const container = root.shadowRoot.querySelector('.bs-checkbox-skeleton');
    expect(container).toEqualAttribute('role', 'status');
    expect(container).toEqualAttribute('aria-label', 'Loading');
    expect(root.shadowRoot.querySelector('.bs-checkbox-skeleton__box')).toHaveClass('bs-checkbox-skeleton__box--lg');
  });

  it('always renders both a box and a label placeholder', async () => {
    const { root } = await render(<bs-checkbox-skeleton></bs-checkbox-skeleton>);
    expect(root.shadowRoot.querySelector('[part="box"]')).not.toBeNull();
    expect(root.shadowRoot.querySelector('[part="label"]')).not.toBeNull();
  });

  it('applies the correct box size class for each size value', async () => {
    const { root, setProps } = await render(<bs-checkbox-skeleton size="sm"></bs-checkbox-skeleton>);
    expect(root.shadowRoot.querySelector('.bs-checkbox-skeleton__box')).toHaveClass('bs-checkbox-skeleton__box--sm');

    await setProps({ size: 'md' });
    expect(root.shadowRoot.querySelector('.bs-checkbox-skeleton__box')).toHaveClass('bs-checkbox-skeleton__box--md');

    await setProps({ size: 'lg' });
    expect(root.shadowRoot.querySelector('.bs-checkbox-skeleton__box')).toHaveClass('bs-checkbox-skeleton__box--lg');
  });
});
