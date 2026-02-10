/**
 * Control Factory
 *
 * Factory class for creating type-specific controls based on CSS variable type.
 * Uses the Factory pattern to instantiate the appropriate control class.
 */

import type { CSSVariable } from '../types';
import { CSSVariableType } from '../types';
import type { CSSVariableManager } from '../CSSVariableManager';
import { ColorControl } from './ColorControl';
import { SizeControl } from './SizeControl';
import { NumberControl } from './NumberControl';
import { FontControl } from './FontControl';
import { ShadowControl } from './ShadowControl';
import { RadiusControl } from './RadiusControl';
import { SpacingControl } from './SpacingControl';
import { SelectControl } from './SelectControl';
import { GenericControl } from './GenericControl';

export class ControlFactory {
  private manager: CSSVariableManager;

  /**
   * Constructor
   *
   * @param manager - CSS Variable Manager instance
   */
  constructor(manager: CSSVariableManager) {
    this.manager = manager;
  }

  /**
   * Create appropriate control for CSS variable type
   *
   * @param variable - CSS variable metadata
   * @returns HTMLElement containing the control
   */
  public createControl(variable: CSSVariable): HTMLElement {
    const container = document.createElement('div');
    container.className = 'settings-control';
    container.dataset.variableName = variable.name;
    container.dataset.variableType = variable.type;

    // Create label
    const label = document.createElement('label');
    label.className = 'settings-control__label';
    label.textContent = this.formatLabel(variable);
    label.title = `${variable.name}\nDefault: ${variable.defaultValue}`;
    container.appendChild(label);

    // Create type-specific control
    let control: HTMLElement;

    switch (variable.type) {
      case CSSVariableType.Color:
        control = new ColorControl(variable, this.manager).render();
        break;
      case CSSVariableType.Size:
        control = new SizeControl(variable, this.manager).render();
        break;
      case CSSVariableType.Number:
        control = new NumberControl(variable, this.manager).render();
        break;
      case CSSVariableType.Font:
        control = new FontControl(variable, this.manager).render();
        break;
      case CSSVariableType.Shadow:
        control = new ShadowControl(variable, this.manager).render();
        break;
      case CSSVariableType.Radius:
        control = new RadiusControl(variable, this.manager).render();
        break;
      case CSSVariableType.Spacing:
        control = new SpacingControl(variable, this.manager).render();
        break;
      case CSSVariableType.Select:
        control = new SelectControl(variable, this.manager).render();
        break;
      default:
        control = new GenericControl(variable, this.manager).render();
    }

    container.appendChild(control);
    return container;
  }

  /**
   * Format variable name for display label
   *
   * @private
   * @param variable - CSS variable metadata
   * @returns Formatted label
   */
  private formatLabel(variable: CSSVariable): string {
    // Use description if available
    if (variable.description && variable.description !== variable.name) {
      return variable.description;
    }

    // Otherwise format the name
    // --color--primary → Primary
    // --font-size-base → Font Size Base
    return variable.name
      .replace(/^--/, '')
      .replace(/--/g, '-')
      .split('-')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  }
}
