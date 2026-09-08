import { render, h, describe, it, expect } from '@stencil/vitest';

describe('bs-menu', () => {
  it('renders with role="menu" on the host', async () => {
    const { root } = await render(<bs-menu></bs-menu>);
    expect(root.shadowRoot.querySelector('[part="list"]').getAttribute('role')).toBe('menu');
  });

  it('exposes the list part', async () => {
    const { root } = await render(<bs-menu></bs-menu>);
    expect(root.shadowRoot.querySelector('[part="list"]')).not.toBeNull();
  });

  it('renders slotted content in the default slot', async () => {
    const { root } = await render(
      <bs-menu>
        <bs-menu-item>Item one</bs-menu-item>
      </bs-menu>,
    );
    expect(root).toHaveTextContent('Item one');
    const slot = root.shadowRoot.querySelector('[part="list"] slot:not([name])') as HTMLSlotElement;
    expect(slot).not.toBeNull();
    expect(slot.assignedElements()).toHaveLength(1);
  });
});
