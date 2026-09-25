import { render, h, describe, it, expect } from '@stencil/vitest';

describe('bs-pagination', () => {
  it('defaults to page 1 of 1', async () => {
    const { root } = await render(<bs-pagination></bs-pagination>);
    expect(root).toEqualAttribute('current-page', '1');
    const pages = root.shadowRoot.querySelectorAll('[part~="page"]');
    expect(pages.length).toBe(1);
    expect(pages[0]).toHaveTextContent('1');
  });

  it('matches the Figma spec exactly: page 1 of 12 shows 1 2 3 ... 12', async () => {
    const { root } = await render(<bs-pagination totalPages={12} currentPage={1}></bs-pagination>);
    const items = Array.from(root.shadowRoot.querySelectorAll('[part="list"] > li')).map(li => li.textContent.trim());
    // First and last <li> are the prev/next buttons (no text content, icon-only).
    expect(items).toEqual(['', '1', '2', '3', '', '12', '']);
  });

  it('renders every page number with no ellipsis when totalPages is small', async () => {
    const { root } = await render(<bs-pagination totalPages={5} currentPage={1}></bs-pagination>);
    expect(root.shadowRoot.querySelectorAll('[part="ellipsis"]').length).toBe(0);
    const pages = Array.from(root.shadowRoot.querySelectorAll('[part~="page"]')).map(el => el.textContent.trim());
    expect(pages).toEqual(['1', '2', '3', '4', '5']);
  });

  it('shows both ellipses when the current page is in the middle', async () => {
    const { root } = await render(<bs-pagination totalPages={12} currentPage={6}></bs-pagination>);
    expect(root.shadowRoot.querySelectorAll('[part="ellipsis"]').length).toBe(2);
    const pages = Array.from(root.shadowRoot.querySelectorAll('[part~="page"]')).map(el => el.textContent.trim());
    expect(pages).toEqual(['1', '5', '6', '7', '12']);
  });

  it('shows only a leading ellipsis when the current page is near the end', async () => {
    const { root } = await render(<bs-pagination totalPages={12} currentPage={12}></bs-pagination>);
    const pages = Array.from(root.shadowRoot.querySelectorAll('[part~="page"]')).map(el => el.textContent.trim());
    expect(pages).toEqual(['1', '10', '11', '12']);
    expect(root.shadowRoot.querySelectorAll('[part="ellipsis"]').length).toBe(1);
  });

  it('marks the current page with aria-current and the "current" part', async () => {
    const { root } = await render(<bs-pagination totalPages={3} currentPage={2}></bs-pagination>);
    const current = root.shadowRoot.querySelector('[part~="current"]');
    expect(current).not.toBeNull();
    expect(current).toEqualAttribute('aria-current', 'page');
    expect(current.textContent.trim()).toBe('2');
  });

  it('disables the previous button on the first page and the next button on the last page', async () => {
    const { root } = await render(<bs-pagination totalPages={3} currentPage={1}></bs-pagination>);
    expect(root.shadowRoot.querySelector('[part="prev"]')).toHaveAttribute('disabled');
    expect(root.shadowRoot.querySelector('[part="next"]')).not.toHaveAttribute('disabled');
  });

  it('updates currentPage and emits bsPageChange when a page button is clicked', async () => {
    const { root, spyOnEvent, waitForChanges } = await render(<bs-pagination totalPages={3} currentPage={1}></bs-pagination>);
    const changeSpy = spyOnEvent('bsPageChange');
    const pageButtons = root.shadowRoot.querySelectorAll('[part~="page"]');
    (pageButtons[1] as HTMLButtonElement).click();
    await waitForChanges();
    expect(root).toEqualAttribute('current-page', '2');
    expect(changeSpy).toHaveReceivedEventDetail(2);
  });

  it('advances/retreats a page via the next/prev buttons and emits bsPageChange', async () => {
    const { root, spyOnEvent, waitForChanges } = await render(<bs-pagination totalPages={3} currentPage={2}></bs-pagination>);
    const changeSpy = spyOnEvent('bsPageChange');
    (root.shadowRoot.querySelector('[part="next"]') as HTMLButtonElement).click();
    await waitForChanges();
    expect(root).toEqualAttribute('current-page', '3');
    expect(changeSpy).toHaveReceivedEventDetail(3);

    (root.shadowRoot.querySelector('[part="prev"]') as HTMLButtonElement).click();
    await waitForChanges();
    expect(root).toEqualAttribute('current-page', '2');
    expect(changeSpy).toHaveReceivedEventDetail(2);
  });

  it('does not emit bsPageChange when clicking the already-current page', async () => {
    const { root, spyOnEvent, waitForChanges } = await render(<bs-pagination totalPages={3} currentPage={2}></bs-pagination>);
    const changeSpy = spyOnEvent('bsPageChange');
    const current = root.shadowRoot.querySelector('[part~="current"]') as HTMLButtonElement;
    current.click();
    await waitForChanges();
    expect(changeSpy).toHaveReceivedEventTimes(0);
  });

  describe('invalid input hardening', () => {
    it('falls back to the default siblingCount when the attribute is an empty string', async () => {
      // Reproduces a real bug: a Storybook control left unset produced `sibling-count=""` (Stencil
      // can't parse that as a number), which corrupted the page list into two adjacent `...`s with
      // pages 2/3 missing entirely, instead of falling back to siblingCount's own default of 1.
      const container = document.createElement('div');
      container.innerHTML = '<bs-pagination total-pages="12" current-page="1" sibling-count=""></bs-pagination>';
      document.body.appendChild(container);
      const el = container.querySelector('bs-pagination') as HTMLElement;
      await new Promise(resolve => requestAnimationFrame(resolve));
      await new Promise(resolve => requestAnimationFrame(resolve));
      const pages = Array.from(el.shadowRoot.querySelectorAll('[part~="page"]')).map(node => node.textContent.trim());
      expect(pages).toEqual(['1', '2', '3', '12']);
      expect(el.shadowRoot.querySelectorAll('[part="ellipsis"]').length).toBe(1);
      container.remove();
    });

    it('treats a non-finite totalPages as 1 rather than producing NaN comparisons', async () => {
      const { root } = await render(<bs-pagination totalPages={NaN} currentPage={1}></bs-pagination>);
      const pages = Array.from(root.shadowRoot.querySelectorAll('[part~="page"]')).map(el => el.textContent.trim());
      expect(pages).toEqual(['1']);
    });
  });

  it('reflects custom previousLabel/nextLabel as aria-label', async () => {
    const { root } = await render(<bs-pagination previousLabel="Go back" nextLabel="Go forward"></bs-pagination>);
    expect(root.shadowRoot.querySelector('[part="prev"]')).toEqualAttribute('aria-label', 'Go back');
    expect(root.shadowRoot.querySelector('[part="next"]')).toEqualAttribute('aria-label', 'Go forward');
  });
});
