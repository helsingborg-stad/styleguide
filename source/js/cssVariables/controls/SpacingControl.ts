/**
 * Spacing Control
 *
 * Input control for spacing-type CSS variables (spacing scale)
 * Features:
 * - Range slider for visual adjustment (0-200px in 8px steps)
 * - Shows computed value (resolves calc() expressions)
 * - Text input for manual entry
 * - Reset button
 */

import type { CSSVariable } from '../types';
import type { CSSVariableManager } from '../CSSVariableManager';

export class SpacingControl {
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
    wrapper.className = 'settings-control__input-wrapper settings-control__input-wrapper--spacing';

    // Get current value with fallback to default (resolves calc/var)
    const userValue = this.manager.getUserValue(this.variable.name);
    const computedValue = this.manager.getCurrentValue(this.variable.name);
    const defaultValue = this.variable.defaultValue;

    // Use user value if set, otherwise use computed value (which resolves calc())
    const currentValue = userValue || computedValue || defaultValue;
    const numericValue = this.extractPixels(currentValue);

    // Spacing scale: 0-200px in 8px increments (--base is 8px)
    const minValue = 0;
    const maxValue = 200;
    const step = 8;

    // Range slider
    const slider = document.createElement('input');
    slider.type = 'range';
    slider.className = 'settings-control__slider';
    slider.min = minValue.toString();
    slider.max = maxValue.toString();
    slider.step = step.toString();
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
    textInput.placeholder = 'e.g., 16px';

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

      if (pixels >= minValue && pixels <= maxValue) {
        // Snap to nearest 8px increment
        const snappedPixels = Math.round(pixels / step) * step;
        slider.value = snappedPixels.toString();
        valueDisplay.textContent = `${snappedPixels}px`;
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

    // Default to 0
    return 0;
  }
}
