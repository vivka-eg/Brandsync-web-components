import { Component, Prop, Event, EventEmitter, h } from '@stencil/core';

/**
 * A single citation row inside `bs-chatbot-sources-drawer` -- a file icon + filename on the first
 * line, the originating system and version on the second, and a trailing "open" arrow.
 *
 * ## When to use
 * - One row per source Genie cited in a response, slotted into `bs-chatbot-sources-drawer`.
 *
 * ## When not to use
 * - Outside the sources drawer context -- this is a purpose-built citation row, not a generic
 *   link/list-item component.
 *
 * @slot icon - Overrides the default file icon.
 * @part icon - The leading file-type icon.
 * @part filename - The filename text.
 * @part source - The source system name.
 * @part version - The version label.
 * @part arrow - The trailing "open" arrow icon.
 * @prop --bs-source-link-radius - Corner radius of the row. Aliased to `--bs-border-radius-150`.
 * @prop --bs-source-link-padding - Padding around the row. Aliased to `--bs-spacing-150`.
 * @prop --bs-source-link-gap - Gap between the filename+meta block and the trailing arrow.
 *   Aliased to `--bs-spacing-50`.
 * @prop --bs-source-link-icon-gap - Gap between the leading icon and the filename text. Aliased
 *   to `--bs-spacing-75`.
 * @prop --bs-source-link-hover - Row background on hover/focus. Aliased to `--bs-surface-hover`.
 * @prop --bs-source-link-pressed - Row background while active/pressed. Aliased to
 *   `--bs-surface-pressed`.
 * @prop --bs-source-link-focus - Focus-visible outline color. Aliased to
 *   `--bs-border-neutral-focus`.
 * @prop --bs-source-link-filename-color - Filename text color. Aliased to `--bs-text-default`.
 * @prop --bs-source-link-meta-color - Source/version text color. Aliased to `--bs-text-secondary`.
 * @prop --bs-source-link-icon-color - File icon and arrow color. Aliased to `--bs-icon-default`.
 * @prop --bs-source-link-dot-color - Separator dot between source and version. Aliased to
 *   `--bs-text-secondary`.
 */
@Component({
  tag: 'bs-source-link',
  styleUrl: 'bs-source-link.css',
  shadow: true,
})
export class BsSourceLink {
  /** The cited document's filename. */
  @Prop() fileName = 'Source';

  /** The system/app the document came from (e.g. "HoltePortalen"). */
  @Prop() sourceName?: string;

  /** The document's version label (e.g. "v3.2"). Omit if the source has no version. */
  @Prop() version?: string;

  /** If set, renders the row as a link that opens this URL; otherwise as a button that only emits `bsOpen`. */
  @Prop() href?: string;

  /** `target` used when `href` is set. */
  @Prop() target = '_blank';

  /** Fires on click/activation, whether or not `href` is set -- lets the consuming app log or handle the open. */
  @Event() bsOpen: EventEmitter<void>;

  private onClick = () => {
    this.bsOpen.emit();
  };

  render() {
    const inner = [
      <span class="bs-source-link__left">
        <span class="bs-source-link__filename-row">
          <span part="icon" class="bs-source-link__icon">
            <slot name="icon">
              <FileTextIcon />
            </slot>
          </span>
          <p part="filename" class="bs-source-link__filename">
            {this.fileName}
          </p>
        </span>
        <span class="bs-source-link__meta">
          {this.sourceName && (
            <span part="source" class="bs-source-link__source">
              {this.sourceName}
            </span>
          )}
          {this.sourceName && this.version && <span class="bs-source-link__dot" aria-hidden="true"></span>}
          {this.version && (
            <span part="version" class="bs-source-link__version">
              {this.version}
            </span>
          )}
        </span>
      </span>,
      <span part="arrow" class="bs-source-link__arrow" aria-hidden="true">
        <ArrowUpRightIcon />
      </span>,
    ];

    return this.href ? (
      <a class="bs-source-link" href={this.href} target={this.target} rel="noopener noreferrer" onClick={this.onClick}>
        {inner}
      </a>
    ) : (
      <button type="button" class="bs-source-link" onClick={this.onClick}>
        {inner}
      </button>
    );
  }
}

const FileTextIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
    <path d="M9.5 1.5H4C3.73478 1.5 3.48043 1.60536 3.29289 1.79289C3.10536 1.98043 3 2.23478 3 2.5V13.5C3 13.7652 3.10536 14.0196 3.29289 14.2071C3.48043 14.3946 3.73478 14.5 4 14.5H12C12.2652 14.5 12.5196 14.3946 12.7071 14.2071C12.8946 14.0196 13 13.7652 13 13.5V5L9.5 1.5Z" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" />
    <path d="M9.5 1.5V5H13" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" />
    <path d="M5.5 8.5H10.5" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" />
    <path d="M5.5 11H10.5" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" />
  </svg>
);

const ArrowUpRightIcon = () => (
  <svg width="24" height="24" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
    <path d="M6.25 13.75L13.75 6.25" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
    <path d="M7.5 6.25H13.75V12.5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
  </svg>
);
