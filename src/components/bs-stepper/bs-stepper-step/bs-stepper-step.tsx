import { Component, Host, Prop, h } from '@stencil/core';

export type BsStepperStepComputedState = 'enabled' | 'current' | 'done';
export type BsStepperStepState = BsStepperStepComputedState | 'error' | 'disabled';
export type BsStepperDirection = 'horizontal' | 'vertical';

/**
 * A single step within a `<bs-stepper>` sequence: an icon/indicator plus a name and optional
 * description, connected to the next step by a trailing rail.
 *
 * `computedState` is set automatically by the parent `<bs-stepper>` based on this step's position
 * relative to its `currentStep` (before it = "done", at it = "current", after it = "enabled") --
 * same "container pushes state onto its slotted children" pattern `bs-tabs` uses for `selected`
 * and `bs-breadcrumbs` uses for `size`. This step's own `error`/`disabled` props, when set directly
 * by the consumer, override that computed value -- e.g. a step before `currentStep` would normally
 * read as "done", but `error` on that step wins regardless.
 *
 * The trailing rail is owned by this component, not the container: `:host(:last-child)` hides it
 * on whichever step is visually last, mirroring `bs-breadcrumb`'s own `:host(:first-child)` rule
 * for its leading separator (same technique, opposite end -- see that component for why pure DOM
 * position, not CSS `:last-of-type`, is what actually needs checking here too).
 *
 * ## When to use
 * - As a child of `<bs-stepper>`, one per step in the sequence.
 *
 * ## When not to use
 * - Standalone, outside a `<bs-stepper>` wrapper -- `computedState`/`direction`/`showDescription`
 *   depend on that parent propagating them; alone, this defaults to `enabled`/`horizontal`/`true`.
 *
 * @slot - None: `name`/`description` fully drive the label content.
 * @part icon - The icon/indicator wrapper.
 * @part label - The name+description wrapper.
 * @part name - The name text.
 * @part description - The description text (only rendered when `showDescription` is true and
 * `description` is set).
 * @part connector - The trailing rail segment (not rendered on the last step).
 */
@Component({
  tag: 'bs-stepper-step',
  styleUrl: 'bs-stepper-step.css',
  shadow: true,
})
export class BsStepperStep {
  /** This step's name/title. */
  @Prop() name = '';

  /** Optional supporting text below the name. Only rendered when `showDescription` (propagated
   * from the parent `<bs-stepper>`) is also true. */
  @Prop() description?: string;

  /** Shows the error treatment for this step, regardless of its `computedState`. */
  @Prop() error = false;

  /** Shows the disabled treatment for this step, regardless of its `computedState`. Takes priority
   * over `error` if both are somehow set. */
  @Prop() disabled = false;

  /** Set automatically by the parent `<bs-stepper>` from this step's position relative to its
   * `currentStep` -- see the class doc above. Can be set directly for a standalone step. */
  @Prop() computedState: BsStepperStepComputedState = 'enabled';

  /** Set automatically by the parent `<bs-stepper>`, propagated to every slotted step. */
  @Prop() direction: BsStepperDirection = 'horizontal';

  /** Set automatically by the parent `<bs-stepper>`, propagated to every slotted step. */
  @Prop() showDescription = true;

  private get state(): BsStepperStepState {
    if (this.disabled) return 'disabled';
    if (this.error) return 'error';
    return this.computedState;
  }

  render() {
    const state = this.state;

    return (
      <Host role="listitem" class={`bs-stepper-step--${this.direction}`}>
        <div class="bs-stepper-step__top">
          <span part="icon" class={`bs-stepper-step__icon bs-stepper-step__icon--${state}`}>
            {state === 'current' && <span class="bs-stepper-step__icon-dot"></span>}
            {state === 'done' && <CheckIcon />}
            {state === 'error' && <ExclamationIcon />}
          </span>
          <span part="connector" class="bs-stepper-step__connector" aria-hidden="true">
            <span class="bs-stepper-step__connector-line"></span>
          </span>
        </div>
        <span part="label" class={`bs-stepper-step__label bs-stepper-step__label--${state}`}>
          <span part="name" class="bs-stepper-step__name">
            {this.name}
          </span>
          {this.showDescription && this.description && (
            <span part="description" class="bs-stepper-step__description">
              {this.description}
            </span>
          )}
        </span>
      </Host>
    );
  }
}

const CheckIcon = () => (
  <svg viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
    <path d="M2.5 9L6 12.5L14 4.5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
  </svg>
);

const ExclamationIcon = () => (
  <svg viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
    <path d="M8 3V9.5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
    <circle cx="8" cy="12.5" r="1" fill="currentColor" />
  </svg>
);
