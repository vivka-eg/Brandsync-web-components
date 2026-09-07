import type { Meta, StoryObj } from '@storybook/web-components-vite';
import { html } from 'lit';
import { componentDescription, propDescription } from '../../stories-utils';
import type { BsComposerVariant, BsComposerState } from './bs-composer';

interface BsComposerArgs {
  variant: BsComposerVariant;
  state: BsComposerState;
  value: string;
  placeholder: string;
}

const variants: BsComposerVariant[] = ['ai', 'human'];
const states: BsComposerState[] = ['idle', 'generating', 'disabled', 'recording'];

const meta: Meta<BsComposerArgs> = {
  title: 'Genie AI Components/bs-composer',
  parameters: { docs: { description: { component: componentDescription('bs-composer') } } },
  render: args => html`
    <bs-composer
      variant=${args.variant}
      state=${args.state}
      value=${args.value}
      placeholder=${args.placeholder}
      aria-label="Message"
    ></bs-composer>
  `,
  argTypes: {
    variant: { control: 'select', options: variants, description: propDescription('bs-composer', 'variant') },
    state: { control: 'select', options: states, description: propDescription('bs-composer', 'state') },
    value: { control: 'text', description: propDescription('bs-composer', 'value') },
    placeholder: { control: 'text', description: propDescription('bs-composer', 'placeholder') },
  },
  args: {
    variant: 'ai',
    state: 'idle',
    value: '',
    placeholder: '',
  },
};

export default meta;
type Story = StoryObj<BsComposerArgs>;

export const Default: Story = {};

export const Human: Story = {
  args: { variant: 'human' },
};

export const Generating: Story = {
  args: { state: 'generating', value: 'Summarize this thread for me' },
};

export const Disabled: Story = {
  args: { state: 'disabled' },
};

export const Recording: Story = {
  args: { state: 'recording', value: 'Here is what I have so far' },
};

export const AllStates: Story = {
  name: 'All variants × states',
  render: () => html`
    <div style="display:flex; flex-direction:column; gap:24px; max-width: 420px;">
      ${variants.map(
        variant => html`
          <div style="display:flex; flex-direction:column; gap:12px;">
            <h4 style="margin:0; font-family: sans-serif; text-transform: capitalize;">${variant}</h4>
            ${states.map(
              state => html`
                <div>
                  <div style="font-size: 12px; font-family: monospace; color: #888; margin-bottom: 4px;">${state}</div>
                  <bs-composer
                    variant=${variant}
                    state=${state}
                    value=${state === 'recording' ? 'Here is what I have so far' : ''}
                    aria-label="Message"
                  ></bs-composer>
                </div>
              `,
            )}
          </div>
        `,
      )}
    </div>
  `,
};
