import { Component, Prop, h } from '@stencil/core';
import { BRANDSYNC_LOGO_SVG } from './brandsync-logo';

export type BsNavigationHeaderAlignment = 'default' | 'center' | 'with-navigation-drawer';

/**
 * The top-level navigation bar for a page: the BrandSync logo plus two consumer-provided slots
 * for menu/action content (e.g. `bs-button`/`bs-icon-button` elements).
 *
 * ## When to use
 * - The persistent top bar of an application, above the page content.
 *
 * ## When not to use
 * - The header of a Genie AI chat panel -- use `bs-chatbot-header` instead, which is purpose-built
 *   for that narrower layout and its own fixed action buttons.
 *
 * `alignment` controls both whether the logo renders and how the two slots are laid out:
 * - `default` (default): logo on the left, `left` slot content immediately after it, `right` slot
 *   content pushed to the far right.
 * - `center`: logo and `right` slot both grow equally (`flex: 1`), which centers the `left` slot
 *   content in the middle of the bar.
 * - `with-navigation-drawer`: no logo at all (this variant assumes a nav-drawer toggle is the
 *   leftmost thing on the page instead) -- `left` slot content starts at the bar's own left edge,
 *   `right` slot content pushed to the far right.
 *
 * @slot left - Menu/action content immediately after the logo (or, in `with-navigation-drawer`
 *   mode, at the bar's left edge). Typically one or more `bs-button`/`bs-icon-button` elements.
 * @slot right - Menu/action content pushed to the bar's far right.
 * @part logo - The BrandSync brand mark (inline SVG). Not rendered in `with-navigation-drawer` mode.
 * @part left - The wrapper around the `left` slot.
 * @part right - The wrapper around the `right` slot.
 * @part skip-link - The "Skip to main content" link (only rendered when `skipToContentHref` is set).
 */
// Note: this component's CSS Custom Properties are documented via @prop comments in
// bs-navigation-header.css, not here.
@Component({
  tag: 'bs-navigation-header',
  styleUrl: 'bs-navigation-header.css',
  shadow: true,
})
export class BsNavigationHeader {
  /** Controls whether the logo renders and how the `left`/`right` slots are laid out -- see the
   * class doc above for the three variants' exact behavior. */
  @Prop() alignment: BsNavigationHeaderAlignment = 'default';

  /** Accessible label for the header landmark, useful when a page has more than one `<header>`
   * (e.g. this one plus a page-specific sub-header) and screen reader users need to tell them
   * apart in the landmarks list. */
  @Prop() ariaLabel: string | null = null;

  /**
   * Fragment/URL to jump to when the "Skip to main content" link is activated (e.g.
   * `#main-content`, matching an id on your page's main landmark). Unset by default -- the link
   * is opt-in rather than pointing at a guessed default id, since a skip link to a target that
   * doesn't exist on the consumer's page is worse than no skip link at all (it silently does
   * nothing when activated). Set this to the same id your page's `<main>` (or equivalent) already
   * has to enable it.
   */
  @Prop() skipToContentHref: string | null = null;

  /** Link text for the skip-to-content link. Only rendered when `skipToContentHref` is set. */
  @Prop() skipToContentLabel = 'Skip to main content';

  render() {
    const showLogo = this.alignment !== 'with-navigation-drawer';
    const rootClasses = `bs-navigation-header bs-navigation-header--${this.alignment}`;

    return (
      <header class={rootClasses} aria-label={this.ariaLabel ?? undefined}>
        {this.skipToContentHref && (
          <a part="skip-link" class="bs-navigation-header__skip-link" href={this.skipToContentHref}>
            {this.skipToContentLabel}
          </a>
        )}
        {showLogo && (
          <div part="logo" class="bs-navigation-header__logo" role="img" aria-label="BrandSync" innerHTML={BRANDSYNC_LOGO_SVG}></div>
        )}
        <div part="left" class="bs-navigation-header__left">
          <slot name="left"></slot>
        </div>
        <div part="right" class="bs-navigation-header__right">
          <slot name="right"></slot>
        </div>
      </header>
    );
  }
}
