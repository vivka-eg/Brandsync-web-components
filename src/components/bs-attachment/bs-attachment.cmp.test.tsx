import { render, h, describe, it, expect } from '@stencil/vitest';

describe('bs-attachment', () => {
  it('renders an image thumbnail by default', async () => {
    const { root } = await render(<bs-attachment image-src="/photo.jpg" image-alt="A photo"></bs-attachment>);

    const thumbnail = root.shadowRoot.querySelector('[part="thumbnail"]');
    expect(thumbnail).not.toBeNull();
    const img = root.shadowRoot.querySelector('img');
    expect(img.getAttribute('src')).toBe('/photo.jpg');
    expect(img.getAttribute('alt')).toBe('A photo');
  });

  it('renders a filename card with a PDF badge for type="pdf"', async () => {
    const { root } = await render(<bs-attachment type="pdf" file-name="report.pdf"></bs-attachment>);

    expect(root.shadowRoot.querySelector('[part="card"]')).not.toBeNull();
    expect(root).toHaveTextContent('report.pdf');
    expect(root.shadowRoot.querySelector('[part="badge"]').className).toContain('bs-attachment__badge--pdf');
  });

  it('renders a filename card with a document badge for type="document"', async () => {
    const { root } = await render(<bs-attachment type="document" file-name="notes.docx"></bs-attachment>);

    expect(root.shadowRoot.querySelector('[part="badge"]').className).toContain('bs-attachment__badge--document');
  });

  it('shows a spinner in the badge instead of the file icon when loading', async () => {
    const { root } = await render(<bs-attachment type="pdf" loading></bs-attachment>);

    const badge = root.shadowRoot.querySelector('[part="badge"]');
    expect(badge.querySelector('svg')).toBeNull();
    expect(badge.querySelector('[role="status"]')).not.toBeNull();
  });

  it('marks the host aria-busy when loading', async () => {
    const { root } = await render(<bs-attachment loading></bs-attachment>);

    expect(root.shadowRoot.querySelector('.bs-attachment').getAttribute('aria-busy')).toBe('true');
  });

  it('emits bsRemove when the remove button is clicked', async () => {
    const { root, spyOnEvent } = await render(<bs-attachment></bs-attachment>);
    const removeSpy = spyOnEvent('bsRemove');

    (root.shadowRoot.querySelector('[part="remove"]') as HTMLButtonElement).click();

    expect(removeSpy).toHaveReceivedEventTimes(1);
  });

  it('does not render a remove button when removable is false', async () => {
    const { root } = await render(<bs-attachment removable={false}></bs-attachment>);

    expect(root.shadowRoot.querySelector('[part="remove"]')).toBeNull();
  });
});
