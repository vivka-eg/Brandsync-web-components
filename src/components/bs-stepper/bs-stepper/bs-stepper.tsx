import { Component, Element, Prop, Watch, h } from '@stencil/core';
import type { BsStepperDirection, BsStepperStepComputedState } from '../bs-stepper-step/bs-stepper-step';

/**
 * A sequence of named steps showing overall progress through a multi-step flow (e.g. a checkout,
 * an onboarding wizard) -- each step reads as enabled (not yet reached), current, done, error, or
 * disabled, connected by a rail between them.
 *
 * This container is intentionally thin: it renders a `<slot>` for `<bs-stepper-step>` children and
 * propagates `currentStep`/`direction`/`showDescription` down to them as JS properties whenever any
 * of those change or the slotted children themselves change -- the same "container pushes state
 * onto its slotted children" pattern `bs-tabs` uses for `selected` and `bs-breadcrumbs` uses for
 * `size`. Each step computes its own `enabled`/`current`/`done` state from its position among its
 * siblings relative to `currentStep`, unless that step's own `error`/`disabled` prop overrides it.
 *
 * This is a static status display, not an interactive control -- Figma's spec shows no
 * hover/pressed treatment on any step, so nothing here is clickable.
 *
 * ## When to use
 * - Showing where the user is in a fixed, ordered, multi-step flow.
 *
 * ## When not to use
 * - A flow whose steps aren't fixed/known in advance -- a stepper implies the full sequence is
 *   already known.
 * - As a substitute for actual in-page navigation between steps -- pair this with real controls
 *   (Next/Back buttons) elsewhere in the flow, this component only displays status.
 *
 * @slot - Default slot: the `<bs-stepper-step>` elements making up the sequence, in order.
 */
@Component({
  tag: 'bs-stepper',
  styleUrl: 'bs-stepper.css',
  shadow: true,
})
export class BsStepper {
  @Element() el: HTMLElement;

  /** 0-indexed: which step is current. Every step before this index reads as "done" (unless that
   * step's own `error`/`disabled` overrides it), every step after reads as "enabled". */
  @Prop() currentStep = 0;

  /** `horizontal` (icon above name/description, connected by a horizontal rail) or `vertical`
   * (icon beside name/description, connected by a vertical rail). Propagated to every slotted
   * `bs-stepper-step`, and reflected as an attribute so this container's own `:host` CSS can switch
   * its `flex-direction` to match -- a bare `<slot>` with no wrapping element (see `render()`)
   * means the slotted steps' flex-row/column layout comes directly from `:host` here, not from any
   * wrapper div. */
  @Prop({ reflect: true }) direction: BsStepperDirection = 'horizontal';

  /** Whether each step's description renders at all. Propagated to every slotted
   * `bs-stepper-step`. */
  @Prop() showDescription = true;

  @Watch('currentStep')
  @Watch('direction')
  @Watch('showDescription')
  onPropChange() {
    this.propagateToSteps();
  }

  componentDidLoad() {
    this.propagateToSteps();
  }

  private onSlotChange = () => {
    this.propagateToSteps();
  };

  private propagateToSteps() {
    const steps = this.el.querySelectorAll(':scope > bs-stepper-step');
    steps.forEach((step, index) => {
      const computedState: BsStepperStepComputedState = index < this.currentStep ? 'done' : index === this.currentStep ? 'current' : 'enabled';
      Object.assign(step as HTMLElement & Record<string, unknown>, {
        computedState,
        direction: this.direction,
        showDescription: this.showDescription,
      });
    });
  }

  render() {
    return <slot onSlotchange={this.onSlotChange}></slot>;
  }
}
