import { render, h, describe, it, expect } from '@stencil/vitest';

describe('bs-breadcrumbs', () => {
  it('defaults aria-label on the nav to "Breadcrumb"', async () => {
    const { root } = await render(<bs-breadcrumbs></bs-breadcrumbs>);
    const nav = root.shadowRoot.querySelector('nav');
    expect(nav).toEqualAttribute('aria-label', 'Breadcrumb');
  });

  it('reflects the label prop as the nav aria-label', async () => {
    const { root } = await render(<bs-breadcrumbs label="You are here"></bs-breadcrumbs>);
    const nav = root.shadowRoot.querySelector('nav');
    expect(nav).toEqualAttribute('aria-label', 'You are here');
  });

  it('wraps an <ol part="list"> inside the nav', async () => {
    const { root } = await render(<bs-breadcrumbs></bs-breadcrumbs>);
    const nav = root.shadowRoot.querySelector('nav');
    const list = root.shadowRoot.querySelector('[part="list"]');
    expect(list).not.toBeNull();
    expect(list.tagName).toBe('OL');
    expect(nav.contains(list)).toBe(true);
  });

  it('renders slotted children via the default slot', async () => {
    const { root } = await render(
      <bs-breadcrumbs>
        <bs-breadcrumb href="/">Home</bs-breadcrumb>
        <bs-breadcrumb current>Edit</bs-breadcrumb>
      </bs-breadcrumbs>,
    );
    const crumbs = root.querySelectorAll('bs-breadcrumb');
    expect(crumbs.length).toBe(2);
  });

  describe('size propagation', () => {
    it('propagates the default "md" size to slotted bs-breadcrumb/bs-breadcrumb-overflow children on load', async () => {
      const { root, waitForChanges } = await render(
        <bs-breadcrumbs>
          <bs-breadcrumb href="/">Home</bs-breadcrumb>
          <bs-breadcrumb-overflow></bs-breadcrumb-overflow>
        </bs-breadcrumbs>,
      );
      await waitForChanges();
      const crumb = root.querySelector('bs-breadcrumb') as HTMLElement & { size: string };
      const overflow = root.querySelector('bs-breadcrumb-overflow') as HTMLElement & { size: string };
      expect(crumb.size).toBe('md');
      expect(overflow.size).toBe('md');
    });

    it('propagates a non-default size to slotted children on load', async () => {
      const { root, waitForChanges } = await render(
        <bs-breadcrumbs size="sm">
          <bs-breadcrumb href="/">Home</bs-breadcrumb>
        </bs-breadcrumbs>,
      );
      await waitForChanges();
      const crumb = root.querySelector('bs-breadcrumb') as HTMLElement & { size: string };
      expect(crumb.size).toBe('sm');
    });

    it('re-propagates size to existing children when the size prop changes', async () => {
      const { root, waitForChanges } = await render(
        <bs-breadcrumbs>
          <bs-breadcrumb href="/">Home</bs-breadcrumb>
        </bs-breadcrumbs>,
      );
      await waitForChanges();
      (root as HTMLElement & { size: string }).size = 'sm';
      await waitForChanges();
      const crumb = root.querySelector('bs-breadcrumb') as HTMLElement & { size: string };
      expect(crumb.size).toBe('sm');
    });

    it('propagates the current size to a child added after initial render', async () => {
      const { root, waitForChanges } = await render(<bs-breadcrumbs size="sm"></bs-breadcrumbs>);
      await waitForChanges();
      const crumb = document.createElement('bs-breadcrumb') as HTMLElement & { size: string };
      root.appendChild(crumb);
      await waitForChanges();
      expect(crumb.size).toBe('sm');
    });
  });
});
