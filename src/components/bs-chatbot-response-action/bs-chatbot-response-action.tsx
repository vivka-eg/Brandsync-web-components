import { Component, Prop, Event, EventEmitter, h } from '@stencil/core';

/**
 * The row of action buttons that appears below an AI response message in a Genie chat panel:
 * like, dislike, copy, regenerate, and more-options icon buttons, plus an optional "N sources"
 * button.
 *
 * ## When to use
 * - Directly below an AI-generated response message in a Genie chat panel.
 *
 * ## When not to use
 * - Below a user's own message -- these actions (regenerate, like/dislike a response, etc.) only
 *   make sense for AI-generated content.
 *
 * @slot like-icon - Overrides the default "Like" button icon.
 * @slot dislike-icon - Overrides the default "Dislike" button icon.
 * @slot copy-icon - Overrides the default "Copy" button icon.
 * @slot regenerate-icon - Overrides the default "Regenerate" button icon.
 * @slot menu-icon - Overrides the default "More options" button icon.
 * @slot sources-icon - Overrides the default icon in the "N sources" button.
 * @part like - The "Like" icon button.
 * @part dislike - The "Dislike" icon button.
 * @part copy - The "Copy" icon button.
 * @part regenerate - The "Regenerate" icon button.
 * @part menu - The "More options" icon button.
 * @part sources - The "N sources" button (only rendered when `sourcesCount` is set).
 * @prop --bs-chatbot-response-action-gap - Gap between all buttons in the row. Aliased to `--bs-spacing-100`.
 * @prop --bs-chatbot-response-action-padding-top - Aliased to `--bs-spacing-150`.
 * @prop --bs-chatbot-response-action-padding-bottom - Aliased to `--bs-spacing-50`.
 * @prop --bs-chatbot-response-action-button-size - Width/height of each icon button. Aliased to `--bs-spacing-400`.
 * @prop --bs-chatbot-response-action-button-radius - Corner radius of each button. Aliased to `--bs-border-radius-100`.
 * @prop --bs-chatbot-response-action-button-hover - Button background on hover. Aliased to `--bs-color-neutral-container`.
 * @prop --bs-chatbot-response-action-button-pressed - Button background when pressed. Aliased to `--bs-color-neutral-container-pressed`.
 * @prop --bs-chatbot-response-action-icon - Icon color. Aliased to `--bs-icon-neutral-default`.
 * @prop --bs-chatbot-response-action-sources-gap - Gap between the sources icon and its label. Aliased to `--bs-spacing-50`.
 * @prop --bs-chatbot-response-action-sources-padding-left - Aliased to `--bs-spacing-100`.
 * @prop --bs-chatbot-response-action-sources-padding-right - Aliased to `--bs-spacing-150`.
 * @prop --bs-chatbot-response-action-sources-color - Text color of the sources label. Aliased to `--bs-text-neutral-default`.
 * @prop --bs-chatbot-response-action-sources-font-size - Aliased to `--bs-font-size-sm`.
 * @prop --bs-chatbot-response-action-sources-line-height - Aliased to `--bs-line-height-body-sm`.
 */
@Component({
  tag: 'bs-chatbot-response-action',
  styleUrl: 'bs-chatbot-response-action.css',
  shadow: true,
})
export class BsChatbotResponseAction {
  /**
   * Number of sources backing the response. When set to a positive number, renders the "N
   * sources" button (singular "1 source" / plural "N sources"). When unset or `0`, the button is
   * not rendered at all.
   */
  @Prop() sourcesCount?: number;

  /** Fires when the "Like" button is clicked. */
  @Event() bsLike: EventEmitter<void>;

  /** Fires when the "Dislike" button is clicked. */
  @Event() bsDislike: EventEmitter<void>;

  /** Fires when the "Copy" button is clicked. */
  @Event() bsCopy: EventEmitter<void>;

  /** Fires when the "Regenerate" button is clicked. */
  @Event() bsRegenerate: EventEmitter<void>;

  /** Fires when the "More options" button is clicked. */
  @Event() bsMenuOpen: EventEmitter<void>;

  /** Fires when the "N sources" button is clicked. */
  @Event() bsSourcesClick: EventEmitter<void>;

  private onLikeClick = () => {
    this.bsLike.emit();
  };

  private onDislikeClick = () => {
    this.bsDislike.emit();
  };

  private onCopyClick = () => {
    this.bsCopy.emit();
  };

  private onRegenerateClick = () => {
    this.bsRegenerate.emit();
  };

  private onMenuClick = () => {
    this.bsMenuOpen.emit();
  };

  private onSourcesClick = () => {
    this.bsSourcesClick.emit();
  };

  render() {
    const hasSources = !!this.sourcesCount && this.sourcesCount > 0;

    return (
      <div class="bs-chatbot-response-action">
        <button type="button" part="like" class="bs-chatbot-response-action__button" aria-label="Like" onClick={this.onLikeClick}>
          <slot name="like-icon">
            <ThumbsUpIcon />
          </slot>
        </button>
        <button type="button" part="dislike" class="bs-chatbot-response-action__button" aria-label="Dislike" onClick={this.onDislikeClick}>
          <slot name="dislike-icon">
            <ThumbsDownIcon />
          </slot>
        </button>
        <button type="button" part="copy" class="bs-chatbot-response-action__button" aria-label="Copy" onClick={this.onCopyClick}>
          <slot name="copy-icon">
            <CopyIcon />
          </slot>
        </button>
        <button
          type="button"
          part="regenerate"
          class="bs-chatbot-response-action__button"
          aria-label="Regenerate"
          onClick={this.onRegenerateClick}
        >
          <slot name="regenerate-icon">
            <RegenerateIcon />
          </slot>
        </button>
        <button type="button" part="menu" class="bs-chatbot-response-action__button" aria-label="More options" onClick={this.onMenuClick}>
          <slot name="menu-icon">
            <MenuIcon />
          </slot>
        </button>
        {hasSources && (
          <button type="button" part="sources" class="bs-chatbot-response-action__sources" onClick={this.onSourcesClick}>
            <slot name="sources-icon">
              <SourcesIcon />
            </slot>
            <span class="bs-chatbot-response-action__sources-label">
              {this.sourcesCount} {this.sourcesCount === 1 ? 'source' : 'sources'}
            </span>
          </button>
        )}
      </div>
    );
  }
}

const ThumbsUpIcon = () => (
  <svg viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
    <path
      d="M2.5 8.125H6.25V16.25H2.5C2.33424 16.25 2.17527 16.1842 2.05806 16.0669C1.94085 15.9497 1.875 15.7908 1.875 15.625V8.75C1.875 8.58424 1.94085 8.42527 2.05806 8.30806C2.17527 8.19085 2.33424 8.125 2.5 8.125Z"
      stroke="currentColor"
      stroke-width="1.66667"
      stroke-linecap="round"
      stroke-linejoin="round"
    />
    <path
      d="M6.25 8.125L9.375 1.875C10.038 1.875 10.6739 2.13839 11.1428 2.60723C11.6116 3.07607 11.875 3.71196 11.875 4.375V6.25H16.875C17.0523 6.25005 17.2276 6.28782 17.3892 6.36081C17.5508 6.4338 17.695 6.54033 17.8123 6.67333C17.9295 6.80634 18.0172 6.96277 18.0693 7.13223C18.1215 7.3017 18.137 7.48033 18.1148 7.65625L17.1773 15.1562C17.1393 15.4583 16.9923 15.736 16.7641 15.9374C16.5358 16.1388 16.2419 16.2499 15.9375 16.25H6.25"
      stroke="currentColor"
      stroke-width="1.66667"
      stroke-linecap="round"
      stroke-linejoin="round"
    />
  </svg>
);

const ThumbsDownIcon = () => (
  <svg viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
    <path
      d="M2.5 3.75H6.25V11.875H2.5C2.33424 11.875 2.17527 11.8092 2.05806 11.6919C1.94085 11.5747 1.875 11.4158 1.875 11.25V4.375C1.875 4.20924 1.94085 4.05027 2.05806 3.93306C2.17527 3.81585 2.33424 3.75 2.5 3.75Z"
      stroke="currentColor"
      stroke-width="1.66667"
      stroke-linecap="round"
      stroke-linejoin="round"
    />
    <path
      d="M6.25 11.875L9.375 18.125C10.038 18.125 10.6739 17.8616 11.1428 17.3928C11.6116 16.9239 11.875 16.288 11.875 15.625V13.75H16.875C17.0523 13.75 17.2276 13.7122 17.3892 13.6392C17.5508 13.5662 17.695 13.4597 17.8123 13.3267C17.9295 13.1937 18.0172 13.0372 18.0693 12.8678C18.1215 12.6983 18.137 12.5197 18.1148 12.3438L17.1773 4.84375C17.1393 4.54174 16.9923 4.26399 16.7641 4.06262C16.5358 3.86124 16.2419 3.75009 15.9375 3.75H6.25"
      stroke="currentColor"
      stroke-width="1.66667"
      stroke-linecap="round"
      stroke-linejoin="round"
    />
  </svg>
);

const CopyIcon = () => (
  <svg viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
    <path d="M13.125 13.125H16.875V3.125H6.875V6.875" stroke="currentColor" stroke-width="1.66667" stroke-linecap="round" stroke-linejoin="round" />
    <path d="M13.125 6.875H3.125V16.875H13.125V6.875Z" stroke="currentColor" stroke-width="1.66667" stroke-linecap="round" stroke-linejoin="round" />
  </svg>
);

const RegenerateIcon = () => (
  <svg viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
    <path d="M13.125 7.5H16.875V3.75" stroke="currentColor" stroke-width="1.66667" stroke-linecap="round" stroke-linejoin="round" />
    <path
      d="M16.875 7.5L14.6656 5.29063C13.3861 4.01117 11.6538 3.28772 9.84437 3.27719C8.03494 3.26666 6.29431 3.9699 5 5.23438"
      stroke="currentColor"
      stroke-width="1.66667"
      stroke-linecap="round"
      stroke-linejoin="round"
    />
    <path d="M6.875 12.5H3.125V16.25" stroke="currentColor" stroke-width="1.66667" stroke-linecap="round" stroke-linejoin="round" />
    <path
      d="M3.125 12.5L5.33437 14.7094C6.61388 15.9888 8.34621 16.7123 10.1556 16.7228C11.9651 16.7333 13.7057 16.0301 15 14.7656"
      stroke="currentColor"
      stroke-width="1.66667"
      stroke-linecap="round"
      stroke-linejoin="round"
    />
  </svg>
);

const MenuIcon = () => (
  <svg viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
    <path
      d="M10 9.11426C10.489 9.11426 10.8857 9.511 10.8857 10C10.8857 10.489 10.489 10.8857 10 10.8857C9.511 10.8857 9.11426 10.489 9.11426 10C9.11426 9.511 9.511 9.11426 10 9.11426Z"
      fill="currentColor"
      stroke="currentColor"
      stroke-width="0.104167"
    />
    <path
      d="M10 3.80176C10.489 3.80176 10.8857 4.1985 10.8857 4.6875C10.8857 5.1765 10.489 5.57324 10 5.57324C9.511 5.57324 9.11426 5.1765 9.11426 4.6875C9.11426 4.1985 9.511 3.80176 10 3.80176Z"
      fill="currentColor"
      stroke="currentColor"
      stroke-width="0.104167"
    />
    <path
      d="M10 16.25C10.5178 16.25 10.9375 15.8303 10.9375 15.3125C10.9375 14.7947 10.5178 14.375 10 14.375C9.48223 14.375 9.0625 14.7947 9.0625 15.3125C9.0625 15.8303 9.48223 16.25 10 16.25Z"
      fill="currentColor"
    />
  </svg>
);

const SourcesIcon = () => (
  <svg viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
    <path
      d="M13.125 17.5H4.375C4.20924 17.5 4.05027 17.4342 3.93306 17.3169C3.81585 17.1997 3.75 17.0408 3.75 16.875V5.625C3.75 5.45924 3.81585 5.30027 3.93306 5.18306C4.05027 5.06585 4.20924 5 4.375 5H10.625L13.75 8.125V16.875C13.75 17.0408 13.6842 17.1997 13.5669 17.3169C13.4497 17.4342 13.2908 17.5 13.125 17.5Z"
      stroke="currentColor"
      stroke-width="1.66667"
      stroke-linecap="round"
      stroke-linejoin="round"
    />
    <path
      d="M6.25 5V3.125C6.25 2.95924 6.31585 2.80027 6.43306 2.68306C6.55027 2.56585 6.70924 2.5 6.875 2.5H13.125L16.25 5.625V14.375C16.25 14.5408 16.1842 14.6997 16.0669 14.8169C15.9497 14.9342 15.7908 15 15.625 15H13.75"
      stroke="currentColor"
      stroke-width="1.66667"
      stroke-linecap="round"
      stroke-linejoin="round"
    />
    <path d="M6.875 11.875H10.625" stroke="currentColor" stroke-width="1.66667" stroke-linecap="round" stroke-linejoin="round" />
    <path d="M6.875 14.375H10.625" stroke="currentColor" stroke-width="1.66667" stroke-linecap="round" stroke-linejoin="round" />
  </svg>
);
