import { render, h, describe, it, expect } from '@stencil/vitest';
import type { BsCardSurface } from './bs-card';

describe('bs-card', () => {
  it('defaults to the "raised" surface', async () => {
    const { root } = await render(<bs-card>Body content</bs-card>);
    const container = root.shadowRoot.querySelector('.bs-card');
    expect(container).toHaveClass('bs-card--raised');
  });

  const surfaces: BsCardSurface[] = ['base', 'raised', 'container'];

  surfaces.forEach(surface => {
    it(`applies the "${surface}" surface class`, async () => {
      const { root } = await render(<bs-card surface={surface}>Body content</bs-card>);
      const container = root.shadowRoot.querySelector('.bs-card');
      expect(container).toHaveClass(`bs-card--${surface}`);
    });
  });

  it('renders the header, default, and footer slot content in their respective parts', async () => {
    const { root } = await render(
      <bs-card>
        <span slot="header">Booking summary</span>
        Main content
        <span slot="footer">Actions</span>
      </bs-card>,
    );

    expect(root).toHaveTextContent('Booking summary');
    expect(root).toHaveTextContent('Main content');
    expect(root).toHaveTextContent('Actions');

    const headerSlot = root.shadowRoot.querySelector('[part="header"] slot[name="header"]');
    const bodySlot = root.shadowRoot.querySelector('[part="body"] slot:not([name])');
    const footerSlot = root.shadowRoot.querySelector('[part="footer"] slot[name="footer"]');
    expect(headerSlot).toBeTruthy();
    expect(bodySlot).toBeTruthy();
    expect(footerSlot).toBeTruthy();
  });

  it('exposes container, header, body, and footer parts', async () => {
    const { root } = await render(<bs-card>Body content</bs-card>);
    expect(root.shadowRoot.querySelector('[part="container"]')).toBeTruthy();
    expect(root.shadowRoot.querySelector('[part="header"]')).toBeTruthy();
    expect(root.shadowRoot.querySelector('[part="body"]')).toBeTruthy();
    expect(root.shadowRoot.querySelector('[part="footer"]')).toBeTruthy();
  });

  it('renders empty header/footer wrappers when no slotted content is provided', async () => {
    const { root } = await render(<bs-card>Body content only</bs-card>);
    const header = root.shadowRoot.querySelector('.bs-card__header');
    const footer = root.shadowRoot.querySelector('.bs-card__footer');
    expect(header.textContent.trim()).toBe('');
    expect(footer.textContent.trim()).toBe('');
  });
});
