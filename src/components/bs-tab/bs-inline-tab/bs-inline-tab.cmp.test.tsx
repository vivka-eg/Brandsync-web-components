import { render, h, describe, it, expect } from '@stencil/vitest';

describe('bs-inline-tab', () => {
  it('renders a button with role="tab" and part="tab"', async () => {
    const { root } = await render(<bs-inline-tab>Overview</bs-inline-tab>);
    const button = root.shadowRoot.querySelector('[part="tab"]');
    expect(button).not.toBeNull();
    expect(button.tagName).toBe('BUTTON');
    expect(button.getAttribute('role')).toBe('tab');
    expect(button.getAttribute('type')).toBe('button');
  });

  it('reflects ariaLabel to the aria-label attribute, for icon-only accessible names', async () => {
    const { root } = await render(
      <bs-inline-tab ariaLabel="Home">
        <span slot="icon">ICON</span>
      </bs-inline-tab>,
    );
    const button = root.shadowRoot.querySelector('[part="tab"]');
    expect(button).toEqualAttribute('aria-label', 'Home');
  });

  it('does not set aria-label when ariaLabel is not provided', async () => {
    const { root } = await render(<bs-inline-tab>Overview</bs-inline-tab>);
    const button = root.shadowRoot.querySelector('[part="tab"]');
    expect(button).not.toHaveAttribute('aria-label');
  });

  describe('layout variants', () => {
    it('text-only: renders the label, no icon space reserved', async () => {
      const { root } = await render(<bs-inline-tab>Overview</bs-inline-tab>);
      expect(root).toHaveTextContent('Overview');
      const icon = root.shadowRoot.querySelector('[part="icon"]');
      expect(icon).not.toHaveClass('bs-inline-tab__icon--has-content');
      expect(getComputedStyle(icon as Element).display).toBe('none');
      const label = root.shadowRoot.querySelector('[part="label"]');
      expect(label).toHaveClass('bs-inline-tab__label--has-content');
    });

    it('icon + label: renders both, no icon-only class', async () => {
      const { root } = await render(
        <bs-inline-tab>
          <span slot="icon">ICON</span>
          Overview
        </bs-inline-tab>,
      );
      const icon = root.shadowRoot.querySelector('[part="icon"]');
      expect(icon).toHaveClass('bs-inline-tab__icon--has-content');
      const label = root.shadowRoot.querySelector('[part="label"]');
      expect(label).toHaveClass('bs-inline-tab__label--has-content');
      const button = root.shadowRoot.querySelector('[part="tab"]');
      expect(button).not.toHaveClass('bs-inline-tab--icon-only');
      expect(button).toHaveClass('bs-inline-tab--has-icon');
    });

    it('icon-only: renders the icon, no label space reserved, requires ariaLabel', async () => {
      const { root } = await render(
        <bs-inline-tab ariaLabel="Home">
          <span slot="icon">ICON</span>
        </bs-inline-tab>,
      );
      const icon = root.shadowRoot.querySelector('[part="icon"]');
      expect(icon).toHaveClass('bs-inline-tab__icon--has-content');
      const label = root.shadowRoot.querySelector('[part="label"]');
      expect(label).not.toHaveClass('bs-inline-tab__label--has-content');
      expect(getComputedStyle(label as Element).display).toBe('none');
      const button = root.shadowRoot.querySelector('[part="tab"]');
      expect(button).toHaveClass('bs-inline-tab--icon-only');
      expect(button).toEqualAttribute('aria-label', 'Home');
    });
  });

  describe('selected', () => {
    it('applies selected styling and reflects the attribute, but is false by default', async () => {
      const { root } = await render(<bs-inline-tab>Overview</bs-inline-tab>);
      const button = root.shadowRoot.querySelector('[part="tab"]');
      expect(button).not.toHaveClass('bs-inline-tab--selected');
      expect(button).toEqualAttribute('aria-selected', 'false');
    });

    it('reflects selected as an attribute and applies selected styling', async () => {
      const { root } = await render(<bs-inline-tab selected>Overview</bs-inline-tab>);
      expect(root).toHaveAttribute('selected');
      const button = root.shadowRoot.querySelector('[part="tab"]');
      expect(button).toHaveClass('bs-inline-tab--selected');
      expect(button).toEqualAttribute('aria-selected', 'true');
    });

    it('does not self-toggle selected on click', async () => {
      const { root, waitForChanges } = await render(<bs-inline-tab>Overview</bs-inline-tab>);
      const button = root.shadowRoot.querySelector('[part="tab"]') as HTMLButtonElement;
      button.click();
      await waitForChanges();
      expect((root as HTMLElement & { selected: boolean }).selected).toBe(false);
      expect(button).not.toHaveClass('bs-inline-tab--selected');
    });
  });

  it('emits bsSelect when clicked', async () => {
    const { root, spyOnEvent } = await render(<bs-inline-tab>Overview</bs-inline-tab>);
    const selectSpy = spyOnEvent('bsSelect');
    (root.shadowRoot.querySelector('[part="tab"]') as HTMLButtonElement).click();
    expect(selectSpy).toHaveReceivedEventTimes(1);
  });

  describe('disabled', () => {
    it('applies disabled styling, sets the native disabled attribute and aria-disabled', async () => {
      const { root } = await render(<bs-inline-tab disabled>Overview</bs-inline-tab>);
      const button = root.shadowRoot.querySelector('[part="tab"]') as HTMLButtonElement;
      expect(button).toHaveClass('bs-inline-tab--disabled');
      expect(button).toHaveAttribute('disabled');
      expect(button).toEqualAttribute('aria-disabled', 'true');
    });

    it('does not emit bsSelect when clicked while disabled', async () => {
      const { root, spyOnEvent } = await render(<bs-inline-tab disabled>Overview</bs-inline-tab>);
      const selectSpy = spyOnEvent('bsSelect');
      (root.shadowRoot.querySelector('[part="tab"]') as HTMLButtonElement).click();
      expect(selectSpy).toHaveReceivedEventTimes(0);
    });

    it('applies both the disabled and selected classes when both are set (disabled always wins in CSS precedence)', async () => {
      const { root } = await render(
        <bs-inline-tab disabled selected>
          Overview
        </bs-inline-tab>,
      );
      const button = root.shadowRoot.querySelector('[part="tab"]') as HTMLButtonElement;
      expect(button).toHaveClass('bs-inline-tab--disabled');
      expect(button).toHaveClass('bs-inline-tab--selected');
      expect(button).toHaveAttribute('disabled');
    });
  });
});
