import { render, h, describe, it, expect } from '@stencil/vitest';

describe('bs-composer-status-banner', () => {
  it('renders the message and a default clock icon', async () => {
    const { root } = await render(<bs-composer-status-banner message="Something went wrong"></bs-composer-status-banner>);

    expect(root).toHaveTextContent('Something went wrong');
    expect(root.shadowRoot.querySelector('[part="icon"] svg')).not.toBeNull();
  });

  it('does not render the icon when showIcon is false', async () => {
    const { root } = await render(<bs-composer-status-banner showIcon={false}></bs-composer-status-banner>);

    expect(root.shadowRoot.querySelector('[part="icon"]')).toBeNull();
  });

  it('applies the type-specific class', async () => {
    const { root } = await render(<bs-composer-status-banner type="warning"></bs-composer-status-banner>);

    expect(root.shadowRoot.querySelector('.bs-composer-status-banner').className).toContain('bs-composer-status-banner--warning');
  });

  it('does not render the action button by default', async () => {
    const { root } = await render(<bs-composer-status-banner></bs-composer-status-banner>);

    expect(root.shadowRoot.querySelector('[part="action"]')).toBeNull();
  });

  it('renders the action button with actionLabel when showButton is true', async () => {
    const { root } = await render(<bs-composer-status-banner showButton actionLabel="Retry"></bs-composer-status-banner>);

    const action = root.shadowRoot.querySelector('[part="action"]');
    expect(action).not.toBeNull();
    expect(action).toHaveTextContent('Retry');
  });

  it('emits bsAction when the action button is clicked', async () => {
    const { root, spyOnEvent } = await render(<bs-composer-status-banner showButton></bs-composer-status-banner>);
    const actionSpy = spyOnEvent('bsAction');

    (root.shadowRoot.querySelector('[part="action"]') as HTMLButtonElement).click();

    expect(actionSpy).toHaveReceivedEventTimes(1);
  });

  it('does not render the close button when allowClose is false', async () => {
    const { root } = await render(<bs-composer-status-banner allowClose={false}></bs-composer-status-banner>);

    expect(root.shadowRoot.querySelector('[part="close"]')).toBeNull();
  });

  it('emits bsClose when the close button is clicked', async () => {
    const { root, spyOnEvent } = await render(<bs-composer-status-banner></bs-composer-status-banner>);
    const closeSpy = spyOnEvent('bsClose');

    (root.shadowRoot.querySelector('[part="close"]') as HTMLButtonElement).click();

    expect(closeSpy).toHaveReceivedEventTimes(1);
  });
});
