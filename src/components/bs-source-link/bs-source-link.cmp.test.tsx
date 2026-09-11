import { render, h, describe, it, expect } from '@stencil/vitest';

describe('bs-source-link', () => {
  it('renders the file icon nested alongside the filename, not as a top-level sibling', async () => {
    const { root } = await render(<bs-source-link file-name="report.pdf"></bs-source-link>);

    const filenameRow = root.shadowRoot.querySelector('.bs-source-link__filename-row');
    expect(filenameRow.querySelector('[part="icon"]')).not.toBeNull();
    expect(filenameRow).toHaveTextContent('report.pdf');
  });

  it('renders as a native button when href is not set, and emits bsOpen on click', async () => {
    const { root, spyOnEvent } = await render(<bs-source-link file-name="report.pdf"></bs-source-link>);
    const spy = spyOnEvent('bsOpen');

    const el = root.shadowRoot.querySelector('.bs-source-link');
    expect(el.tagName).toBe('BUTTON');
    (el as HTMLButtonElement).click();

    expect(spy).toHaveReceivedEventTimes(1);
  });

  it('renders as a link when href is set, with target="_blank" by default', async () => {
    const { root } = await render(<bs-source-link file-name="report.pdf" href="https://example.com/report.pdf"></bs-source-link>);

    const el = root.shadowRoot.querySelector('.bs-source-link');
    expect(el.tagName).toBe('A');
    expect(el).toEqualAttribute('href', 'https://example.com/report.pdf');
    expect(el).toEqualAttribute('target', '_blank');
    expect(el).toEqualAttribute('rel', 'noopener noreferrer');
  });

  it('renders source name and version separated by a dot when both are set', async () => {
    const { root } = await render(<bs-source-link source-name="HoltePortalen" version="v3.2"></bs-source-link>);

    expect(root.shadowRoot.querySelector('[part="source"]')).toHaveTextContent('HoltePortalen');
    expect(root.shadowRoot.querySelector('[part="version"]')).toHaveTextContent('v3.2');
    expect(root.shadowRoot.querySelector('.bs-source-link__dot')).not.toBeNull();
  });

  it('does not render the meta row content or dot when sourceName and version are unset', async () => {
    const { root } = await render(<bs-source-link></bs-source-link>);

    expect(root.shadowRoot.querySelector('[part="source"]')).toBeNull();
    expect(root.shadowRoot.querySelector('[part="version"]')).toBeNull();
    expect(root.shadowRoot.querySelector('.bs-source-link__dot')).toBeNull();
  });

  it('renders slotted content in the icon slot instead of the default file icon', async () => {
    const { root } = await render(
      <bs-source-link>
        <svg slot="icon" data-testid="custom-icon"></svg>
      </bs-source-link>,
    );

    const slot = root.shadowRoot.querySelector('slot[name="icon"]') as HTMLSlotElement;
    expect(slot.assignedElements()).toHaveLength(1);
  });
});
