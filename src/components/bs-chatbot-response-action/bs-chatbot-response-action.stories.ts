import type { Meta, StoryObj } from '@storybook/web-components-vite';
import { html } from 'lit';
import { componentDescription, propDescription } from '../../stories-utils';

interface BsChatbotResponseActionArgs {
  sourcesCount: number;
}

const meta: Meta<BsChatbotResponseActionArgs> = {
  title: 'Genie AI Components/bs-chatbot-response-action',
  parameters: { docs: { description: { component: componentDescription('bs-chatbot-response-action') } } },
  render: args => html` <bs-chatbot-response-action sources-count=${args.sourcesCount || undefined}></bs-chatbot-response-action> `,
  argTypes: {
    sourcesCount: { control: 'number', description: propDescription('bs-chatbot-response-action', 'sources-count') },
  },
  args: {
    sourcesCount: 3,
  },
};

export default meta;
type Story = StoryObj<BsChatbotResponseActionArgs>;

export const Default: Story = {};

export const NoSources: Story = {
  name: 'Without sources',
  args: {
    sourcesCount: 0,
  },
};

export const InResponseMessage: Story = {
  name: 'In an AI response message',
  render: () => html`
    <div style="max-width: 480px; font-family: sans-serif;">
      <p style="margin: 0; color: #1a1a1a; font-size: 14px; line-height: 20px;">
        This is a placeholder AI response message. It demonstrates how the action row sits directly below the
        response text, aligned to the left edge of the message.
      </p>
      <bs-chatbot-response-action sources-count="3"></bs-chatbot-response-action>
    </div>
  `,
};

const ReadAloudIcon = () => html`
  <svg slot="icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
    <path
      d="M7.5 15.75H3C2.80109 15.75 2.61032 15.671 2.46967 15.5303C2.32902 15.3897 2.25 15.1989 2.25 15V9C2.25 8.80109 2.32902 8.61032 2.46967 8.46967C2.61032 8.32902 2.80109 8.25 3 8.25H7.5L14.25 3V21L7.5 15.75Z"
      stroke="currentColor"
      stroke-width="2"
      stroke-linecap="round"
      stroke-linejoin="round"
    />
    <path d="M7.5 8.25V15.75" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
    <path
      d="M18 10.0172C18.4825 10.565 18.7487 11.27 18.7487 12C18.7487 12.73 18.4825 13.435 18 13.9828"
      stroke="currentColor"
      stroke-width="2"
      stroke-linecap="round"
      stroke-linejoin="round"
    />
    <path
      d="M20.7816 7.5C21.8885 8.73755 22.5004 10.3397 22.5004 12C22.5004 13.6603 21.8885 15.2624 20.7816 16.5"
      stroke="currentColor"
      stroke-width="2"
      stroke-linecap="round"
      stroke-linejoin="round"
    />
  </svg>
`;

const ChatWithHumanIcon = () => html`
  <svg slot="icon" viewBox="0 0 24.5 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
    <path
      d="M12.25 15C14.3211 15 16 13.3211 16 11.25C16 9.17893 14.3211 7.5 12.25 7.5C10.1789 7.5 8.5 9.17893 8.5 11.25C8.5 13.3211 10.1789 15 12.25 15Z"
      stroke="currentColor"
      stroke-width="2"
      stroke-linecap="round"
      stroke-linejoin="round"
    />
    <path
      d="M6.23125 18.6909C6.79554 17.5795 7.65659 16.6459 8.71895 15.9939C9.7813 15.3418 11.0035 14.9966 12.25 14.9966C13.4965 14.9966 14.7187 15.3418 15.7811 15.9939C16.8434 16.6459 17.7045 17.5795 18.2687 18.6909"
      stroke="currentColor"
      stroke-width="2"
      stroke-linecap="round"
      stroke-linejoin="round"
    />
    <path d="M19 12L21.25 14.25L23.5 12" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
    <path d="M1 12L3.25 9.75L5.5 12" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
    <path
      d="M3.25 9.75V12C3.24929 13.9055 3.85337 15.762 4.97524 17.3022C6.09712 18.8424 7.67888 19.9868 9.49273 20.5706C11.3066 21.1543 13.2589 21.1474 15.0685 20.5506C16.8782 19.9539 18.4517 18.7982 19.5625 17.25"
      stroke="currentColor"
      stroke-width="2"
      stroke-linecap="round"
      stroke-linejoin="round"
    />
    <path
      d="M21.25 14.25V12C21.2507 10.0945 20.6466 8.238 19.5248 6.69779C18.4029 5.15758 16.8211 4.01319 15.0073 3.42942C13.1934 2.84565 11.2411 2.85264 9.43147 3.44938C7.62185 4.04611 6.04832 5.2018 4.9375 6.75"
      stroke="currentColor"
      stroke-width="2"
      stroke-linecap="round"
      stroke-linejoin="round"
    />
  </svg>
`;

const RaiseTicketIcon = () => html`
  <svg slot="icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
    <path d="M9 5.25V18.75" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
    <path
      d="M2.25 15C3.04565 15 3.80871 14.6839 4.37132 14.1213C4.93393 13.5587 5.25 12.7956 5.25 12C5.25 11.2044 4.93393 10.4413 4.37132 9.87868C3.80871 9.31607 3.04565 9 2.25 9V6C2.25 5.80109 2.32902 5.61032 2.46967 5.46967C2.61032 5.32902 2.80109 5.25 3 5.25H21C21.1989 5.25 21.3897 5.32902 21.5303 5.46967C21.671 5.61032 21.75 5.80109 21.75 6V9C20.9544 9 20.1913 9.31607 19.6287 9.87868C19.0661 10.4413 18.75 11.2044 18.75 12C18.75 12.7956 19.0661 13.5587 19.6287 14.1213C20.1913 14.6839 20.9544 15 21.75 15V18C21.75 18.1989 21.671 18.3897 21.5303 18.5303C21.3897 18.671 21.1989 18.75 21 18.75H3C2.80109 18.75 2.61032 18.671 2.46967 18.5303C2.32902 18.3897 2.25 18.1989 2.25 18V15Z"
      stroke="currentColor"
      stroke-width="2"
      stroke-linecap="round"
      stroke-linejoin="round"
    />
  </svg>
`;

export const WithMenu: Story = {
  name: 'More options menu',
  render: () => {
    // Demonstrates the intended integration pattern: bs-chatbot-response-action only tracks/emits
    // the menuOpen toggle and provides a `menu` slot positioned below the kebab button -- it has no
    // opinion on what goes in the menu. The consuming app (here, this story) supplies a bs-menu with
    // real bs-menu-items and is responsible for wiring bsMenuOpen to the response-action's menuOpen
    // prop, mirroring how bs-chatbot-header's WithComposer story wires bsExpand.
    const onMenuOpen = (ev: CustomEvent<boolean>) => {
      (ev.target as HTMLBsChatbotResponseActionElement).menuOpen = ev.detail;
    };

    return html`
      <div style="max-width: 480px; font-family: sans-serif;">
        <bs-chatbot-response-action sources-count="3" @bsMenuOpen=${onMenuOpen}>
          <bs-menu slot="menu" style="width: 210px;">
            <bs-menu-item>${ReadAloudIcon()}Read aloud</bs-menu-item>
            <bs-menu-item>${ChatWithHumanIcon()}Chat with a human</bs-menu-item>
            <bs-menu-item>${RaiseTicketIcon()}Raise a ticket</bs-menu-item>
          </bs-menu>
        </bs-chatbot-response-action>
      </div>
    `;
  },
};
