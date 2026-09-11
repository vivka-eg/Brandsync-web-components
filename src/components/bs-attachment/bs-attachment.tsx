import { Component, Prop, Event, EventEmitter, h } from '@stencil/core';

export type BsAttachmentType = 'image' | 'pdf' | 'document';

/**
 * A single file attachment preview for `bs-composer` -- an image thumbnail, or a filename card
 * with a colored file-type badge (PDF/Document), with an optional upload-in-progress spinner and
 * a hover/focus-revealed remove button.
 *
 * ## When to use
 * - Rendered by the consuming app for each file a user has attached to a Genie AI chat message,
 *   typically alongside or inside `bs-composer`.
 *
 * ## When not to use
 * - A generic file-upload control -- this is a preview-only presentational component. The
 *   consuming app owns the actual file picker/upload logic and drives `loading` from that state.
 *
 * @part thumbnail - The image thumbnail wrapper (type="image" only).
 * @part card - The filename card (type="pdf" / type="document" only).
 * @part filename - The truncated filename text inside the card.
 * @part badge - The colored file-type badge inside the card.
 * @part remove - The remove button.
 * @prop --bs-attachment-size - Width/height of the image thumbnail and of the card. Defaults to 112px.
 * @prop --bs-attachment-radius - Corner radius of the thumbnail/card. Aliased to
 *   `--bs-border-radius-100`.
 * @prop --bs-attachment-border-color - Border color of the card / loading image wrap. Aliased to
 *   `--bs-border-default`.
 * @prop --bs-attachment-card-bg - Card background. Aliased to `--bs-surface-base`.
 * @prop --bs-attachment-filename-color - Filename text color. Aliased to `--bs-text-default`.
 * @prop --bs-attachment-badge-bg-pdf - PDF badge background. Aliased to `--bs-badge-bg-error`.
 * @prop --bs-attachment-badge-bg-document - Document badge background. Aliased to
 *   `--bs-badge-bg-info`.
 * @prop --bs-attachment-remove-bg - Remove button (neutral icon button) default background.
 *   Aliased to `--bs-button-neutral-container`.
 * @prop --bs-attachment-remove-hover - Remove button hover background. Aliased to
 *   `--bs-button-neutral-hover`.
 * @prop --bs-attachment-remove-pressed - Remove button active/pressed background. Aliased to
 *   `--bs-button-neutral-pressed`.
 * @prop --bs-attachment-remove-focus - Remove button focus outline color. Aliased to
 *   `--bs-border-neutral-focus`.
 */
@Component({
  tag: 'bs-attachment',
  styleUrl: 'bs-attachment.css',
  shadow: true,
})
export class BsAttachment {
  /** Which kind of attachment preview to render. */
  @Prop() type: BsAttachmentType = 'image';

  /** The filename shown on the card. Only used when `type` is "pdf" or "document". */
  @Prop() fileName = 'Attachment';

  /** The thumbnail image URL. Only used when `type` is "image". */
  @Prop() imageSrc?: string;

  /** Accessible alt text for the image thumbnail. Only used when `type` is "image". */
  @Prop() imageAlt = '';

  /** Shows an upload-in-progress spinner (blurred + overlaid for images, in the badge for files). */
  @Prop() loading = false;

  /** Whether the hover/focus-revealed remove button is rendered at all. */
  @Prop() removable = true;

  /** Fires when the remove button is clicked. */
  @Event() bsRemove: EventEmitter<void>;

  private onRemoveClick = () => {
    this.bsRemove.emit();
  };

  render() {
    const isImage = this.type === 'image';

    return (
      <div class={{ 'bs-attachment': true, 'bs-attachment--loading': this.loading }} aria-busy={this.loading ? 'true' : 'false'}>
        {isImage ? this.renderImage() : this.renderCard()}
        {this.removable && (
          <button type="button" part="remove" class="bs-attachment__remove" aria-label="Remove attachment" onClick={this.onRemoveClick}>
            <CloseIcon />
          </button>
        )}
      </div>
    );
  }

  private renderImage() {
    return (
      <div part="thumbnail" class="bs-attachment__thumbnail">
        <img class="bs-attachment__image" src={this.imageSrc} alt={this.imageAlt} />
        {this.loading && <Spinner class="bs-attachment__spinner bs-attachment__spinner--overlay" size={16} />}
      </div>
    );
  }

  private renderCard() {
    return (
      <div part="card" class="bs-attachment__card">
        <p part="filename" class="bs-attachment__filename">
          {this.fileName}
        </p>
        <span part="badge" class={`bs-attachment__badge bs-attachment__badge--${this.type}`}>
          {this.loading ? <Spinner size={16} /> : this.type === 'pdf' ? <FilePdfIcon /> : <FileDocIcon />}
        </span>
      </div>
    );
  }
}

const Spinner = ({ class: className, size = 16 }: { class?: string; size?: number }) => (
  <span class={`bs-attachment__spinner ${className ?? ''}`} style={{ width: `${size}px`, height: `${size}px` }} role="status" aria-label="Uploading"></span>
);

const CloseIcon = () => (
  <svg width="8" height="8" viewBox="0 0 8 8" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
    <path d="M6.25 1.75L1.75 6.25" stroke="currentColor" stroke-width="0.666667" stroke-linecap="round" stroke-linejoin="round" />
    <path d="M6.25 6.25L1.75 1.75" stroke="currentColor" stroke-width="0.666667" stroke-linecap="round" stroke-linejoin="round" />
  </svg>
);

const FilePdfIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
    <path d="M13.5 9.5H11.5V13" stroke="white" stroke-linecap="round" stroke-linejoin="round" />
    <path d="M13 11.5H11.5" stroke="white" stroke-linecap="round" stroke-linejoin="round" />
    <path
      d="M3 12H4C4.33152 12 4.64946 11.8683 4.88388 11.6339C5.1183 11.3995 5.25 11.0815 5.25 10.75C5.25 10.4185 5.1183 10.1005 4.88388 9.86612C4.64946 9.6317 4.33152 9.5 4 9.5H3V13"
      stroke="white"
      stroke-linecap="round"
      stroke-linejoin="round"
    />
    <path
      d="M7 9.5V13H8C8.46413 13 8.90925 12.8156 9.23744 12.4874C9.56563 12.1592 9.75 11.7141 9.75 11.25C9.75 10.7859 9.56563 10.3408 9.23744 10.0126C8.90925 9.68437 8.46413 9.5 8 9.5H7Z"
      stroke="white"
      stroke-linecap="round"
      stroke-linejoin="round"
    />
    <path d="M3 7V2.5C3 2.36739 3.05268 2.24021 3.14645 2.14645C3.24021 2.05268 3.36739 2 3.5 2H9.5L13 5.5V7" stroke="white" stroke-linecap="round" stroke-linejoin="round" />
    <path d="M9.5 2V5.5H13" stroke="white" stroke-linecap="round" stroke-linejoin="round" />
  </svg>
);

const FileDocIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
    <path
      d="M2.25 9.5V13H3.25C3.71413 13 4.15925 12.8156 4.48744 12.4874C4.81563 12.1592 5 11.7141 5 11.25C5 10.7859 4.81563 10.3408 4.48744 10.0126C4.15925 9.68437 3.71413 9.5 3.25 9.5H2.25Z"
      stroke="white"
      stroke-linecap="round"
      stroke-linejoin="round"
    />
    <path
      d="M13.5 12.5544C13.3724 12.6928 13.2179 12.8038 13.046 12.8804C12.874 12.957 12.6882 12.9977 12.5 13C11.6712 13 11 12.2163 11 11.25C11 10.2837 11.6712 9.5 12.5 9.5C12.6882 9.50228 12.874 9.54298 13.046 9.61961C13.2179 9.69624 13.3724 9.80718 13.5 9.94563"
      stroke="white"
      stroke-linecap="round"
      stroke-linejoin="round"
    />
    <path d="M3 7V2.5C3 2.36739 3.05268 2.24021 3.14645 2.14645C3.24021 2.05268 3.36739 2 3.5 2H9.5L13 5.5V7" stroke="white" stroke-linecap="round" stroke-linejoin="round" />
    <path d="M9.5 2V5.5H13" stroke="white" stroke-linecap="round" stroke-linejoin="round" />
    <path
      d="M8 13C8.82843 13 9.5 12.2165 9.5 11.25C9.5 10.2835 8.82843 9.5 8 9.5C7.17157 9.5 6.5 10.2835 6.5 11.25C6.5 12.2165 7.17157 13 8 13Z"
      stroke="white"
      stroke-linecap="round"
      stroke-linejoin="round"
    />
  </svg>
);
