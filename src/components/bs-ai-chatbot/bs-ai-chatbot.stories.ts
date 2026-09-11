import type { Meta, StoryObj } from '@storybook/web-components-vite';
import { html } from 'lit';

/**
 * This is not a real component -- `bs-ai-chatbot` isn't a registered custom element. It's a
 * showcase composing the existing Genie AI components (bs-chatbot-header, bs-ai-greeting,
 * bs-chatbot-suggestion-button, bs-composer, bs-composer-status-banner, bs-attachment-list,
 * bs-ai-thinking, bs-chatbot-response-action, bs-chatbot-sources-drawer, bs-ai-disclaimer) into
 * realistic full-panel use cases, since no single component's own story shows how they fit
 * together end to end.
 */
const meta: Meta = {
  title: 'Genie AI Components/bs-ai-chatbot',
  parameters: { docs: { description: { component: 'A composed showcase of Genie AI components in realistic full-chat-panel use cases. Not a real custom element.' } } },
};

export default meta;
type Story = StoryObj;

const PANEL_STYLE = `
  display: flex;
  flex-direction: column;
  width: 420px;
  height: 640px;
  border: 1px solid var(--bs-border-default);
  border-radius: var(--bs-border-radius-200);
  overflow: hidden;
  background: var(--bs-surface-base);
  font-family: var(--bs-typography-font-family-body), sans-serif;
`;

const TRANSCRIPT_STYLE = `
  flex: 1;
  min-height: 0;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: var(--bs-spacing-200);
  padding: var(--bs-spacing-200);
`;

const USER_BUBBLE_STYLE = `
  align-self: flex-end;
  max-width: 80%;
  padding: var(--bs-spacing-100) var(--bs-spacing-150);
  border-radius: var(--bs-border-radius-150);
  background: var(--bs-color-primary-container);
  color: var(--bs-text-default);
  font-size: var(--bs-font-size-md);
  line-height: 1.5;
`;

const AI_RESPONSE_STYLE = `
  max-width: 100%;
  color: var(--bs-text-default);
  font-size: var(--bs-font-size-md);
  line-height: 1.5;
`;

export const EmptyState: Story = {
  name: 'Empty state',
  render: () => html`
    <div style=${PANEL_STYLE}>
      <bs-chatbot-header heading="Genie"></bs-chatbot-header>
      <div style="${TRANSCRIPT_STYLE} align-items: center; justify-content: center; gap: var(--bs-spacing-400);">
        <bs-ai-greeting product-name="BrandSync"></bs-ai-greeting>
        <div style="display: flex; flex-wrap: wrap; gap: var(--bs-spacing-100); justify-content: center;">
          <bs-chatbot-suggestion-button>How do I reset my password?</bs-chatbot-suggestion-button>
          <bs-chatbot-suggestion-button>Summarize this document</bs-chatbot-suggestion-button>
          <bs-chatbot-suggestion-button>What's my leave balance?</bs-chatbot-suggestion-button>
        </div>
      </div>
      <bs-composer aria-label="Message" style="margin: var(--bs-spacing-100) var(--bs-spacing-200) 0;"></bs-composer>
      <bs-ai-disclaimer style="padding: var(--bs-spacing-100) 0;">AI can make mistakes. Please verify important information.</bs-ai-disclaimer>
    </div>
  `,
};

export const ActiveConversation: Story = {
  name: 'Active conversation',
  render: () => html`
    <div style=${PANEL_STYLE}>
      <bs-chatbot-header heading="Genie"></bs-chatbot-header>
      <div style=${TRANSCRIPT_STYLE}>
        <p style=${USER_BUBBLE_STYLE}>How do I submit a ByggSøk application?</p>
        <div style="display: flex; flex-direction: column; gap: var(--bs-spacing-50);">
          <p style=${AI_RESPONSE_STYLE}>
            You can submit a ByggSøk application through the municipal portal. Log in with your ID, select "New
            application", and attach your building plans before submitting for review.
          </p>
          <bs-chatbot-response-action sources-count="3"></bs-chatbot-response-action>
        </div>
      </div>
      <bs-composer aria-label="Message" style="margin: var(--bs-spacing-100) var(--bs-spacing-200) 0;"></bs-composer>
      <bs-ai-disclaimer style="padding: var(--bs-spacing-100) 0;">AI can make mistakes. Please verify important information.</bs-ai-disclaimer>
    </div>
  `,
};

export const Thinking: Story = {
  name: 'AI is thinking',
  render: () => html`
    <div style=${PANEL_STYLE}>
      <bs-chatbot-header heading="Genie"></bs-chatbot-header>
      <div style=${TRANSCRIPT_STYLE}>
        <p style=${USER_BUBBLE_STYLE}>How do I submit a ByggSøk application?</p>
        <bs-ai-thinking label="Retrieving sources"></bs-ai-thinking>
      </div>
      <bs-composer aria-label="Message" state="generating" style="margin: var(--bs-spacing-100) var(--bs-spacing-200) 0;"></bs-composer>
      <bs-ai-disclaimer style="padding: var(--bs-spacing-100) 0;">AI can make mistakes. Please verify important information.</bs-ai-disclaimer>
    </div>
  `,
};

export const WithSourcesDrawerOpen: Story = {
  name: 'Sources drawer open',
  render: () => html`
    <div style="${PANEL_STYLE} position: relative;">
      <bs-chatbot-header heading="Genie"></bs-chatbot-header>
      <div style=${TRANSCRIPT_STYLE}>
        <p style=${USER_BUBBLE_STYLE}>How do I submit a ByggSøk application?</p>
        <div style="display: flex; flex-direction: column; gap: var(--bs-spacing-50);">
          <p style=${AI_RESPONSE_STYLE}>
            You can submit a ByggSøk application through the municipal portal. Log in with your ID, select "New
            application", and attach your building plans before submitting for review.
          </p>
          <bs-chatbot-response-action sources-count="3"></bs-chatbot-response-action>
        </div>
      </div>
      <bs-composer aria-label="Message" style="margin: var(--bs-spacing-100) var(--bs-spacing-200) 0;"></bs-composer>
      <bs-ai-disclaimer style="padding: var(--bs-spacing-100) 0;">AI can make mistakes. Please verify important information.</bs-ai-disclaimer>

      <!-- Backdrop -->
      <div style="position: absolute; inset: 0; background: rgba(33, 38, 46, 0.32);"></div>

      <!-- Slide-in drawer, docked to the panel's own right edge -- not a separate side-by-side
           column, so it stays within the chat panel's own bounds like a real in-app drawer. -->
      <div style="position: absolute; top: 0; right: 0; bottom: 0; width: 85%; box-shadow: var(--bs-shadow-lg); background: var(--bs-surface-raised);">
        <bs-chatbot-sources-drawer heading="Sources">
          <bs-source-link file-name="Employee Handbook 2026" source-name="HoltePortalen" version="v3.2"></bs-source-link>
          <bs-source-link file-name="Payroll Processing Guide" source-name="WorkdayHQ" version="v2.4"></bs-source-link>
          <bs-source-link file-name="Benefits & Leave Policy" source-name="PeopleOps Wiki" version="v1.8"></bs-source-link>
        </bs-chatbot-sources-drawer>
      </div>
    </div>
  `,
};

export const UploadingAttachments: Story = {
  name: 'Uploading attachments',
  render: () => html`
    <div style=${PANEL_STYLE}>
      <bs-chatbot-header heading="Genie"></bs-chatbot-header>
      <div style=${TRANSCRIPT_STYLE}></div>
      <div style="margin: 0 var(--bs-spacing-200);">
        <bs-composer-status-banner
          type="info"
          message="Uploading files, please wait."
          style="margin-bottom: calc(-1 * var(--bs-spacing-150));"
        ></bs-composer-status-banner>
        <bs-composer aria-label="Message">
          <bs-attachment-list slot="attachments">
            <bs-attachment type="image" image-src="https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=200&h=200&fit=crop" loading></bs-attachment>
            <bs-attachment type="pdf" file-name="Dummy-pdf-in-here" loading></bs-attachment>
          </bs-attachment-list>
        </bs-composer>
      </div>
      <bs-ai-disclaimer style="padding: var(--bs-spacing-100) 0;">AI can make mistakes. Please verify important information.</bs-ai-disclaimer>
    </div>
  `,
};

export const SendFailed: Story = {
  name: 'Send failed',
  render: () => html`
    <div style=${PANEL_STYLE}>
      <bs-chatbot-header heading="Genie"></bs-chatbot-header>
      <div style=${TRANSCRIPT_STYLE}>
        <p style=${USER_BUBBLE_STYLE}>How do I submit a ByggSøk application?</p>
      </div>
      <div style="margin: 0 var(--bs-spacing-200);">
        <bs-composer-status-banner
          type="error"
          message="Message failed to send"
          show-button
          action-label="Retry"
          style="margin-bottom: calc(-1 * var(--bs-spacing-150));"
        ></bs-composer-status-banner>
        <bs-composer aria-label="Message"></bs-composer>
      </div>
      <bs-ai-disclaimer style="padding: var(--bs-spacing-100) 0;">AI can make mistakes. Please verify important information.</bs-ai-disclaimer>
    </div>
  `,
};
