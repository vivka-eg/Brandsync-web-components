import { Component, Prop, Event, EventEmitter, h } from '@stencil/core';

/**
 * A single-line text field with an optional label, description, and error state.
 *
 * ## When to use
 * - Collecting a single line of free-text, email, password, or numeric input.
 * - Pair with `error` for inline validation feedback tied to that specific field.
 *
 * ## When not to use
 * - Multi-line text — this component has no `textarea` mode.
 * - A fixed set of choices — use a select/radio/checkbox component instead of free text.
 *
 * @part label - The `<label>` element.
 * @part control - The native `<input>` element.
 * @part description - The helper text element (hidden when `error` is set).
 * @part error - The error message element.
 */
@Component({
  tag: 'bs-input',
  styleUrl: 'bs-input.css',
  // delegatesFocus so calling .focus() on the <bs-input> host (e.g. focusing a field with a
  // validation error) actually reaches the native <input> inside -- see bs-button for why.
  shadow: { delegatesFocus: true },
})
export class BsInput {
  /** Current value. Native `input`/`change` events don't cross the Shadow DOM boundary, so this
   * component re-dispatches them as `bsInput`/`bsChange` custom events instead. */
  @Prop() value = '';

  @Prop() type: 'text' | 'email' | 'password' | 'number' = 'text';
  @Prop() label?: string;
  @Prop() placeholder?: string;
  @Prop() description?: string;
  @Prop() error?: string;
  @Prop() disabled = false;

  @Event() bsInput: EventEmitter<string>;
  @Event() bsChange: EventEmitter<string>;

  private onInput = (ev: InputEvent) => {
    const value = (ev.target as HTMLInputElement).value;
    this.bsInput.emit(value);
  };

  private onChange = (ev: Event) => {
    const value = (ev.target as HTMLInputElement).value;
    this.bsChange.emit(value);
  };

  render() {
    return (
      <div class={`bs-input ${this.error ? 'bs-input--error' : ''}`}>
        {this.label && (
          // "control" is a fixed id, not a generated one -- safe because Shadow DOM scopes ids
          // to this instance's own shadow root, so it can never collide with another bs-input.
          <label part="label" class="bs-input__label" htmlFor="control">
            {this.label}
          </label>
        )}
        <input
          id="control"
          part="control"
          class="bs-input__control"
          type={this.type}
          value={this.value}
          placeholder={this.placeholder}
          disabled={this.disabled}
          aria-describedby={this.error || this.description ? 'description-or-error' : undefined}
          aria-invalid={this.error ? 'true' : undefined}
          onInput={this.onInput}
          onChange={this.onChange}
        />
        {this.error ? (
          <span id="description-or-error" part="error" class="bs-input__error">
            {this.error}
          </span>
        ) : this.description ? (
          <span id="description-or-error" part="description" class="bs-input__description">
            {this.description}
          </span>
        ) : null}
      </div>
    );
  }
}
