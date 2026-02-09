/**
 * Color Control
 *
 * Input control for color-type CSS variables.
 * Features:
 * - Native color picker
 * - Text input for manual hex entry
 * - Reset button
 * - Real-time preview
 */

import type { CSSVariable } from '../types';
import type { CSSVariableManager } from '../CSSVariableManager';

export class ColorControl {
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

    // Color picker input
    const colorInput = document.createElement('input');
    colorInput.type = 'color';
    colorInput.className = 'settings-control__input settings-control__input--color';
    colorInput.value = this.normalizeColorValue(currentValue);

    // Text input for manual entry
    const textInput = document.createElement('input');
    textInput.type = 'text';
    textInput.className = 'settings-control__input settings-control__input--text';
    textInput.value = currentValue;
    textInput.placeholder = 'e.g., #ff0000';

    // Reset button
    const resetBtn = document.createElement('button');
    resetBtn.type = 'button';
    resetBtn.className = 'settings-control__reset';
    resetBtn.textContent = 'Reset';
    resetBtn.title = `Reset to default: ${this.variable.defaultValue}`;

    // Event listeners
    colorInput.addEventListener('input', (e) => {
      const value = (e.target as HTMLInputElement).value;
      textInput.value = value;
      this.manager.setValue(this.variable.name, value);
    });

    textInput.addEventListener('input', (e) => {
      const value = (e.target as HTMLInputElement).value.trim();
      if (this.isValidColor(value)) {
        const normalized = this.normalizeColorValue(value);
        if (normalized) {
          colorInput.value = normalized;
        }
        this.manager.setValue(this.variable.name, value);
      }
    });

    resetBtn.addEventListener('click', () => {
      this.manager.resetValue(this.variable.name);

      // Wait a tick for DOM to update, then read computed value
      setTimeout(() => {
        const computedValue = this.manager.getCurrentValue(this.variable.name);
        const displayValue = computedValue || this.variable.defaultValue;
        textInput.value = displayValue;
        const normalized = this.normalizeColorValue(displayValue);
        if (normalized) {
          colorInput.value = normalized;
        }
      }, 10);
    });

    wrapper.appendChild(colorInput);
    wrapper.appendChild(textInput);
    wrapper.appendChild(resetBtn);

    return wrapper;
  }

  /**
   * Normalize color value to hex format for color input
   *
   * @private
   * @param value - Color value (hex, rgb, etc.)
   * @returns Hex color or empty string
   */
  private normalizeColorValue(value: string): string {
    // Already hex format
    if (/^#[0-9a-fA-F]{6}$/.test(value)) {
      return value;
    }

    // Short hex format (#abc -> #aabbcc)
    if (/^#[0-9a-fA-F]{3}$/.test(value)) {
      const r = value[1];
      const g = value[2];
      const b = value[3];
      return `#${r}${r}${g}${g}${b}${b}`;
    }

    // For other formats (rgb, rgba, var()), return empty
    // The color picker won't work, but text input will
    return '';
  }

  /**
   * Validate color value
   *
   * @private
   * @param value - Color value to validate
   * @returns Boolean indicating validity
   */
  private isValidColor(value: string): boolean {
    // Hex colors
    if (/^#[0-9a-fA-F]{3,8}$/.test(value)) {
      return true;
    }

    // rgb/rgba
    if (/^rgba?\(/.test(value)) {
      return true;
    }

    // hsl/hsla
    if (/^hsla?\(/.test(value)) {
      return true;
    }

    // CSS variables
    if (/^var\(/.test(value)) {
      return true;
    }

    return false;
  }
}
