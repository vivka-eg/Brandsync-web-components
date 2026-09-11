import { Component, Element, State, Prop, Event, EventEmitter, h } from '@stencil/core';

export type BsComposerVariant = 'ai' | 'human';
export type BsComposerState = 'idle' | 'generating' | 'disabled' | 'recording';

const DEFAULT_PLACEHOLDERS: Record<BsComposerVariant, string> = {
  ai: 'Ask Genie something...',
  human: 'Message your support agent...',
};

// Static (non-animated) placeholder audio-level bar heights in px, sampled from the Figma
// "Audio Waveform" reference (60 bars, 2.5px wide, 3px gap) -- a real analyzer would drive these
// from actual audio input, this just reproduces the designed look.
const WAVEFORM_BAR_HEIGHTS = [
  6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 18, 14, 34, 22, 22, 10, 28, 18, 12, 24, 6, 20, 30, 14, 8, 26, 16,
  32, 10, 22, 18, 12, 28, 8, 20, 14, 24, 10, 16, 30, 12, 22, 6, 18, 26, 8, 14, 32, 20, 10, 24, 6,
];

/**
 * A chat composer input for Genie AI-style conversational interfaces: a text field
 * plus an attach button, a mic/voice-recording toggle, and a single primary action button whose
 * icon and behavior change with `state` (send, stop generating, or confirm a voice recording).
 *
 * ## When to use
 * - The message-entry bar for an AI chat/assistant or human support conversation.
 *
 * ## When not to use
 * - A general-purpose text field — use `bs-input` instead; this component's layout and states are
 *   purpose-built for a chat composer, not a generic form field.
 *
 * ## Focus
 * Uses `shadow: { delegatesFocus: true }`, so calling `.focus()` on the `<bs-composer>` host
 * element itself (not just its internal `<input>`) moves focus into the shadow-DOM text field --
 * useful for e.g. focusing the composer after a parent view mounts, without reaching into its
 * shadow root.
 *
 * @slot attachments - A `bs-attachment-list` (or other content) rendered inside the composer's own
 *   bordered container, above the text field -- only takes up space/padding when it has assigned
 *   content, so leaving it empty renders identically to not having the slot at all.
 * @slot actions-end - Extra consumer-supplied controls appended after the primary action button
 *   in the controls row (e.g. a product-specific "Tools" button). Slotted content is placed
 *   inline in the same flex row as attach/mic/action, so a slotted element should size itself to
 *   roughly match `--bs-composer-button-size` to align visually.
 * @part attachments - The wrapper around the `attachments` slot.
 * @part attach - The "+" attach button.
 * @part input - The native text `<input>`.
 * @part mic - The secondary icon button (microphone, or the stop-recording square while `state="recording"`).
 * @part action - The primary circular action button (send, stop, or confirm depending on `state`).
 * @prop --bs-composer-radius - Corner radius of the container. Aliased to `--bs-border-radius-150`.
 * @prop --bs-composer-button-radius - Corner radius of the attach/mic/action buttons. Aliased to `--bs-border-radius-100`.
 * @prop --bs-composer-button-size - Width/height of the attach/mic/action buttons. Aliased to `--bs-spacing-600`.
 * @prop --bs-composer-bg - Background of the pill container. Aliased to `--bs-input-bg-default`.
 * @prop --bs-composer-border - Border color of the pill container. Aliased to `--bs-input-border-default`.
 * @prop --bs-composer-border-focus - Border color when the text field has focus. Aliased to `--bs-input-border-focus`.
 * @prop --bs-composer-action-bg - Background of the primary action button. Aliased to `--bs-color-primary-default`.
 * @prop --bs-composer-action-bg-hover - Aliased to `--bs-color-primary-hover`.
 * @prop --bs-composer-action-bg-pressed - Aliased to `--bs-color-primary-pressed`.
 * @prop --bs-composer-action-bg-disabled - Aliased to `--bs-surface-action-disabled`.
 * @prop --bs-composer-action-icon - Icon color on the primary action button. Aliased to `--bs-text-on-action`.
 * @prop --bs-composer-action-icon-disabled - Aliased to `--bs-text-on-disabled`.
 * @prop --bs-composer-attach-icon - Icon color of the attach button. Aliased to `--bs-icon-default`.
 * @prop --bs-composer-mic-icon - Icon color of the mic/stop-recording button. Aliased to `--bs-icon-default`.
 * @prop --bs-composer-mic-icon-disabled - Aliased to `--bs-icon-disabled`.
 * @prop --bs-composer-subtle-hover - Background of the attach/mic buttons on hover (subtle-button treatment, same as `bs-button`'s `subtle` variant). Aliased to `--bs-color-neutral-container`.
 * @prop --bs-composer-subtle-pressed - Background of the attach/mic buttons when pressed. Aliased to `--bs-color-neutral-container-pressed`.
 */
@Component({
  tag: 'bs-composer',
  styleUrl: 'bs-composer.css',
  // delegatesFocus so calling .focus() on the <bs-composer> host reaches the native text <input>
  // inside -- same reasoning as bs-input.
  shadow: { delegatesFocus: true },
})
export class BsComposer {
  @Element() el: HTMLElement;

  /**
   * Which flavor of composer this is: changes the *default* placeholder text (set `placeholder`
   * directly to override it) and, per the Figma design, renders the container border dashed
   * instead of solid for `'human'` -- a deliberate visual cue distinguishing a human-support
   * composer from the AI one, not a layout/token difference.
   */
  @Prop() variant: BsComposerVariant = 'ai';

  /** Overrides the variant's default placeholder. */
  @Prop() placeholder?: string;

  /** Current text value. Native `input` events don't cross the Shadow DOM boundary, so this
   * component re-dispatches them as a `bsInput` custom event instead. */
  @Prop() value = '';

  /**
   * Which of the four mutually-exclusive composer states to render: `idle` (send, enabled),
   * `generating` (stop, while the AI is responding), `disabled` (send, but not interactive), or
   * `recording` (voice input in progress -- shows a waveform and a confirm action).
   */
  @Prop() state: BsComposerState = 'idle';

  /**
   * Accessible name for the text field. This component has no visible `<label>` (chat composers
   * don't show one in the design), so `ariaLabel` is the only way a consumer gives the textbox an
   * accessible name -- set it in every real usage.
   */
  @Prop() ariaLabel: string | null = null;

  /** Tracks whether the `attachments` slot has assigned content, so the row above the text field
   * (padding, border) only takes up space when a consumer has actually put something there --
   * same reasoning/pattern as `hasIcon`/`hasLabel` in `bs-attachment`. */
  @State() hasAttachments = false;

  /** Fires on every keystroke in the text field, with the current value. */
  @Event() bsInput: EventEmitter<string>;

  /** Fires when the primary action button is clicked while `state="idle"`. */
  @Event() bsSubmit: EventEmitter<void>;

  /** Fires when the primary action button is clicked while `state="generating"`. */
  @Event() bsStop: EventEmitter<void>;

  /** Fires when the primary action button is clicked while `state="recording"`. */
  @Event() bsVoiceConfirm: EventEmitter<void>;

  /** Fires when the "+" attach button is clicked. */
  @Event() bsAttach: EventEmitter<void>;

  /** Fires when the mic/stop-recording button is clicked. The consumer decides what that means
   * (e.g. start recording when idle/generating, or stop recording when `state="recording"`). */
  @Event() bsMicToggle: EventEmitter<void>;

  /** Computes the initial `hasAttachments` state directly from the host's light DOM children,
   * before first render -- same reasoning as `bs-attachment`'s `componentWillLoad`: `slotchange`
   * alone never fires for a slot that starts out empty and stays that way. */
  componentWillLoad() {
    this.hasAttachments = Array.from(this.el.childNodes).some(node => node.nodeType === Node.ELEMENT_NODE && (node as Element).getAttribute('slot') === 'attachments');
  }

  private onAttachmentsSlotchange = (ev: Event) => {
    this.hasAttachments = (ev.target as HTMLSlotElement).assignedNodes().length > 0;
  };

  private onInput = (ev: InputEvent) => {
    const value = (ev.target as HTMLInputElement).value;
    this.bsInput.emit(value);
  };

  private onAttachClick = () => {
    this.bsAttach.emit();
  };

  private onMicClick = () => {
    this.bsMicToggle.emit();
  };

  private onActionClick = () => {
    if (this.state === 'idle') {
      this.bsSubmit.emit();
    } else if (this.state === 'generating') {
      this.bsStop.emit();
    } else if (this.state === 'recording') {
      this.bsVoiceConfirm.emit();
    }
  };

  private actionLabel(): string {
    if (this.state === 'generating') return 'Stop';
    if (this.state === 'recording') return 'Confirm';
    return 'Send';
  }

  private renderActionIcon() {
    if (this.state === 'generating') return <StopIcon />;
    if (this.state === 'recording') return <CheckIcon />;
    return <SendIcon />;
  }

  render() {
    const placeholder = this.placeholder ?? DEFAULT_PLACEHOLDERS[this.variant];
    const disabled = this.state === 'disabled';
    const recording = this.state === 'recording';

    return (
      <div class={`bs-composer bs-composer--${this.state} bs-composer--${this.variant}`}>
        <div part="attachments" class={`bs-composer__attachments-row ${this.hasAttachments ? 'bs-composer__attachments-row--visible' : ''}`}>
          <slot name="attachments" onSlotchange={this.onAttachmentsSlotchange}></slot>
        </div>
        <div class="bs-composer__text-row">
          <input
            part="input"
            class="bs-composer__input"
            type="text"
            value={this.value}
            placeholder={placeholder}
            disabled={disabled}
            aria-label={this.ariaLabel}
            onInput={this.onInput}
          />
        </div>
        <div class="bs-composer__controls-row">
          <button type="button" part="attach" class="bs-composer__attach" aria-label="Attach" onClick={this.onAttachClick}>
            <PlusIcon />
          </button>
          {recording ? (
            <span class="bs-composer__waveform" aria-hidden="true">
              {WAVEFORM_BAR_HEIGHTS.map(height => (
                <span class="bs-composer__waveform-bar" style={{ '--bs-composer-bar-height': `${height}px` }}></span>
              ))}
            </span>
          ) : (
            <span class="bs-composer__spacer"></span>
          )}
          <button
            type="button"
            part="mic"
            class={`bs-composer__mic ${recording ? 'bs-composer__mic--recording' : ''}`}
            aria-label={recording ? 'Stop recording' : 'Start voice input'}
            disabled={disabled}
            onClick={this.onMicClick}
          >
            {recording ? <StopIcon /> : <MicIcon />}
          </button>
          <button
            type="button"
            part="action"
            class={`bs-composer__action bs-composer__action--${this.state}`}
            aria-label={this.actionLabel()}
            disabled={disabled}
            onClick={this.onActionClick}
          >
            {this.renderActionIcon()}
          </button>
          <slot name="actions-end"></slot>
        </div>
      </div>
    );
  }
}

const PlusIcon = () => (
  <svg viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
    <path d="M8 2.5V13.5M2.5 8H13.5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" />
  </svg>
);

const MicIcon = () => (
  <svg viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
    <path
      d="M8 9.5C9.10457 9.5 10 8.60457 10 7.5V3.5C10 2.39543 9.10457 1.5 8 1.5C6.89543 1.5 6 2.39543 6 3.5V7.5C6 8.60457 6.89543 9.5 8 9.5Z"
      stroke="currentColor"
      stroke-width="1.4"
    />
    <path d="M3.5 7V7.5C3.5 9.98528 5.51472 12 8 12C10.4853 12 12.5 9.98528 12.5 7.5V7" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" />
    <path d="M8 12V14.5" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" />
  </svg>
);

// Exact "PaperPlaneRight" path from the Figma design (node 45:95), not a hand-drawn approximation.
const SendIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
    <path d="M13.5 12H7.5" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
    <path
      d="M4.54594 20.745C4.4932 20.889 4.48589 21.0457 4.52499 21.1941C4.56409 21.3424 4.64771 21.4751 4.76459 21.5744C4.88147 21.6737 5.02599 21.7348 5.17866 21.7494C5.33133 21.7641 5.48482 21.7315 5.61844 21.6562L21.3684 12.6478C21.4857 12.583 21.5834 12.4879 21.6514 12.3725C21.7195 12.2571 21.7553 12.1255 21.7553 11.9916C21.7553 11.8576 21.7195 11.7261 21.6514 11.6107C21.5834 11.4952 21.4857 11.4002 21.3684 11.3353L5.61844 2.34937C5.48523 2.27487 5.33245 2.24278 5.18052 2.2574C5.02859 2.27201 4.88474 2.33264 4.76817 2.43117C4.65161 2.5297 4.56788 2.66145 4.52817 2.80882C4.48846 2.9562 4.49466 3.11218 4.54594 3.25594L7.5 12L4.54594 20.745Z"
      stroke="currentColor"
      stroke-width="2"
      stroke-linecap="round"
      stroke-linejoin="round"
    />
  </svg>
);

const StopIcon = () => (
  <svg viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
    <rect x="6" y="6" width="8" height="8" rx="1.5" fill="currentColor" />
  </svg>
);

const CheckIcon = () => (
  <svg viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
    <path d="M4.5 10.5L8 14L15.5 6" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" />
  </svg>
);
