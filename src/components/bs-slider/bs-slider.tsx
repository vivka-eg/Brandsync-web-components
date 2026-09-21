import { Component, Element, Prop, Event, EventEmitter, h } from '@stencil/core';

export type BsSliderType = 'default' | 'segmented' | 'range';

/**
 * A slider for picking a single numeric value (`type="default"`), a value snapped to evenly
 * spaced ticks (`type="segmented"`), or a min/max pair (`type="range"`) from within a bounded
 * `min`/`max` range.
 *
 * ## When to use
 * - A numeric value that's easiest to reason about relative to its bounds (volume, brightness,
 *   a price range) rather than typed digit-by-digit.
 * - `type="segmented"` when only a fixed number of discrete stops make sense (e.g. a 5-star
 *   rating-like scale) but a visual track is still preferable to discrete buttons.
 * - `type="range"` for picking a min/max pair (e.g. a price range filter) with two thumbs.
 *
 * ## When not to use
 * - A precise value where mis-dragging by a pixel matters more than the at-a-glance bounds --
 *   use `bs-input[type="number"]` instead.
 * - A small, fixed set of mutually exclusive choices -- use a radio group instead.
 *
 * @part label - The "Label" text above the track.
 * @part field - Each editable percentage-value field, shown top-right above the track.
 * @part bound - Each static min/max bound label flanking the track itself.
 * @part track - The background (inactive) track.
 * @part fill - The active/filled portion of the track.
 * @part control - The native range input(s) that drive the knob(s).
 * @part tooltip - The value tooltip shown above a knob while focused/dragging.
 */
// Note: this component's CSS Custom Properties are documented via @prop comments in
// bs-slider.css, not here.
@Component({
  tag: 'bs-slider',
  styleUrl: 'bs-slider.css',
  // delegatesFocus so calling .focus() on the <bs-slider> host reaches the native range input(s)
  // inside -- see bs-button/bs-input/bs-switch for why.
  shadow: { delegatesFocus: true },
})
export class BsSlider {
  @Element() el: HTMLElement;

  /** Which slider shape to render. `range` uses two thumbs (`valueStart`/`valueEnd`); `default`
   * and `segmented` use one thumb (`value`). `segmented` additionally draws `segments` tick marks
   * along the track. */
  @Prop() type: BsSliderType = 'default';

  /** Shows/hides the "Label" text and editable percentage field(s) above the track, and the
   * static min/max bound labels flanking it. When `false`, only the bare track (and its
   * knob/knobs) renders. */
  @Prop() showLabel = true;

  /** Label text shown above the track when `showLabel` is set. */
  @Prop() label = 'Label';

  /** Minimum selectable value, for all `type`s. */
  @Prop() min = 0;

  /** Maximum selectable value, for all `type`s. */
  @Prop() max = 100;

  /** Step size between selectable values. For `type="segmented"`, the effective step is derived
   * from `(max - min) / segments` instead, so the thumb always snaps to a tick. */
  @Prop() step = 1;

  /** Current value for `type="default"`/`type="segmented"`. Ignored for `type="range"` -- use
   * `valueStart`/`valueEnd` instead. Mutable so dragging the thumb updates it directly. */
  @Prop({ mutable: true }) value = 0;

  /** Lower thumb's value for `type="range"`. Defaults to `min` when unset. Mutable so dragging the
   * thumb updates it directly. */
  @Prop({ mutable: true }) valueStart?: number;

  /** Upper thumb's value for `type="range"`. Defaults to `max` when unset. Mutable so dragging the
   * thumb updates it directly. */
  @Prop({ mutable: true }) valueEnd?: number;

  /** Number of equal divisions marked by tick lines along the track, for `type="segmented"` only.
   * The first tick (at the very start of the track) is rendered with `opacity: 0` to keep the
   * tick spacing math consistent while not visually doubling up with the track's own start edge --
   * this matches the design spec, not a bug. */
  @Prop() segments = 10;

  /** Disables the slider: sets the native `disabled` attribute on the range input(s), suppresses
   * hover/focus/drag styling and the value tooltip, and prevents interaction. */
  @Prop() disabled = false;

  /**
   * Accessible name for the slider's native range input(s). Required whenever `showLabel` is
   * `false` (a bare track with no visible "Label" text) -- without it, the internal native
   * `<input>` has no accessible name at all. Setting `aria-label` directly on the `<bs-slider>`
   * host does NOT work for this: that attribute stays on the light-DOM host and is never forwarded
   * into the shadow DOM by the browser. Same pattern/reasoning as `bs-switch`'s and `bs-checkbox`'s
   * identical `ariaLabel` prop. For `type="range"`, this labels the lower-bound thumb; the
   * upper-bound thumb gets `"${ariaLabel} end"` (or `"End value"` when `ariaLabel` is unset).
   */
  @Prop() ariaLabel: string | null = null;

  /** Emitted when `value` changes via user interaction (dragging the thumb, or committing the
   * value field), with the new value. Only fires for `type="default"`/`type="segmented"`. */
  @Event() bsChange: EventEmitter<number>;

  /** Emitted when `valueStart`/`valueEnd` changes via user interaction, with both current values.
   * Only fires for `type="range"`. */
  @Event() bsRangeChange: EventEmitter<{ start: number; end: number }>;

  private get effectiveValueStart(): number {
    return this.valueStart ?? this.min;
  }

  private get effectiveValueEnd(): number {
    return this.valueEnd ?? this.max;
  }

  /** Effective step for the native range input(s): `step` as-is, except for `type="segmented"`,
   * where it's derived from `segments` so the thumb always lands on a tick. */
  private get effectiveStep(): number {
    if (this.type === 'segmented' && this.segments > 0) {
      return (this.max - this.min) / this.segments;
    }
    return this.step;
  }

  private clamp(n: number): number {
    if (Number.isNaN(n)) return this.min;
    return Math.min(this.max, Math.max(this.min, n));
  }

  private percent(value: number): number {
    if (this.max === this.min) return 0;
    return ((value - this.min) / (this.max - this.min)) * 100;
  }

  private onInputChange = (ev: Event) => {
    if (this.disabled) return;
    const next = this.clamp(parseFloat((ev.target as HTMLInputElement).value));
    this.value = next;
    this.bsChange.emit(next);
  };

  private clampPercent(n: number): number {
    if (Number.isNaN(n)) return 0;
    return Math.min(100, Math.max(0, n));
  }

  /** Converts an edited percentage (0-100, from the header field) back to a raw value in
   * min/max units. */
  private fromPercent(pct: number): number {
    return this.min + (this.clampPercent(pct) / 100) * (this.max - this.min);
  }

  private onPercentFieldChange = (ev: Event) => {
    if (this.disabled) return;
    const next = this.clamp(this.fromPercent(parseFloat((ev.target as HTMLInputElement).value)));
    this.value = next;
    this.bsChange.emit(next);
  };

  private onStartInputChange = (ev: Event) => {
    if (this.disabled) return;
    let next = this.clamp(parseFloat((ev.target as HTMLInputElement).value));
    next = Math.min(next, this.effectiveValueEnd);
    this.valueStart = next;
    this.bsRangeChange.emit({ start: next, end: this.effectiveValueEnd });
  };

  private onEndInputChange = (ev: Event) => {
    if (this.disabled) return;
    let next = this.clamp(parseFloat((ev.target as HTMLInputElement).value));
    next = Math.max(next, this.effectiveValueStart);
    this.valueEnd = next;
    this.bsRangeChange.emit({ start: this.effectiveValueStart, end: next });
  };

  private onStartPercentFieldChange = (ev: Event) => {
    if (this.disabled) return;
    let next = this.clamp(this.fromPercent(parseFloat((ev.target as HTMLInputElement).value)));
    next = Math.min(next, this.effectiveValueEnd);
    this.valueStart = next;
    this.bsRangeChange.emit({ start: next, end: this.effectiveValueEnd });
  };

  private onEndPercentFieldChange = (ev: Event) => {
    if (this.disabled) return;
    let next = this.clamp(this.fromPercent(parseFloat((ev.target as HTMLInputElement).value)));
    next = Math.max(next, this.effectiveValueStart);
    this.valueEnd = next;
    this.bsRangeChange.emit({ start: this.effectiveValueStart, end: next });
  };

  /** The editable field shown top-right (or as a pair for `type="range"`), displaying/editing
   * the thumb's position as a rounded 0-100 percentage of min/max -- not the raw value -- per
   * the Figma spec (every state screenshot shows this field suffixed "%", matching the same
   * percentage the tooltip shows while dragging). */
  private renderPercentField(percentValue: number, onChange: (ev: Event) => void, ariaLabel: string) {
    return (
      <span part="field" class="bs-slider__field">
        <input
          type="number"
          class="bs-slider__field-input"
          value={Math.round(this.clampPercent(percentValue))}
          min={0}
          max={100}
          disabled={this.disabled}
          aria-label={ariaLabel}
          onChange={onChange}
        />
        <span class="bs-slider__field-suffix" aria-hidden="true">
          %
        </span>
      </span>
    );
  }

  private renderSegmentedTicks() {
    if (this.type !== 'segmented' || this.segments <= 0) return null;
    // segments+1 ticks (both track ends plus every division), per the Figma spec -- the first
    // tick is invisible (opacity: 0) so the spacing math stays consistent even though it would
    // otherwise sit right on top of the track's own start edge.
    const tickCount = this.segments + 1;
    return (
      <div class="bs-slider__ticks" aria-hidden="true">
        {Array.from({ length: tickCount }).map((_, i) => (
          <span class={`bs-slider__tick ${i === 0 ? 'bs-slider__tick--hidden' : ''}`}></span>
        ))}
      </div>
    );
  }

  private renderSingleThumb() {
    const fillEnd = this.percent(this.value);
    return (
      <div class="bs-slider__track-wrapper" style={{ '--bs-slider-fill-start': '0%', '--bs-slider-fill-end': `${fillEnd}%` }}>
        <div part="track" class="bs-slider__track">
          <div part="fill" class="bs-slider__track-fill"></div>
          {this.renderSegmentedTicks()}
        </div>
        <input
          type="range"
          part="control"
          class="bs-slider__input"
          min={this.min}
          max={this.max}
          step={this.effectiveStep}
          value={this.value}
          disabled={this.disabled}
          aria-label={this.ariaLabel ?? undefined}
          aria-labelledby={!this.ariaLabel && this.showLabel ? 'bs-slider-label' : undefined}
          onInput={this.onInputChange}
          onChange={this.onInputChange}
        />
        <span class="bs-slider__tooltip" part="tooltip" style={{ left: `${fillEnd}%` }} aria-hidden="true">
          {Math.round(this.percent(this.value))}%
        </span>
      </div>
    );
  }

  private renderRangeThumbs() {
    const start = this.effectiveValueStart;
    const end = this.effectiveValueEnd;
    const fillStart = this.percent(start);
    const fillEnd = this.percent(end);
    // Two thumbs can't be done with a single native <input type="range"> -- the CSS spec only
    // gives a range input one thumb. This is the well-known dual-range-slider pattern instead:
    // two overlapping native range inputs, each with a fully transparent track (only their thumb
    // is visible/interactive -- see bs-slider.css's pointer-events rules), plus a separate
    // absolutely-positioned div for the "filled" segment between them.
    //
    // Both inputs sit at the same z-index by default, except whichever thumb is in the upper half
    // of the track gets a higher z-index -- without that, once the two thumbs are close together
    // near one end, only the topmost one is reachable by click, and the topmost one is always the
    // one rendered last (the end thumb) unless we compensate.
    const startOnTop = this.percent(start) > 50;
    return (
      <div class="bs-slider__track-wrapper" style={{ '--bs-slider-fill-start': `${fillStart}%`, '--bs-slider-fill-end': `${fillEnd}%` }}>
        <div part="track" class="bs-slider__track">
          <div part="fill" class="bs-slider__track-fill"></div>
        </div>
        <input
          type="range"
          part="control"
          class="bs-slider__input bs-slider__input--start"
          style={{ zIndex: startOnTop ? '4' : '3' }}
          min={this.min}
          max={this.max}
          step={this.step}
          value={start}
          disabled={this.disabled}
          aria-label={this.ariaLabel ?? 'Start value'}
          onInput={this.onStartInputChange}
          onChange={this.onStartInputChange}
        />
        <input
          type="range"
          part="control"
          class="bs-slider__input bs-slider__input--end"
          style={{ zIndex: startOnTop ? '3' : '4' }}
          min={this.min}
          max={this.max}
          step={this.step}
          value={end}
          disabled={this.disabled}
          aria-label={this.ariaLabel ? `${this.ariaLabel} end` : 'End value'}
          onInput={this.onEndInputChange}
          onChange={this.onEndInputChange}
        />
        <span class="bs-slider__tooltip bs-slider__tooltip--start" part="tooltip" style={{ left: `${fillStart}%` }} aria-hidden="true">
          {Math.round(this.percent(start))}%
        </span>
        <span class="bs-slider__tooltip bs-slider__tooltip--end" part="tooltip" style={{ left: `${fillEnd}%` }} aria-hidden="true">
          {Math.round(this.percent(end))}%
        </span>
      </div>
    );
  }

  render() {
    const isRange = this.type === 'range';
    const rootClasses = ['bs-slider', this.disabled ? 'bs-slider--disabled' : ''].filter(Boolean).join(' ');

    return (
      <div class={rootClasses}>
        {this.showLabel && (
          <div class="bs-slider__header">
            <span id="bs-slider-label" part="label" class="bs-slider__label">
              {this.label}
            </span>
            {isRange ? (
              <span class="bs-slider__value-fields">
                {this.renderPercentField(
                  this.percent(this.effectiveValueStart),
                  this.onStartPercentFieldChange,
                  this.ariaLabel ?? 'Start value',
                )}
                <span class="bs-slider__separator">–</span>
                {this.renderPercentField(
                  this.percent(this.effectiveValueEnd),
                  this.onEndPercentFieldChange,
                  this.ariaLabel ? `${this.ariaLabel} end` : 'End value',
                )}
              </span>
            ) : (
              this.renderPercentField(this.percent(this.value), this.onPercentFieldChange, this.ariaLabel ? `${this.ariaLabel} value` : 'Value')
            )}
          </div>
        )}
        <div class="bs-slider__row">
          {this.showLabel && (
            <span part="bound" class="bs-slider__bound">
              {this.min}
            </span>
          )}
          {isRange ? this.renderRangeThumbs() : this.renderSingleThumb()}
          {this.showLabel && (
            <span part="bound" class="bs-slider__bound">
              {this.max}
            </span>
          )}
        </div>
      </div>
    );
  }
}
