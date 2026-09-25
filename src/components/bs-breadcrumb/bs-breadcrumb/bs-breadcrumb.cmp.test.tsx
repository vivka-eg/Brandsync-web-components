import { render, h, describe, it, expect } from '@stencil/vitest';

describe('bs-breadcrumb', () => {
  it('sets role="listitem" on the host', async () => {
    const { root } = await render(<bs-breadcrumb href="/">Home</bs-breadcrumb>);
    expect(root).toEqualAttribute('role', 'listitem');
  });

  it('renders a separator marked aria-hidden', async () => {
    const { root } = await render(<bs-breadcrumb href="/">Home</bs-breadcrumb>);
    const separator = root.shadowRoot.querySelector('[part="separator"]');
    expect(separator).not.toBeNull();
    expect(separator).toEqualAttribute('aria-hidden', 'true');
  });

  it('current renders a non-link <span aria-current="page">, even when href is also set', async () => {
    const { root } = await render(
      <bs-breadcrumb href="/should-be-ignored" current>
        Edit
      </bs-breadcrumb>,
    );
    const current = root.shadowRoot.querySelector('[part="current"]');
    expect(current).not.toBeNull();
    expect(current.tagName).toBe('SPAN');
    expect(current).toEqualAttribute('aria-current', 'page');
    // `current`'s own shadow-DOM textContent is empty -- it only contains a <slot>, and
    // `Element.textContent` doesn't traverse slotted/assigned light-DOM nodes. Check the host's
    // textContent instead, which does include its own light-DOM children.
    expect(root.textContent.trim()).toBe('Edit');
    expect(root.shadowRoot.querySelector('a')).toBeNull();
  });

  it('href (not current) renders a real <a href>', async () => {
    const { root } = await render(<bs-breadcrumb href="/settings">Settings</bs-breadcrumb>);
    const link = root.shadowRoot.querySelector('[part="link"]');
    expect(link).not.toBeNull();
    expect(link.tagName).toBe('A');
    expect(link).toEqualAttribute('href', '/settings');
  });

  it('neither href nor current renders a plain, non-interactive <span>', async () => {
    const { root } = await render(<bs-breadcrumb>No Link</bs-breadcrumb>);
    const link = root.shadowRoot.querySelector('[part="link"]');
    expect(link).not.toBeNull();
    expect(link.tagName).toBe('SPAN');
    expect(root.shadowRoot.querySelector('a')).toBeNull();
  });

  it("hides the first crumb's separator, regardless of tag, and shows the second's", async () => {
    const { root } = await render(
      <bs-breadcrumbs>
        <bs-breadcrumb href="/">Home</bs-breadcrumb>
        <bs-breadcrumb href="/settings">Settings</bs-breadcrumb>
      </bs-breadcrumbs>,
    );
    const crumbs = root.querySelectorAll('bs-breadcrumb');
    const [first, second] = Array.from(crumbs) as HTMLElement[];

    const firstSeparator = first.shadowRoot.querySelector('[part="separator"]') as HTMLElement;
    const secondSeparator = second.shadowRoot.querySelector('[part="separator"]') as HTMLElement;

    expect(getComputedStyle(firstSeparator).display).toBe('none');
    expect(getComputedStyle(secondSeparator).display).not.toBe('none');
  });

  describe('size', () => {
    it('defaults to "md" and reflects the attribute', async () => {
      const { root } = await render(<bs-breadcrumb href="/">Home</bs-breadcrumb>);
      expect(root).toEqualAttribute('size', 'md');
    });

    it('reflects a "sm" size and scales down the computed font-size', async () => {
      const mdRender = await render(<bs-breadcrumb href="/">Home</bs-breadcrumb>);
      const smRender = await render(
        <bs-breadcrumb href="/" size="sm">
          Home
        </bs-breadcrumb>,
      );
      expect(smRender.root).toEqualAttribute('size', 'sm');
      const mdFontSize = getComputedStyle(mdRender.root).fontSize;
      const smFontSize = getComputedStyle(smRender.root).fontSize;
      expect(smFontSize).not.toBe(mdFontSize);
    });
  });
});
