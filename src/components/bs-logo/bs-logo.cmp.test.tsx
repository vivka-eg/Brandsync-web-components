import { render, h, describe, it, expect } from '@stencil/vitest';

describe('bs-logo', () => {
  it('renders role="img" and aria-label="BrandSync"', async () => {
    const { root } = await render(<bs-logo></bs-logo>);
    const logo = root.shadowRoot.querySelector('[part="logo"]');
    expect(logo).not.toBeNull();
    expect(logo).toEqualAttribute('role', 'img');
    expect(logo).toEqualAttribute('aria-label', 'BrandSync');
  });

  it('renders both the light and dark full-wordmark assets in the shadow DOM regardless of background', async () => {
    // variant="full" always renders both assets and picks one via CSS (see bs-logo.css) -- this
    // lets background="auto" react to the ambient theme with no re-render needed.
    const { root } = await render(<bs-logo></bs-logo>);
    const lightSvg = root.shadowRoot.querySelector('.bs-logo__asset--light svg');
    const darkSvg = root.shadowRoot.querySelector('.bs-logo__asset--dark svg');
    expect(lightSvg).toEqualAttribute('width', '190.977');
    expect(lightSvg).toEqualAttribute('height', '44');
    // Light asset's icon mark is a two-path composition (solid fill + a subtle #E8EAEE border ring).
    expect(lightSvg.querySelector('path[fill="#E8EAEE"]')).not.toBeNull();

    expect(darkSvg).toEqualAttribute('width', '190.0');
    expect(darkSvg).toEqualAttribute('height', '44');
    // Dark asset's icon mark is a single solid-white path -- no #E8EAEE border-ring path, and no
    // #363C47 wordmark fills (all wordmark paths are solid white instead).
    expect(darkSvg.querySelector('path[fill="#E8EAEE"]')).toBeNull();
    expect(darkSvg.querySelector('path[fill="#363C47"]')).toBeNull();
  });

  describe('background="auto" (default)', () => {
    it('applies the bs-logo--bg-auto class', async () => {
      const { root } = await render(<bs-logo></bs-logo>);
      expect(root.shadowRoot.querySelector('[part="logo"]')).toHaveClass('bs-logo--bg-auto');
    });

    it('shows the light asset and hides the dark one when no ambient theme is set', async () => {
      const { root } = await render(<bs-logo></bs-logo>);
      const lightAsset = root.shadowRoot.querySelector('.bs-logo__asset--light');
      const darkAsset = root.shadowRoot.querySelector('.bs-logo__asset--dark');
      expect(getComputedStyle(lightAsset).display).not.toBe('none');
      expect(getComputedStyle(darkAsset).display).toBe('none');
    });

    it('shows the dark asset and hides the light one when an ambient dark theme sets --bs-logo-asset-*-display', async () => {
      // Simulates what src/global/base.css's [data-theme="dark"] rule sets on <html> in a real
      // app -- setting the same custom properties directly on the render stage container here,
      // since this isolated component test doesn't load that global stylesheet. CSS custom
      // properties inherit through the shadow boundary regardless of where they're defined.
      const { root } = await render(<bs-logo></bs-logo>, {
        stageAttrs: { style: '--bs-logo-asset-light-display: none; --bs-logo-asset-dark-display: block;' },
      });

      const lightAsset = root.shadowRoot.querySelector('.bs-logo__asset--light');
      const darkAsset = root.shadowRoot.querySelector('.bs-logo__asset--dark');
      expect(getComputedStyle(lightAsset).display).toBe('none');
      expect(getComputedStyle(darkAsset).display).not.toBe('none');
    });
  });

  describe('background="light"/"dark" (explicit)', () => {
    it('pins the light asset even when an ambient dark theme is set', async () => {
      const { root } = await render(<bs-logo background="light"></bs-logo>, {
        stageAttrs: { style: '--bs-logo-asset-light-display: none; --bs-logo-asset-dark-display: block;' },
      });

      expect(root.shadowRoot.querySelector('[part="logo"]')).toHaveClass('bs-logo--bg-light');
      expect(getComputedStyle(root.shadowRoot.querySelector('.bs-logo__asset--light')).display).not.toBe('none');
      expect(getComputedStyle(root.shadowRoot.querySelector('.bs-logo__asset--dark')).display).toBe('none');
    });

    it('pins the dark asset even when no ambient theme is set', async () => {
      const { root } = await render(<bs-logo background="dark"></bs-logo>);
      expect(root.shadowRoot.querySelector('[part="logo"]')).toHaveClass('bs-logo--bg-dark');
      expect(getComputedStyle(root.shadowRoot.querySelector('.bs-logo__asset--light')).display).toBe('none');
      expect(getComputedStyle(root.shadowRoot.querySelector('.bs-logo__asset--dark')).display).not.toBe('none');
    });
  });

  it('renders the icon-only mark asset for variant="mark"', async () => {
    const { root } = await render(<bs-logo variant="mark"></bs-logo>);
    const svg = root.shadowRoot.querySelector('[part="logo"] svg');
    expect(svg).toEqualAttribute('width', '44');
    expect(svg).toEqualAttribute('height', '44');
    expect(svg).toEqualAttribute('viewBox', '0 0 44 44');
  });

  it('applies the bs-logo--full/bs-logo--mark class matching the variant', async () => {
    const { root: fullRoot } = await render(<bs-logo variant="full"></bs-logo>);
    expect(fullRoot.shadowRoot.querySelector('[part="logo"]')).toHaveClass('bs-logo--full');

    const { root: markRoot } = await render(<bs-logo variant="mark"></bs-logo>);
    expect(markRoot.shadowRoot.querySelector('[part="logo"]')).toHaveClass('bs-logo--mark');
  });

  it('renders identical markup for variant="mark" regardless of background (no separate dark mark asset)', async () => {
    const { root: lightRoot } = await render(<bs-logo variant="mark" background="light"></bs-logo>);
    const { root: darkRoot } = await render(<bs-logo variant="mark" background="dark"></bs-logo>);
    const lightMarkup = lightRoot.shadowRoot.querySelector('[part="logo"]').innerHTML;
    const darkMarkup = darkRoot.shadowRoot.querySelector('[part="logo"]').innerHTML;
    expect(lightMarkup).toBe(darkMarkup);
  });

  describe('variant="custom"', () => {
    it('renders a real <img> with the given src/alt instead of a built-in asset', async () => {
      const { root } = await render(<bs-logo variant="custom" src="https://example.com/logo.png" alt="Acme Co"></bs-logo>);
      const img = root.shadowRoot.querySelector('[part="logo"]');
      expect(img.tagName).toBe('IMG');
      expect(img).toEqualAttribute('src', 'https://example.com/logo.png');
      expect(img).toEqualAttribute('alt', 'Acme Co');
      expect(img).toHaveClass('bs-logo--custom');
    });

    it('falls back to alt="" (not a missing attribute) when alt is not provided', async () => {
      const { root } = await render(<bs-logo variant="custom" src="https://example.com/logo.png"></bs-logo>);
      const img = root.shadowRoot.querySelector('[part="logo"]');
      expect(img).toEqualAttribute('alt', '');
    });

    it('does not fetch/render any built-in BrandSync asset when custom', async () => {
      const { root } = await render(<bs-logo variant="custom" src="https://example.com/logo.png" alt="Acme Co"></bs-logo>);
      expect(root.shadowRoot.querySelector('svg')).toBeNull();
    });

    it('ignores background for variant="custom"', async () => {
      const { root: lightRoot } = await render(<bs-logo variant="custom" background="light" src="https://example.com/logo.png" alt="Acme"></bs-logo>);
      const { root: darkRoot } = await render(<bs-logo variant="custom" background="dark" src="https://example.com/logo.png" alt="Acme"></bs-logo>);
      expect(lightRoot.shadowRoot.querySelector('[part="logo"]').outerHTML).toBe(darkRoot.shadowRoot.querySelector('[part="logo"]').outerHTML);
    });
  });
});
