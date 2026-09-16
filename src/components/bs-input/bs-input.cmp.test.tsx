import { render, h, describe, it, expect } from '@stencil/vitest';

describe('bs-input', () => {
  it('renders a native text input with an empty value by default', async () => {
    const { root } = await render(<bs-input></bs-input>);
    const input = root.shadowRoot.querySelector('input') as HTMLInputElement;
    expect(input).toEqualAttribute('type', 'text');
    expect(input.value).toBe('');
    expect(input).not.toHaveAttribute('disabled');
  });

  it('reflects the value prop to the native input', async () => {
    const { root } = await render(<bs-input value="hello"></bs-input>);
    const input = root.shadowRoot.querySelector('input') as HTMLInputElement;
    expect(input.value).toBe('hello');
  });

  (['text', 'email', 'password', 'number'] as const).forEach(type => {
    it(`applies type="${type}" to the native input`, async () => {
      const { root } = await render(<bs-input type={type}></bs-input>);
      const input = root.shadowRoot.querySelector('input');
      expect(input).toEqualAttribute('type', type);
    });
  });

  it('passes the placeholder prop through to the native input', async () => {
    const { root } = await render(<bs-input placeholder="Enter your name"></bs-input>);
    const input = root.shadowRoot.querySelector('input');
    expect(input).toEqualAttribute('placeholder', 'Enter your name');
  });

  it('does not render a label when the label prop is not set', async () => {
    const { root } = await render(<bs-input></bs-input>);
    expect(root.shadowRoot.querySelector('label')).toBeNull();
  });

  it('renders a label wired to the control via htmlFor/id when the label prop is set', async () => {
    const { root } = await render(<bs-input label="Email address"></bs-input>);
    const label = root.shadowRoot.querySelector('label');
    const input = root.shadowRoot.querySelector('input');
    expect(label).toHaveTextContent('Email address');
    expect(label).toEqualAttribute('for', 'control');
    expect(input).toEqualAttribute('id', 'control');
    expect(label).toEqualAttribute('part', 'label');
  });

  it('disables the native input when disabled is set', async () => {
    const { root } = await render(<bs-input disabled></bs-input>);
    const input = root.shadowRoot.querySelector('input');
    expect(input).toHaveAttribute('disabled');
  });

  it('renders the description when set and no error is present', async () => {
    const { root } = await render(<bs-input description="Must be a valid email"></bs-input>);
    const description = root.shadowRoot.querySelector('[part="description"]');
    const input = root.shadowRoot.querySelector('input');
    expect(description).toHaveTextContent('Must be a valid email');
    expect(root.shadowRoot.querySelector('[part="error"]')).toBeNull();
    expect(input).toEqualAttribute('aria-describedby', 'description-or-error');
    expect(input).not.toHaveAttribute('aria-invalid');
  });

  it('renders the error message instead of the description, applies the error class, and sets aria-invalid', async () => {
    const { root } = await render(<bs-input description="Must be a valid email" error="This field is required"></bs-input>);
    const error = root.shadowRoot.querySelector('[part="error"]');
    expect(error).toHaveTextContent('This field is required');
    expect(root.shadowRoot.querySelector('[part="description"]')).toBeNull();

    const wrapper = root.shadowRoot.querySelector('.bs-input');
    expect(wrapper).toHaveClass('bs-input--error');

    const input = root.shadowRoot.querySelector('input');
    expect(input).toEqualAttribute('aria-invalid', 'true');
    expect(input).toEqualAttribute('aria-describedby', 'description-or-error');
  });

  it('renders a warning icon before the error message, but not before the description', async () => {
    const { root } = await render(<bs-input error="This field is required"></bs-input>);
    expect(root.shadowRoot.querySelector('[part="error"] [part="error-icon"]')).not.toBeNull();

    const { root: rootWithDescription } = await render(<bs-input description="Helper text"></bs-input>);
    expect(rootWithDescription.shadowRoot.querySelector('[part="error-icon"]')).toBeNull();
  });

  it('emits bsInput with the current value as the user types', async () => {
    const { root, spyOnEvent } = await render(<bs-input></bs-input>);
    const bsInputSpy = spyOnEvent('bsInput');
    const input = root.shadowRoot.querySelector('input') as HTMLInputElement;

    input.value = 'a';
    input.dispatchEvent(new Event('input', { bubbles: true, composed: true }));

    expect(bsInputSpy).toHaveReceivedEventTimes(1);
    expect(bsInputSpy).toHaveReceivedEventDetail('a');
  });

  it('emits bsChange with the current value on native change', async () => {
    const { root, spyOnEvent } = await render(<bs-input></bs-input>);
    const bsChangeSpy = spyOnEvent('bsChange');
    const input = root.shadowRoot.querySelector('input') as HTMLInputElement;

    input.value = 'final value';
    input.dispatchEvent(new Event('change', { bubbles: true, composed: true }));

    expect(bsChangeSpy).toHaveReceivedEventTimes(1);
    expect(bsChangeSpy).toHaveReceivedEventDetail('final value');
  });

  it('does not emit bsChange on input, or bsInput on change', async () => {
    const { root, spyOnEvent } = await render(<bs-input></bs-input>);
    const bsInputSpy = spyOnEvent('bsInput');
    const bsChangeSpy = spyOnEvent('bsChange');
    const input = root.shadowRoot.querySelector('input') as HTMLInputElement;

    input.value = 'x';
    input.dispatchEvent(new Event('input', { bubbles: true, composed: true }));
    expect(bsChangeSpy.length).toBe(0);

    input.dispatchEvent(new Event('change', { bubbles: true, composed: true }));
    expect(bsInputSpy).toHaveReceivedEventTimes(1);
  });

  it('applies bs-input__icon--visible when the icon slot has assigned content', async () => {
    const { root } = await render(
      <bs-input>
        <svg slot="icon" viewBox="0 0 16 16"></svg>
      </bs-input>,
    );
    const icon = root.shadowRoot.querySelector('[part="icon"]');
    expect(icon).toHaveClass('bs-input__icon--visible');
  });

  it('does not apply bs-input__icon--visible when the icon slot is empty', async () => {
    const { root } = await render(<bs-input></bs-input>);
    const icon = root.shadowRoot.querySelector('[part="icon"]');
    expect(icon).not.toHaveClass('bs-input__icon--visible');
  });

  it('applies bs-input__end-icon--visible when the end-icon slot has assigned content', async () => {
    const { root } = await render(
      <bs-input>
        <svg slot="end-icon" viewBox="0 0 16 16"></svg>
      </bs-input>,
    );
    const endIcon = root.shadowRoot.querySelector('[part="end-icon"]');
    expect(endIcon).toHaveClass('bs-input__end-icon--visible');
  });

  it('does not apply bs-input__end-icon--visible when the end-icon slot is empty', async () => {
    const { root } = await render(<bs-input></bs-input>);
    const endIcon = root.shadowRoot.querySelector('[part="end-icon"]');
    expect(endIcon).not.toHaveClass('bs-input__end-icon--visible');
  });

  it('applies bs-input__field--error to the field wrapper when error is set', async () => {
    const { root } = await render(<bs-input error="Required"></bs-input>);
    const field = root.shadowRoot.querySelector('[part="field"]');
    expect(field).toHaveClass('bs-input__field--error');
  });

  it('applies bs-input__field--disabled to the field wrapper when disabled is set', async () => {
    const { root } = await render(<bs-input disabled></bs-input>);
    const field = root.shadowRoot.querySelector('[part="field"]');
    expect(field).toHaveClass('bs-input__field--disabled');
  });

  it('delegates focus from the host to the native input (delegatesFocus)', async () => {
    const { root } = await render(<bs-input label="Name"></bs-input>);
    const input = root.shadowRoot.querySelector('input') as HTMLInputElement;

    (root as unknown as HTMLElement).focus();

    expect(root.shadowRoot.activeElement).toBe(input);
    expect(document.activeElement).toBe(root);
  });

  describe('required', () => {
    it('renders a red asterisk after the label when required is set', async () => {
      const { root } = await render(<bs-input label="Name" required></bs-input>);
      const required = root.shadowRoot.querySelector('[part="required"]');
      expect(required).toHaveTextContent('*');
    });

    it('does not render an asterisk when required is not set', async () => {
      const { root } = await render(<bs-input label="Name"></bs-input>);
      expect(root.shadowRoot.querySelector('[part="required"]')).toBeNull();
    });

    it('sets aria-required on the control when required is set', async () => {
      const { root } = await render(<bs-input required></bs-input>);
      const input = root.shadowRoot.querySelector('input');
      expect(input).toEqualAttribute('aria-required', 'true');
    });
  });

  (['search', 'date'] as const).forEach(type => {
    it(`applies type="${type}" to the native input`, async () => {
      const { root } = await render(<bs-input type={type}></bs-input>);
      const input = root.shadowRoot.querySelector('input');
      expect(input).toEqualAttribute('type', type);
    });
  });

  describe('type="search"', () => {
    it('renders a default magnifying-glass icon in the leading icon position when nothing is slotted', async () => {
      const { root } = await render(<bs-input type="search"></bs-input>);
      const icon = root.shadowRoot.querySelector('[part="icon"]');
      expect(icon).toHaveClass('bs-input__icon--visible');
      expect(root.shadowRoot.querySelector('.bs-input__search-icon')).not.toBeNull();
    });

    it('uses the slotted icon instead of the default when one is provided', async () => {
      const { root } = await render(
        <bs-input type="search">
          <svg slot="icon" viewBox="0 0 16 16"></svg>
        </bs-input>,
      );
      expect(root.shadowRoot.querySelector('.bs-input__search-icon')).toBeNull();
      const icon = root.shadowRoot.querySelector('[part="icon"]');
      expect(icon).toHaveClass('bs-input__icon--visible');
    });

    it('does not render the default magnifying-glass icon for other types', async () => {
      const { root } = await render(<bs-input type="text"></bs-input>);
      const icon = root.shadowRoot.querySelector('[part="icon"]');
      expect(icon).not.toHaveClass('bs-input__icon--visible');
      expect(root.shadowRoot.querySelector('.bs-input__search-icon')).toBeNull();
    });
  });

  describe('type="number"', () => {
    it('renders increment/decrement stepper buttons instead of an end-icon slot', async () => {
      const { root } = await render(<bs-input type="number" value="1"></bs-input>);
      const buttons = root.shadowRoot.querySelectorAll('.bs-input__stepper-btn');
      expect(buttons.length).toBe(2);
    });

    it('increments the value on the increment button, respecting max', async () => {
      const { root, spyOnEvent } = await render(<bs-input type="number" value="9" step={1} max={10}></bs-input>);
      const bsChangeSpy = spyOnEvent('bsChange');
      const [incrementBtn] = Array.from(root.shadowRoot.querySelectorAll('.bs-input__stepper-btn')) as HTMLButtonElement[];

      incrementBtn.click();
      expect(bsChangeSpy).toHaveReceivedEventDetail('10');

      incrementBtn.click();
      expect(bsChangeSpy).toHaveReceivedEventDetail('10');
    });

    it('decrements the value on the decrement button, respecting min', async () => {
      const { root, spyOnEvent } = await render(<bs-input type="number" value="0" step={1} min={0}></bs-input>);
      const bsChangeSpy = spyOnEvent('bsChange');
      const [, decrementBtn] = Array.from(root.shadowRoot.querySelectorAll('.bs-input__stepper-btn')) as HTMLButtonElement[];

      decrementBtn.click();
      expect(bsChangeSpy).toHaveReceivedEventDetail('0');
    });
  });

  describe('type="password"', () => {
    it('renders a show-password toggle button in the end-icon position', async () => {
      const { root } = await render(<bs-input type="password"></bs-input>);
      const toggle = root.shadowRoot.querySelector('.bs-input__password-toggle');
      expect(toggle).toEqualAttribute('aria-label', 'Show password');
    });

    it('toggles the rendered native input type and aria-label when clicked', async () => {
      const { root, waitForChanges } = await render(<bs-input type="password"></bs-input>);
      const toggle = root.shadowRoot.querySelector('.bs-input__password-toggle') as HTMLButtonElement;

      toggle.click();
      await waitForChanges();

      const input = root.shadowRoot.querySelector('input');
      expect(input).toEqualAttribute('type', 'text');
      const toggleAfter = root.shadowRoot.querySelector('.bs-input__password-toggle');
      expect(toggleAfter).toEqualAttribute('aria-label', 'Hide password');
    });

    it('is a type="button" so it never submits an enclosing form', async () => {
      const { root } = await render(<bs-input type="password"></bs-input>);
      const toggle = root.shadowRoot.querySelector('.bs-input__password-toggle');
      expect(toggle).toEqualAttribute('type', 'button');
    });
  });

  describe('type="dropdown"', () => {
    it('renders the control as readonly, not disabled', async () => {
      const { root } = await render(<bs-input type="dropdown"></bs-input>);
      const input = root.shadowRoot.querySelector('input');
      expect(input).toHaveAttribute('readonly');
      expect(input).not.toHaveAttribute('disabled');
    });

    it('toggles open and emits bsOpen when the field is clicked', async () => {
      const { root, waitForChanges, spyOnEvent } = await render(<bs-input type="dropdown"></bs-input>);
      const bsOpenSpy = spyOnEvent('bsOpen');
      const field = root.shadowRoot.querySelector('[part="field"]') as HTMLElement;

      field.click();
      await waitForChanges();
      expect(bsOpenSpy).toHaveReceivedEventDetail(true);
      expect(root).toEqualAttribute('open', '');

      field.click();
      await waitForChanges();
      expect(bsOpenSpy).toHaveReceivedEventDetail(false);
      expect(root).not.toHaveAttribute('open');
    });

    it('does not render a bs-menu when there are no options, even if open', async () => {
      const { root } = await render(<bs-input type="dropdown" open></bs-input>);
      expect(root.shadowRoot.querySelector('bs-menu')).toBeNull();
    });

    it('renders a bs-menu with one bs-menu-item per option when open', async () => {
      const { root } = await render(<bs-input type="dropdown" open options={[{ label: 'Denmark', value: 'dk' }, { label: 'Sweden', value: 'se' }]}></bs-input>);
      const items = root.shadowRoot.querySelectorAll('bs-menu-item');
      expect(items.length).toBe(2);
      expect(items[0]).toHaveTextContent('Denmark');
      expect(items[1]).toHaveTextContent('Sweden');
    });

    it('does not render the bs-menu when closed', async () => {
      const { root } = await render(<bs-input type="dropdown" options={[{ label: 'Denmark', value: 'dk' }]}></bs-input>);
      expect(root.shadowRoot.querySelector('bs-menu')).toBeNull();
    });

    it('selecting an option sets value, closes the menu, and emits bsChange', async () => {
      const { root, waitForChanges, spyOnEvent } = await render(
        <bs-input type="dropdown" open options={[{ label: 'Denmark', value: 'dk' }, { label: 'Sweden', value: 'se' }]}></bs-input>,
      );
      const bsChangeSpy = spyOnEvent('bsChange');
      const item = root.shadowRoot.querySelectorAll('bs-menu-item')[1] as HTMLElement;

      item.dispatchEvent(new CustomEvent('bsSelect', { bubbles: true, composed: true }));
      await waitForChanges();

      expect(bsChangeSpy).toHaveReceivedEventDetail('Sweden');
      expect(root).not.toHaveAttribute('open');
      expect(root.shadowRoot.querySelector('bs-menu')).toBeNull();
      const input = root.shadowRoot.querySelector('input') as HTMLInputElement;
      expect(input.value).toBe('Sweden');
    });

    it('closes the menu on Escape', async () => {
      const { root, waitForChanges } = await render(
        <bs-input type="dropdown" open options={[{ label: 'Denmark', value: 'dk' }]}></bs-input>,
      );
      (root as unknown as HTMLElement).dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true, composed: true }));
      await waitForChanges();
      expect(root).not.toHaveAttribute('open');
    });
  });

  describe('type="select"', () => {
    it('renders a native select with an option per entry', async () => {
      const { root } = await render(
        <bs-input
          type="select"
          options={[
            { label: 'One', value: '1' },
            { label: 'Two', value: '2' },
          ]}
        ></bs-input>,
      );
      const select = root.shadowRoot.querySelector('select');
      const options = select.querySelectorAll('option');
      expect(options.length).toBe(2);
      expect(options[1]).toHaveTextContent('Two');
    });

    it('emits bsChange with the selected value on change', async () => {
      const { root, spyOnEvent } = await render(
        <bs-input
          type="select"
          options={[
            { label: 'One', value: '1' },
            { label: 'Two', value: '2' },
          ]}
        ></bs-input>,
      );
      const bsChangeSpy = spyOnEvent('bsChange');
      const select = root.shadowRoot.querySelector('select') as HTMLSelectElement;

      select.value = '2';
      select.dispatchEvent(new Event('change', { bubbles: true, composed: true }));

      expect(bsChangeSpy).toHaveReceivedEventDetail('2');
    });
  });

  describe('type="textarea"', () => {
    it('renders a native textarea with the rows prop applied', async () => {
      const { root } = await render(<bs-input type="textarea" rows={5} value="hello"></bs-input>);
      const textarea = root.shadowRoot.querySelector('textarea') as HTMLTextAreaElement;
      expect(textarea).toEqualAttribute('rows', '5');
      expect(textarea.value).toBe('hello');
    });
  });

  describe('type="chip"', () => {
    it('renders a chip per entry with a remove button', async () => {
      const { root } = await render(<bs-input type="chip" chips={['red', 'blue']}></bs-input>);
      const chips = root.shadowRoot.querySelectorAll('.bs-input__chip');
      expect(chips.length).toBe(2);
      expect(chips[0]).toHaveTextContent('red');
    });

    it('commits the draft input as a new chip on Enter and clears it', async () => {
      const { root, spyOnEvent } = await render(<bs-input type="chip" chips={[]}></bs-input>);
      const bsChipAddSpy = spyOnEvent('bsChipAdd');
      const input = root.shadowRoot.querySelector('.bs-input__chip-input') as HTMLInputElement;

      input.value = 'green';
      input.dispatchEvent(new Event('input', { bubbles: true, composed: true }));
      input.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true, composed: true }));

      expect(bsChipAddSpy).toHaveReceivedEventDetail('green');
    });

    it('emits bsChipRemove when a chip remove button is clicked', async () => {
      const { root, spyOnEvent } = await render(<bs-input type="chip" chips={['red']}></bs-input>);
      const bsChipRemoveSpy = spyOnEvent('bsChipRemove');
      const removeBtn = root.shadowRoot.querySelector('.bs-input__chip-remove') as HTMLButtonElement;

      removeBtn.click();

      expect(bsChipRemoveSpy).toHaveReceivedEventDetail('red');
    });
  });

  describe('type="initials"', () => {
    it('renders a title select followed by a text input, sharing one label', async () => {
      const { root } = await render(
        <bs-input type="initials" label="Name" titleOptions={['Mrs.', 'Mr.', 'Dr.']}></bs-input>,
      );
      const select = root.shadowRoot.querySelector('.bs-input__title-select');
      const input = root.shadowRoot.querySelector('input');
      const label = root.shadowRoot.querySelector('label');
      expect(select.querySelectorAll('option').length).toBe(3);
      expect(label).toEqualAttribute('for', 'control');
      expect(input).toEqualAttribute('id', 'control');
    });

    it('emits bsTitleChange when the title select changes', async () => {
      const { root, spyOnEvent } = await render(<bs-input type="initials" titleOptions={['Mrs.', 'Mr.']}></bs-input>);
      const bsTitleChangeSpy = spyOnEvent('bsTitleChange');
      const select = root.shadowRoot.querySelector('.bs-input__title-select') as HTMLSelectElement;

      select.value = 'Mr.';
      select.dispatchEvent(new Event('change', { bubbles: true, composed: true }));

      expect(bsTitleChangeSpy).toHaveReceivedEventDetail('Mr.');
    });
  });

  describe('type="country"', () => {
    it('renders a country select followed by a text input', async () => {
      const { root } = await render(
        <bs-input type="country" countryOptions={[{ code: 'DK', label: 'Denmark' }, { code: 'US', label: 'United States' }]}></bs-input>,
      );
      const select = root.shadowRoot.querySelector('.bs-input__country-select');
      expect(select.querySelectorAll('option').length).toBe(2);
    });

    it('emits bsCountryChange when the country select changes', async () => {
      const { root, spyOnEvent } = await render(
        <bs-input type="country" countryOptions={[{ code: 'DK', label: 'Denmark' }, { code: 'US', label: 'United States' }]}></bs-input>,
      );
      const bsCountryChangeSpy = spyOnEvent('bsCountryChange');
      const select = root.shadowRoot.querySelector('.bs-input__country-select') as HTMLSelectElement;

      select.value = 'US';
      select.dispatchEvent(new Event('change', { bubbles: true, composed: true }));

      expect(bsCountryChangeSpy).toHaveReceivedEventDetail('US');
    });
  });

  describe('type="pin"', () => {
    it('renders one input cell per length', async () => {
      const { root } = await render(<bs-input type="pin" length={4}></bs-input>);
      const cells = root.shadowRoot.querySelectorAll('.bs-input__pin-cell');
      expect(cells.length).toBe(4);
    });

    it('auto-advances focus to the next cell when a digit is typed', async () => {
      const { root } = await render(<bs-input type="pin" length={4}></bs-input>);
      const cells = Array.from(root.shadowRoot.querySelectorAll('.bs-input__pin-cell')) as HTMLInputElement[];

      cells[0].value = '1';
      cells[0].dispatchEvent(new InputEvent('input', { bubbles: true, composed: true }));

      expect(root.shadowRoot.activeElement).toBe(cells[1]);
    });

    it('moves focus to the previous cell on backspace in an empty cell', async () => {
      const { root } = await render(<bs-input type="pin" length={4}></bs-input>);
      const cells = Array.from(root.shadowRoot.querySelectorAll('.bs-input__pin-cell')) as HTMLInputElement[];
      cells[1].focus();

      cells[1].dispatchEvent(new KeyboardEvent('keydown', { key: 'Backspace', bubbles: true, composed: true }));

      expect(root.shadowRoot.activeElement).toBe(cells[0]);
    });

    it('emits bsChange with the concatenated pin value as cells are typed', async () => {
      const { root, spyOnEvent } = await render(<bs-input type="pin" length={2}></bs-input>);
      const bsChangeSpy = spyOnEvent('bsChange');
      const cells = Array.from(root.shadowRoot.querySelectorAll('.bs-input__pin-cell')) as HTMLInputElement[];

      cells[0].value = '4';
      cells[0].dispatchEvent(new InputEvent('input', { bubbles: true, composed: true }));

      expect(bsChangeSpy).toHaveReceivedEventDetail('4');
    });
  });
});
