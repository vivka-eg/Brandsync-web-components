import { Component, Prop, h } from '@stencil/core';

export type BsAvatarType = 'icon' | 'initials' | 'image';
export type BsAvatarSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'xxl';

/**
 * A circular representation of a person or entity -- a photo, initials, or (as a fallback when
 * neither is available) a generic user-silhouette icon.
 *
 * ## When to use
 * - Representing a specific user or account: in a header, a comment, a member list, etc.
 * - `type="initials"` when a photo isn't available but a name is (e.g. "Sam Lee" -> "SL").
 * - `type="icon"` (the default) as the generic fallback when neither a photo nor a name/initials
 *   is available yet.
 *
 * ## When not to use
 * - A company/brand logo -- use `bs-logo` instead.
 *
 * This component is decorative/informational by default, not an interactive control -- it renders
 * a plain `<span>`/`<img>`, not a `<button>`. Figma's own component set includes hover/focused/
 * pressed states (e.g. for an account-switcher trigger use case), which this implements as real
 * `:hover`/`:focus-visible`/`:active` CSS on the host itself -- so wrapping this in your own
 * `<button>`, or setting `tabindex` and a click handler on the `<bs-avatar>` element directly, gets
 * the matching visual treatment for free with no extra wiring. Left genuinely non-interactive
 * (no implicit role/tabindex of its own) so it doesn't misrepresent a purely decorative avatar
 * (e.g. next to a comment) as a control when it isn't one.
 *
 * @part container - The circular wrapper (all three `type`s render this; `image` additionally
 *   wraps a real `<img>` inside it, since the border/background/radius treatment is identical
 *   across types and factoring it into one shared part keeps `::part(container)` overrides
 *   consistent regardless of which `type` ends up rendering).
 * @part image - The `<img>` itself. Only rendered for `type="image"`.
 * @part initials - The initials text. Only rendered for `type="initials"`.
 * @part icon - The fallback user-silhouette icon. Only rendered for `type="icon"`.
 */
// Note: this component's CSS Custom Properties are documented via @prop comments in bs-avatar.css,
// not here -- see bs-navigation-header.css's identical note. Most of them are this library's
// existing vendored --bs-avatar-* tokens (see tokens.css), not new ones invented for this
// component -- brandsync-tokens already ships a full avatar-specific token set.
@Component({
  tag: 'bs-avatar',
  styleUrl: 'bs-avatar.css',
  shadow: true,
})
export class BsAvatar {
  /** What to render inside the circle. `icon` (default) is the generic fallback for when neither
   * a photo nor initials are available yet. */
  @Prop() type: BsAvatarType = 'icon';

  /** Sizing scale -- `xs` (24px) through `xxl` (128px), matching Figma's own six-step scale. */
  @Prop() size: BsAvatarSize = 'md';

  /** `type="initials"` only: the initials text to display (e.g. `"SL"` for "Sam Lee"). Ignored
   * for `icon`/`image`. */
  @Prop() initials: string | null = null;

  /** `type="image"` only: the photo URL. This component does not fetch it itself -- network
   * calls, loading/error states, and caching are the consuming app's responsibility, same
   * convention as `bs-logo`'s own `src` prop. Ignored for `icon`/`initials`. */
  @Prop() src: string | null = null;

  /** `type="image"` only: accessible alt text for the photo, set directly on the real `<img>`
   * this renders -- a person's photo is meaningful content, not decorative, so pass something
   * real (e.g. their name). Falls back to `alt=""` (decorative to assistive tech) when unset,
   * rather than omitting the attribute entirely, but don't rely on that fallback. Ignored for
   * `icon`/`initials` -- see `ariaLabel` for those instead. */
  @Prop() alt: string | null = null;

  /** `type="icon"`/`"initials"` only: accessible name for the avatar, set as `aria-label` on the
   * `role="img"` wrapper this renders (neither is a real `<img>`, so there's no native `alt` to
   * set). Setting a plain `aria-label` attribute on the `<bs-avatar>` host does NOT work for this
   * -- that attribute stays on the light-DOM host and never crosses into the shadow DOM, so the
   * actual `role="img"` element stays nameless. Same pattern as `bs-checkbox`'s identical
   * `ariaLabel` prop. Ignored for `image` -- see `alt` for that instead. */
  @Prop() ariaLabel: string | null = null;

  /** Applies the disabled treatment (50% opacity) and suppresses the hover/focus/pressed CSS
   * states -- this doesn't set a native `disabled` attribute (this component renders no native
   * form control), it's purely a visual/interaction-state flag for when a consuming app has
   * wrapped this in its own disabled control. Reflected so the `:host([disabled])` CSS selector
   * that drives all of the above still matches when a consumer sets the JS property directly
   * (`el.disabled = true`) rather than the HTML attribute. */
  @Prop({ reflect: true }) disabled = false;

  render() {
    const classes = `bs-avatar bs-avatar--${this.type} bs-avatar--${this.size}`;

    if (this.type === 'image') {
      return (
        <span part="container" class={classes}>
          <img part="image" class="bs-avatar__image" src={this.src ?? undefined} alt={this.alt ?? ''} />
        </span>
      );
    }

    return (
      <span part="container" class={classes} role="img" aria-label={this.ariaLabel ?? undefined}>
        {this.type === 'initials' ? (
          <span part="initials" class="bs-avatar__initials">
            {this.initials}
          </span>
        ) : (
          <UserIcon />
        )}
      </span>
    );
  }
}

// A generic, standard "user" silhouette (head + shoulders bust) -- not a pixel port of Figma's own
// exported icon asset (a plain raster/vector glyph this common isn't a proprietary brand asset
// worth treating as a fixed image import, unlike e.g. bs-logo's actual wordmark), same
// inline-icon-helper-function pattern as bs-chatbot-header.tsx's NewChatIcon/ExpandIcon/etc. Single
// shared viewBox scales cleanly to every avatar size via plain CSS width/height, so one glyph
// covers all six sizes.
const UserIcon = () => (
  <svg part="icon" class="bs-avatar__icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
    <circle cx="12" cy="8" r="4" fill="currentColor" />
    <path d="M4 20.5C4 16.634 7.582 13.5 12 13.5C16.418 13.5 20 16.634 20 20.5" stroke="currentColor" stroke-width="2" stroke-linecap="round" />
  </svg>
);
