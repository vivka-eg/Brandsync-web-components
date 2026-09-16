import { Component, Element, Listen, Prop, h } from '@stencil/core';

export type BsTabsType = 'bs-tab' | 'bs-inline-tab';
export type BsTabsOrientation = 'horizontal' | 'vertical';

/**
 * A tab-group wrapper: owns `role="tablist"` and coordinates selection across its slotted
 * `<bs-tab>` or `<bs-inline-tab>` children, so consumers no longer have to hand-roll this.
 *
 * `bs-tab.mdx`/`bs-inline-tab.mdx` previously documented this coordination -- listening for
 * `bsSelect` and setting `selected`/`false` on siblings, plus supplying `role="tablist"` on
 * whatever element groups the tabs -- as a "Known gap"/manual consumer responsibility. This
 * component is that wrapper: it renders the `role="tablist"` element and listens for `bsSelect`
 * itself. Using `<bs-tab>`/`<bs-inline-tab>` standalone, outside a `<bs-tabs>` wrapper, still means
 * `selected` doesn't self-toggle -- a consumer doing that would still need to coordinate `selected`
 * manually -- but that's no longer the first recommended path.
 *
 * ## When to use
 * - Wrapping a set of `<bs-tab>` (underline style) or `<bs-inline-tab>` (pill style) elements that
 *   should behave as a single-selection tab bar.
 *
 * ## When not to use
 * - For a single, standalone tab button not participating in a group -- use `bs-tab`/`bs-inline-tab`
 *   directly.
 *
 * @slot - Default slot: the tab elements (`<bs-tab>` or `<bs-inline-tab>`, matching `type`) that
 * make up this group.
 * @part tablist - The wrapping element carrying `role="tablist"`.
 */
// Note: this component's CSS Custom Properties (--bs-tabs-*) are documented via @prop comments in
// bs-tabs.css, not here -- Stencil's docs generator only parses @prop out of CSS file comments, not
// the class-level JSDoc (see bs-tab.tsx's equivalent note).
@Component({
  tag: 'bs-tabs',
  styleUrl: 'bs-tabs.css',
  shadow: true,
})
export class BsTabs {
  @Element() el: HTMLElement;

  /** Which tab-button family this group wraps. Governs the wrapper's own visual treatment (gap-only
   * for `bs-tab`, a filled pill bar for `bs-inline-tab`). Not reflected as an attribute -- nothing
   * external needs to target it via CSS attribute selector, it only drives internal class names. */
  @Prop() type: BsTabsType = 'bs-tab';

  /** Layout direction of the tab bar itself. Sets `aria-orientation` on the internal wrapper and
   * switches `flex-direction`. */
  @Prop() orientation: BsTabsOrientation = 'horizontal';

  /**
   * Catches `bsSelect` bubbling up from any slotted `<bs-tab>`/`<bs-inline-tab>` (Stencil's
   * `@Event()` defaults to `bubbles: true, composed: true`, and `@Listen` without a target listens
   * on the host itself), and sets `selected` on the clicked child / `false` on its siblings.
   * Disabled children never emit `bsSelect` in the first place (each's own `onClick` guards
   * `if (this.disabled) return;`), so no special-casing is needed here.
   */
  @Listen('bsSelect')
  onTabSelect(ev: CustomEvent<void>) {
    const tabs = this.el.querySelectorAll(':scope > bs-tab, :scope > bs-inline-tab');
    tabs.forEach(tab => {
      (tab as HTMLElement & { selected: boolean }).selected = tab === ev.target;
    });
  }

  render() {
    const vertical = this.orientation === 'vertical';

    return (
      <div
        part="tablist"
        role="tablist"
        aria-orientation={this.orientation}
        class={`bs-tabs bs-tabs--${this.type} ${vertical ? 'bs-tabs--vertical' : ''}`}
      >
        <slot></slot>
      </div>
    );
  }
}
