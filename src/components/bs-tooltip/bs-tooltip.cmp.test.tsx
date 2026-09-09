import { render, h, describe, it, expect } from '@stencil/vitest';

describe('bs-tooltip', () => {
  it('renders slotted content in the default slot', async () => {
    const { root } = await render(<bs-tooltip>I'm a tooltip.</bs-tooltip>);
    expect(root).toHaveTextContent("I'm a tooltip.");
  });

  it('exposes the bubble and arrow parts', async () => {
    const { root } = await render(<bs-tooltip>Hint</bs-tooltip>);
    expect(root.shadowRoot.querySelector('[part="bubble"]')).not.toBeNull();
    expect(root.shadowRoot.querySelector('[part="arrow"]')).not.toBeNull();
  });

  it('defaults the placement prop to "top"', async () => {
    const { root } = await render(<bs-tooltip>Hint</bs-tooltip>);
    expect((root as HTMLBsTooltipElement).placement).toBe('top');
  });
});
