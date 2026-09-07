import { render, h, describe, it, expect } from '@stencil/vitest';
import type { BsBadgeVariant } from './bs-badge';

describe('bs-badge', () => {
  it('renders the default slot content and default variant class', async () => {
    const { root } = await render(<bs-badge>Active</bs-badge>);
    expect(root).toHaveTextContent('Active');
    const container = root.shadowRoot.querySelector('.bs-badge');
    expect(container).toHaveClass('bs-badge--default');
  });

  it('exposes the container part on the pill element', async () => {
    const { root } = await render(<bs-badge>Active</bs-badge>);
    const container = root.shadowRoot.querySelector('.bs-badge');
    expect(container).toEqualAttribute('part', 'container');
  });

  const variants: BsBadgeVariant[] = ['default', 'primary', 'success', 'warning', 'info', 'error', 'neutral', 'inverse'];

  variants.forEach(variant => {
    it(`applies the "${variant}" variant class`, async () => {
      const { root } = await render(<bs-badge variant={variant}>Status</bs-badge>);
      const container = root.shadowRoot.querySelector('.bs-badge');
      expect(container).toHaveClass(`bs-badge--${variant}`);
    });
  });

  it('reflects a changed variant prop to the internal class', async () => {
    const { root, setProps } = await render(<bs-badge variant="primary">Status</bs-badge>);
    expect(root.shadowRoot.querySelector('.bs-badge')).toHaveClass('bs-badge--primary');

    await setProps({ variant: 'error' });
    const container = root.shadowRoot.querySelector('.bs-badge');
    expect(container).toHaveClass('bs-badge--error');
    expect(container).not.toHaveClass('bs-badge--primary');
  });
});
