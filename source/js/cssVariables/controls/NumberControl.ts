/**
 * Number Control
 *
 * Input control for number-type CSS variables (pure numbers, multipliers, z-index, etc.)
 * Features:
 * - Number input with step support
 * - Range slider for certain variables
 * - Reset button
 */

import type { CSSVariable } from '../types';
import type { CSSVariableManager } from '../CSSVariableManager';

export class NumberControl {
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

    // Determine if this is a multiplier (0-2 range)
    const isMultiplier = this.variable.name.includes('amount') ||
                        this.variable.name.includes('multiplier');

    // Number input
    const input = document.createElement('input');
    input.type = 'number';
    input.className = 'settings-control__input settings-control__input--number';
    input.value = this.extractNumber(currentValue);

    if (isMultiplier) {
      input.min = '0';
      input.max = '2';
      input.step = '0.1';
    } else {
      input.step = '1';
    }

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

      // Wait a tick for DOM to update, then read computed value
      setTimeout(() => {
        const computedValue = this.manager.getCurrentValue(this.variable.name);
        input.value = this.extractNumber(computedValue || this.variable.defaultValue);
      }, 10);
    });

    wrapper.appendChild(input);
    wrapper.appendChild(resetBtn);

    return wrapper;
  }

  /**
   * Extract numeric value from string
   * Handles calc() expressions and var() references
   *
   * @private
   * @param value - Value string
   * @returns Numeric string
   */
  private extractNumber(value: string): string {
    // Pure number
    if (/^-?\d+(\.\d+)?$/.test(value.trim())) {
      return value.trim();
    }

    // Extract from calc()
    const calcMatch = value.match(/calc\(([^)]+)\)/);
    if (calcMatch) {
      // Just return the whole value for complex expressions
      return value;
    }

    // Default to 0 for complex values
    return value;
  }
}
