import { Component, Prop, h } from '@stencil/core';

/**
 * A dark tooltip bubble with a pointer arrow, used to surface a short hint of extra information
 * next to a trigger element.
 *
 * `bs-tooltip` is a purely presentational bubble -- like `bs-menu`, it does not manage its own
 * visibility, hover/focus triggering, or positioning relative to a trigger element. A consuming
 * app is responsible for showing/hiding it and for positioning it against its trigger (e.g. via a
 * wrapping `position: relative`/`absolute` pattern, the same approach used by
 * `bs-chatbot-response-action` for its own `menu` slot).
 *
 * ## When to use
 * - A short, contextual hint of extra information shown next to a trigger element on hover/focus,
 *   where the host app owns the show/hide and positioning logic.
 *
 * ## When not to use
 * - A component that manages its own trigger interaction (hover/focus listeners) or positioning --
 *   this component intentionally does not do that; wire that up in the consuming app instead.
 *
 * @slot - Default slot: the tooltip's message content.
 * @part bubble - The dark rounded box containing the slotted content.
 * @part arrow - The triangular pointer arrow.
 * @prop --bs-tooltip-bg - Background of the bubble and arrow. Aliased to `--bs-surface-inverse`.
 * @prop --bs-tooltip-color - Text color of the slotted content. Aliased to `--bs-text-inverse`.
 * @prop --bs-tooltip-radius - Corner radius of the bubble. Aliased to `--bs-border-radius-50`.
 * @prop --bs-tooltip-padding-x - Left/right padding of the bubble. Aliased to `--bs-spacing-200`.
 * @prop --bs-tooltip-padding-y - Top/bottom padding of the bubble. Aliased to `--bs-spacing-100`.
 * @prop --bs-tooltip-max-width - Max width of the bubble. Aliased to `200px`, Figma's own reference
 * width (the bubble's width is otherwise variable based on content).
 * @prop --bs-tooltip-shadow - Elevation shadow of the bubble. See `bs-tooltip.css` for why this is
 * a literal value rather than a `--bs-shadow-*` token alias.
 * @prop --bs-tooltip-font-size - Font size of the slotted content. Aliased to `--bs-font-size-sm`.
 * @prop --bs-tooltip-line-height - Line height of the slotted content. Aliased to
 * `--bs-line-height-body-sm`.
 */
@Component({
  tag: 'bs-tooltip',
  styleUrl: 'bs-tooltip.css',
  shadow: true,
})
export class BsTooltip {
  /**
   * Which edge of the bubble the arrow points from, and therefore which side of a trigger the
   * bubble should be placed on. `'top'` is the only value implemented -- it is the only variant
   * confirmed from the Figma "EG Tooltip" component (arrow at the top of the bubble, pointing
   * up). Bottom/left/right variants aren't implemented pending further Figma design confirmation.
   */
  @Prop() placement: 'top' = 'top';

  render() {
    return (
      <div class="bs-tooltip">
        <span part="arrow" class="bs-tooltip__arrow"></span>
        <div part="bubble" class="bs-tooltip__bubble">
          <slot></slot>
        </div>
      </div>
    );
  }
}
