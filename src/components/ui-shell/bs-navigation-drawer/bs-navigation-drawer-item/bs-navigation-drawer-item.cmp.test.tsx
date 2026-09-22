import { render, h, describe, it, expect } from '@stencil/vitest';

describe('bs-navigation-drawer-item', () => {
  it('renders a real button with part="item"', async () => {
    const { root } = await render(<bs-navigation-drawer-item>Introduction</bs-navigation-drawer-item>);
    const button = root.shadowRoot.querySelector('[part="item"]');
    expect(button).not.toBeNull();
    expect(button.tagName).toBe('BUTTON');
    expect(button).toEqualAttribute('type', 'button');
  });

  describe('click behavior: expandable vs. non-expandable', () => {
    it('emits bsSelect (not bsToggle) when expandable is false', async () => {
      const { root, spyOnEvent } = await render(<bs-navigation-drawer-item>Introduction</bs-navigation-drawer-item>);
      const selectSpy = spyOnEvent('bsSelect');
      const toggleSpy = spyOnEvent('bsToggle');
      (root.shadowRoot.querySelector('[part="item"]') as HTMLButtonElement).click();
      expect(selectSpy).toHaveReceivedEventTimes(1);
      expect(toggleSpy).toHaveReceivedEventTimes(0);
    });

    it('emits bsToggle (not bsSelect) when expandable is true', async () => {
      const { root, spyOnEvent } = await render(<bs-navigation-drawer-item expandable>Components</bs-navigation-drawer-item>);
      const selectSpy = spyOnEvent('bsSelect');
      const toggleSpy = spyOnEvent('bsToggle');
      (root.shadowRoot.querySelector('[part="item"]') as HTMLButtonElement).click();
      expect(toggleSpy).toHaveReceivedEventTimes(1);
      expect(selectSpy).toHaveReceivedEventTimes(0);
    });

    it('emits bsToggle with the new expanded value', async () => {
      const { root, spyOnEvent } = await render(<bs-navigation-drawer-item expandable>Components</bs-navigation-drawer-item>);
      const toggleSpy = spyOnEvent('bsToggle');
      (root.shadowRoot.querySelector('[part="item"]') as HTMLButtonElement).click();
      expect(toggleSpy).toHaveReceivedEventDetail(true);
    });

    it('does not self-toggle selected when non-expandable is clicked', async () => {
      const { root, waitForChanges } = await render(<bs-navigation-drawer-item>Introduction</bs-navigation-drawer-item>);
      (root.shadowRoot.querySelector('[part="item"]') as HTMLButtonElement).click();
      await waitForChanges();
      expect((root as HTMLElement & { selected: boolean }).selected).toBe(false);
    });
  });

  describe('expanded (self-toggling)', () => {
    it('defaults to false', async () => {
      const { root } = await render(<bs-navigation-drawer-item expandable>Components</bs-navigation-drawer-item>);
      expect(root.hasAttribute('expanded')).toBe(false);
    });

    it('self-toggles to true on click and reflects the attribute', async () => {
      const { root, waitForChanges } = await render(<bs-navigation-drawer-item expandable>Components</bs-navigation-drawer-item>);
      (root.shadowRoot.querySelector('[part="item"]') as HTMLButtonElement).click();
      await waitForChanges();
      expect((root as HTMLElement & { expanded: boolean }).expanded).toBe(true);
      expect(root).toHaveAttribute('expanded');
    });

    it('self-toggles back to false on a second click', async () => {
      const { root, waitForChanges } = await render(<bs-navigation-drawer-item expandable expanded>Components</bs-navigation-drawer-item>);
      (root.shadowRoot.querySelector('[part="item"]') as HTMLButtonElement).click();
      await waitForChanges();
      expect((root as HTMLElement & { expanded: boolean }).expanded).toBe(false);
      expect(root).not.toHaveAttribute('expanded');
    });

    it('sets aria-expanded on the button when expandable', async () => {
      const { root, waitForChanges } = await render(<bs-navigation-drawer-item expandable>Components</bs-navigation-drawer-item>);
      const button = root.shadowRoot.querySelector('[part="item"]');
      expect(button).toEqualAttribute('aria-expanded', 'false');
      (button as HTMLButtonElement).click();
      await waitForChanges();
      expect(button).toEqualAttribute('aria-expanded', 'true');
    });

    it('does not set aria-expanded when not expandable', async () => {
      const { root } = await render(<bs-navigation-drawer-item>Introduction</bs-navigation-drawer-item>);
      const button = root.shadowRoot.querySelector('[part="item"]');
      expect(button).not.toHaveAttribute('aria-expanded');
    });
  });

  describe('selected', () => {
    it('applies selected styling and reflects the attribute', async () => {
      const { root } = await render(<bs-navigation-drawer-item selected>Introduction</bs-navigation-drawer-item>);
      expect(root).toHaveAttribute('selected');
      const button = root.shadowRoot.querySelector('[part="item"]');
      expect(button).toHaveClass('bs-navigation-drawer-item--selected');
    });

    it('does not apply the selected class when expandable, even if selected is set', async () => {
      const { root } = await render(
        <bs-navigation-drawer-item selected expandable>
          Components
        </bs-navigation-drawer-item>,
      );
      const button = root.shadowRoot.querySelector('[part="item"]');
      expect(button).not.toHaveClass('bs-navigation-drawer-item--selected');
    });
  });

  describe('nested rows', () => {
    it('applies the nested class', async () => {
      const { root } = await render(
        <bs-navigation-drawer-item nested>Button</bs-navigation-drawer-item>,
      );
      const button = root.shadowRoot.querySelector('[part="item"]');
      expect(button).toHaveClass('bs-navigation-drawer-item--nested');
    });

    it('does not render an icon slot wrapper at all for nested rows, even if icon content is provided', async () => {
      const { root } = await render(
        <bs-navigation-drawer-item nested>
          <span slot="icon">ICON</span>
          Button
        </bs-navigation-drawer-item>,
      );
      expect(root.shadowRoot.querySelector('[part="icon"]')).toBeNull();
    });

    it('renders an icon slot wrapper for top-level (non-nested) rows', async () => {
      const { root } = await render(<bs-navigation-drawer-item>Introduction</bs-navigation-drawer-item>);
      expect(root.shadowRoot.querySelector('[part="icon"]')).not.toBeNull();
    });
  });

  describe('icon slot: only reserves space when populated', () => {
    it('does not reserve icon space by default', async () => {
      const { root } = await render(<bs-navigation-drawer-item>Introduction</bs-navigation-drawer-item>);
      const icon = root.shadowRoot.querySelector('[part="icon"]');
      expect(icon).not.toHaveClass('bs-navigation-drawer-item__icon--has-content');
      expect(getComputedStyle(icon as Element).display).toBe('none');
    });

    it('reserves icon space when the icon slot is populated', async () => {
      const { root } = await render(
        <bs-navigation-drawer-item>
          <span slot="icon">ICON</span>
          Introduction
        </bs-navigation-drawer-item>,
      );
      const icon = root.shadowRoot.querySelector('[part="icon"]');
      expect(icon).toHaveClass('bs-navigation-drawer-item__icon--has-content');
    });
  });

  describe('children slot (expandable only)', () => {
    it('does not render a children slot wrapper when not expandable', async () => {
      const { root } = await render(<bs-navigation-drawer-item>Introduction</bs-navigation-drawer-item>);
      expect(root.shadowRoot.querySelector('[part="children"]')).toBeNull();
    });

    it('renders a children slot wrapper when expandable', async () => {
      const { root } = await render(<bs-navigation-drawer-item expandable>Components</bs-navigation-drawer-item>);
      expect(root.shadowRoot.querySelector('[part="children"]')).not.toBeNull();
    });

    it('hides the children slot wrapper when not expanded', async () => {
      const { root } = await render(
        <bs-navigation-drawer-item expandable>
          Components
          <bs-navigation-drawer-item slot="children" nested>
            Button
          </bs-navigation-drawer-item>
        </bs-navigation-drawer-item>,
      );
      const children = root.shadowRoot.querySelector('[part="children"]');
      expect(getComputedStyle(children as Element).display).toBe('none');
    });

    it('shows the children slot wrapper when expanded', async () => {
      const { root } = await render(
        <bs-navigation-drawer-item expandable expanded>
          Components
          <bs-navigation-drawer-item slot="children" nested>
            Button
          </bs-navigation-drawer-item>
        </bs-navigation-drawer-item>,
      );
      const children = root.shadowRoot.querySelector('[part="children"]');
      expect(getComputedStyle(children as Element).display).not.toBe('none');
    });
  });

  describe('collapsed', () => {
    it('keeps the label visible (restyled as a caption), not hidden', async () => {
      const { root } = await render(<bs-navigation-drawer-item collapsed>Introduction</bs-navigation-drawer-item>);
      const label = root.shadowRoot.querySelector('[part="label"]');
      expect(getComputedStyle(label as Element).display).not.toBe('none');
      // .textContent on the shadow-DOM label wrapper doesn't reflect slotted content (a DOM quirk:
      // textContent walks the light tree, not the flattened/slotted one) -- check the host's own
      // text instead, which is what's actually visible on screen via the slot.
      expect(root.textContent.trim()).toBe('Introduction');
    });

    it('forces the chevron hidden even when expandable and expanded', async () => {
      const { root } = await render(
        <bs-navigation-drawer-item collapsed expandable expanded>
          Components
        </bs-navigation-drawer-item>,
      );
      const chevron = root.shadowRoot.querySelector('[part="chevron"]');
      expect(getComputedStyle(chevron as Element).display).toBe('none');
    });

    it('forces the children slot wrapper hidden even when expanded', async () => {
      const { root } = await render(
        <bs-navigation-drawer-item collapsed expandable expanded>
          Components
          <bs-navigation-drawer-item slot="children" nested>
            Button
          </bs-navigation-drawer-item>
        </bs-navigation-drawer-item>,
      );
      const children = root.shadowRoot.querySelector('[part="children"]');
      expect(getComputedStyle(children as Element).display).toBe('none');
    });

    it('moves the selected tint onto the icon chip instead of the whole row', async () => {
      const { root } = await render(
        <bs-navigation-drawer-item collapsed selected>
          <span slot="icon">ICON</span>
          Introduction
        </bs-navigation-drawer-item>,
      );
      const button = root.shadowRoot.querySelector('[part="item"]');
      const icon = root.shadowRoot.querySelector('[part="icon"]');
      expect(getComputedStyle(button as Element).backgroundColor).toBe('rgba(0, 0, 0, 0)');
      expect(getComputedStyle(icon as Element).backgroundColor).not.toBe('rgba(0, 0, 0, 0)');
    });
  });

  describe('ariaLabel', () => {
    it('sets aria-label on the row when provided', async () => {
      const { root } = await render(<bs-navigation-drawer-item ariaLabel="Introduction page">Introduction</bs-navigation-drawer-item>);
      expect(root.shadowRoot.querySelector('[part="item"]')).toEqualAttribute('aria-label', 'Introduction page');
    });

    it('omits aria-label when not provided, falling back to the visible text as the accessible name', async () => {
      const { root } = await render(<bs-navigation-drawer-item>Introduction</bs-navigation-drawer-item>);
      expect(root.shadowRoot.querySelector('[part="item"]').hasAttribute('aria-label')).toBe(false);
    });
  });
});
