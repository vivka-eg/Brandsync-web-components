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
});
