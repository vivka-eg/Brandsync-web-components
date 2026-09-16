import { Component, Element, Prop, Event, EventEmitter, h } from '@stencil/core';

/**
 * A single radio button with its label, for one mutually-exclusive choice within a group.
 *
 * ## When to use
 * - One option within a set of mutually-exclusive choices, where all options should stay visible
 *   (a radio group).
 *
 * ## When not to use
 * - An independent, non-exclusive binary choice, or one item in a set of independent choices --
 *   use `bs-checkbox` instead.
 * - An on/off setting that takes effect immediately (no explicit form submission) -- use `bs-switch`.
 *
 * @slot - Default slot: the label text.
 * @part circle - The visual radio ring.
 * @part dot - The center fill shown inside the ring when `checked`.
 * @part label - The label text wrapper.
 */
// Note: this component's CSS Custom Properties (--bs-radio-*) are documented via @prop comments
// in bs-radio.css, not here -- Stencil's docs generator only parses @prop out of CSS file
// comments, not the class-level JSDoc (see bs-checkbox.tsx's equivalent note).
@Component({
  tag: 'bs-radio',
  styleUrl: 'bs-radio.css',
  // delegatesFocus so calling .focus() on the <bs-radio> host reaches the native radio inside --
  // see bs-button/bs-input for why.
  shadow: { delegatesFocus: true },
})
export class BsRadio {
  @Element() el: HTMLElement;

  /** The native radio input's `name` attribute. Passed straight through to the native input inside.
   * NOTE: because each `bs-radio` renders its own shadow root, native `<input type="radio">`
   * mutual-exclusion grouping (which the HTML spec scopes to a single DOM tree) does NOT extend
   * across separate `bs-radio` instances sharing the same `name` -- checking one will not natively
   * uncheck another. Within a single instance this still behaves like a normal radio input. See
   * bs-radio.mdx's Accessibility section for this known gap; consumers building a group currently
   * need to manage mutual exclusivity themselves (e.g. via `bsChange`) until a `bs-radio-group`
   * wrapper exists. */
  @Prop() name: string;

  /** The native radio input's `value` attribute -- read from `event.target.value`, or used when
   * wiring the group up to a form. */
  @Prop() value: string;

  /** Whether the radio is checked. Mutable so clicking the label/input sets it directly. */
  @Prop({ mutable: true, reflect: true }) checked = false;

  /** Disables the radio: sets the native `disabled` attribute, suppresses hover/focus styling, and
   * prevents toggling. */
  @Prop() disabled = false;

  /** Emitted with this radio's own `value` when it becomes checked via user interaction. Since
   * native same-`name` grouping doesn't cross shadow-root boundaries (see the `name` prop's doc),
   * a consumer wiring up a group of `bs-radio`s must itself set `checked = false` on the others in
   * response to this event -- there's no automatic un-checking to rely on here. */
  @Event() bsChange: EventEmitter<string>;

  private onChange = (ev: Event) => {
    const checked = (ev.target as HTMLInputElement).checked;
    this.checked = checked;
    if (checked) {
      this.bsChange.emit(this.value);
    }
  };

  render() {
    return (
      <label class={`bs-radio ${this.disabled ? 'bs-radio--disabled' : ''}`}>
        <input
          class="bs-radio__input"
          type="radio"
          name={this.name}
          value={this.value}
          checked={this.checked}
          disabled={this.disabled}
          onChange={this.onChange}
        />
        <span class="bs-radio__hit-area">
          <span class="bs-radio__state-layer">
            <span part="circle" class={`bs-radio__circle ${this.checked ? 'bs-radio__circle--selected' : ''}`}>
              {this.checked && <span part="dot" class="bs-radio__dot"></span>}
            </span>
          </span>
        </span>
        <span part="label" class="bs-radio__label">
          <slot></slot>
        </span>
      </label>
    );
  }
}
