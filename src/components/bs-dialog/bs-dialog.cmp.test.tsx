import { render, h, describe, it, expect, afterEach } from '@stencil/vitest';

describe('bs-dialog', () => {
  afterEach(() => {
    document.querySelectorAll('button[data-test-trigger]').forEach(el => el.remove());
  });

  it('renders nothing when closed (default)', async () => {
    const { root } = await render(<bs-dialog heading="Confirm booking">Body</bs-dialog>);
    expect(root.shadowRoot.querySelector('[part="backdrop"]')).toBeNull();
    expect(root.shadowRoot.querySelector('[part="dialog"]')).toBeNull();
  });

  it('renders the backdrop and dialog with correct a11y attributes when open', async () => {
    const { root } = await render(
      <bs-dialog open heading="Confirm booking">
        Body content
      </bs-dialog>,
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
        <bs-dialog open size={size}>
          Body
        </bs-dialog>,
      );
      const dialog = root.shadowRoot.querySelector('[part="dialog"]');
      expect(dialog).toHaveClass(`bs-dialog__dialog--${size}`);
    });
  });

  it('defaults to the "md" size', async () => {
    const { root } = await render(<bs-dialog open>Body</bs-dialog>);
    const dialog = root.shadowRoot.querySelector('[part="dialog"]');
    expect(dialog).toHaveClass('bs-dialog__dialog--md');
  });

  it('only shows the footer bar when the footer slot has content', async () => {
    const { root: withoutFooter } = await render(<bs-dialog open>Body</bs-dialog>);
    const footerWithout = withoutFooter.shadowRoot.querySelector('[part="footer"]');
    expect(footerWithout).not.toHaveClass('bs-dialog__footer--visible');

    const { root: withFooter } = await render(
      <bs-dialog open>
        Body
        <button slot="footer">Confirm</button>
      </bs-dialog>,
    );
    const footerWith = withFooter.shadowRoot.querySelector('[part="footer"]');
    expect(footerWith).toHaveClass('bs-dialog__footer--visible');
    expect(withFooter).toHaveTextContent('Confirm');
  });

  describe('image slot', () => {
    it('has no visible image wrapper and an inline close button when the image slot is empty', async () => {
      const { root } = await render(<bs-dialog open>Body</bs-dialog>);
      const image = root.shadowRoot.querySelector('[part="image"]');
      expect(image).not.toHaveClass('bs-dialog__image--visible');
      const header = root.shadowRoot.querySelector('[part="header"]');
      expect(header.querySelector('[part="close"]')).not.toBeNull();
      expect(root.shadowRoot.querySelector('.bs-dialog__close--floating')).toBeNull();
    });

    it('shows the image wrapper and floats the close button when the image slot has content', async () => {
      const { root } = await render(
        <bs-dialog open>
          Body
          <img slot="image" src="hero.jpg" alt="" />
        </bs-dialog>,
      );
      const image = root.shadowRoot.querySelector('[part="image"]');
      expect(image).toHaveClass('bs-dialog__image--visible');
      const floating = root.shadowRoot.querySelector('.bs-dialog__close--floating');
      expect(floating).not.toBeNull();
      const header = root.shadowRoot.querySelector('[part="header"]');
      expect(header.querySelector('[part="close"]')).toBeNull();
      // Exactly one close button total, not both the floating and inline variants at once.
      expect(root.shadowRoot.querySelectorAll('[part="close"]').length).toBe(1);
    });
  });

  describe('centered layout', () => {
    it('reflects the centered attribute, defaulting to false', async () => {
      const { root } = await render(<bs-dialog open>Body</bs-dialog>);
      expect(root).not.toHaveAttribute('centered');
    });

    it('renders an icon wrapper, centers the header/body, and floats the close button', async () => {
      const { root } = await render(
        <bs-dialog open centered heading="All set">
          Body
          <span slot="icon">✓</span>
        </bs-dialog>,
      );
      expect(root).toHaveAttribute('centered');
      const icon = root.shadowRoot.querySelector('[part="icon"]');
      expect(icon).not.toBeNull();
      expect(icon).toHaveClass('bs-dialog__icon--visible');
      const header = root.shadowRoot.querySelector('[part="header"]');
      expect(header).toHaveClass('bs-dialog__header--centered');
      const body = root.shadowRoot.querySelector('[part="body"]');
      expect(body).toHaveClass('bs-dialog__body--centered');
      expect(header.querySelector('[part="close"]')).toBeNull();
      expect(root.shadowRoot.querySelector('.bs-dialog__close--floating')).not.toBeNull();
    });

    it('does not render an icon wrapper at all when not centered, even with a slotted icon', async () => {
      const { root } = await render(
        <bs-dialog open>
          Body
          <span slot="icon">✓</span>
        </bs-dialog>,
      );
      expect(root.shadowRoot.querySelector('[part="icon"]')).toBeNull();
    });
  });

  it('closes and emits bsClose when the close button is clicked', async () => {
    const { root, spyOnEvent, waitForChanges } = await render(
      <bs-dialog open heading="Confirm booking">
        Body
      </bs-dialog>,
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
    const { root, spyOnEvent, waitForChanges } = await render(<bs-dialog open>Body</bs-dialog>);
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
    const { root, spyOnEvent, waitForChanges } = await render(<bs-dialog open>Body</bs-dialog>);
    const closeSpy = spyOnEvent('bsClose');

    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));
    await waitForChanges();

    expect(closeSpy).toHaveReceivedEventTimes(1);
    expect(root).not.toHaveAttribute('open');
  });

  it('does not react to Escape when closed', async () => {
    const { spyOnEvent, waitForChanges } = await render(<bs-dialog>Body</bs-dialog>);
    const closeSpy = spyOnEvent('bsClose');

    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));
    await waitForChanges();

    expect(closeSpy.length).toBe(0);
  });

  it('moves focus into the dialog when opened', async () => {
    const { root } = await render(<bs-dialog open>Body</bs-dialog>);
    const dialog = root.shadowRoot.querySelector('[part="dialog"]');
    expect(root.shadowRoot.activeElement).toBe(dialog);
  });

  it('redirects focus back into the dialog if focus escapes it while open (focus trap)', async () => {
    const outside = document.createElement('button');
    outside.setAttribute('data-test-trigger', '');
    outside.textContent = 'outside';
    document.body.appendChild(outside);

    const { root } = await render(<bs-dialog open>Body</bs-dialog>);
    const dialog = root.shadowRoot.querySelector('[part="dialog"]');

    outside.focus();

    expect(root.shadowRoot.activeElement).toBe(dialog);
  });

  it('captures the previously focused element on open and restores focus to it on close', async () => {
    const trigger = document.createElement('button');
    trigger.setAttribute('data-test-trigger', '');
    trigger.textContent = 'open dialog';
    document.body.appendChild(trigger);
    trigger.focus();
    expect(document.activeElement).toBe(trigger);

    const { root, setProps, waitForChanges } = await render(<bs-dialog>Body</bs-dialog>);
    await setProps({ open: true });

    const dialog = root.shadowRoot.querySelector('[part="dialog"]');
    expect(root.shadowRoot.activeElement).toBe(dialog);

    await setProps({ open: false });
    await waitForChanges();

    expect(document.activeElement).toBe(trigger);
  });
});
