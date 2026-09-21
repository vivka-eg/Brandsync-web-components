import { render, h, describe, it, expect } from '@stencil/vitest';

describe('bs-icon-button', () => {
  it('renders the default icon slot and variant/size classes', async () => {
    const { root } = await render(
      <bs-icon-button ariaLabel="Confirm">
        <svg viewBox="0 0 16 16"></svg>
      </bs-icon-button>,
    );
    const button = root.shadowRoot.querySelector('button');
    expect(button).toHaveClass('bs-icon-button--primary');
    expect(button).toHaveClass('bs-icon-button--md');
  });

  it('applies the disabled attribute to the native button', async () => {
    const { root } = await render(
      <bs-icon-button ariaLabel="Confirm" disabled>
        <svg viewBox="0 0 16 16"></svg>
      </bs-icon-button>,
    );
    const button = root.shadowRoot.querySelector('button');
    expect(button).toHaveAttribute('disabled');
  });

  it('reflects the variant prop to the internal class', async () => {
    const { root, setProps } = await render(
      <bs-icon-button ariaLabel="Confirm" variant="neutral">
        <svg viewBox="0 0 16 16"></svg>
      </bs-icon-button>,
    );
    expect(root.shadowRoot.querySelector('button')).toHaveClass('bs-icon-button--neutral');

    await setProps({ variant: 'primary' });
    expect(root.shadowRoot.querySelector('button')).toHaveClass('bs-icon-button--primary');
  });

  it('applies the error variant class and reflects on prop change', async () => {
    const { root, setProps } = await render(
      <bs-icon-button ariaLabel="Delete" variant="error">
        <svg viewBox="0 0 16 16"></svg>
      </bs-icon-button>,
    );
    expect(root.shadowRoot.querySelector('button')).toHaveClass('bs-icon-button--error');

    await setProps({ variant: 'primary' });
    expect(root.shadowRoot.querySelector('button')).toHaveClass('bs-icon-button--primary');
    expect(root.shadowRoot.querySelector('button')).not.toHaveClass('bs-icon-button--error');
  });

  it('applies the subtle variant class', async () => {
    const { root } = await render(
      <bs-icon-button ariaLabel="Confirm" variant="subtle">
        <svg viewBox="0 0 16 16"></svg>
      </bs-icon-button>,
    );
    expect(root.shadowRoot.querySelector('button')).toHaveClass('bs-icon-button--subtle');
  });

  it('applies the outlined variant class', async () => {
    const { root } = await render(
      <bs-icon-button ariaLabel="Confirm" variant="outlined">
        <svg viewBox="0 0 16 16"></svg>
      </bs-icon-button>,
    );
    expect(root.shadowRoot.querySelector('button')).toHaveClass('bs-icon-button--outlined');
  });

  it('applies the success variant class and reflects on prop change', async () => {
    const { root, setProps } = await render(
      <bs-icon-button ariaLabel="Approve" variant="success">
        <svg viewBox="0 0 16 16"></svg>
      </bs-icon-button>,
    );
    expect(root.shadowRoot.querySelector('button')).toHaveClass('bs-icon-button--success');

    await setProps({ variant: 'primary' });
    expect(root.shadowRoot.querySelector('button')).toHaveClass('bs-icon-button--primary');
    expect(root.shadowRoot.querySelector('button')).not.toHaveClass('bs-icon-button--success');
  });

  it('applies the warning variant class', async () => {
    const { root } = await render(
      <bs-icon-button ariaLabel="Proceed anyway" variant="warning">
        <svg viewBox="0 0 16 16"></svg>
      </bs-icon-button>,
    );
    expect(root.shadowRoot.querySelector('button')).toHaveClass('bs-icon-button--warning');
  });

  it('applies the info variant class', async () => {
    const { root } = await render(
      <bs-icon-button ariaLabel="View details" variant="info">
        <svg viewBox="0 0 16 16"></svg>
      </bs-icon-button>,
    );
    expect(root.shadowRoot.querySelector('button')).toHaveClass('bs-icon-button--info');
  });

  it('applies each size class', async () => {
    const { root, setProps } = await render(
      <bs-icon-button ariaLabel="Confirm" size="sm">
        <svg viewBox="0 0 16 16"></svg>
      </bs-icon-button>,
    );
    expect(root.shadowRoot.querySelector('button')).toHaveClass('bs-icon-button--sm');

    await setProps({ size: 'lg' });
    expect(root.shadowRoot.querySelector('button')).toHaveClass('bs-icon-button--lg');
  });

  it('renders size="xs" at 16px with an 8px icon and a smaller radius than sm/md/lg', async () => {
    const { root } = await render(
      <bs-icon-button ariaLabel="Remove" size="xs">
        <svg viewBox="0 0 16 16"></svg>
      </bs-icon-button>,
    );
    const button = root.shadowRoot.querySelector('button');
    expect(button).toHaveClass('bs-icon-button--xs');
    expect(getComputedStyle(button).width).toBe('16px');
    expect(getComputedStyle(button).height).toBe('16px');
    const icon = root.shadowRoot.querySelector('[part="icon"]');
    expect(getComputedStyle(icon).width).toBe('8px');
    expect(getComputedStyle(icon).height).toBe('8px');
  });

  it('sets aria-label on the inner button from the ariaLabel prop', async () => {
    const { root } = await render(
      <bs-icon-button ariaLabel="Delete">
        <svg viewBox="0 0 16 16"></svg>
      </bs-icon-button>,
    );
    const button = root.shadowRoot.querySelector('button');
    expect(button).toEqualAttribute('aria-label', 'Delete');
  });

  it('renders the native button type from the type prop', async () => {
    const { root } = await render(
      <bs-icon-button ariaLabel="Submit" type="submit">
        <svg viewBox="0 0 16 16"></svg>
      </bs-icon-button>,
    );
    const button = root.shadowRoot.querySelector('button');
    expect(button).toEqualAttribute('type', 'submit');
  });

  it('renders the slotted icon content inside part="icon"', async () => {
    const { root } = await render(
      <bs-icon-button ariaLabel="Confirm">
        <svg class="my-icon" viewBox="0 0 16 16"></svg>
      </bs-icon-button>,
    );
    const iconWrapper = root.shadowRoot.querySelector('[part="icon"]');
    expect(iconWrapper).not.toBeNull();
    expect(iconWrapper.querySelector('slot')).not.toBeNull();
    expect(root.querySelector('svg.my-icon')).not.toBeNull();
  });
});
