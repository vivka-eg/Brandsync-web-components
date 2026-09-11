import { Component, Prop, Event, EventEmitter, h } from '@stencil/core';

export type BsComposerStatusBannerType = 'error' | 'info' | 'neutral' | 'warning';

/**
 * A full-width status banner for use directly above `bs-composer`, surfacing a message about the
 * composer's current state (e.g. a send failure, an informational notice) with an optional
 * "Continue"-style action button and an optional close button.
 *
 * ## When to use
 * - A message tied to the composer itself (send failed, rate-limited, draft restored, etc.) that
 *   needs to sit directly above it, not a general-purpose alert -- see `CONVENTIONS.md` if this
 *   library gains a generic banner/alert component later, and prefer that instead once it exists.
 *
 * ## When not to use
 * - A toast/snackbar notification unrelated to the composer -- this component is not
 *   self-dismissing and has no positioning of its own (it's a static block, not an overlay).
 *
 * @slot icon - Overrides the default leading icon. Only rendered when `showIcon` is true.
 * @part icon - The leading icon wrapper.
 * @part message - The message text.
 * @part action - The optional "Continue"-style action button.
 * @part close - The optional close button.
 * @prop --bs-composer-status-banner-radius - Corner radius of the top-left/top-right corners
 *   (bottom corners are square, so this sits flush above `bs-composer`). Aliased to
 *   `--bs-border-radius-150`.
 * @prop --bs-composer-status-banner-padding-x - Horizontal padding. Aliased to `--bs-spacing-150`.
 * @prop --bs-composer-status-banner-padding-top - Top padding. Aliased to `--bs-spacing-100`.
 * @prop --bs-composer-status-banner-padding-bottom - Bottom padding. Aliased to `--bs-spacing-200`.
 * @prop --bs-composer-status-banner-gap - Gap between the message group and the action/close
 *   controls. Aliased to `--bs-spacing-100`.
 * @prop --bs-composer-status-banner-icon-gap - Gap between the icon and the message text.
 *   Aliased to `--bs-spacing-75`.
 * @prop --bs-composer-status-banner-error-bg - Background for `type="error"`. Aliased to
 *   `--bs-color-error-container`.
 * @prop --bs-composer-status-banner-error-text - Text/icon color for `type="error"`. Aliased to
 *   `--bs-text-error`.
 * @prop --bs-composer-status-banner-error-action-bg - Action button background for
 *   `type="error"`. Aliased to `--bs-color-error-default`.
 * @prop --bs-composer-status-banner-error-action-bg-hover - Aliased to `--bs-color-error-hover`.
 * @prop --bs-composer-status-banner-info-bg - Background for `type="info"`. Aliased to
 *   `--bs-color-info-container`.
 * @prop --bs-composer-status-banner-info-text - Text/icon color for `type="info"`. Aliased to
 *   `--bs-text-info`.
 * @prop --bs-composer-status-banner-info-action-bg - Action button background for `type="info"`.
 *   Aliased to `--bs-color-info-default`.
 * @prop --bs-composer-status-banner-info-action-bg-hover - Aliased to `--bs-color-info-hover`.
 * @prop --bs-composer-status-banner-neutral-bg - Background for `type="neutral"`. Aliased to
 *   `--bs-color-neutral-container`.
 * @prop --bs-composer-status-banner-neutral-text - Text/icon color for `type="neutral"`. Aliased
 *   to `--bs-text-default`.
 * @prop --bs-composer-status-banner-neutral-action-bg - Action button background for
 *   `type="neutral"`. Aliased to `--bs-color-neutral-container`.
 * @prop --bs-composer-status-banner-neutral-action-bg-hover - Aliased to
 *   `--bs-color-neutral-container-hover`.
 * @prop --bs-composer-status-banner-neutral-action-border - Action button border for
 *   `type="neutral"` (the only variant whose action button is outlined). Aliased to
 *   `--bs-border-neutral-container`.
 * @prop --bs-composer-status-banner-warning-bg - Background for `type="warning"`. Aliased to
 *   `--bs-color-warning-container`.
 * @prop --bs-composer-status-banner-warning-text - Text/icon color for `type="warning"`. Aliased
 *   to `--bs-text-warning`.
 * @prop --bs-composer-status-banner-warning-action-bg - Action button background for
 *   `type="warning"`. Aliased to `--bs-color-warning-default`.
 * @prop --bs-composer-status-banner-warning-action-bg-hover - Aliased to
 *   `--bs-color-warning-hover`.
 * @prop --bs-composer-status-banner-close-hover-bg - Close button hover background (same across
 *   every `type`). Aliased to `--bs-color-neutral-container-hover`.
 */
@Component({
  tag: 'bs-composer-status-banner',
  styleUrl: 'bs-composer-status-banner.css',
  shadow: true,
})
export class BsComposerStatusBanner {
  /** Which severity/style to render. Drives background, text/icon color, and the action button's color. */
  @Prop() type: BsComposerStatusBannerType = 'error';

  /** The message text. */
  @Prop() message = 'This is a message';

  /** Whether the leading icon (default: clock) is rendered. */
  @Prop() showIcon = true;

  /** Whether the "Continue"-style action button is rendered. */
  @Prop() showButton = false;

  /** Label for the action button, only rendered when `showButton` is true. */
  @Prop() actionLabel = 'Continue';

  /** Whether the close button is rendered. */
  @Prop() allowClose = true;

  /** Fires when the action button is clicked. Only relevant when `showButton` is true. */
  @Event() bsAction: EventEmitter<void>;

  /** Fires when the close button is clicked. Only relevant when `allowClose` is true. */
  @Event() bsClose: EventEmitter<void>;

  private onActionClick = () => {
    this.bsAction.emit();
  };

  private onCloseClick = () => {
    this.bsClose.emit();
  };

  render() {
    return (
      <div class={`bs-composer-status-banner bs-composer-status-banner--${this.type}`}>
        <div class="bs-composer-status-banner__message-group">
          {this.showIcon && (
            <span part="icon" class="bs-composer-status-banner__icon">
              <slot name="icon">
                <ClockIcon />
              </slot>
            </span>
          )}
          <p part="message" class="bs-composer-status-banner__message">
            {this.message}
          </p>
        </div>
        {this.showButton && (
          <button type="button" part="action" class="bs-composer-status-banner__action" onClick={this.onActionClick}>
            {this.actionLabel}
          </button>
        )}
        {this.allowClose && (
          <button type="button" part="close" class="bs-composer-status-banner__close" aria-label="Dismiss" onClick={this.onCloseClick}>
            <CloseIcon />
          </button>
        )}
      </div>
    );
  }
}

const ClockIcon = () => (
  <svg viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
    <circle cx="10" cy="10" r="7.25" stroke="currentColor" stroke-width="1.3" />
    <path d="M10 5.83V10L12.5 11.67" stroke="currentColor" stroke-width="1.3" stroke-linecap="round" stroke-linejoin="round" />
  </svg>
);

const CloseIcon = () => (
  <svg viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
    <path d="M15 5L5 15" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
    <path d="M15 15L5 5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
  </svg>
);
