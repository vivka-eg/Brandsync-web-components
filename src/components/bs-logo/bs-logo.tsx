import { Component, Prop, h } from '@stencil/core';
import { BRANDSYNC_LOGO_FULL_LIGHT_SVG } from './brandsync-logo-full-light';
import { BRANDSYNC_LOGO_FULL_DARK_SVG } from './brandsync-logo-full-dark';
import { BRANDSYNC_LOGO_MARK_SVG } from './brandsync-logo-mark';

export type BsLogoVariant = 'full' | 'mark' | 'custom';
export type BsLogoBackground = 'auto' | 'light' | 'dark';

/**
 * The BrandSync brand mark, as its own standalone component -- shared by `bs-navigation-header`
 * and `bs-navigation-drawer`, which used to each render their own duplicated copy of this SVG
 * (the drawer's collapsed state even faked an icon-only look by clipping the full wordmark asset
 * down to a narrowed box, rather than using a real icon-only asset).
 *
 * ## When to use
 * - Anywhere the BrandSync logo/icon needs to render: a navigation header, a nav drawer, etc.
 *
 * ## When not to use
 * - The Genie AI chat panel's own brand mark -- that's a different logo (`bs-chatbot-header`'s
 *   own inline Genie asset), not this one.
 *
 * `variant` mirrors Figma's "Logo" component set (node 10909:30421) `Device` property
 * ("Desktop" / "Tab and mobile"), which was originally meant to distinguish the full lockup from
 * the icon-only mark at different responsive breakpoints -- renamed here to
 * `variant: 'full' | 'mark'` since that's what it actually controls (how much of the logo
 * renders), not literally a device/breakpoint switch.
 *
 * `variant="custom"` is not a Figma variant at all -- it's an escape hatch for a consuming app
 * that needs to show a DIFFERENT product's logo in the same slot (e.g. a white-labeled deployment,
 * or a logo fetched at runtime from a service like brand.dev), via `src`/`alt`, instead of the
 * built-in BrandSync assets. This component deliberately does NOT fetch that image itself --
 * network calls, loading/error states, and caching are the consuming app's responsibility, same as
 * every other component in this library (e.g. `bs-attachment` takes `imageSrc` rather than fetching
 * an image on its own). `background` has no effect on `variant="custom"` -- a consumer's own image
 * is already designed for whatever surface it's placed on.
 *
 * @part logo - The rendered SVG/image's wrapper.
 */
// Note: this component's CSS Custom Properties are documented via @prop comments in bs-logo.css,
// not here -- see bs-navigation-header.css's identical note.
@Component({
  tag: 'bs-logo',
  styleUrl: 'bs-logo.css',
  shadow: true,
})
export class BsLogo {
  /** How much of the logo to render. `full` is the icon + "EG BrandSync" wordmark (190.977x44
   * natural size); `mark` is just the icon (44x44 natural size), no wordmark; `custom` renders a
   * consumer-supplied image via `src`/`alt` instead of a built-in BrandSync asset -- see the class
   * doc above. */
  @Prop() variant: BsLogoVariant = 'full';

  /**
   * Which pre-built asset to use for `variant="full"` -- Figma ships a genuinely separate,
   * differently-drawn dark-background asset (every wordmark path filled solid white, and the
   * icon's outer shape a single solid-white path instead of the light version's two-path
   * white-fill-plus-border-ring), not a CSS currentColor swap of identical paths.
   *
   * `"auto"` (default) renders both assets and lets CSS pick one via
   * `--bs-logo-asset-light-display`/`--bs-logo-asset-dark-display` (defined in
   * `src/global/base.css`, flipped by the same `[data-theme="dark"]` attribute every other
   * `--bs-*` token already reacts to) -- so the logo just follows the ambient theme with no wiring
   * needed, the same way a consuming app's own dark mode already re-themes every other part of
   * this library via ordinary CSS custom property inheritance. Set `"light"`/`"dark"` explicitly
   * to pin one regardless of the ambient theme -- e.g. a dark sidebar that isn't otherwise
   * dark-themed.
   *
   * Has no effect on `variant="mark"`: Figma's component set only has one real designed instance
   * of the icon-only mark (`Device="Tab and mobile"`, `Background="Default"`) -- there's no
   * separate dark version of it, so the mark renders identically regardless of this prop.
   */
  @Prop() background: BsLogoBackground = 'auto';

  /** `variant="custom"` only: the image URL to render (e.g. a URL your app already fetched from a
   * logo API). Ignored for `full`/`mark`. */
  @Prop() src: string | null = null;

  /**
   * `variant="custom"` only: accessible alt text for the image -- a product logo is meaningful
   * content (whose brand is this?), not decorative, so set this to something real (e.g. the
   * product/company name). Falls back to `alt=""` (marking the image decorative to assistive
   * tech) when unset, rather than omitting the `alt` attribute entirely -- an `<img>` with no
   * `alt` attribute at all is a harder accessibility failure than one explicitly marked
   * decorative, but an empty fallback is still worse than a real name, so don't rely on it.
   * Ignored for `full`/`mark` (those already carry their own fixed `aria-label="BrandSync"`).
   */
  @Prop() alt: string | null = null;

  render() {
    if (this.variant === 'custom') {
      return <img part="logo" class="bs-logo bs-logo--custom" src={this.src ?? undefined} alt={this.alt ?? ''} />;
    }

    if (this.variant === 'mark') {
      return <div part="logo" class="bs-logo bs-logo--mark" role="img" aria-label="BrandSync" innerHTML={BRANDSYNC_LOGO_MARK_SVG}></div>;
    }

    return (
      <div part="logo" class={`bs-logo bs-logo--full bs-logo--bg-${this.background}`} role="img" aria-label="BrandSync">
        <div class="bs-logo__asset bs-logo__asset--light" innerHTML={BRANDSYNC_LOGO_FULL_LIGHT_SVG}></div>
        <div class="bs-logo__asset bs-logo__asset--dark" innerHTML={BRANDSYNC_LOGO_FULL_DARK_SVG}></div>
      </div>
    );
  }
}
