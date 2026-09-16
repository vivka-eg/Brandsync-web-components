import { render, h, describe, it, expect } from '@stencil/vitest';

describe('bs-tab', () => {
  it('renders a button with role="tab" and part="tab"', async () => {
    const { root } = await render(<bs-tab>Overview</bs-tab>);
    const button = root.shadowRoot.querySelector('[part="tab"]');
    expect(button).not.toBeNull();
    expect(button.tagName).toBe('BUTTON');
    expect(button.getAttribute('role')).toBe('tab');
    expect(button.getAttribute('type')).toBe('button');
  });

  it('reflects ariaLabel to the aria-label attribute, for icon-only accessible names', async () => {
    const { root } = await render(
      <bs-tab ariaLabel="Home">
        <span slot="icon">ICON</span>
      </bs-tab>,
    );
    const button = root.shadowRoot.querySelector('[part="tab"]');
    expect(button).toEqualAttribute('aria-label', 'Home');
  });

  it('does not set aria-label when ariaLabel is not provided', async () => {
    const { root } = await render(<bs-tab>Overview</bs-tab>);
    const button = root.shadowRoot.querySelector('[part="tab"]');
    expect(button).not.toHaveAttribute('aria-label');
  });

  describe('layout variants', () => {
    it('text-only: renders the label, no icon space reserved', async () => {
      const { root } = await render(<bs-tab>Overview</bs-tab>);
      expect(root).toHaveTextContent('Overview');
      const icon = root.shadowRoot.querySelector('[part="icon"]');
      expect(icon).not.toHaveClass('bs-tab__icon--has-content');
      expect(getComputedStyle(icon as Element).display).toBe('none');
      const label = root.shadowRoot.querySelector('[part="label"]');
      expect(label).toHaveClass('bs-tab__label--has-content');
    });

    it('icon-only: renders the icon, no label space reserved', async () => {
      const { root } = await render(
        <bs-tab>
          <span slot="icon">ICON</span>
        </bs-tab>,
      );
      const icon = root.shadowRoot.querySelector('[part="icon"]');
      expect(icon).toHaveClass('bs-tab__icon--has-content');
      const label = root.shadowRoot.querySelector('[part="label"]');
      expect(label).not.toHaveClass('bs-tab__label--has-content');
      expect(getComputedStyle(label as Element).display).toBe('none');
      const button = root.shadowRoot.querySelector('[part="tab"]');
      expect(button).toHaveClass('bs-tab--icon-only');
    });

    it('icon + text horizontal (default iconPosition): row layout, not vertical', async () => {
      const { root } = await render(
        <bs-tab>
          <span slot="icon">ICON</span>
          Overview
        </bs-tab>,
      );
      const button = root.shadowRoot.querySelector('[part="tab"]');
      expect(button).not.toHaveClass('bs-tab--vertical');
      expect(button).not.toHaveClass('bs-tab--icon-only');
    });

    it('icon + text vertical (iconPosition="top"): column layout', async () => {
      const { root } = await render(
        <bs-tab iconPosition="top">
          <span slot="icon">ICON</span>
          Overview
        </bs-tab>,
      );
      const button = root.shadowRoot.querySelector('[part="tab"]');
      expect(button).toHaveClass('bs-tab--vertical');
    });
  });

  describe('badge slot', () => {
    it('does not reserve badge space when empty', async () => {
      const { root } = await render(<bs-tab>Overview</bs-tab>);
      const badge = root.shadowRoot.querySelector('[part="badge"]');
      expect(badge).not.toHaveClass('bs-tab__badge--has-content');
      expect(getComputedStyle(badge as Element).display).toBe('none');
    });

    it('reserves badge space in a text-only tab when populated', async () => {
      const { root } = await render(
        <bs-tab>
          Overview
          <span slot="badge">3</span>
        </bs-tab>,
      );
      const badge = root.shadowRoot.querySelector('[part="badge"]');
      expect(badge).toHaveClass('bs-tab__badge--has-content');
    });

    it('does not reserve badge space in an icon-only tab, even when populated', async () => {
      const { root } = await render(
        <bs-tab>
          <span slot="icon">ICON</span>
          <span slot="badge">3</span>
        </bs-tab>,
      );
      const badge = root.shadowRoot.querySelector('[part="badge"]');
      expect(badge).not.toHaveClass('bs-tab__badge--has-content');
    });

    it('does not reserve badge space in an icon+text vertical tab, even when populated', async () => {
      const { root } = await render(
        <bs-tab iconPosition="top">
          <span slot="icon">ICON</span>
          Overview
          <span slot="badge">3</span>
        </bs-tab>,
      );
      const badge = root.shadowRoot.querySelector('[part="badge"]');
      expect(badge).not.toHaveClass('bs-tab__badge--has-content');
    });
  });

  describe('selected', () => {
    it('applies selected styling and reflects the attribute, but is false by default', async () => {
      const { root } = await render(<bs-tab>Overview</bs-tab>);
      const button = root.shadowRoot.querySelector('[part="tab"]');
      expect(button).not.toHaveClass('bs-tab--selected');
      expect(button).toEqualAttribute('aria-selected', 'false');
    });

    it('reflects selected as an attribute and applies selected styling', async () => {
      const { root } = await render(<bs-tab selected>Overview</bs-tab>);
      expect(root).toHaveAttribute('selected');
      const button = root.shadowRoot.querySelector('[part="tab"]');
      expect(button).toHaveClass('bs-tab--selected');
      expect(button).toEqualAttribute('aria-selected', 'true');
    });

    it('does not self-toggle selected on click', async () => {
      const { root, waitForChanges } = await render(<bs-tab>Overview</bs-tab>);
      const button = root.shadowRoot.querySelector('[part="tab"]') as HTMLButtonElement;
      button.click();
      await waitForChanges();
      expect((root as HTMLElement & { selected: boolean }).selected).toBe(false);
      expect(button).not.toHaveClass('bs-tab--selected');
    });
  });

  it('emits bsSelect when clicked', async () => {
    const { root, spyOnEvent } = await render(<bs-tab>Overview</bs-tab>);
    const selectSpy = spyOnEvent('bsSelect');
    (root.shadowRoot.querySelector('[part="tab"]') as HTMLButtonElement).click();
    expect(selectSpy).toHaveReceivedEventTimes(1);
  });

  describe('disabled', () => {
    it('applies disabled styling, sets the native disabled attribute and aria-disabled', async () => {
      const { root } = await render(<bs-tab disabled>Overview</bs-tab>);
      const button = root.shadowRoot.querySelector('[part="tab"]') as HTMLButtonElement;
      expect(button).toHaveClass('bs-tab--disabled');
      expect(button).toHaveAttribute('disabled');
      expect(button).toEqualAttribute('aria-disabled', 'true');
    });

    it('does not emit bsSelect when clicked while disabled', async () => {
      const { root, spyOnEvent } = await render(<bs-tab disabled>Overview</bs-tab>);
      const selectSpy = spyOnEvent('bsSelect');
      (root.shadowRoot.querySelector('[part="tab"]') as HTMLButtonElement).click();
      expect(selectSpy).toHaveReceivedEventTimes(0);
    });
  });
});
