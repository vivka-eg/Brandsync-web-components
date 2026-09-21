import { Component, Element, Prop, Event, EventEmitter, h } from '@stencil/core';

export type BsSwitchSize = 'md' | 'lg';

/**
 * A toggle switch for an on/off setting that takes effect immediately (no explicit form
 * submission required).
 *
 * ## When to use
 * - A binary setting that applies right away (e.g. "Enable notifications", "Dark mode").
 *
 * ## When not to use
 * - A binary choice that's part of a form submitted later, or one item within a group of
 *   independent choices -- use `bs-checkbox` instead.
 * - A single mutually-exclusive choice from a set -- use a radio group instead.
 *
 * @slot - Default slot: the label text.
 * @part track - The visual pill-shaped track.
 * @part knob - The sliding circular knob.
 * @part label - The label text wrapper.
 */
// Note: this component's CSS Custom Properties are documented via @prop comments in
// bs-switch.css, not here.
@Component({
  tag: 'bs-switch',
  styleUrl: 'bs-switch.css',
  // delegatesFocus so calling .focus() on the <bs-switch> host reaches the native input inside --
  // see bs-button/bs-input for why.
  shadow: { delegatesFocus: true },
})
export class BsSwitch {
  @Element() el: HTMLElement;

  /** Sizing scale. Controls the track's width/height and the knob's diameter. */
  @Prop() size: BsSwitchSize = 'lg';

  /** Whether the switch is on. Mutable so clicking the label/input toggles it directly, and
   * reflected so consumers can target `bs-switch[checked]` via CSS. */
  @Prop({ mutable: true, reflect: true }) checked = false;

  /** Disables the switch: sets the native `disabled` attribute, suppresses hover/focus styling,
   * and prevents toggling. */
  @Prop() disabled = false;

  /**
   * Accessible name for the switch. Required whenever the default (label) slot is empty (e.g. a
   * bare "enabled" switch in a table row) -- without it, the internal native `<input>` has no
   * accessible name at all. Setting `aria-label` directly on the `<bs-switch>` host does NOT
   * work for this: that attribute stays on the light-DOM host and is never forwarded into the
   * shadow DOM by the browser, so the actual focusable element (the native `<input>` inside) stays
   * nameless. This prop exists specifically to bridge that gap -- same pattern as `bs-button`'s and
   * `bs-checkbox`'s identical `ariaLabel` prop, both of which explicitly bind it onto their own
   * internal focusable element for the same reason.
   */
  @Prop() ariaLabel: string | null = null;

  /** Emitted when the checked state changes via user interaction, with the new `checked` value. */
  @Event() bsChange: EventEmitter<boolean>;

  private onChange = (ev: Event) => {
    const checked = (ev.target as HTMLInputElement).checked;
    this.checked = checked;
    this.bsChange.emit(checked);
  };

  render() {
    const trackClasses = [
      'bs-switch__track',
      `bs-switch__track--${this.size}`,
      this.checked ? 'bs-switch__track--checked' : '',
      this.disabled ? 'bs-switch__track--disabled' : '',
    ]
      .filter(Boolean)
      .join(' ');

    const knobClasses = ['bs-switch__knob', `bs-switch__knob--${this.size}`, this.disabled ? 'bs-switch__knob--disabled' : '']
      .filter(Boolean)
      .join(' ');

    return (
      <label class={`bs-switch ${this.disabled ? 'bs-switch--disabled' : ''}`}>
        <input
          class="bs-switch__input"
          type="checkbox"
          role="switch"
          checked={this.checked}
          disabled={this.disabled}
          aria-checked={String(this.checked)}
          aria-label={this.ariaLabel}
          onChange={this.onChange}
        />
        <span part="track" class={trackClasses}>
          <span part="knob" class={knobClasses}></span>
        </span>
        <span part="label" class="bs-switch__label">
          <slot></slot>
        </span>
      </label>
    );
  }
}
