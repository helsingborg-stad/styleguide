/**
 * Size Control
 *
 * Input control for size-type CSS variables (px, rem, em, %, etc.)
 * Features:
 * - Text input with unit validation
 * - Common unit suggestions
 * - Reset button
 * - Real-time validation
 */

import type { CSSVariable } from '../types';
import type { CSSVariableManager } from '../CSSVariableManager';

export class SizeControl {
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

    // Get user value if exists, otherwise get computed value (resolves calc())
    const userValue = this.manager.getUserValue(this.variable.name);
    const computedValue = this.manager.getCurrentValue(this.variable.name);
    const defaultValue = this.variable.defaultValue;

    // Use user value if set, otherwise use computed value (which resolves calc())
    const displayValue = userValue || computedValue || defaultValue;

    // Text input
    const input = document.createElement('input');
    input.type = 'text';
    input.className = 'settings-control__input settings-control__input--text';
    input.value = displayValue;
    input.placeholder = 'e.g., 16px, 1rem, 50%';

    // Reset button
    const resetBtn = document.createElement('button');
    resetBtn.type = 'button';
    resetBtn.className = 'settings-control__reset';
    resetBtn.textContent = 'Reset';
    resetBtn.title = `Reset to default: ${this.variable.defaultValue}`;

    // Event listeners
    input.addEventListener('input', (e) => {
      const value = (e.target as HTMLInputElement).value.trim();

      // Visual feedback for valid/invalid
      if (value === '' || this.isValidSize(value)) {
        input.classList.remove('settings-control__input--invalid');
        if (value) {
          this.manager.setValue(this.variable.name, value);
        }
      } else {
        input.classList.add('settings-control__input--invalid');
      }
    });

    resetBtn.addEventListener('click', () => {
      this.manager.resetValue(this.variable.name);

      // Wait a tick for DOM to update, then read computed value
      setTimeout(() => {
        const computedValue = this.manager.getCurrentValue(this.variable.name);
        input.value = computedValue || this.variable.defaultValue;
        input.classList.remove('settings-control__input--invalid');
      }, 10);
    });

    wrapper.appendChild(input);
    wrapper.appendChild(resetBtn);

    return wrapper;
  }

  /**
   * Validate size value
   *
   * @private
   * @param value - Size value to validate
   * @returns Boolean indicating validity
   */
  private isValidSize(value: string): boolean {
    // Units: px, rem, em, %, vh, vw, vmin, vmax, ch, ex
    const sizePattern = /^-?\d+(\.\d+)?(px|rem|em|%|vh|vw|vmin|vmax|ch|ex)$/i;

    if (sizePattern.test(value)) {
      return true;
    }

    // calc() expressions
    if (/^calc\(/.test(value)) {
      return true;
    }

    // CSS variables
    if (/^var\(/.test(value)) {
      return true;
    }

    // Zero without unit
    if (value === '0') {
      return true;
    }

    return false;
  }
}
