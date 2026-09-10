import { Component, Prop, h } from '@stencil/core';
import { GENIE_MARK_ICON } from './genie-mark-icon';

/**
 * A small inline status indicator for Genie AI surfaces: the colorful Genie mark next to a label
 * (e.g. "Retrieving", "Thinking", "Searching") whose text pulses in a slow breathing loop while
 * an operation is in progress.
 *
 * ## When to use
 * - Inline in a Genie AI chat transcript to show what the assistant is currently doing while a
 *   response is being generated (retrieving context, searching, thinking).
 *
 * ## When not to use
 * - A blocking/full-panel loading state -- this is a small inline indicator, not a spinner overlay.
 *
 * The label's pulse animation reproduces Figma's exact keyframe track (a plain opacity
 * fade-in/hold/reset with the source's own cubic-bezier easing) rather than an invented
 * shimmer-sweep -- the source design only specifies this one animation.
 *
 * @part icon - The Genie mark icon.
 * @part label - The status label text.
 * @prop --bs-ai-thinking-gap - Gap between icon and label. Aliased to `--bs-spacing-100`.
 * @prop --bs-ai-thinking-icon-size - Width/height of the icon.
 * @prop --bs-ai-thinking-text - Label color. Aliased to `--bs-text-muted`.
 * @prop --bs-ai-thinking-font-size - Label font size. Aliased to `--bs-font-size-md`.
 * @prop --bs-ai-thinking-line-height - Label line height. Aliased to `--bs-line-height-body-md`.
 * @prop --bs-ai-thinking-cycle-duration - Duration of one pulse loop. Figma specifies exactly 2s,
 *   longer than any `--bs-duration-*` token (max `--bs-duration-slower` is 500ms), so this is
 *   aliased directly to the literal value.
 */
@Component({
  tag: 'bs-ai-thinking',
  styleUrl: 'bs-ai-thinking.css',
  shadow: true,
})
export class BsAiThinking {
  /** The status text shown next to the icon, e.g. "Retrieving", "Thinking", "Searching". */
  @Prop() label = 'Thinking';

  render() {
    return (
      <div class="bs-ai-thinking" role="status" aria-live="polite">
        <img part="icon" class="bs-ai-thinking__icon" src={GENIE_MARK_ICON} alt="" aria-hidden="true" />
        <span part="label" class="bs-ai-thinking__label">
          {this.label}
        </span>
      </div>
    );
  }
}
