import { render, h, describe, it, expect } from '@stencil/vitest';

describe('bs-snackbar', () => {
  it('defaults to the "default" variant', async () => {
    const { root } = await render(<bs-snackbar>Files uploaded successfully.</bs-snackbar>);
    const container = root.shadowRoot.querySelector('[part="container"]');
    expect(container).toHaveClass('bs-snackbar--default');
  });

  (['default', 'info', 'warning', 'success', 'error'] as const).forEach(variant => {
    it(`applies the "${variant}" variant class`, async () => {
      const { root } = await render(<bs-snackbar variant={variant}>Message</bs-snackbar>);
      const container = root.shadowRoot.querySelector('[part="container"]');
      expect(container).toHaveClass(`bs-snackbar--${variant}`);
    });
  });

  it('renders the slotted message', async () => {
    const { root } = await render(<bs-snackbar>Files uploaded successfully.</bs-snackbar>);
    expect(root).toHaveTextContent('Files uploaded successfully.');
  });

  describe('icon vs. loading spinner', () => {
    it('renders the checkmark icon by default', async () => {
      const { root } = await render(<bs-snackbar>Message</bs-snackbar>);
      const icon = root.shadowRoot.querySelector('[part="icon"]');
      expect(icon.querySelector('svg')).not.toBeNull();
      expect(icon.querySelector('.bs-snackbar__spinner')).toBeNull();
    });

    it('renders the spinner instead of the icon when loading', async () => {
      const { root } = await render(<bs-snackbar loading>Message</bs-snackbar>);
      const icon = root.shadowRoot.querySelector('[part="icon"]');
      expect(icon.querySelector('.bs-snackbar__spinner')).not.toBeNull();
      expect(icon.querySelector('svg')).toBeNull();
    });
  });

  describe('action button', () => {
    it('renders no action button when actionLabel is not set', async () => {
      const { root } = await render(<bs-snackbar>Message</bs-snackbar>);
      expect(root.shadowRoot.querySelector('[part="action"]')).toBeNull();
    });

    it('renders the action button with the given label when actionLabel is set', async () => {
      const { root } = await render(<bs-snackbar actionLabel="Undo">Message</bs-snackbar>);
      const action = root.shadowRoot.querySelector('[part="action"]');
      expect(action).not.toBeNull();
      expect(action.textContent.trim()).toBe('Undo');
    });

    it('emits bsAction when the action button is clicked', async () => {
      const { root, spyOnEvent } = await render(<bs-snackbar actionLabel="Undo">Message</bs-snackbar>);
      const actionSpy = spyOnEvent('bsAction');
      (root.shadowRoot.querySelector('[part="action"]') as HTMLButtonElement).click();
      expect(actionSpy).toHaveReceivedEventTimes(1);
    });
  });

  describe('close button', () => {
    it('always renders a close button with an accessible name', async () => {
      const { root } = await render(<bs-snackbar>Message</bs-snackbar>);
      const close = root.shadowRoot.querySelector('[part="close"]');
      expect(close).not.toBeNull();
      expect(close).toEqualAttribute('aria-label', 'Dismiss');
    });

    it('emits bsDismiss when the close button is clicked', async () => {
      const { root, spyOnEvent } = await render(<bs-snackbar>Message</bs-snackbar>);
      const dismissSpy = spyOnEvent('bsDismiss');
      (root.shadowRoot.querySelector('[part="close"]') as HTMLButtonElement).click();
      expect(dismissSpy).toHaveReceivedEventTimes(1);
    });
  });

  describe('aria-live', () => {
    it('uses aria-live="polite" for non-error variants', async () => {
      const { root } = await render(<bs-snackbar variant="success">Message</bs-snackbar>);
      const container = root.shadowRoot.querySelector('[part="container"]');
      expect(container).toEqualAttribute('aria-live', 'polite');
    });

    it('uses aria-live="assertive" for the error variant', async () => {
      const { root } = await render(<bs-snackbar variant="error">Message</bs-snackbar>);
      const container = root.shadowRoot.querySelector('[part="container"]');
      expect(container).toEqualAttribute('aria-live', 'assertive');
    });
  });
});
