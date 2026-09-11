import { render, h, describe, it, expect, vi } from '@stencil/vitest';

describe('bs-attachment-list', () => {
  it('renders slotted attachments inside the scrollable row', async () => {
    const { root } = await render(
      <bs-attachment-list>
        <bs-attachment type="pdf" file-name="report.pdf"></bs-attachment>
      </bs-attachment-list>,
    );

    const row = root.shadowRoot.querySelector('[part="row"]');
    expect(row).not.toBeNull();
    expect(root.querySelector('bs-attachment')).not.toBeNull();
  });

  it('has an accessible group label on the row by default', async () => {
    const { root } = await render(<bs-attachment-list></bs-attachment-list>);

    expect(root.shadowRoot.querySelector('[part="row"]').getAttribute('aria-label')).toBe('Attachments');
  });

  it('does not render the fade overlay when content fits without scrolling', async () => {
    const { root } = await render(<bs-attachment-list></bs-attachment-list>);

    expect(root.shadowRoot.querySelector('[part="fade"]')).toBeNull();
  });

  it('shows the fade overlay once the row has more content than fits', async () => {
    const { root, waitForChanges } = await render(<bs-attachment-list></bs-attachment-list>);
    const row = root.shadowRoot.querySelector('[part="row"]') as HTMLDivElement;

    // jsdom never actually lays out content, so scrollWidth/clientWidth are always 0 -- fake the
    // "more content than fits" condition directly rather than relying on real layout.
    vi.spyOn(row, 'scrollWidth', 'get').mockReturnValue(500);
    vi.spyOn(row, 'clientWidth', 'get').mockReturnValue(300);
    row.dispatchEvent(new Event('scroll'));
    await waitForChanges();

    expect(root.shadowRoot.querySelector('[part="fade"]')).not.toBeNull();
  });
});
