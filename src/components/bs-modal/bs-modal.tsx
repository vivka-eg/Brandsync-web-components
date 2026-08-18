import { Component, Prop, State, Event, EventEmitter, Listen, h } from '@stencil/core';

export type BsModalSize = 'sm' | 'md' | 'lg';

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
 *   modal that just gets taller and taller.
 *
 * @slot - Default slot: the dialog body content.
 * @slot footer - Optional footer content (typically action buttons).
 * @part backdrop - The full-viewport overlay behind the dialog.
 * @part dialog - The dialog box itself.
 * @part header - The header row (heading + close button).
 * @part close - The close button.
 * @part body - The body content wrapper.
 * @part footer - The footer wrapper (only visible when the footer slot has content).
 */
@Component({
  tag: 'bs-modal',
  styleUrl: 'bs-modal.css',
  shadow: true,
})
export class BsModal {
  /** Mutable + reflected so the component can close itself (backdrop click, Escape, close button)
   * the same way a native `<dialog>` does, while still emitting `bsClose` for the consumer to react to. */
  @Prop({ mutable: true, reflect: true }) open = false;

  @Prop() heading?: string;
  @Prop() size: BsModalSize = 'md';

  @Event() bsClose: EventEmitter<void>;

  /** Tracks whether the `footer` slot has assigned content, so the footer bar (border + padding)
   * only renders when there's actually something to put in it. */
  @State() hasFooter = false;

  private onFooterSlotchange = (ev: Event) => {
    this.hasFooter = (ev.target as HTMLSlotElement).assignedNodes().length > 0;
  };

  private dialogRef?: HTMLElement;
  private previouslyFocused?: HTMLElement;
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
    } else if (!this.open && this.wasOpen) {
      this.previouslyFocused?.focus();
    }
    this.wasOpen = this.open;
  }

  render() {
    if (!this.open) {
      return null;
    }

    return (
      <div part="backdrop" class="bs-modal__backdrop" onClick={this.onBackdropClick}>
        <div
          ref={el => (this.dialogRef = el)}
          tabIndex={-1}
          part="dialog"
          class={`bs-modal__dialog bs-modal__dialog--${this.size}`}
          role="dialog"
          aria-modal="true"
          aria-label={this.heading}
        >
          <div part="header" class="bs-modal__header">
            <span class="bs-modal__heading">{this.heading}</span>
            <button part="close" class="bs-modal__close" aria-label="Close" onClick={this.close}>
              ×
            </button>
          </div>
          <div part="body" class="bs-modal__body">
            <slot></slot>
          </div>
          <div part="footer" class={`bs-modal__footer ${this.hasFooter ? 'bs-modal__footer--visible' : ''}`}>
            <slot name="footer" onSlotchange={this.onFooterSlotchange}></slot>
          </div>
        </div>
      </div>
    );
  }
}
