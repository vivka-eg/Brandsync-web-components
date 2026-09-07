import { render, h, describe, it, expect, afterEach } from '@stencil/vitest';

describe('bs-modal', () => {
  afterEach(() => {
    document.querySelectorAll('button[data-test-trigger]').forEach(el => el.remove());
  });

  it('renders nothing when closed (default)', async () => {
    const { root } = await render(<bs-modal heading="Confirm booking">Body</bs-modal>);
    expect(root.shadowRoot.querySelector('[part="backdrop"]')).toBeNull();
    expect(root.shadowRoot.querySelector('[part="dialog"]')).toBeNull();
  });

  it('renders the backdrop and dialog with correct a11y attributes when open', async () => {
    const { root } = await render(
      <bs-modal open heading="Confirm booking">
        Body content
      </bs-modal>,
    );
    const backdrop = root.shadowRoot.querySelector('[part="backdrop"]');
    const dialog = root.shadowRoot.querySelector('[part="dialog"]');
    expect(backdrop).toBeTruthy();
    expect(dialog).toBeTruthy();
    expect(dialog).toEqualAttribute('role', 'dialog');
    expect(dialog).toEqualAttribute('aria-modal', 'true');
    expect(dialog).toEqualAttribute('aria-label', 'Confirm booking');
    expect(root).toHaveTextContent('Body content');
  });

  (['sm', 'md', 'lg'] as const).forEach(size => {
    it(`applies the "${size}" size class to the dialog`, async () => {
      const { root } = await render(
        <bs-modal open size={size}>
          Body
        </bs-modal>,
      );
      const dialog = root.shadowRoot.querySelector('[part="dialog"]');
      expect(dialog).toHaveClass(`bs-modal__dialog--${size}`);
    });
  });

  it('defaults to the "md" size', async () => {
    const { root } = await render(<bs-modal open>Body</bs-modal>);
    const dialog = root.shadowRoot.querySelector('[part="dialog"]');
    expect(dialog).toHaveClass('bs-modal__dialog--md');
  });

  it('only shows the footer bar when the footer slot has content', async () => {
    const { root: withoutFooter } = await render(<bs-modal open>Body</bs-modal>);
    const footerWithout = withoutFooter.shadowRoot.querySelector('[part="footer"]');
    expect(footerWithout).not.toHaveClass('bs-modal__footer--visible');

    const { root: withFooter } = await render(
      <bs-modal open>
        Body
        <button slot="footer">Confirm</button>
      </bs-modal>,
    );
    const footerWith = withFooter.shadowRoot.querySelector('[part="footer"]');
    expect(footerWith).toHaveClass('bs-modal__footer--visible');
    expect(withFooter).toHaveTextContent('Confirm');
  });

  it('closes and emits bsClose when the close button is clicked', async () => {
    const { root, spyOnEvent, waitForChanges } = await render(
      <bs-modal open heading="Confirm booking">
        Body
      </bs-modal>,
    );
    const closeSpy = spyOnEvent('bsClose');
    const closeButton = root.shadowRoot.querySelector('[part="close"]') as HTMLButtonElement;
    closeButton.click();
    await waitForChanges();

    expect(closeSpy).toHaveReceivedEventTimes(1);
    expect(root).not.toHaveAttribute('open');
    expect(root.shadowRoot.querySelector('[part="dialog"]')).toBeNull();
  });

  it('closes when the backdrop itself is clicked, but not when the dialog inside it is clicked', async () => {
    const { root, spyOnEvent, waitForChanges } = await render(<bs-modal open>Body</bs-modal>);
    const closeSpy = spyOnEvent('bsClose');
    const dialog = root.shadowRoot.querySelector('[part="dialog"]') as HTMLElement;

    dialog.click();
    await waitForChanges();
    expect(closeSpy.length).toBe(0);
    expect(root).toHaveAttribute('open');

    const backdrop = root.shadowRoot.querySelector('[part="backdrop"]') as HTMLElement;
    backdrop.click();
    await waitForChanges();
    expect(closeSpy).toHaveReceivedEventTimes(1);
    expect(root).not.toHaveAttribute('open');
  });

  it('closes on Escape keydown while open', async () => {
    const { root, spyOnEvent, waitForChanges } = await render(<bs-modal open>Body</bs-modal>);
    const closeSpy = spyOnEvent('bsClose');

    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));
    await waitForChanges();

    expect(closeSpy).toHaveReceivedEventTimes(1);
    expect(root).not.toHaveAttribute('open');
  });

  it('does not react to Escape when closed', async () => {
    const { spyOnEvent, waitForChanges } = await render(<bs-modal>Body</bs-modal>);
    const closeSpy = spyOnEvent('bsClose');

    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));
    await waitForChanges();

    expect(closeSpy.length).toBe(0);
  });

  it('moves focus into the dialog when opened', async () => {
    const { root } = await render(<bs-modal open>Body</bs-modal>);
    const dialog = root.shadowRoot.querySelector('[part="dialog"]');
    expect(root.shadowRoot.activeElement).toBe(dialog);
  });

  it('redirects focus back into the dialog if focus escapes it while open (focus trap)', async () => {
    const outside = document.createElement('button');
    outside.setAttribute('data-test-trigger', '');
    outside.textContent = 'outside';
    document.body.appendChild(outside);

    const { root } = await render(<bs-modal open>Body</bs-modal>);
    const dialog = root.shadowRoot.querySelector('[part="dialog"]');

    outside.focus();

    expect(root.shadowRoot.activeElement).toBe(dialog);
  });

  it('captures the previously focused element on open and restores focus to it on close', async () => {
    const trigger = document.createElement('button');
    trigger.setAttribute('data-test-trigger', '');
    trigger.textContent = 'open modal';
    document.body.appendChild(trigger);
    trigger.focus();
    expect(document.activeElement).toBe(trigger);

    const { root, setProps, waitForChanges } = await render(<bs-modal>Body</bs-modal>);
    await setProps({ open: true });

    const dialog = root.shadowRoot.querySelector('[part="dialog"]');
    expect(root.shadowRoot.activeElement).toBe(dialog);

    await setProps({ open: false });
    await waitForChanges();

    expect(document.activeElement).toBe(trigger);
  });
});
