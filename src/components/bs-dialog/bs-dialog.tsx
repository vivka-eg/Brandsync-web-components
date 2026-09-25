import { Component, Prop, State, Event, EventEmitter, Listen, h } from '@stencil/core';

export type BsDialogSize = 'sm' | 'md' | 'lg';

/**
 * An overlay dialog that interrupts the current flow for a focused task or confirmation.
 * Closes itself on backdrop click, Escape, or its own close button, and emits `bsClose`.
 *
 * ## When to use
 * - Confirming a consequential action (e.g. "Confirm booking") before it takes effect.
 * - A short, focused task that doesn't warrant navigating to a new page.
 *
 * ## When not to use
 * - For non-blocking status messages — use a toast/notification instead of interrupting the user.
 * - For a long, multi-step flow — a full page or a dedicated route is usually a better fit than a
 *   dialog that just gets taller and taller.
 *
 * Two additional slots cover the Figma "Dialog" component's other states: `image` (a hero image
 * across the top, close button floats over it instead of sitting in the header row) and `icon`
 * (only rendered when `centered` is set, e.g. a success checkmark above a centered heading). The
 * close button "floats" (absolute-positioned, top-right of the dialog, with its own background)
 * whenever `centered` is true or the `image` slot has content -- otherwise it's the plain inline
 * button in the header row next to the heading, same as before this addition.
 *
 * @slot - Default slot: the dialog body content.
 * @slot image - Optional hero image across the top of the dialog. Presence of assigned content
 * switches the close button to float over it; doesn't affect layout when empty.
 * @slot icon - Optional icon shown above the heading, only rendered at all when `centered` is true.
 * @slot footer - Optional footer content (typically action buttons).
 * @part backdrop - The full-viewport overlay behind the dialog.
 * @part dialog - The dialog box itself.
 * @part image - The hero image wrapper (only visible when the `image` slot has content).
 * @part icon - The icon wrapper (only rendered when `centered` is true).
 * @part header - The header row (heading + close button, when the close button isn't floating).
 * @part close - The close button (inline in the header, or floating -- see the class doc above).
 * @part body - The body content wrapper.
 * @part footer - The footer wrapper (only visible when the footer slot has content).
 */
@Component({
  tag: 'bs-dialog',
  styleUrl: 'bs-dialog.css',
  shadow: true,
})
export class BsDialog {
  /** Mutable + reflected so the component can close itself (backdrop click, Escape, close button)
   * the same way a native `<dialog>` does, while still emitting `bsClose` for the consumer to react to. */
  @Prop({ mutable: true, reflect: true }) open = false;

  @Prop() heading?: string;
  @Prop() size: BsDialogSize = 'md';

  /** Switches to the Figma "Icon Centered" layout: heading/body text centered, the `icon` slot
   * rendered above the heading, and the close button floating top-right of the dialog instead of
   * inline in the header row. Doesn't hide a slotted `image` if one is also provided -- Figma's
   * spec doesn't show the two combined, so this is unspecified rather than actively blocked.
   * Reflected so consumers/CSS can target `bs-dialog[centered]`. */
  @Prop({ reflect: true }) centered = false;

  @Event() bsClose: EventEmitter<void>;

  /** Tracks whether the `footer` slot has assigned content, so the footer bar (border + padding)
   * only renders when there's actually something to put in it. */
  @State() hasFooter = false;

  /** Tracks whether the `image` slot has assigned content -- drives both whether the image wrapper
   * is visible and whether the close button floats over it (see `floatingClose` in `render()`). */
  @State() hasImage = false;

  /** Tracks whether the `icon` slot has assigned content, so the icon wrapper only reserves layout
   * space when there's actually an icon -- same pattern as `bs-tab`'s `hasIcon`. Only relevant when
   * `centered` is true, since the icon wrapper isn't rendered at all otherwise. */
  @State() hasIcon = false;

  private onFooterSlotchange = (ev: Event) => {
    this.hasFooter = (ev.target as HTMLSlotElement).assignedNodes().length > 0;
  };

  private onImageSlotchange = (ev: Event) => {
    this.hasImage = (ev.target as HTMLSlotElement).assignedNodes().length > 0;
  };

  private onIconSlotchange = (ev: Event) => {
    this.hasIcon = (ev.target as HTMLSlotElement).assignedNodes().length > 0;
  };

  private dialogRef?: HTMLElement;
  private previouslyFocused?: HTMLElement;
  private previousBodyOverflow?: string;
  private wasOpen = false;

  private close = () => {
    this.open = false;
    this.bsClose.emit();
  };

  @Listen('keydown', { target: 'document' })
  onKeydown(ev: KeyboardEvent) {
    if (this.open && ev.key === 'Escape') {
      this.close();
    }
  }

  private onBackdropClick = (ev: MouseEvent) => {
    if (ev.target === ev.currentTarget) {
      this.close();
    }
  };

  // Simple focus containment: rather than manually enumerating focusable elements (which can't
  // reliably walk into slotted children's own Shadow DOM anyway), redirect any focus that lands
  // outside the dialog back to it. composedPath() correctly reports elements across Shadow DOM
  // boundaries, unlike a plain `.contains()` check.
  @Listen('focusin', { target: 'document' })
  onFocusIn(ev: FocusEvent) {
    if (this.open && this.dialogRef && !ev.composedPath().includes(this.dialogRef)) {
      this.dialogRef.focus();
    }
  }

  componentDidRender() {
    if (this.open && !this.wasOpen) {
      this.previouslyFocused = document.activeElement as HTMLElement;
      this.dialogRef?.focus();
      // Locks the page behind the dialog from scrolling while it's open -- a fixed-position
      // backdrop/dialog doesn't block scroll on its own, since scroll input still targets whatever
      // element is under the pointer/has focus, not the topmost painted layer.
      this.previousBodyOverflow = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
    } else if (!this.open && this.wasOpen) {
      this.previouslyFocused?.focus();
      document.body.style.overflow = this.previousBodyOverflow ?? '';
    }
    this.wasOpen = this.open;
  }

  disconnectedCallback() {
    // Covers the case where the host is removed from the DOM entirely while still open (e.g. a
    // consumer conditionally rendering `<bs-dialog>` itself rather than toggling `open`) -- without
    // this, the page would be left permanently unscrollable since componentDidRender's own
    // open->closed transition never runs.
    if (this.wasOpen) {
      document.body.style.overflow = this.previousBodyOverflow ?? '';
    }
  }

  render() {
    if (!this.open) {
      return null;
    }

    // The close button floats (absolute, over the top of the dialog) whenever there's a hero image
    // to sit over, or the centered layout has no header row to put an inline close button in.
    const floatingClose = this.centered || this.hasImage;

    return (
      <div part="backdrop" class="bs-dialog__backdrop" onClick={this.onBackdropClick}>
        <div
          ref={el => (this.dialogRef = el)}
          tabIndex={-1}
          part="dialog"
          class={`bs-dialog__dialog bs-dialog__dialog--${this.size}`}
          role="dialog"
          aria-modal="true"
          aria-label={this.heading}
        >
          {floatingClose && (
            <bs-icon-button
              part="close"
              class="bs-dialog__close--floating"
              variant="neutral"
              size="md"
              aria-label="Close"
              onClick={this.close}
            >
              <CloseIcon />
            </bs-icon-button>
          )}
          <div part="image" class={`bs-dialog__image ${this.hasImage ? 'bs-dialog__image--visible' : ''}`}>
            <slot name="image" onSlotchange={this.onImageSlotchange}></slot>
          </div>
          {this.centered && (
            <div part="icon" class={`bs-dialog__icon ${this.hasIcon ? 'bs-dialog__icon--visible' : ''}`}>
              <slot name="icon" onSlotchange={this.onIconSlotchange}></slot>
            </div>
          )}
          <div part="header" class={`bs-dialog__header ${this.centered ? 'bs-dialog__header--centered' : ''}`}>
            <span class="bs-dialog__heading">{this.heading}</span>
            {!floatingClose && (
              <bs-icon-button part="close" variant="subtle" size="md" aria-label="Close" onClick={this.close}>
                <CloseIcon />
              </bs-icon-button>
            )}
          </div>
          <div part="body" class={`bs-dialog__body ${this.centered ? 'bs-dialog__body--centered' : ''}`}>
            <slot></slot>
          </div>
          <div part="footer" class={`bs-dialog__footer ${this.hasFooter ? 'bs-dialog__footer--visible' : ''}`}>
            <slot name="footer" onSlotchange={this.onFooterSlotchange}></slot>
          </div>
        </div>
      </div>
    );
  }
}

// 16x16 native viewBox, matching bs-attachment's own CloseIcon proportions (two crossing diagonal
// strokes) -- shared between both close button variants above rather than duplicated inline.
const CloseIcon = () => (
  <svg viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
    <path d="M12.5 3.5L3.5 12.5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
    <path d="M12.5 12.5L3.5 3.5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
  </svg>
);
