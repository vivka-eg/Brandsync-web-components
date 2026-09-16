import { Component, Element, Prop, State, Event, EventEmitter, Listen, h } from '@stencil/core';

/**
 * A single-line text field with an optional label, description, and error state. Also covers a
 * range of related "field" shapes (number stepper, password reveal, date, dropdown trigger,
 * select, textarea, chip input, initials, country, and pin) via the `type` prop, since they all
 * share the same label/description/error/icon-slot chrome.
 *
 * ## When to use
 * - Collecting a single line of free-text, email, password, or numeric input.
 * - Any of the other supported `type`s (search, date, dropdown, select, textarea, chip, initials,
 *   country, pin) that share this component's label/description/error chrome.
 * - Pair with `error` for inline validation feedback tied to that specific field.
 *
 * ## When not to use
 * - A fixed set of choices best served by a dedicated radio/checkbox group rather than a single
 *   field. `type="select"` (native `<select>`) and `type="dropdown"` (a `bs-menu` of
 *   `bs-menu-item`s from the `options` prop) cover the field-shaped cases; `type="chip"` has no
 *   options list at all (freeform chip entry).
 *
 * @slot icon - Optional leading icon, rendered before the native control (e.g. a mail icon for an
 *   email field). For `type="search"`, the slot is used if provided, otherwise a default
 *   magnifying-glass icon is shown.
 * @slot end-icon - Optional trailing icon, rendered after the native control (e.g. a chevron for a
 *   field that opens a picker). Ignored when `type` is `number` (stepper buttons), `password` (show/hide
 *   toggle), or `dropdown` (chevron) -- those types always render their own trailing control there.
 *   For `type="date"`, the slot is used if provided, otherwise a default calendar icon is shown.
 * @part field - The bordered field wrapper containing the icon(s) and native control(s).
 * @part menu - The `bs-menu` rendered below the field for `type="dropdown"` when `open` and
 *   `options` is non-empty.
 * @part label - The `<label>` element.
 * @part required - The red `*` rendered after the label text when `required` is set.
 * @part icon - The leading icon wrapper element.
 * @part control - The native control element (`<input>`, `<select>`, or `<textarea>` depending on
 *   `type`). Composite types (`initials`, `country`) render this part on more than one element.
 * @part end-icon - The trailing icon wrapper element.
 * @part chip - A single chip pill, when `type="chip"`.
 * @part description - The helper text element (hidden when `error` is set).
 * @part error - The error message element.
 * @part error-icon - The warning icon shown before the error message.
 */
// Note: this component's CSS Custom Properties (--bs-input-*) are documented via @prop comments
// in bs-input.css, not here -- Stencil's docs generator only parses @prop out of CSS file
// comments (see stencil.js's parseStyleDocs/parseCssComment), not the class-level JSDoc.
@Component({
  tag: 'bs-input',
  styleUrl: 'bs-input.css',
  // delegatesFocus so calling .focus() on the <bs-input> host (e.g. focusing a field with a
  // validation error) actually reaches the native control inside -- see bs-button for why.
  shadow: { delegatesFocus: true },
})
export class BsInput {
  @Element() el: HTMLElement;

  /** Current value. Native `input`/`change` events don't cross the Shadow DOM boundary, so this
   * component re-dispatches them as `bsInput`/`bsChange` custom events instead. Mutable so the
   * `number` type's stepper buttons can update it directly. */
  @Prop({ mutable: true }) value = '';

  @Prop() type:
    | 'text'
    | 'email'
    | 'password'
    | 'number'
    | 'search'
    | 'date'
    | 'dropdown'
    | 'select'
    | 'textarea'
    | 'chip'
    | 'initials'
    | 'country'
    | 'pin' = 'text';
  @Prop() label?: string;
  @Prop() placeholder?: string;
  @Prop() description?: string;
  @Prop() error?: string;
  @Prop() disabled = false;

  /** Marks the field as required: renders a red `*` after the label and sets `aria-required="true"`
   * on the control. Applies regardless of `type`. */
  @Prop() required = false;

  /** Step size for `type="number"`'s increment/decrement stepper buttons. */
  @Prop() step = 1;
  /** Minimum value for `type="number"`'s stepper buttons. */
  @Prop() min?: number;
  /** Maximum value for `type="number"`'s stepper buttons. */
  @Prop() max?: number;

  /** Options for `type="select"` (rendered as native `<option>`s) and `type="dropdown"` (rendered
   * as a `bs-menu` of `bs-menu-item`s when `open`). Must be set as a JS property, not an HTML
   * attribute -- see CONVENTIONS.md's non-string props rule. */
  @Prop() options: { label: string; value: string }[] = [];

  /** Number of visible rows for `type="textarea"`. */
  @Prop() rows = 3;

  /** Current chips for `type="chip"`. Must be set as a JS property, not an HTML attribute -- see
   * CONVENTIONS.md's non-string props rule. */
  @Prop() chips: string[] = [];

  /** Title select options for `type="initials"` (e.g. `['Mrs.', 'Mr.', 'Dr.']`). Must be set as a
   * JS property, not an HTML attribute -- see CONVENTIONS.md's non-string props rule. */
  @Prop() titleOptions: string[] = [];
  /** Current selected title for `type="initials"`. Named `initialsTitle` rather than `title` --
   * `title` is a reserved standard HTML attribute (tooltip text) inherited by every element, and
   * Stencil warns against shadowing it with a component `@Prop`. */
  @Prop() initialsTitle = '';

  /** Country select options for `type="country"`. Must be set as a JS property, not an HTML
   * attribute -- see CONVENTIONS.md's non-string props rule. */
  @Prop() countryOptions: { code: string; label: string; flagIcon?: string }[] = [];
  /** Current selected country code for `type="country"`. */
  @Prop() country = '';

  /** Number of cells for `type="pin"`. */
  @Prop() length = 4;

  /** Whether the `type="dropdown"` trigger is open. Reflects to an attribute so consumers can style
   * an open state via CSS. When `options` is non-empty, this also controls whether the `bs-menu`
   * of `bs-menu-item`s is rendered below the field. */
  @Prop({ mutable: true, reflect: true }) open = false;

  @Event() bsInput: EventEmitter<string>;
  @Event() bsChange: EventEmitter<string>;
  /** Emitted when `type="dropdown"`'s trigger is toggled. See `open`'s doc comment for this type's
   * shell-only limitation. */
  @Event() bsOpen: EventEmitter<boolean>;
  /** Emitted when a chip is committed (Enter pressed in the draft input) for `type="chip"`. */
  @Event() bsChipAdd: EventEmitter<string>;
  /** Emitted when a chip's remove button is clicked for `type="chip"`. */
  @Event() bsChipRemove: EventEmitter<string>;
  /** Emitted when the title `<select>` changes for `type="initials"`. */
  @Event() bsTitleChange: EventEmitter<string>;
  /** Emitted when the country `<select>` changes for `type="country"`. */
  @Event() bsCountryChange: EventEmitter<string>;

  /** Tracks whether the `icon` slot has assigned content, so the leading icon wrapper only takes
   * up space in the field when there's actually an icon (same pattern as `bs-button`). */
  @State() hasIcon = false;

  /** Tracks whether the `end-icon` slot has assigned content, so the trailing icon wrapper only
   * takes up space in the field when there's actually a trailing icon. */
  @State() hasEndIcon = false;

  /** Whether `type="password"`'s native input is currently rendered as `type="text"` (revealed). The
   * `type` prop itself stays `'password'` -- this only toggles the rendered native input's type. */
  @State() passwordVisible = false;

  /** Draft text for `type="chip"`'s trailing input, committed to a chip on Enter. */
  @State() chipDraft = '';

  private pinInputs: HTMLInputElement[] = [];

  /** Computes the initial `hasIcon`/`hasEndIcon` state directly from the host's light DOM
   * children, before first render -- see `bs-button`'s `componentWillLoad` for why `slotchange`
   * alone isn't enough for a slot that starts (and stays) empty. */
  componentWillLoad() {
    this.hasIcon = this.hasSlottedContent('icon');
    this.hasEndIcon = this.hasSlottedContent('end-icon');
  }

  private hasSlottedContent(slotName: string): boolean {
    return Array.from(this.el.childNodes).some(
      node => node.nodeType === Node.ELEMENT_NODE && (node as Element).getAttribute('slot') === slotName,
    );
  }

  private onIconSlotchange = (ev: Event) => {
    this.hasIcon = (ev.target as HTMLSlotElement).assignedNodes().length > 0;
  };

  private onEndIconSlotchange = (ev: Event) => {
    this.hasEndIcon = (ev.target as HTMLSlotElement).assignedNodes().length > 0;
  };

  private onInput = (ev: InputEvent) => {
    const value = (ev.target as HTMLInputElement).value;
    this.bsInput.emit(value);
  };

  private onChange = (ev: Event) => {
    const value = (ev.target as HTMLInputElement).value;
    this.bsChange.emit(value);
  };

  private clampNumber(n: number): number {
    if (this.min !== undefined && n < this.min) n = this.min;
    if (this.max !== undefined && n > this.max) n = this.max;
    return n;
  }

  private onStepperIncrement = () => {
    if (this.disabled) return;
    const next = this.clampNumber((parseFloat(this.value) || 0) + this.step);
    this.value = String(next);
    this.bsChange.emit(this.value);
  };

  private onStepperDecrement = () => {
    if (this.disabled) return;
    const next = this.clampNumber((parseFloat(this.value) || 0) - this.step);
    this.value = String(next);
    this.bsChange.emit(this.value);
  };

  private onTogglePasswordVisibility = () => {
    this.passwordVisible = !this.passwordVisible;
  };

  private onDropdownToggle = () => {
    if (this.disabled) return;
    this.open = !this.open;
    this.bsOpen.emit(this.open);
  };

  private onDropdownKeydown = (ev: KeyboardEvent) => {
    if (ev.key === 'Enter' || ev.key === ' ') {
      ev.preventDefault();
      this.onDropdownToggle();
    }
  };

  private onDropdownOptionSelect = (option: { label: string; value: string }) => () => {
    this.value = option.label;
    this.open = false;
    this.bsChange.emit(this.value);
  };

  /** Closes the `type="dropdown"` menu on Escape, from anywhere within the component (host is the
   * default @Listen target, and both keydown from the native control and from `bs-menu-item`
   * buttons bubble/compose up to it). */
  @Listen('keydown')
  onHostKeydown(ev: KeyboardEvent) {
    if (this.type === 'dropdown' && this.open && ev.key === 'Escape') {
      this.open = false;
    }
  }

  /** Closes the `type="dropdown"` menu once focus leaves the component entirely (e.g. Tab away, or
   * a click outside that moves focus elsewhere) -- `focusout` is composed, so it bubbles across
   * the `bs-menu-item` shadow boundary too. */
  @Listen('focusout')
  onHostFocusOut(ev: FocusEvent) {
    if (this.type !== 'dropdown' || !this.open) return;
    const related = ev.relatedTarget as Node | null;
    if (!related || !this.el.contains(related)) {
      this.open = false;
    }
  }

  private onChipDraftInput = (ev: InputEvent) => {
    this.chipDraft = (ev.target as HTMLInputElement).value;
  };

  private onChipDraftKeydown = (ev: KeyboardEvent) => {
    if (ev.key === 'Enter') {
      ev.preventDefault();
      const value = this.chipDraft.trim();
      if (value) {
        this.bsChipAdd.emit(value);
        this.chipDraft = '';
      }
    }
  };

  private onChipRemove = (chip: string) => () => {
    this.bsChipRemove.emit(chip);
  };

  private onTitleChange = (ev: Event) => {
    this.bsTitleChange.emit((ev.target as HTMLSelectElement).value);
  };

  private onCountryChange = (ev: Event) => {
    this.bsCountryChange.emit((ev.target as HTMLSelectElement).value);
  };

  private onPinInput = (index: number) => (ev: InputEvent) => {
    const input = ev.target as HTMLInputElement;
    let value = input.value;
    if (value.length > 1) {
      value = value.slice(-1);
      input.value = value;
    }
    if (value && index < this.length - 1) {
      this.pinInputs[index + 1]?.focus();
    }
    this.bsChange.emit(this.pinInputs.map(i => i?.value ?? '').join(''));
  };

  private onPinKeydown = (index: number) => (ev: KeyboardEvent) => {
    if (ev.key === 'Backspace' && !(ev.target as HTMLInputElement).value && index > 0) {
      this.pinInputs[index - 1]?.focus();
    }
  };

  private get showsEndIconArea(): boolean {
    return (
      this.type === 'number' || this.type === 'password' || this.type === 'dropdown' || this.type === 'date' || this.hasEndIcon
    );
  }

  private get showsIconArea(): boolean {
    return (this.type === 'search' && !this.hasIcon) || this.hasIcon;
  }

  private renderIconContent() {
    if (this.type === 'search' && !this.hasIcon) {
      return (
        <svg class="bs-input__search-icon" viewBox="0 0 16 16" fill="none" aria-hidden="true">
          <circle cx="7" cy="7" r="5" stroke="currentColor" stroke-width="1.3" />
          <path d="M11 11L14.5 14.5" stroke="currentColor" stroke-width="1.3" stroke-linecap="round" />
        </svg>
      );
    }

    return <slot name="icon" onSlotchange={this.onIconSlotchange}></slot>;
  }

  private renderEndIconContent() {
    if (this.type === 'number') {
      return (
        <span class="bs-input__stepper">
          <button
            type="button"
            part="control"
            class="bs-input__stepper-btn"
            aria-label="Increment"
            tabIndex={-1}
            disabled={this.disabled}
            onClick={this.onStepperIncrement}
          >
            <svg viewBox="0 0 10 6" width="10" height="6" aria-hidden="true">
              <path d="M1 5L5 1L9 5" stroke="currentColor" stroke-width="1.3" fill="none" stroke-linecap="round" stroke-linejoin="round" />
            </svg>
          </button>
          <button
            type="button"
            part="control"
            class="bs-input__stepper-btn"
            aria-label="Decrement"
            tabIndex={-1}
            disabled={this.disabled}
            onClick={this.onStepperDecrement}
          >
            <svg viewBox="0 0 10 6" width="10" height="6" aria-hidden="true">
              <path d="M1 1L5 5L9 1" stroke="currentColor" stroke-width="1.3" fill="none" stroke-linecap="round" stroke-linejoin="round" />
            </svg>
          </button>
        </span>
      );
    }

    if (this.type === 'password') {
      return (
        <button
          type="button"
          part="control"
          class="bs-input__password-toggle"
          aria-label={this.passwordVisible ? 'Hide password' : 'Show password'}
          disabled={this.disabled}
          onClick={this.onTogglePasswordVisibility}
        >
          {this.passwordVisible ? (
            <svg viewBox="0 0 16 16" fill="none" aria-hidden="true">
              <path
                d="M1 8C2.2 5.5 4.9 3 8 3C11.1 3 13.8 5.5 15 8C13.8 10.5 11.1 13 8 13C4.9 13 2.2 10.5 1 8Z"
                stroke="currentColor"
                stroke-width="1.2"
                stroke-linejoin="round"
              />
              <circle cx="8" cy="8" r="2" stroke="currentColor" stroke-width="1.2" />
              <path d="M2 2L14 14" stroke="currentColor" stroke-width="1.2" stroke-linecap="round" />
            </svg>
          ) : (
            <svg viewBox="0 0 16 16" fill="none" aria-hidden="true">
              <path
                d="M1 8C2.2 5.5 4.9 3 8 3C11.1 3 13.8 5.5 15 8C13.8 10.5 11.1 13 8 13C4.9 13 2.2 10.5 1 8Z"
                stroke="currentColor"
                stroke-width="1.2"
                stroke-linejoin="round"
              />
              <circle cx="8" cy="8" r="2" stroke="currentColor" stroke-width="1.2" />
            </svg>
          )}
        </button>
      );
    }

    if (this.type === 'dropdown') {
      return (
        <svg class="bs-input__chevron" viewBox="0 0 16 16" fill="none" aria-hidden="true">
          <path d="M4 6L8 10L12 6" stroke="currentColor" stroke-width="1.3" stroke-linecap="round" stroke-linejoin="round" />
        </svg>
      );
    }

    if (this.type === 'date' && !this.hasEndIcon) {
      return (
        <svg class="bs-input__calendar" viewBox="0 0 16 16" fill="none" aria-hidden="true">
          <rect x="2" y="3" width="12" height="11" rx="1" stroke="currentColor" stroke-width="1.2" />
          <path d="M2 6.5H14" stroke="currentColor" stroke-width="1.2" />
          <path d="M5 1.5V4M11 1.5V4" stroke="currentColor" stroke-width="1.2" stroke-linecap="round" />
        </svg>
      );
    }

    return <slot name="end-icon" onSlotchange={this.onEndIconSlotchange}></slot>;
  }

  private renderStandardControl() {
    const nativeType = this.type === 'password' ? (this.passwordVisible ? 'text' : 'password') : this.type === 'dropdown' ? 'text' : this.type;
    return (
      <input
        id="control"
        part="control"
        class="bs-input__control"
        type={nativeType}
        value={this.value}
        placeholder={this.placeholder}
        disabled={this.disabled}
        readOnly={this.type === 'dropdown'}
        min={this.type === 'number' ? this.min : undefined}
        max={this.type === 'number' ? this.max : undefined}
        step={this.type === 'number' ? this.step : undefined}
        aria-describedby={this.error || this.description ? 'description-or-error' : undefined}
        aria-invalid={this.error ? 'true' : undefined}
        aria-required={this.required ? 'true' : undefined}
        onInput={this.onInput}
        onChange={this.onChange}
      />
    );
  }

  private renderSelectControl() {
    return (
      <select
        id="control"
        part="control"
        class="bs-input__control"
        disabled={this.disabled}
        aria-describedby={this.error || this.description ? 'description-or-error' : undefined}
        aria-invalid={this.error ? 'true' : undefined}
        aria-required={this.required ? 'true' : undefined}
        onInput={this.onInput}
        onChange={this.onChange}
      >
        {this.options.map(opt => (
          <option value={opt.value} selected={opt.value === this.value}>
            {opt.label}
          </option>
        ))}
      </select>
    );
  }

  private renderTextareaControl() {
    return (
      <textarea
        id="control"
        part="control"
        class="bs-input__control bs-input__control--textarea"
        rows={this.rows}
        value={this.value}
        placeholder={this.placeholder}
        disabled={this.disabled}
        aria-describedby={this.error || this.description ? 'description-or-error' : undefined}
        aria-invalid={this.error ? 'true' : undefined}
        aria-required={this.required ? 'true' : undefined}
        onInput={this.onInput}
        onChange={this.onChange}
      ></textarea>
    );
  }

  private renderChipControl() {
    return (
      <div class="bs-input__chips">
        {this.chips.map(chip => (
          <span part="chip" class="bs-input__chip">
            {chip}
            <button type="button" class="bs-input__chip-remove" aria-label={`Remove ${chip}`} onClick={this.onChipRemove(chip)}>
              ×
            </button>
          </span>
        ))}
        <input
          id="control"
          part="control"
          class="bs-input__control bs-input__chip-input"
          type="text"
          value={this.chipDraft}
          placeholder={this.placeholder}
          disabled={this.disabled}
          aria-required={this.required ? 'true' : undefined}
          onInput={this.onChipDraftInput}
          onKeyDown={this.onChipDraftKeydown}
        />
      </div>
    );
  }

  private renderInitialsControl() {
    return [
      <select
        part="control"
        class="bs-input__control bs-input__title-select"
        disabled={this.disabled}
        onChange={this.onTitleChange}
      >
        {this.titleOptions.map(opt => (
          <option value={opt} selected={opt === this.initialsTitle}>
            {opt}
          </option>
        ))}
      </select>,
      <input
        id="control"
        part="control"
        class="bs-input__control"
        type="text"
        value={this.value}
        placeholder={this.placeholder}
        disabled={this.disabled}
        aria-required={this.required ? 'true' : undefined}
        onInput={this.onInput}
        onChange={this.onChange}
      />,
    ];
  }

  private renderCountryControl() {
    return [
      <select
        part="control"
        class="bs-input__control bs-input__country-select"
        disabled={this.disabled}
        onChange={this.onCountryChange}
      >
        {this.countryOptions.map(opt => (
          <option value={opt.code} selected={opt.code === this.country}>
            {opt.flagIcon ? `${opt.flagIcon} ` : ''}
            {opt.code} {opt.label}
          </option>
        ))}
      </select>,
      <input
        id="control"
        part="control"
        class="bs-input__control"
        type="text"
        value={this.value}
        placeholder={this.placeholder}
        disabled={this.disabled}
        aria-required={this.required ? 'true' : undefined}
        onInput={this.onInput}
        onChange={this.onChange}
      />,
    ];
  }

  private renderControl() {
    switch (this.type) {
      case 'select':
        return this.renderSelectControl();
      case 'textarea':
        return this.renderTextareaControl();
      case 'chip':
        return this.renderChipControl();
      case 'initials':
        return this.renderInitialsControl();
      case 'country':
        return this.renderCountryControl();
      default:
        return this.renderStandardControl();
    }
  }

  private renderField() {
    const fieldClasses = [
      'bs-input__field',
      this.error ? 'bs-input__field--error' : '',
      this.disabled ? 'bs-input__field--disabled' : '',
      this.type === 'textarea' ? 'bs-input__field--textarea' : '',
      this.type === 'chip' ? 'bs-input__field--chip' : '',
    ]
      .filter(Boolean)
      .join(' ');

    const isDropdown = this.type === 'dropdown';
    return (
      <div class="bs-input__field-wrapper">
        <div
          part="field"
          class={fieldClasses}
          onClick={isDropdown ? this.onDropdownToggle : undefined}
          onKeyDown={isDropdown ? this.onDropdownKeydown : undefined}
          aria-haspopup={isDropdown ? 'listbox' : undefined}
          aria-expanded={isDropdown ? String(this.open) : undefined}
        >
          <span part="icon" class={`bs-input__icon ${this.showsIconArea ? 'bs-input__icon--visible' : ''}`}>
            {this.renderIconContent()}
          </span>
          {this.renderControl()}
          <span part="end-icon" class={`bs-input__end-icon ${this.showsEndIconArea ? 'bs-input__end-icon--visible' : ''}`}>
            {this.renderEndIconContent()}
          </span>
        </div>
        {isDropdown && this.open && this.options.length > 0 && (
          <bs-menu part="menu" class="bs-input__dropdown-menu" role="listbox">
            {this.options.map(option => (
              <bs-menu-item key={option.value} onBsSelect={this.onDropdownOptionSelect(option)}>
                {option.label}
              </bs-menu-item>
            ))}
          </bs-menu>
        )}
      </div>
    );
  }

  private renderPinField() {
    this.pinInputs = [];
    return (
      <div part="field" class={`bs-input__field bs-input__field--pin ${this.disabled ? 'bs-input__field--disabled' : ''}`}>
        {Array.from({ length: this.length }).map((_, i) => (
          <input
            id={i === 0 ? 'control' : undefined}
            ref={el => (this.pinInputs[i] = el as HTMLInputElement)}
            part="control"
            class="bs-input__pin-cell"
            type="text"
            inputMode="numeric"
            maxLength={1}
            value={this.value[i] ?? ''}
            disabled={this.disabled}
            aria-required={this.required ? 'true' : undefined}
            onInput={this.onPinInput(i)}
            onKeyDown={this.onPinKeydown(i)}
          />
        ))}
      </div>
    );
  }

  render() {
    return (
      <div class={`bs-input ${this.error ? 'bs-input--error' : ''}`}>
        {this.label && (
          // "control" is a fixed id, not a generated one -- safe because Shadow DOM scopes ids
          // to this instance's own shadow root, so it can never collide with another bs-input.
          <label part="label" class="bs-input__label" htmlFor="control">
            {this.label}
            {this.required && (
              <span part="required" class="bs-input__required" aria-hidden="true">
                *
              </span>
            )}
          </label>
        )}
        {this.type === 'pin' ? this.renderPinField() : this.renderField()}
        {this.error ? (
          <span id="description-or-error" part="error" class="bs-input__error">
            <svg part="error-icon" class="bs-input__error-icon" viewBox="0 0 16 16" fill="none" aria-hidden="true">
              <circle cx="8" cy="8" r="6.5" stroke="currentColor" stroke-width="1.2" />
              <path d="M8 5V8.5" stroke="currentColor" stroke-width="1.2" stroke-linecap="round" />
              <circle cx="8" cy="11" r="0.75" fill="currentColor" />
            </svg>
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
