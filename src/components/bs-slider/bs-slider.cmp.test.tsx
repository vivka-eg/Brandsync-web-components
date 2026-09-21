import { render, h, describe, it, expect } from '@stencil/vitest';

describe('bs-slider', () => {
  it('renders a native range input by default with the given value/min/max', async () => {
    const { root } = await render(<bs-slider min={0} max={100} value={40}></bs-slider>);
    const input = root.shadowRoot.querySelector('input[type="range"]') as HTMLInputElement;
    expect(input).not.toBeNull();
    expect(input.value).toBe('40');
    expect(input).toEqualAttribute('min', '0');
    expect(input).toEqualAttribute('max', '100');
  });

  it('renders the label and one editable percentage field when showLabel is true (default)', async () => {
    const { root } = await render(<bs-slider label="Volume" value={20}></bs-slider>);
    expect(root.shadowRoot.querySelector('[part="label"]').textContent).toBe('Volume');
    expect(root.shadowRoot.querySelectorAll('[part="field"]').length).toBe(1);
  });

  it('renders static min/max bound labels flanking the track when showLabel is true', async () => {
    const { root } = await render(<bs-slider min={0} max={100} value={20}></bs-slider>);
    const bounds = root.shadowRoot.querySelectorAll('[part="bound"]');
    expect(bounds.length).toBe(2);
    expect(bounds[0].textContent).toBe('0');
    expect(bounds[1].textContent).toBe('100');
  });

  describe('accessible name', () => {
    it('associates the range input with the visible "Label" text via aria-labelledby when no ariaLabel is set', async () => {
      const { root } = await render(<bs-slider label="Volume" value={20}></bs-slider>);
      const input = root.shadowRoot.querySelector('input[type="range"]') as HTMLInputElement;
      const labelId = input.getAttribute('aria-labelledby');
      expect(labelId).not.toBeNull();
      expect(root.shadowRoot.getElementById(labelId!).textContent).toBe('Volume');
      expect(input.getAttribute('aria-label')).toBeNull();
    });

    it('prefers an explicit ariaLabel over the visible label text', async () => {
      const { root } = await render(<bs-slider label="Volume" ariaLabel="Custom name" value={20}></bs-slider>);
      const input = root.shadowRoot.querySelector('input[type="range"]') as HTMLInputElement;
      expect(input.getAttribute('aria-label')).toBe('Custom name');
      expect(input.getAttribute('aria-labelledby')).toBeNull();
    });
  });

  it('renders no label, value field, or bounds when showLabel is false', async () => {
    const { root } = await render(<bs-slider showLabel={false}></bs-slider>);
    expect(root.shadowRoot.querySelector('[part="label"]')).toBeNull();
    expect(root.shadowRoot.querySelectorAll('[part="field"]').length).toBe(0);
    expect(root.shadowRoot.querySelectorAll('[part="bound"]').length).toBe(0);
  });

  describe('value clamping', () => {
    it('clamps a percentage entered in the value field above 100 down to max', async () => {
      const { root, waitForChanges } = await render(<bs-slider min={0} max={100} value={40}></bs-slider>);
      const valueField = root.shadowRoot.querySelector('[part="field"] input') as HTMLInputElement;
      valueField.value = '999';
      valueField.dispatchEvent(new Event('change'));
      await waitForChanges();

      const rangeInput = root.shadowRoot.querySelector('input[type="range"]') as HTMLInputElement;
      expect(rangeInput.value).toBe('100');
    });

    it('clamps a percentage entered in the value field below 0 up to min', async () => {
      const { root, waitForChanges } = await render(<bs-slider min={10} max={100} value={40}></bs-slider>);
      const valueField = root.shadowRoot.querySelector('[part="field"] input') as HTMLInputElement;
      valueField.value = '-50';
      valueField.dispatchEvent(new Event('change'));
      await waitForChanges();

      const rangeInput = root.shadowRoot.querySelector('input[type="range"]') as HTMLInputElement;
      expect(rangeInput.value).toBe('10');
    });
  });

  it('fires bsChange with the new value when the range input changes', async () => {
    const { root, waitForChanges, spyOnEvent } = await render(<bs-slider min={0} max={100} value={10}></bs-slider>);
    const bsChangeSpy = spyOnEvent('bsChange');
    const input = root.shadowRoot.querySelector('input[type="range"]') as HTMLInputElement;

    input.value = '55';
    input.dispatchEvent(new Event('change'));
    await waitForChanges();

    expect(bsChangeSpy).toHaveReceivedEventTimes(1);
    expect(bsChangeSpy).toHaveReceivedEventDetail(55);
  });

  describe('disabled', () => {
    it('sets the disabled attribute on the range input and value fields', async () => {
      const { root } = await render(<bs-slider disabled></bs-slider>);
      const input = root.shadowRoot.querySelector('input[type="range"]');
      expect(input).toHaveAttribute('disabled');
      root.shadowRoot.querySelectorAll('[part="field"] input').forEach(field => {
        expect(field).toHaveAttribute('disabled');
      });
    });

    it('prevents value changes via the range input', async () => {
      const { root, waitForChanges, spyOnEvent } = await render(<bs-slider disabled value={10}></bs-slider>);
      const bsChangeSpy = spyOnEvent('bsChange');
      const input = root.shadowRoot.querySelector('input[type="range"]') as HTMLInputElement;

      input.value = '90';
      input.dispatchEvent(new Event('change'));
      await waitForChanges();

      expect(bsChangeSpy).toHaveReceivedEventTimes(0);
    });
  });

  describe('type="range"', () => {
    it('renders two range inputs for the start/end thumbs', async () => {
      const { root } = await render(<bs-slider type="range" min={0} max={100} valueStart={20} valueEnd={80}></bs-slider>);
      const inputs = root.shadowRoot.querySelectorAll('input[type="range"]') as NodeListOf<HTMLInputElement>;
      expect(inputs.length).toBe(2);
      expect(inputs[0].value).toBe('20');
      expect(inputs[1].value).toBe('80');
    });

    it('fires bsRangeChange when the start thumb changes, clamped to not exceed the end value', async () => {
      const { root, waitForChanges, spyOnEvent } = await render(
        <bs-slider type="range" min={0} max={100} valueStart={20} valueEnd={80}></bs-slider>,
      );
      const bsRangeChangeSpy = spyOnEvent('bsRangeChange');
      const inputs = root.shadowRoot.querySelectorAll('input[type="range"]') as NodeListOf<HTMLInputElement>;
      const startInput = inputs[0];

      startInput.value = '95';
      startInput.dispatchEvent(new Event('change'));
      await waitForChanges();

      expect(bsRangeChangeSpy).toHaveReceivedEventTimes(1);
      expect(bsRangeChangeSpy).toHaveReceivedEventDetail({ start: 80, end: 80 });
    });

    it('fires bsRangeChange when the end thumb changes, clamped to not go below the start value', async () => {
      const { root, waitForChanges, spyOnEvent } = await render(
        <bs-slider type="range" min={0} max={100} valueStart={20} valueEnd={80}></bs-slider>,
      );
      const bsRangeChangeSpy = spyOnEvent('bsRangeChange');
      const inputs = root.shadowRoot.querySelectorAll('input[type="range"]') as NodeListOf<HTMLInputElement>;
      const endInput = inputs[1];

      endInput.value = '5';
      endInput.dispatchEvent(new Event('change'));
      await waitForChanges();

      expect(bsRangeChangeSpy).toHaveReceivedEventTimes(1);
      expect(bsRangeChangeSpy).toHaveReceivedEventDetail({ start: 20, end: 20 });
    });
  });

  describe('type="segmented"', () => {
    it('renders segments + 1 tick marks, with the first hidden', async () => {
      const { root } = await render(<bs-slider type="segmented" segments={5}></bs-slider>);
      const ticks = root.shadowRoot.querySelectorAll('.bs-slider__tick');
      expect(ticks.length).toBe(6);
      expect(ticks[0]).toHaveClass('bs-slider__tick--hidden');
      expect(ticks[1]).not.toHaveClass('bs-slider__tick--hidden');
    });

    it('derives the range input step from (max - min) / segments', async () => {
      const { root } = await render(<bs-slider type="segmented" min={0} max={100} segments={4}></bs-slider>);
      const input = root.shadowRoot.querySelector('input[type="range"]');
      expect(input).toEqualAttribute('step', '25');
    });
  });
});
