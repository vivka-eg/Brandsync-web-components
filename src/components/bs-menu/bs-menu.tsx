import { Component, h } from '@stencil/core';

/**
 * A generic dropdown/popup menu container: a rounded, elevated list of items (typically
 * `bs-menu-item` elements).
 *
 * ## When to use
 * - A popup list of actions/options triggered by another control (e.g. a "more options" kebab
 *   button), such as `bs-chatbot-response-action`'s `menu` slot.
 *
 * ## When not to use
 * - A persistent, always-visible list of options -- this component is purpose-built as a popup
 *   surface (rounded corners, elevation shadow), not a plain list.
 *
 * @slot - Default slot: the menu's items (typically `bs-menu-item` elements, though anything can
 * be slotted in -- this component doesn't restrict slot content via JS).
 * @part list - The rounded, elevated box wrapping the slotted items.
 * @prop --bs-menu-bg - Background of the menu box. Aliased to `--bs-surface-raised`.
 * @prop --bs-menu-radius - Corner radius of the menu box. Aliased to `--bs-border-radius-100`.
 * @prop --bs-menu-padding-y - Top/bottom padding of the menu box. Aliased to `--bs-spacing-50`.
 * @prop --bs-menu-gap - Gap between slotted items. Aliased to `--bs-spacing-50`.
 * @prop --bs-menu-shadow - Elevation shadow of the menu box. Aliased to `--bs-shadow-sm`.
 */
@Component({
  tag: 'bs-menu',
  styleUrl: 'bs-menu.css',
  shadow: true,
})
export class BsMenu {
  render() {
    return (
      <div part="list" class="bs-menu" role="menu">
        <slot></slot>
      </div>
    );
  }
}
