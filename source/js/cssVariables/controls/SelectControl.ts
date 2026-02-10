/**
 * Select Control
 *
 * Dropdown control for CSS variables with predefined options.
 * Features:
 * - <select> dropdown with predefined choices
 * - Reset button
 */

import type { CSSVariable } from '../types';
import type { CSSVariableManager } from '../CSSVariableManager';

export class SelectControl {
  private variable: CSSVariable;
  private manager: CSSVariableManager;

  constructor(variable: CSSVariable, manager: CSSVariableManager) {
    this.variable = variable;
    this.manager = manager;
  }

  /**
   * Render the control
   *
   * @returns HTMLElement containing the control UI
   */
  public render(): HTMLElement {
    const wrapper = document.createElement('div');
    wrapper.className = 'settings-control__input-wrapper settings-control__input-wrapper--select';

    const currentValue = this.manager.getUserValue(this.variable.name) ||
                        this.manager.getCurrentValue(this.variable.name) ||
                        this.variable.defaultValue;

    // Select dropdown
    const select = document.createElement('select');
    select.className = 'settings-control__input settings-control__input--select';
    select.dataset.variable = this.variable.name;

    const options = this.variable.options || [currentValue];
    options.forEach(opt => {
      const option = document.createElement('option');
      option.value = opt;
      option.textContent = opt;
      if (opt === currentValue) {
        option.selected = true;
      }
      select.appendChild(option);
    });

    // Reset button
    const resetBtn = document.createElement('button');
    resetBtn.type = 'button';
    resetBtn.className = 'settings-control__reset';
    resetBtn.textContent = 'Reset';
    resetBtn.title = `Reset to default: ${this.variable.defaultValue}`;

    // Event listeners
    select.addEventListener('change', (e) => {
      const value = (e.target as HTMLSelectElement).value;
      this.manager.setValue(this.variable.name, value);
    });

    resetBtn.addEventListener('click', () => {
      this.manager.resetValue(this.variable.name);

      setTimeout(() => {
        const newValue = this.manager.getCurrentValue(this.variable.name) || this.variable.defaultValue;
        select.value = newValue;
      }, 10);
    });

    wrapper.appendChild(select);
    wrapper.appendChild(resetBtn);

    return wrapper;
  }
}
