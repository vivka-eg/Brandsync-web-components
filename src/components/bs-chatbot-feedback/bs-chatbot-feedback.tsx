import { Component, Prop, Event, EventEmitter, h } from '@stencil/core';

const RATING_COPY: Record<number, { heading: string; subtitle: string }> = {
  1: { heading: "We're sorry we couldn't help.", subtitle: "We'll use your feedback to improve." },
  2: { heading: "We're sorry we didn't get it right.", subtitle: "We'll use your feedback to improve." },
  3: { heading: 'Thanks for your feedback.', subtitle: "We're always looking for ways to improve." },
  4: { heading: "Thanks! We're glad we could help.", subtitle: 'We appreciate your feedback.' },
  5: { heading: 'Thanks for the great rating!', subtitle: "We're happy we could help." },
};

const DEFAULT_HEADING = 'How was your experience with us?';
const DEFAULT_SUBTITLE = 'Your feedback helps us make Genie better.';

/**
 * A star-rating feedback card shown at the end of a Genie AI chat: a heading/subtitle, a 5-star
 * rating, an optional comment, and either "Submit feedback" + "Start new chat" (before
 * submitting) or just "Start new chat" (after).
 *
 * ## When to use
 * - Prompting for feedback on a Genie response or chat session, typically after the user ends or
 *   restarts a conversation.
 *
 * ## When not to use
 * - A generic star-rating input elsewhere in the product -- this component's copy and layout are
 *   purpose-built for the Genie feedback flow, not a reusable rating control.
 *
 * The heading and subtitle are not freeform props: before submitting, they're always the fixed
 * "How was your experience..." copy; after submitting, they're determined entirely by `rating`
 * (1-2 stars reads apologetic, 3 neutral, 4-5 positive), matching the Figma source exactly. Use
 * `heading`/`subtitle` only if a consuming app genuinely needs to override that copy.
 *
 * @part close - The close button.
 * @part heading - The heading text.
 * @part subtitle - The subtitle text.
 * @part star - A single star button (`::part(star)` matches all five).
 * @part label - The "Tell us what you think" label (only rendered before submitting).
 * @part textarea - The comment textarea (only rendered before submitting).
 * @part comment - The submitted comment, read-only (only rendered after submitting, if a comment was given).
 * @part submit - The "Submit feedback" button (only rendered before submitting).
 * @part new-chat - The "Start new chat" button.
 * @prop --bs-chatbot-feedback-bg - Card background. Aliased to `--bs-surface-raised`.
 * @prop --bs-chatbot-feedback-border - Card border color. Aliased to `--bs-border-default`.
 * @prop --bs-chatbot-feedback-radius - Card corner radius. Aliased to `--bs-border-radius-200`.
 * @prop --bs-chatbot-feedback-padding-x - Card horizontal padding. Aliased to `--bs-spacing-250`.
 * @prop --bs-chatbot-feedback-padding-y - Card vertical padding. Aliased to `--bs-spacing-550`.
 * @prop --bs-chatbot-feedback-max-width - Max width of the card. Matches Figma's 762px.
 * @prop --bs-chatbot-feedback-gap - Gap between the top content block and the button(s). Aliased
 *   to `--bs-spacing-300`.
 * @prop --bs-chatbot-feedback-top-gap - Gap between heading/subtitle, stars, and the
 *   textarea/comment within the top block. Aliased to `--bs-spacing-250`.
 * @prop --bs-chatbot-feedback-heading-color - Aliased to `--bs-text-default`.
 * @prop --bs-chatbot-feedback-subtitle-color - Aliased to `--bs-text-secondary`.
 * @prop --bs-chatbot-feedback-star-filled - Filled star color. Aliased to `--bs-color-primary-default`.
 * @prop --bs-chatbot-feedback-star-empty - Empty star color. Aliased to `--bs-border-neutral-container`.
 * @prop --bs-chatbot-feedback-comment-color - Submitted comment text color. Aliased to `--bs-text-default`.
 * @prop --bs-chatbot-feedback-close-hover - Close button hover background. Aliased to `--bs-surface-hover`.
 * @prop --bs-chatbot-feedback-primary-bg - "Submit feedback" / post-submit "Start new chat"
 *   background. Aliased to `--bs-button-primary-default`.
 * @prop --bs-chatbot-feedback-primary-bg-hover - Aliased to `--bs-button-primary-hover`.
 * @prop --bs-chatbot-feedback-primary-bg-disabled - Aliased to `--bs-button-primary-disabled`.
 * @prop --bs-chatbot-feedback-outlined-border - Pre-submit "Start new chat" border. Aliased to
 *   `--bs-border-primary`.
 * @prop --bs-chatbot-feedback-outlined-hover - Pre-submit "Start new chat" hover background.
 *   Aliased to `--bs-color-primary-container-hover`.
 * @prop --bs-chatbot-feedback-outlined-text - Pre-submit "Start new chat" text/icon color.
 *   Aliased to `--bs-text-action`.
 */
@Component({
  tag: 'bs-chatbot-feedback',
  styleUrl: 'bs-chatbot-feedback.css',
  shadow: true,
})
export class BsChatbotFeedback {
  /** Current star rating, 0-5. 0 means no rating has been given yet. */
  @Prop({ mutable: true, reflect: true }) rating = 0;

  /** Whether feedback has been submitted. Switches the card from the editable form to the
   * read-only "thanks" view. */
  @Prop({ mutable: true, reflect: true }) submitted = false;

  /** The comment text. */
  @Prop({ mutable: true }) comment = '';

  /** Overrides the computed heading (see the class doc for why this is computed by default). */
  @Prop() heading?: string;

  /** Overrides the computed subtitle. */
  @Prop() subtitle?: string;

  /** Fires when a star is clicked, with the new rating. */
  @Event() bsRatingChange: EventEmitter<number>;

  /** Fires on every keystroke in the comment textarea, with the current value. */
  @Event() bsCommentInput: EventEmitter<string>;

  /** Fires when "Submit feedback" is clicked, with the current rating and comment. Also sets
   * `submitted` to true. */
  @Event() bsSubmit: EventEmitter<{ rating: number; comment: string }>;

  /** Fires when "Start new chat" is clicked. The consuming app owns actually starting a new chat. */
  @Event() bsNewChat: EventEmitter<void>;

  /** Fires when the close button is clicked. The consuming app owns actually hiding the card. */
  @Event() bsClose: EventEmitter<void>;

  private onStarClick = (value: number) => {
    if (this.submitted) return;
    this.rating = value;
    this.bsRatingChange.emit(value);
  };

  private onCommentInput = (ev: InputEvent) => {
    this.comment = (ev.target as HTMLTextAreaElement).value;
    this.bsCommentInput.emit(this.comment);
  };

  private onSubmitClick = () => {
    if (this.rating === 0) return;
    this.submitted = true;
    this.bsSubmit.emit({ rating: this.rating, comment: this.comment });
  };

  private onNewChatClick = () => {
    this.bsNewChat.emit();
  };

  private onCloseClick = () => {
    this.bsClose.emit();
  };

  private computedHeading(): string {
    if (this.heading) return this.heading;
    if (this.submitted && RATING_COPY[this.rating]) return RATING_COPY[this.rating].heading;
    return DEFAULT_HEADING;
  }

  private computedSubtitle(): string {
    if (this.subtitle) return this.subtitle;
    if (this.submitted && RATING_COPY[this.rating]) return RATING_COPY[this.rating].subtitle;
    return DEFAULT_SUBTITLE;
  }

  render() {
    const stars = [1, 2, 3, 4, 5];

    return (
      <div class="bs-chatbot-feedback" role="region" aria-label={this.computedHeading()}>
        <button type="button" part="close" class="bs-chatbot-feedback__close" aria-label="Close" onClick={this.onCloseClick}>
          <CloseIcon />
        </button>
        <div class="bs-chatbot-feedback__top">
          <div class="bs-chatbot-feedback__text">
            <p part="heading" class="bs-chatbot-feedback__heading">
              {this.computedHeading()}
            </p>
            <p part="subtitle" class="bs-chatbot-feedback__subtitle">
              {this.computedSubtitle()}
            </p>
          </div>
          <div class="bs-chatbot-feedback__stars" role="radiogroup" aria-label="Rating">
            {stars.map(value => (
              <button
                type="button"
                part="star"
                class="bs-chatbot-feedback__star"
                role="radio"
                aria-checked={(this.rating >= value).toString()}
                aria-label={`${value} star${value > 1 ? 's' : ''}`}
                disabled={this.submitted}
                onClick={() => this.onStarClick(value)}
              >
                <StarIcon filled={this.rating >= value} />
              </button>
            ))}
          </div>
          {!this.submitted && (
            <div class="bs-chatbot-feedback__field">
              <label part="label" class="bs-chatbot-feedback__label" htmlFor="bs-chatbot-feedback-comment">
                Tell us what you think
              </label>
              <textarea
                part="textarea"
                id="bs-chatbot-feedback-comment"
                class="bs-chatbot-feedback__textarea"
                placeholder="e.g.The response was helpful ...."
                value={this.comment}
                onInput={this.onCommentInput}
              ></textarea>
            </div>
          )}
          {this.submitted && this.comment && (
            <p part="comment" class="bs-chatbot-feedback__comment">
              {this.comment}
            </p>
          )}
        </div>
        <div class="bs-chatbot-feedback__actions">
          {!this.submitted && (
            <button type="button" part="submit" class="bs-chatbot-feedback__submit" disabled={this.rating === 0} onClick={this.onSubmitClick}>
              <SendIcon />
              Submit feedback
            </button>
          )}
          <button
            type="button"
            part="new-chat"
            class={`bs-chatbot-feedback__new-chat ${this.submitted ? 'bs-chatbot-feedback__new-chat--primary' : 'bs-chatbot-feedback__new-chat--outlined'}`}
            onClick={this.onNewChatClick}
          >
            <EditIcon />
            Start new chat
          </button>
        </div>
      </div>
    );
  }
}

const StarIcon = ({ filled }: { filled: boolean }) => (
  <svg viewBox="0 0 24 24" fill={filled ? 'currentColor' : 'none'} xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
    <path
      d="M12 2.5L15.09 8.75L22 9.77L17 14.62L18.18 21.5L12 18.22L5.82 21.5L7 14.62L2 9.77L8.91 8.75L12 2.5Z"
      stroke="currentColor"
      stroke-width="1.5"
      stroke-linecap="round"
      stroke-linejoin="round"
    />
  </svg>
);

const SendIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
    <path d="M13.5 12H7.5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
    <path
      d="M4.55 20.75C4.44 20.99 4.47 21.27 4.63 21.48C4.79 21.69 5.05 21.79 5.31 21.75L21.37 12.65C21.6 12.52 21.75 12.27 21.75 12C21.75 11.73 21.6 11.48 21.37 11.35L5.31 2.25C5.05 2.21 4.79 2.31 4.63 2.52C4.47 2.73 4.44 3.01 4.55 3.25L7.5 12L4.55 20.75Z"
      stroke="currentColor"
      stroke-width="1.5"
      stroke-linecap="round"
      stroke-linejoin="round"
    />
  </svg>
);

const EditIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
    <path
      d="M16.5 3.5L20.5 7.5L8 20H4V16L16.5 3.5Z"
      stroke="currentColor"
      stroke-width="1.5"
      stroke-linecap="round"
      stroke-linejoin="round"
    />
    <path d="M14.5 5.5L18.5 9.5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
  </svg>
);

const CloseIcon = () => (
  <svg viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
    <path d="M15 5L5 15" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
    <path d="M15 15L5 5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
  </svg>
);
