/**
 * Shadow Control
 *
 * Input control for shadow-type CSS variables (drop-shadow() functions)
 * Features:
 * - Text input for shadow values
 * - Reset button
 * - Validation for drop-shadow syntax
 *
 * Note: This is a simple implementation. A future enhancement could
 * provide a visual shadow editor with separate controls for offset,
 * blur, and color.
 */

import type { CSSVariable } from '../types';
import type { CSSVariableManager } from '../CSSVariableManager';

export class ShadowControl {
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

    // Text input (shadows are complex, use text input)
    const input = document.createElement('input');
    input.type = 'text';
    input.className = 'settings-control__input settings-control__input--text settings-control__input--shadow';
    input.value = currentValue;
    input.placeholder = 'e.g., drop-shadow(0 2px 4px rgba(0,0,0,0.1))';

    // Reset button
    const resetBtn = document.createElement('button');
    resetBtn.type = 'button';
    resetBtn.className = 'settings-control__reset';
    resetBtn.textContent = 'Reset';
    resetBtn.title = `Reset to default: ${this.variable.defaultValue}`;

    // Event listeners
    input.addEventListener('input', (e) => {
      const value = (e.target as HTMLInputElement).value.trim();

      // Basic validation for drop-shadow syntax
      if (value === '' || this.isValidShadow(value)) {
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
   * Validate shadow value
   *
   * @private
   * @param value - Shadow value to validate
   * @returns Boolean indicating validity
   */
  private isValidShadow(value: string): boolean {
    // drop-shadow()
    if (/^drop-shadow\(/.test(value)) {
      return true;
    }

    // CSS variables
    if (/^var\(/.test(value)) {
      return true;
    }

    // None
    if (value === 'none' || value === 'transparent') {
      return true;
    }

    return false;
  }
}
