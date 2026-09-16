import { Component, Element, Prop, Event, EventEmitter, Watch, h } from '@stencil/core';

export type BsCheckboxSize = 'sm' | 'md' | 'lg';

/**
 * A single checkbox with its label, for a binary choice or one item within a group of independent
 * choices.
 *
 * ## When to use
 * - A single standalone binary setting (e.g. "Remember me", "I agree to the terms").
 * - One item within a set of independent, non-exclusive choices (a checkbox group/list).
 * - `indeterminate` for a "select all" checkbox representing a partially-selected group.
 *
 * ## When not to use
 * - A single mutually-exclusive choice from a set -- use a radio group instead.
 * - An on/off setting that takes effect immediately (no explicit form submission) -- use `bs-switch`.
 *
 * @slot - Default slot: the label text.
 * @part box - The visual checkbox square.
 * @part icon - The check/minus icon shown inside the box when `checked` or `indeterminate`.
 * @part label - The label text wrapper.
 */
// Note: this component's CSS Custom Properties (--bs-checkbox-*) are documented via @prop comments
// in bs-checkbox.css, not here -- Stencil's docs generator only parses @prop out of CSS file
// comments, not the class-level JSDoc (see bs-input.tsx's equivalent note).
@Component({
  tag: 'bs-checkbox',
  styleUrl: 'bs-checkbox.css',
  // delegatesFocus so calling .focus() on the <bs-checkbox> host reaches the native checkbox
  // inside -- see bs-button/bs-input for why.
  shadow: { delegatesFocus: true },
})
export class BsCheckbox {
  @Element() el: HTMLElement;

  private inputEl?: HTMLInputElement;

  /** Sizing scale. Controls the box's width/height and border width; corner radius is constant
   * across all sizes. */
  @Prop() size: BsCheckboxSize = 'lg';

  /** Whether the checkbox is checked. Mutable so clicking the label/input toggles it directly.
   * When `indeterminate` is also true, `indeterminate` wins visually (shows the minus icon)
   * regardless of this value -- same as native checkboxes. */
  @Prop({ mutable: true, reflect: true }) checked = false;

  /** Whether the checkbox is in the indeterminate ("partially selected") state -- shows a minus
   * icon instead of a check, and takes visual precedence over `checked`. Unlike `checked`, native
   * checkboxes have no `indeterminate` HTML attribute; it can only be set as a JS property on the
   * element. This `@Prop` still works as an attribute for the *host* (`<bs-checkbox>`) since that's
   * this component's own reflected state, not the native control's -- the native `<input>` inside
   * has its `.indeterminate` property set imperatively in `componentDidLoad`/`componentDidUpdate`. */
  @Prop({ mutable: true, reflect: true }) indeterminate = false;

  /** Disables the checkbox: sets the native `disabled` attribute, suppresses hover/focus styling,
   * and prevents toggling. */
  @Prop() disabled = false;

  /** Applies the error border/label-color treatment. This component's spec has no error message
   * text of its own (unlike `bs-input`'s `error: string`), so it's a plain boolean. */
  @Prop() error = false;

  /**
   * Accessible name for the checkbox. Required whenever the default (label) slot is empty (e.g. a
   * bare "select row" checkbox in a table) -- without it, the internal native `<input>` has no
   * accessible name at all. Setting `aria-label` directly on the `<bs-checkbox>` host does NOT
   * work for this: that attribute stays on the light-DOM host and is never forwarded into the
   * shadow DOM by the browser, so the actual focusable element (the native `<input>` inside) stays
   * nameless. This prop exists specifically to bridge that gap -- same pattern as `bs-button`'s and
   * `bs-tab`'s identical `ariaLabel` prop, both of which explicitly bind it onto their own internal
   * focusable element for the same reason.
   */
  @Prop() ariaLabel: string | null = null;

  /** Emitted when the checked state changes via user interaction, with the new `checked` value. */
  @Event() bsChange: EventEmitter<boolean>;

  /** Keeps the native input's `.indeterminate` JS property in sync -- this can't be expressed as a
   * JSX attribute in Stencil, it must be set imperatively on the element. */
  @Watch('indeterminate')
  onIndeterminateChange() {
    if (this.inputEl) {
      this.inputEl.indeterminate = this.indeterminate;
    }
  }

  componentDidLoad() {
    if (this.inputEl) {
      this.inputEl.indeterminate = this.indeterminate;
    }
  }

  componentDidUpdate() {
    if (this.inputEl) {
      this.inputEl.indeterminate = this.indeterminate;
    }
  }

  private onChange = (ev: Event) => {
    const checked = (ev.target as HTMLInputElement).checked;
    this.checked = checked;
    // Clicking a native checkbox always clears indeterminate, regardless of what it was before --
    // match that here so the visual state (icon) tracks the real native behavior.
    this.indeterminate = false;
    this.bsChange.emit(checked);
  };

  render() {
    const showIcon = this.checked || this.indeterminate;
    const boxClasses = [
      'bs-checkbox__box',
      `bs-checkbox__box--${this.size}`,
      showIcon ? 'bs-checkbox__box--selected' : '',
      this.disabled ? 'bs-checkbox__box--disabled' : '',
      this.error ? 'bs-checkbox__box--error' : '',
    ]
      .filter(Boolean)
      .join(' ');

    return (
      <label class={`bs-checkbox ${this.disabled ? 'bs-checkbox--disabled' : ''}`}>
        <input
          ref={el => (this.inputEl = el as HTMLInputElement)}
          class="bs-checkbox__input"
          type="checkbox"
          checked={this.checked}
          disabled={this.disabled}
          aria-checked={this.indeterminate ? 'mixed' : String(this.checked)}
          aria-label={this.ariaLabel}
          onChange={this.onChange}
        />
        <span part="box" class={boxClasses}>
          {showIcon && (
            <svg part="icon" class="bs-checkbox__icon" viewBox="0 0 16 16" fill="none" aria-hidden="true">
              {this.indeterminate ? (
                <path d="M3 8H13" stroke="currentColor" stroke-width="2" stroke-linecap="round" />
              ) : (
                <path
                  d="M3 8.5L6.2 11.5L13 4.5"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
              )}
            </svg>
          )}
        </span>
        <span part="label" class="bs-checkbox__label">
          <slot></slot>
        </span>
      </label>
    );
  }
}
