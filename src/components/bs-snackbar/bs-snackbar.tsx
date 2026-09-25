import { Component, Event, EventEmitter, Prop, h } from '@stencil/core';

export type BsSnackbarVariant = 'default' | 'info' | 'warning' | 'success' | 'error';

/**
 * A transient status bar for confirming the result of an action (e.g. "Files uploaded
 * successfully.") -- an icon (or loading spinner), a message, an optional action, and a close
 * button.
 *
 * This component only renders the bar itself -- it doesn't manage its own visibility, timing, or
 * stacking. A consumer (typically a small "toast manager" utility) creates one per message and
 * removes it from the DOM again, whether on a timer or on `bsDismiss`. Figma's spec doesn't show
 * auto-dismiss timing at all (it's a static visual spec), so this deliberately doesn't invent one.
 *
 * The icon is always the same checkmark glyph across every `variant`, just recolored -- matching
 * the Figma spec exactly, even though a checkmark for `variant="error"` reads a little oddly
 * semantically. Worth revisiting with severity-specific icons (warning triangle, error circle,
 * etc.) if the design updates to specify them.
 *
 * ## When to use
 * - Confirming the outcome of an action that just happened (save succeeded, upload failed) without
 *   interrupting the user's flow.
 *
 * ## When not to use
 * - For a response that requires the user to make a decision before continuing -- use `bs-dialog`.
 * - For persistent, always-visible status -- a snackbar is inherently transient.
 *
 * @slot - Default slot: the message text.
 * @part container - The outer bar.
 * @part icon - The leading icon/spinner wrapper.
 * @part message - The message text wrapper.
 * @part action - The optional action button (only rendered when `actionLabel` is set).
 * @part close - The close button.
 */
@Component({
  tag: 'bs-snackbar',
  styleUrl: 'bs-snackbar.css',
  shadow: true,
})
export class BsSnackbar {
  /** Color/semantic variant. `default` is the neutral (dark, inverse-surface) bar Figma shows as
   * the baseline; `info`/`warning`/`success`/`error` use their matching container/text tokens. */
  @Prop() variant: BsSnackbarVariant = 'default';

  /** Replaces the checkmark icon with a spinning loading indicator, for a message describing
   * in-progress work (e.g. "Uploading files...") rather than a completed result. */
  @Prop() loading = false;

  /** Label for the optional action button (e.g. "Undo", "Retry"). Omit this prop entirely to
   * render no action button at all -- its presence, not a boolean flag, is what shows it. */
  @Prop() actionLabel?: string;

  /** Fires when the action button is clicked. Ignored/never fires if `actionLabel` isn't set. */
  @Event() bsAction: EventEmitter<void>;

  /** Fires when the close button is clicked. This component doesn't remove itself from the DOM --
   * the consumer is expected to do that (or hide it) in response to this event. */
  @Event() bsDismiss: EventEmitter<void>;

  private onAction = () => {
    this.bsAction.emit();
  };

  private onDismiss = () => {
    this.bsDismiss.emit();
  };

  render() {
    return (
      <div
        part="container"
        class={`bs-snackbar bs-snackbar--${this.variant}`}
        role="status"
        // Errors interrupt (assertive); everything else is announced politely without cutting off
        // whatever the screen reader is already saying -- standard toast/snackbar a11y convention,
        // not something Figma's static visual spec addresses one way or the other.
        aria-live={this.variant === 'error' ? 'assertive' : 'polite'}
      >
        <div class="bs-snackbar__content">
          <span part="icon" class="bs-snackbar__icon" aria-hidden="true">
            {this.loading ? <span class="bs-snackbar__spinner"></span> : <CheckCircleIcon />}
          </span>
          <span part="message" class="bs-snackbar__message">
            <slot></slot>
          </span>
        </div>
        <div class="bs-snackbar__actions">
          {this.actionLabel && (
            <button part="action" type="button" class="bs-snackbar__action" onClick={this.onAction}>
              {this.actionLabel}
            </button>
          )}
          <button part="close" type="button" class="bs-snackbar__close" aria-label="Dismiss" onClick={this.onDismiss}>
            <CloseIcon />
          </button>
        </div>
      </div>
    );
  }
}

const CheckCircleIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
    <path d="M8.25 12.75L10.5 15L15.75 9.75" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
    <path
      d="M12 21C16.9706 21 21 16.9706 21 12C21 7.02944 16.9706 3 12 3C7.02944 3 3 7.02944 3 12C3 16.9706 7.02944 21 12 21Z"
      stroke="currentColor"
      stroke-width="1.5"
      stroke-linecap="round"
      stroke-linejoin="round"
    />
  </svg>
);

const CloseIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
    <path d="M18.75 5.25L5.25 18.75" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
    <path d="M18.75 18.75L5.25 5.25" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
  </svg>
);
