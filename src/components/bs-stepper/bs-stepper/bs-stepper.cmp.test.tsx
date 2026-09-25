import { render, h, describe, it, expect } from '@stencil/vitest';

describe('bs-stepper', () => {
  it('propagates computedState to slotted steps based on position relative to currentStep', async () => {
    const { root, waitForChanges } = await render(
      <bs-stepper currentStep={2}>
        <bs-stepper-step name="Cart"></bs-stepper-step>
        <bs-stepper-step name="Shipping"></bs-stepper-step>
        <bs-stepper-step name="Payment"></bs-stepper-step>
        <bs-stepper-step name="Confirm"></bs-stepper-step>
      </bs-stepper>,
    );
    await waitForChanges();
    const steps = root.querySelectorAll('bs-stepper-step') as NodeListOf<HTMLElement & { computedState: string }>;
    expect(steps[0].computedState).toBe('done');
    expect(steps[1].computedState).toBe('done');
    expect(steps[2].computedState).toBe('current');
    expect(steps[3].computedState).toBe('enabled');
  });

  it('re-propagates computedState when currentStep changes', async () => {
    const { root, waitForChanges } = await render(
      <bs-stepper currentStep={0}>
        <bs-stepper-step name="A"></bs-stepper-step>
        <bs-stepper-step name="B"></bs-stepper-step>
      </bs-stepper>,
    );
    await waitForChanges();
    (root as HTMLElement & { currentStep: number }).currentStep = 1;
    await waitForChanges();
    const steps = root.querySelectorAll('bs-stepper-step') as NodeListOf<HTMLElement & { computedState: string }>;
    expect(steps[0].computedState).toBe('done');
    expect(steps[1].computedState).toBe('current');
  });

  it('propagates direction and showDescription to slotted steps', async () => {
    const { root, waitForChanges } = await render(
      <bs-stepper direction="vertical" showDescription={false}>
        <bs-stepper-step name="A"></bs-stepper-step>
      </bs-stepper>,
    );
    await waitForChanges();
    const step = root.querySelector('bs-stepper-step') as HTMLElement & { direction: string; showDescription: boolean };
    expect(step.direction).toBe('vertical');
    expect(step.showDescription).toBe(false);
  });

  it('propagates the current props to a step added after initial render', async () => {
    // currentStep=0 and this being the only (so index-0) step once appended -- 0 === 0 -> "current".
    const { root, waitForChanges } = await render(<bs-stepper currentStep={0}></bs-stepper>);
    await waitForChanges();
    const step = document.createElement('bs-stepper-step') as HTMLElement & { computedState: string };
    step.setAttribute('name', 'Late add');
    root.appendChild(step);
    await waitForChanges();
    expect(step.computedState).toBe('current');
  });

  it('reflects the direction attribute for the container itself', async () => {
    const { root } = await render(<bs-stepper direction="vertical"></bs-stepper>);
    expect(root).toEqualAttribute('direction', 'vertical');
  });
});
