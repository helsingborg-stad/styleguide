/**
 * Font Control
 *
 * Input control for font-type CSS variables (font families)
 * Features:
 * - Text input for font family
 * - Common font suggestions (future enhancement)
 * - Reset button
 */

import type { CSSVariable } from '../types';
import type { CSSVariableManager } from '../CSSVariableManager';

export class FontControl {
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
    input.value = currentValue.replace(/^["']|["']$/g, ''); // Remove quotes for display
    input.placeholder = 'e.g., Arial, sans-serif';

    // Reset button
    const resetBtn = document.createElement('button');
    resetBtn.type = 'button';
    resetBtn.className = 'settings-control__reset';
    resetBtn.textContent = 'Reset';
    resetBtn.title = `Reset to default: ${this.variable.defaultValue}`;

    // Event listeners
    input.addEventListener('input', (e) => {
      const value = (e.target as HTMLInputElement).value.trim();

      // Add quotes if not present and contains spaces or commas
      let finalValue = value;
      if (value && !value.startsWith('"') && !value.startsWith('var(')) {
        // Keep as-is if it's a system font or CSS variable
        if (value.includes(',') || value.includes(' ')) {
          finalValue = `"${value}"`;
        }
      }

      this.manager.setValue(this.variable.name, finalValue);
    });

    resetBtn.addEventListener('click', () => {
      this.manager.resetValue(this.variable.name);
      const defaultValue = this.variable.defaultValue;
      input.value = defaultValue.replace(/^["']|["']$/g, '');
    });

    wrapper.appendChild(input);
    wrapper.appendChild(resetBtn);

    return wrapper;
  }
}
