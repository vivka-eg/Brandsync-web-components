import { Component, State, Event, EventEmitter, h } from '@stencil/core';

/**
 * A single selectable row inside a `bs-menu`: an optional icon plus a text label, rendered as a
 * real `<button>` for correct keyboard/click semantics.
 *
 * ## When to use
 * - As a child of `bs-menu`, one per selectable action/option.
 *
 * ## When not to use
 * - Outside of `bs-menu` -- this component's sizing/hover treatment is designed to sit inside the
 *   menu's rounded, padded list box.
 *
 * @slot icon - Optional leading icon (24x24). When left empty, no icon space is reserved.
 * @slot - Default slot: the item's text label.
 * @part item - The button element.
 * @part icon - The icon wrapper.
 * @part label - The label wrapper.
 * @prop --bs-menu-item-radius - Corner radius of the row. Aliased to `--bs-border-radius-100`.
 * @prop --bs-menu-item-padding-y - Top/bottom padding. Aliased to `--bs-spacing-100`.
 * @prop --bs-menu-item-padding-x - Left/right padding. Aliased to `--bs-spacing-150`.
 * @prop --bs-menu-item-gap - Gap between icon and label. Aliased to `--bs-spacing-100`.
 * @prop --bs-menu-item-hover - Background on hover. Aliased to `--bs-color-neutral-container`.
 * @prop --bs-menu-item-pressed - Background when pressed. Aliased to `--bs-color-neutral-container-pressed`.
 * @prop --bs-menu-item-icon-color - Icon color. Aliased to `--bs-icon-default`.
 * @prop --bs-menu-item-color - Label text color. Aliased to `--bs-text-muted`.
 * @prop --bs-menu-item-font-size - Aliased to `--bs-font-size-md`.
 * @prop --bs-menu-item-line-height - Aliased to `--bs-line-height-body-md`.
 */
@Component({
  tag: 'bs-menu-item',
  styleUrl: 'bs-menu-item.css',
  shadow: true,
})
export class BsMenuItem {
  /** Tracks whether the `icon` slot has assigned content, so the icon wrapper (and its gap) only
   * renders when there's actually an icon to show. */
  @State() hasIcon = false;

  /** Fires when the item is clicked. */
  @Event() bsSelect: EventEmitter<void>;

  private onIconSlotchange = (ev: Event) => {
    this.hasIcon = (ev.target as HTMLSlotElement).assignedNodes().length > 0;
  };

  private onClick = () => {
    this.bsSelect.emit();
  };

  render() {
    return (
      <button type="button" part="item" role="menuitem" class="bs-menu-item" onClick={this.onClick}>
        <span part="icon" class={`bs-menu-item__icon ${this.hasIcon ? 'bs-menu-item__icon--has-content' : ''}`}>
          <slot name="icon" onSlotchange={this.onIconSlotchange}></slot>
        </span>
        <span part="label" class="bs-menu-item__label">
          <slot></slot>
        </span>
      </button>
    );
  }
}
