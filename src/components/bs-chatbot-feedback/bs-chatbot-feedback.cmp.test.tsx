import { render, h, describe, it, expect } from '@stencil/vitest';

describe('bs-chatbot-feedback', () => {
  it('renders the default heading/subtitle and the editable form before submitting', async () => {
    const { root } = await render(<bs-chatbot-feedback></bs-chatbot-feedback>);

    expect(root.shadowRoot.querySelector('[part="heading"]')).toHaveTextContent('How was your experience with us?');
    expect(root.shadowRoot.querySelector('[part="textarea"]')).not.toBeNull();
    expect(root.shadowRoot.querySelector('[part="submit"]')).not.toBeNull();
    expect(root.shadowRoot.querySelector('[part="comment"]')).toBeNull();
  });

  it('disables the submit button until a star is clicked', async () => {
    const { root } = await render(<bs-chatbot-feedback></bs-chatbot-feedback>);

    expect(root.shadowRoot.querySelector('[part="submit"]')).toHaveAttribute('disabled');
  });

  it('emits bsRatingChange and updates aria-checked when a star is clicked', async () => {
    const { root, spyOnEvent, waitForChanges } = await render(<bs-chatbot-feedback></bs-chatbot-feedback>);
    const spy = spyOnEvent('bsRatingChange');

    const stars = root.shadowRoot.querySelectorAll('[part="star"]');
    (stars[2] as HTMLButtonElement).click(); // 3rd star -> rating 3
    await waitForChanges();

    expect(spy).toHaveReceivedEventDetail(3);
    expect(stars[0]).toEqualAttribute('aria-checked', 'true');
    expect(stars[2]).toEqualAttribute('aria-checked', 'true');
    expect(stars[3]).toEqualAttribute('aria-checked', 'false');
  });

  it('enables the submit button once a star is selected, and emits bsSubmit with rating + comment', async () => {
    const { root, spyOnEvent, waitForChanges } = await render(<bs-chatbot-feedback></bs-chatbot-feedback>);
    const submitSpy = spyOnEvent('bsSubmit');

    (root.shadowRoot.querySelectorAll('[part="star"]')[3] as HTMLButtonElement).click(); // rating 4
    await waitForChanges();
    const textarea = root.shadowRoot.querySelector('[part="textarea"]') as HTMLTextAreaElement;
    textarea.value = 'Great answer';
    textarea.dispatchEvent(new Event('input', { bubbles: true, composed: true }));
    await waitForChanges();

    const submit = root.shadowRoot.querySelector('[part="submit"]') as HTMLButtonElement;
    expect(submit).not.toHaveAttribute('disabled');
    submit.click();

    expect(submitSpy).toHaveReceivedEventDetail({ rating: 4, comment: 'Great answer' });
  });

  it('switches to the rating-specific heading/subtitle and read-only comment after submitting', async () => {
    const { root } = await render(<bs-chatbot-feedback rating={5} submitted comment="Loved it"></bs-chatbot-feedback>);

    expect(root.shadowRoot.querySelector('[part="heading"]')).toHaveTextContent('Thanks for the great rating!');
    expect(root.shadowRoot.querySelector('[part="textarea"]')).toBeNull();
    expect(root.shadowRoot.querySelector('[part="submit"]')).toBeNull();
    expect(root.shadowRoot.querySelector('[part="comment"]')).toHaveTextContent('Loved it');
  });

  it('does not render the comment part when submitted with no comment', async () => {
    const { root } = await render(<bs-chatbot-feedback rating={5} submitted></bs-chatbot-feedback>);

    expect(root.shadowRoot.querySelector('[part="comment"]')).toBeNull();
  });

  it('disables stars and ignores clicks once submitted', async () => {
    const { root, spyOnEvent } = await render(<bs-chatbot-feedback rating={2} submitted></bs-chatbot-feedback>);
    const spy = spyOnEvent('bsRatingChange');

    const stars = root.shadowRoot.querySelectorAll('[part="star"]');
    expect(stars[0]).toHaveAttribute('disabled');
    (stars[4] as HTMLButtonElement).click();

    expect(spy).toHaveReceivedEventTimes(0);
  });

  it('renders "Start new chat" as outlined before submitting and primary after', async () => {
    const { root: before } = await render(<bs-chatbot-feedback></bs-chatbot-feedback>);
    expect(before.shadowRoot.querySelector('[part="new-chat"]').className).toContain('--outlined');

    const { root: after } = await render(<bs-chatbot-feedback rating={5} submitted></bs-chatbot-feedback>);
    expect(after.shadowRoot.querySelector('[part="new-chat"]').className).toContain('--primary');
  });

  it('emits bsNewChat and bsClose when their buttons are clicked', async () => {
    const { root, spyOnEvent } = await render(<bs-chatbot-feedback></bs-chatbot-feedback>);
    const newChatSpy = spyOnEvent('bsNewChat');
    const closeSpy = spyOnEvent('bsClose');

    (root.shadowRoot.querySelector('[part="new-chat"]') as HTMLButtonElement).click();
    (root.shadowRoot.querySelector('[part="close"]') as HTMLButtonElement).click();

    expect(newChatSpy).toHaveReceivedEventTimes(1);
    expect(closeSpy).toHaveReceivedEventTimes(1);
  });
});
