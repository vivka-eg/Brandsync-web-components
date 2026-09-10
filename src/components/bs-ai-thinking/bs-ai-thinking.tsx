import { Component, Prop, h } from '@stencil/core';
import { GENIE_MARK_ICON } from './genie-mark-icon';

/**
 * A small inline status indicator for Genie AI surfaces: the colorful Genie mark next to a label
 * (e.g. "Retrieving", "Thinking", "Searching") whose text shimmers with a moving highlight band
 * while an operation is in progress.
 *
 * ## When to use
 * - Inline in a Genie AI chat transcript to show what the assistant is currently doing while a
 *   response is being generated (retrieving context, searching, thinking).
 *
 * ## When not to use
 * - A blocking/full-panel loading state -- this is a small inline indicator, not a spinner overlay.
 *
 * @part icon - The Genie mark icon.
 * @part label - The status label text.
 * @prop --bs-ai-thinking-gap - Gap between icon and label. Aliased to `--bs-spacing-100`.
 * @prop --bs-ai-thinking-icon-size - Width/height of the icon.
 * @prop --bs-ai-thinking-text - Label base color. Aliased to `--bs-text-muted`.
 * @prop --bs-ai-thinking-shimmer-highlight - Color of the moving highlight band. Aliased to
 *   `--bs-text-default` (more prominent than `--bs-text-muted` in both themes).
 * @prop --bs-ai-thinking-font-size - Label font size. Aliased to `--bs-font-size-md`.
 * @prop --bs-ai-thinking-line-height - Label line height. Aliased to `--bs-line-height-body-md`.
 * @prop --bs-ai-thinking-cycle-duration - Duration of one shimmer sweep. Figma's own keyframe
 *   track for this label runs over exactly 2s, longer than any `--bs-duration-*` token (max
 *   `--bs-duration-slower` is 500ms), so this is aliased directly to the literal value.
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
