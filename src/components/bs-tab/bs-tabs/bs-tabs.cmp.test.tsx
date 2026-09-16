import { render, h, describe, it, expect } from '@stencil/vitest';

describe('bs-tabs', () => {
  it('renders a wrapper with role="tablist" and part="tablist"', async () => {
    const { root } = await render(
      <bs-tabs>
        <bs-tab>Overview</bs-tab>
      </bs-tabs>,
    );
    const tablist = root.shadowRoot.querySelector('[part="tablist"]');
    expect(tablist).not.toBeNull();
    expect(tablist.getAttribute('role')).toBe('tablist');
  });

  it('defaults type to "bs-tab" and orientation to "horizontal", reflecting aria-orientation', async () => {
    const { root } = await render(
      <bs-tabs>
        <bs-tab>Overview</bs-tab>
      </bs-tabs>,
    );
    const tablist = root.shadowRoot.querySelector('[part="tablist"]');
    expect(tablist).toHaveClass('bs-tabs--bs-tab');
    expect(tablist).not.toHaveClass('bs-tabs--vertical');
    expect(tablist).toEqualAttribute('aria-orientation', 'horizontal');
  });

  it('orientation="vertical" applies the vertical layout class and aria-orientation', async () => {
    const { root } = await render(
      <bs-tabs orientation="vertical">
        <bs-tab>Overview</bs-tab>
      </bs-tabs>,
    );
    const tablist = root.shadowRoot.querySelector('[part="tablist"]');
    expect(tablist).toHaveClass('bs-tabs--vertical');
    expect(tablist).toEqualAttribute('aria-orientation', 'vertical');
  });

  it('type="bs-inline-tab" applies the inline-tab wrapper class', async () => {
    const { root } = await render(
      <bs-tabs type="bs-inline-tab">
        <bs-inline-tab>Overview</bs-inline-tab>
      </bs-tabs>,
    );
    const tablist = root.shadowRoot.querySelector('[part="tablist"]');
    expect(tablist).toHaveClass('bs-tabs--bs-inline-tab');
  });

  it('coordinates selection across slotted bs-tab children on click', async () => {
    const { root, waitForChanges } = await render(
      <bs-tabs>
        <bs-tab selected>Overview</bs-tab>
        <bs-tab>Details</bs-tab>
        <bs-tab>Settings</bs-tab>
      </bs-tabs>,
    );
    const tabs = Array.from(root.querySelectorAll('bs-tab')) as (HTMLElement & { selected: boolean })[];
    const [first, second, third] = tabs;
    expect(first.selected).toBe(true);

    const secondButton = second.shadowRoot.querySelector('[part="tab"]') as HTMLButtonElement;
    secondButton.click();
    await waitForChanges();

    expect(first.selected).toBe(false);
    expect(second.selected).toBe(true);
    expect(third.selected).toBe(false);
  });

  it('coordinates selection across slotted bs-inline-tab children on click', async () => {
    const { root, waitForChanges } = await render(
      <bs-tabs type="bs-inline-tab">
        <bs-inline-tab selected>Overview</bs-inline-tab>
        <bs-inline-tab>Details</bs-inline-tab>
        <bs-inline-tab>Settings</bs-inline-tab>
      </bs-tabs>,
    );
    const tabs = Array.from(root.querySelectorAll('bs-inline-tab')) as (HTMLElement & { selected: boolean })[];
    const [first, second, third] = tabs;
    expect(first.selected).toBe(true);

    const thirdButton = third.shadowRoot.querySelector('[part="tab"]') as HTMLButtonElement;
    thirdButton.click();
    await waitForChanges();

    expect(first.selected).toBe(false);
    expect(second.selected).toBe(false);
    expect(third.selected).toBe(true);
  });

  it('does not select a disabled slotted tab on click', async () => {
    const { root, waitForChanges } = await render(
      <bs-tabs>
        <bs-tab selected>Overview</bs-tab>
        <bs-tab disabled>Details</bs-tab>
      </bs-tabs>,
    );
    const tabs = Array.from(root.querySelectorAll('bs-tab')) as (HTMLElement & { selected: boolean })[];
    const [first, second] = tabs;

    const secondButton = second.shadowRoot.querySelector('[part="tab"]') as HTMLButtonElement;
    secondButton.click();
    await waitForChanges();

    expect(first.selected).toBe(true);
    expect(second.selected).toBe(false);
  });
});
