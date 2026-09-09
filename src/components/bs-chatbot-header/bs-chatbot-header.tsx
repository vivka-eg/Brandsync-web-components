import { Component, Prop, Event, EventEmitter, h } from '@stencil/core';
import { GENIE_LOGO_SVG } from './genie-logo';

/**
 * The header bar that sits above `bs-composer` in a Genie AI chat panel: the Genie brand mark on
 * the left and four fixed actions (new chat, history, expand, close) on the right.
 *
 * ## When to use
 * - The top bar of a Genie AI chat panel, directly above a `bs-composer`.
 *
 * ## When not to use
 * - A generic app/page header — this component's layout and actions are purpose-built for the
 *   Genie chat panel, not a general navigation bar.
 *
 * Each action button shows a `bs-tooltip` (placement="top", i.e. positioned below the button with
 * its arrow pointing up toward it -- fits naturally since this header sits at the top of a panel)
 * on hover/focus, driven by plain CSS (`:hover`/`:focus-within` on a wrapper, no extra JS state).
 * The tooltip is `aria-hidden` since it's a purely visual reinforcement of each button's existing
 * `aria-label` -- screen readers already get the accessible name from the button itself, so the
 * tooltip doesn't need to be (and shouldn't be) announced a second time.
 *
 * @slot new-chat-icon - Overrides the default "New chat" button icon.
 * @slot history-icon - Overrides the default "History" button icon.
 * @slot expand-icon - Overrides the default "Expand"/"Collapse" button icon (rendered regardless of `expanded` -- there is no separate confirmed "collapsed" glyph in the design, so swap it yourself via this slot if you need one).
 * @slot close-icon - Overrides the default "Close" button icon.
 * @part logo - The Genie brand mark (inline SVG).
 * @part new-chat - The "New chat" icon button.
 * @part history - The "History" icon button.
 * @part expand - The "Expand"/"Collapse" icon button.
 * @part close - The "Close" icon button.
 * @prop --bs-chatbot-header-bg - Background of the header bar. Aliased to `--bs-surface-base`.
 * @prop --bs-chatbot-header-border - Bottom border color. Aliased to `--bs-border-default`.
 * @prop --bs-chatbot-header-padding-top - Aliased to `--bs-spacing-200`.
 * @prop --bs-chatbot-header-padding-bottom - Aliased to `--bs-spacing-100`.
 * @prop --bs-chatbot-header-padding-x - Aliased to `--bs-margin-fluid`.
 * @prop --bs-chatbot-header-gap - Gap between the logo and the button group. Aliased to `--bs-navigation-header-gap`.
 * @prop --bs-chatbot-header-actions-gap - Gap between the individual action buttons. Aliased to `--bs-spacing-100`.
 * @prop --bs-chatbot-header-button-size - Width/height of each icon button. Aliased to `--bs-spacing-600`.
 * @prop --bs-chatbot-header-button-radius - Corner radius of each icon button. Aliased to `--bs-border-radius-100`.
 * @prop --bs-chatbot-header-button-hover - Icon button background on hover. Aliased to `--bs-color-neutral-container`.
 * @prop --bs-chatbot-header-button-pressed - Icon button background when pressed. Aliased to `--bs-color-neutral-container-pressed`.
 * @prop --bs-chatbot-header-icon - Icon color. Aliased to `--bs-icon-default`.
 */
@Component({
  tag: 'bs-chatbot-header',
  styleUrl: 'bs-chatbot-header.css',
  shadow: true,
})
export class BsChatbotHeader {
  /** Accessible label for the header landmark, and alt text context for the logo image. */
  @Prop() heading = 'Genie';

  /**
   * Whether the chat panel is currently expanded (e.g. to full viewport width/height). This
   * component has no visibility into the surrounding layout, so it does not resize anything
   * itself -- it only tracks and reflects the toggle state (via the `expanded` attribute, for CSS
   * hooks, and `aria-pressed`/`aria-label` on the expand button) and emits `bsExpand` with the new
   * value. The consuming app is responsible for actually resizing its own chat panel container in
   * response to that event, since only the app knows what that container is.
   */
  @Prop({ mutable: true, reflect: true }) expanded = false;

  /** Fires when the "New chat" button is clicked. */
  @Event() bsNewChat: EventEmitter<void>;

  /** Fires when the "History" button is clicked. */
  @Event() bsHistory: EventEmitter<void>;

  /** Fires when the "Expand"/"Collapse" button is clicked, with the new `expanded` value. */
  @Event() bsExpand: EventEmitter<boolean>;

  /** Fires when the "Close" button is clicked. */
  @Event() bsClose: EventEmitter<void>;

  private onNewChatClick = () => {
    this.bsNewChat.emit();
  };

  private onHistoryClick = () => {
    this.bsHistory.emit();
  };

  private onExpandClick = () => {
    this.expanded = !this.expanded;
    this.bsExpand.emit(this.expanded);
  };

  private onCloseClick = () => {
    this.bsClose.emit();
  };

  render() {
    return (
      <div class="bs-chatbot-header" role="banner" aria-label={this.heading}>
        <div part="logo" class="bs-chatbot-header__logo" role="img" aria-label={this.heading} innerHTML={GENIE_LOGO_SVG}></div>
        <div class="bs-chatbot-header__actions">
          <span class="bs-chatbot-header__tooltip-wrapper">
            <button type="button" part="new-chat" class="bs-chatbot-header__button" aria-label="New chat" onClick={this.onNewChatClick}>
              <slot name="new-chat-icon">
                <NewChatIcon />
              </slot>
            </button>
            <bs-tooltip class="bs-chatbot-header__tooltip" placement="top" aria-hidden="true">
              New chat
            </bs-tooltip>
          </span>
          <span class="bs-chatbot-header__tooltip-wrapper">
            <button type="button" part="history" class="bs-chatbot-header__button" aria-label="History" onClick={this.onHistoryClick}>
              <slot name="history-icon">
                <HistoryIcon />
              </slot>
            </button>
            <bs-tooltip class="bs-chatbot-header__tooltip" placement="top" aria-hidden="true">
              History
            </bs-tooltip>
          </span>
          <span class="bs-chatbot-header__tooltip-wrapper">
            <button
              type="button"
              part="expand"
              class="bs-chatbot-header__button"
              aria-label={this.expanded ? 'Collapse' : 'Expand'}
              aria-pressed={this.expanded ? 'true' : 'false'}
              onClick={this.onExpandClick}
            >
              <slot name="expand-icon">
                <ExpandIcon />
              </slot>
            </button>
            <bs-tooltip class="bs-chatbot-header__tooltip" placement="top" aria-hidden="true">
              {this.expanded ? 'Collapse' : 'Expand'}
            </bs-tooltip>
          </span>
          <span class="bs-chatbot-header__tooltip-wrapper">
            <button type="button" part="close" class="bs-chatbot-header__button" aria-label="Close" onClick={this.onCloseClick}>
              <slot name="close-icon">
                <CloseIcon />
              </slot>
            </button>
            <bs-tooltip class="bs-chatbot-header__tooltip" placement="top" aria-hidden="true">
              Close
            </bs-tooltip>
          </span>
        </div>
      </div>
    );
  }
}

const NewChatIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
    <path d="M12 15H9V12L18 3L21 6L12 15Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
    <path d="M15.75 5.25L18.75 8.25" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
    <path
      d="M20.25 12V19.5C20.25 19.6989 20.171 19.8897 20.0303 20.0303C19.8897 20.171 19.6989 20.25 19.5 20.25H4.5C4.30109 20.25 4.11032 20.171 3.96967 20.0303C3.82902 19.8897 3.75 19.6989 3.75 19.5V4.5C3.75 4.30109 3.82902 4.11032 3.96967 3.96967C4.11032 3.82902 4.30109 3.75 4.5 3.75H12"
      stroke="currentColor"
      stroke-width="2"
      stroke-linecap="round"
      stroke-linejoin="round"
    />
  </svg>
);

const HistoryIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
    <path d="M12 7.5V12L15.75 14.25" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
    <path d="M6.75 9.75H3V6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
    <path
      d="M6.3375 18C7.51685 19.1128 8.99798 19.8535 10.5958 20.1294C12.1937 20.4052 13.8374 20.2041 15.3217 19.5512C16.8059 18.8982 18.0648 17.8224 18.9411 16.458C19.8173 15.0937 20.2721 13.5014 20.2486 11.8801C20.2251 10.2587 19.7244 8.68026 18.8089 7.3419C17.8934 6.00354 16.6039 4.96463 15.1014 4.35497C13.5988 3.74531 11.95 3.59195 10.3608 3.91403C8.77157 4.23612 7.31253 5.01938 6.16594 6.16594C5.0625 7.28344 4.15125 8.33719 3 9.75"
      stroke="currentColor"
      stroke-width="2"
      stroke-linecap="round"
      stroke-linejoin="round"
    />
  </svg>
);

const ExpandIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
    <path d="M15.75 4.5H19.5V8.25" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
    <path d="M8.25 19.5H4.5V15.75" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
    <path d="M19.5 15.75V19.5H15.75" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
    <path d="M4.5 8.25V4.5H8.25" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
  </svg>
);

const CloseIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
    <path d="M18.75 5.25L5.25 18.75" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
    <path d="M18.75 18.75L5.25 5.25" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
  </svg>
);
