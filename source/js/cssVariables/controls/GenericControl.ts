/**
 * Generic Control
 *
 * Fallback input control for CSS variables that don't match specific types.
 * Features:
 * - Simple text input
 * - No validation (accepts any value)
 * - Reset button
 *
 * Used for:
 * - CSS variables with var() references
 * - Complex calc() expressions
 * - Unknown or mixed types
 */

import type { CSSVariable } from '../types';
import type { CSSVariableManager } from '../CSSVariableManager';

export class GenericControl {
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
    wrapper.className = 'settings-control__input-wrapper';

    const currentValue = this.manager.getUserValue(this.variable.name) ||
                        this.manager.getCurrentValue(this.variable.name) ||
                        this.variable.defaultValue;

    // Text input
    const input = document.createElement('input');
    input.type = 'text';
    input.className = 'settings-control__input settings-control__input--text';
    input.value = currentValue;
    input.placeholder = 'Enter value';

    // Reset button
    const resetBtn = document.createElement('button');
    resetBtn.type = 'button';
    resetBtn.className = 'settings-control__reset';
    resetBtn.textContent = 'Reset';
    resetBtn.title = `Reset to default: ${this.variable.defaultValue}`;

    // Event listeners
    input.addEventListener('input', (e) => {
      const value = (e.target as HTMLInputElement).value;
      this.manager.setValue(this.variable.name, value);
    });

    resetBtn.addEventListener('click', () => {
      this.manager.resetValue(this.variable.name);
      input.value = this.variable.defaultValue;
    });

    wrapper.appendChild(input);
    wrapper.appendChild(resetBtn);

    return wrapper;
  }
}
