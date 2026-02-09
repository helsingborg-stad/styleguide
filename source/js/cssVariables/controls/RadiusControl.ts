/**
 * Radius Control
 *
 * Input control for radius-type CSS variables (border-radius)
 * Features:
 * - Range slider for visual adjustment (0-50px)
 * - Shows computed value (resolves calc() expressions)
 * - Text input for manual entry
 * - Reset button
 */

import type { CSSVariable } from '../types';
import type { CSSVariableManager } from '../CSSVariableManager';

export class RadiusControl {
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
    wrapper.className = 'settings-control__input-wrapper settings-control__input-wrapper--radius';

    // Get current computed value (resolves calc() to actual pixels)
    const computedValue = this.manager.getCurrentValue(this.variable.name);
    const numericValue = this.extractPixels(computedValue);

    // Determine max value based on variable name
    let maxValue = 50;
    if (this.variable.name.includes('full')) {
      maxValue = 500; // For --radius-full
    }

    // Range slider
    const slider = document.createElement('input');
    slider.type = 'range';
    slider.className = 'settings-control__slider';
    slider.min = '0';
    slider.max = maxValue.toString();
    slider.step = '1';
    slider.value = numericValue.toString();

    // Display value (shows computed value)
    const valueDisplay = document.createElement('span');
    valueDisplay.className = 'settings-control__value-display';
    valueDisplay.textContent = `${numericValue}px`;

    // Text input for manual entry
    const textInput = document.createElement('input');
    textInput.type = 'text';
    textInput.className = 'settings-control__input settings-control__input--text settings-control__input--small';
    textInput.value = `${numericValue}px`;
    textInput.placeholder = 'e.g., 8px';

    // Reset button
    const resetBtn = document.createElement('button');
    resetBtn.type = 'button';
    resetBtn.className = 'settings-control__reset';
    resetBtn.textContent = 'Reset';
    resetBtn.title = `Reset to default: ${this.variable.defaultValue}`;

    // Event listeners
    slider.addEventListener('input', (e) => {
      const value = (e.target as HTMLInputElement).value;
      const pxValue = `${value}px`;

      valueDisplay.textContent = pxValue;
      textInput.value = pxValue;
      this.manager.setValue(this.variable.name, pxValue);
    });

    textInput.addEventListener('input', (e) => {
      const value = (e.target as HTMLInputElement).value.trim();
      const pixels = this.extractPixels(value);

      if (pixels >= 0 && pixels <= maxValue) {
        slider.value = pixels.toString();
        valueDisplay.textContent = `${pixels}px`;
        this.manager.setValue(this.variable.name, value);
      }
    });

    resetBtn.addEventListener('click', () => {
      this.manager.resetValue(this.variable.name);

      // Wait a tick for the DOM to update, then read the new value
      setTimeout(() => {
        const newValue = this.manager.getCurrentValue(this.variable.name);
        const pixels = this.extractPixels(newValue);

        slider.value = pixels.toString();
        valueDisplay.textContent = `${pixels}px`;
        textInput.value = `${pixels}px`;
      }, 10);
    });

    // Build layout: [Slider] [Value] [Input] [Reset]
    const sliderGroup = document.createElement('div');
    sliderGroup.className = 'settings-control__slider-group';
    sliderGroup.appendChild(slider);
    sliderGroup.appendChild(valueDisplay);

    wrapper.appendChild(sliderGroup);
    wrapper.appendChild(textInput);
    wrapper.appendChild(resetBtn);

    return wrapper;
  }

  /**
   * Extract pixel value from string
   * Handles: "8px", "1rem", calc expressions, or already computed values
   *
   * @private
   * @param value - Value string
   * @returns Numeric pixel value
   */
  private extractPixels(value: string): number {
    // Already a pixel value
    const pxMatch = value.match(/^(\d+(?:\.\d+)?)px/);
    if (pxMatch) {
      return Math.round(parseFloat(pxMatch[1]));
    }

    // Convert rem to px (assuming 16px = 1rem)
    const remMatch = value.match(/^(\d+(?:\.\d+)?)rem/);
    if (remMatch) {
      return Math.round(parseFloat(remMatch[1]) * 16);
    }

    // Pure number
    const numMatch = value.match(/^(\d+(?:\.\d+)?)/);
    if (numMatch) {
      return Math.round(parseFloat(numMatch[1]));
    }

    // For --radius-full special case
    if (value.includes('5000') || this.variable.name.includes('full')) {
      return 500;
    }

    // Default
    return 0;
  }
}
