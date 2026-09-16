import { render, h, describe, it, expect } from '@stencil/vitest';

describe('bs-menu-item', () => {
  it('renders a button with role="menuitem" and part="item"', async () => {
    const { root } = await render(<bs-menu-item>Read aloud</bs-menu-item>);
    const button = root.shadowRoot.querySelector('[part="item"]');
    expect(button).not.toBeNull();
    expect(button.tagName).toBe('BUTTON');
    expect(button.getAttribute('role')).toBe('menuitem');
    expect(button.getAttribute('type')).toBe('button');
  });

  it('renders the label slot content', async () => {
    const { root } = await render(<bs-menu-item>Read aloud</bs-menu-item>);
    expect(root).toHaveTextContent('Read aloud');
  });

  it('does not reserve icon space when no icon is slotted', async () => {
    const { root } = await render(<bs-menu-item>Read aloud</bs-menu-item>);
    const icon = root.shadowRoot.querySelector('[part="icon"]');
    expect(icon).not.toBeNull();
    expect(icon).not.toHaveClass('bs-menu-item__icon--has-content');
    expect(getComputedStyle(icon as Element).display).toBe('none');
  });

  it('shows the icon wrapper when an icon is slotted', async () => {
    const { root } = await render(
      <bs-menu-item>
        <span slot="icon">ICON</span>
        Read aloud
      </bs-menu-item>,
    );
    const icon = root.shadowRoot.querySelector('[part="icon"]');
    expect(icon).toHaveClass('bs-menu-item__icon--has-content');
  });

  it('emits bsSelect when clicked', async () => {
    const { root, spyOnEvent } = await render(<bs-menu-item>Read aloud</bs-menu-item>);
    const selectSpy = spyOnEvent('bsSelect');
    (root.shadowRoot.querySelector('[part="item"]') as HTMLButtonElement).click();
    expect(selectSpy).toHaveReceivedEventTimes(1);
  });

  it('has no background by default (enabled state has no fill of its own)', async () => {
    const { root } = await render(<bs-menu-item>Read aloud</bs-menu-item>);
    const button = root.shadowRoot.querySelector('[part="item"]') as HTMLElement;
    expect(getComputedStyle(button).backgroundColor).toBe('rgba(0, 0, 0, 0)');
  });

  it('applies disabled styling, sets the native disabled attribute and aria-disabled, when disabled is set', async () => {
    const { root } = await render(<bs-menu-item disabled>Read aloud</bs-menu-item>);
    const button = root.shadowRoot.querySelector('[part="item"]') as HTMLButtonElement;
    expect(button).toHaveClass('bs-menu-item--disabled');
    expect(button).toHaveAttribute('disabled');
    expect(button).toEqualAttribute('aria-disabled', 'true');
  });

  it('does not emit bsSelect when clicked while disabled', async () => {
    const { root, spyOnEvent } = await render(<bs-menu-item disabled>Read aloud</bs-menu-item>);
    const selectSpy = spyOnEvent('bsSelect');
    (root.shadowRoot.querySelector('[part="item"]') as HTMLButtonElement).click();
    expect(selectSpy).toHaveReceivedEventTimes(0);
  });
});
