import { render, h, describe, it, expect } from '@stencil/vitest';

describe('bs-chatbot-sources-drawer', () => {
  it('renders the heading and slotted bs-source-link rows', async () => {
    const { root } = await render(
      <bs-chatbot-sources-drawer heading="Sources">
        <bs-source-link file-name="report.pdf"></bs-source-link>
        <bs-source-link file-name="notes.docx"></bs-source-link>
      </bs-chatbot-sources-drawer>,
    );

    expect(root.shadowRoot.querySelector('[part="heading"]')).toHaveTextContent('Sources');
    const slot = root.shadowRoot.querySelector('[part="list"] slot') as HTMLSlotElement;
    expect(slot.assignedElements()).toHaveLength(2);
  });

  it('does not render the count badge when there are no sources', async () => {
    const { root } = await render(<bs-chatbot-sources-drawer></bs-chatbot-sources-drawer>);

    expect(root.shadowRoot.querySelector('[part="count"]')).toBeNull();
  });

  it('auto-detects the count from slotted bs-source-link children', async () => {
    const { root, waitForChanges } = await render(
      <bs-chatbot-sources-drawer>
        <bs-source-link file-name="a.pdf"></bs-source-link>
        <bs-source-link file-name="b.pdf"></bs-source-link>
        <bs-source-link file-name="c.pdf"></bs-source-link>
      </bs-chatbot-sources-drawer>,
    );
    // The initial count is computed from slotchange, which fires once assignment settles.
    await waitForChanges();

    expect(root.shadowRoot.querySelector('[part="count"]')).toHaveTextContent('3');
  });

  it('ignores non-bs-source-link children when counting', async () => {
    const { root, waitForChanges } = await render(
      <bs-chatbot-sources-drawer>
        <bs-source-link file-name="a.pdf"></bs-source-link>
        <div>not a source</div>
      </bs-chatbot-sources-drawer>,
    );
    await waitForChanges();

    expect(root.shadowRoot.querySelector('[part="count"]')).toHaveTextContent('1');
  });

  it('overrides the auto-detected count when the count prop is set', async () => {
    const { root } = await render(
      <bs-chatbot-sources-drawer count={9}>
        <bs-source-link file-name="a.pdf"></bs-source-link>
      </bs-chatbot-sources-drawer>,
    );

    expect(root.shadowRoot.querySelector('[part="count"]')).toHaveTextContent('9');
  });

  it('emits bsCollapse when the collapse button is clicked', async () => {
    const { root, spyOnEvent } = await render(<bs-chatbot-sources-drawer></bs-chatbot-sources-drawer>);
    const spy = spyOnEvent('bsCollapse');

    (root.shadowRoot.querySelector('[part="collapse"]') as HTMLButtonElement).click();

    expect(spy).toHaveReceivedEventTimes(1);
  });
});
