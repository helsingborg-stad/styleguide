/**
 * Settings Center UI Component
 *
 * Provides a side panel interface for managing CSS variables.
 * Features:
 * - Sliding panel from right
 * - Categorized variable sections
 * - Save/Reset buttons
 * - Floating toggle button
 * - Keyboard shortcuts (Escape to close)
 */

import type { CSSVariableManager } from './CSSVariableManager';
import type { CSSVariable } from './types';

export class SettingsCenter {
  private manager: CSSVariableManager;
  private container: HTMLElement | null = null;
  private isOpen: boolean = false;
  private controlFactory: any = null; // Will be set when ControlFactory is available

  /**
   * Constructor
   *
   * @param manager - CSS Variable Manager instance
   */
  constructor(manager: CSSVariableManager) {
    this.manager = manager;
  }

  /**
   * Set the control factory (injected after creation)
   *
   * @param factory - Control Factory instance
   */
  public setControlFactory(factory: any): void {
    this.controlFactory = factory;
  }

  /**
   * Initialize and render the settings center
   */
  public initialize(): void {
    if (!this.manager.isInitialized()) {
      throw new Error('CSSVariableManager must be initialized before SettingsCenter');
    }

    this.createContainer();
    this.createToggleButton();
    this.renderCategories();
    this.attachEventListeners();
  }

  /**
   * Create the main container element
   *
   * @private
   */
  private createContainer(): void {
    this.container = document.createElement('div');
    this.container.className = 'settings-center';
    this.container.setAttribute('role', 'dialog');
    this.container.setAttribute('aria-label', 'CSS Variables Settings');
    this.container.setAttribute('aria-hidden', 'true');

    this.container.innerHTML = `
      <div class="settings-center__panel">
        <div class="settings-center__header">
          <h2 class="settings-center__title">CSS Variables Settings</h2>
          <button class="settings-center__close" aria-label="Close settings" type="button">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
              <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
            </svg>
          </button>
        </div>
        <div class="settings-center__content"></div>
        <div class="settings-center__footer">
          <button class="settings-center__save" type="button">Save Changes</button>
          <button class="settings-center__reset" type="button">Reset All</button>
        </div>
      </div>
      <div class="settings-center__overlay"></div>
    `;

    document.body.appendChild(this.container);
  }

  /**
   * Create floating toggle button
   *
   * @private
   */
  private createToggleButton(): void {
    const button = document.createElement('button');
    button.className = 'settings-center__toggle';
    button.setAttribute('aria-label', 'Open CSS variables settings');
    button.setAttribute('type', 'button');

    button.innerHTML = `
      <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 15.5A3.5 3.5 0 0 1 8.5 12 3.5 3.5 0 0 1 12 8.5a3.5 3.5 0 0 1 3.5 3.5 3.5 3.5 0 0 1-3.5 3.5m7.43-2.53c.04-.32.07-.64.07-.97 0-.33-.03-.66-.07-1l2.11-1.63c.19-.15.24-.42.12-.64l-2-3.46c-.12-.22-.39-.31-.61-.22l-2.49 1c-.52-.39-1.06-.73-1.69-.98l-.37-2.65A.506.506 0 0 0 14 2h-4c-.25 0-.46.18-.5.42l-.37 2.65c-.63.25-1.17.59-1.69.98l-2.49-1c-.22-.09-.49 0-.61.22l-2 3.46c-.13.22-.07.49.12.64L4.57 11c-.04.34-.07.67-.07 1 0 .33.03.65.07.97l-2.11 1.66c-.19.15-.25.42-.12.64l2 3.46c.12.22.39.3.61.22l2.49-1.01c.52.4 1.06.74 1.69.99l.37 2.65c.04.24.25.42.5.42h4c.25 0 .46-.18.5-.42l.37-2.65c.63-.26 1.17-.59 1.69-.99l2.49 1.01c.22.08.49 0 .61-.22l2-3.46c.12-.22.07-.49-.12-.64l-2.11-1.66z"/>
      </svg>
    `;

    button.addEventListener('click', () => this.toggle());

    document.body.appendChild(button);
  }

  /**
   * Render all categories with their controls
   *
   * @private
   */
  private renderCategories(): void {
    const content = this.container?.querySelector('.settings-center__content') as HTMLElement;
    if (!content) return;

    const categories = this.manager.getCategories();

    if (categories.length === 0) {
      content.innerHTML = '<p class="settings-center__empty">No CSS variables found.</p>';
      return;
    }

    categories.forEach(category => {
      // Skip empty categories
      const variables = this.manager.getVariablesByCategory(category);
      if (variables.length === 0) {
        return;
      }

      const section = this.createCategorySection(category);
      content.appendChild(section);
    });
  }

  /**
   * Create a category section with variables
   *
   * @private
   * @param category - Category name
   * @returns HTMLElement for the category section
   */
  private createCategorySection(category: string): HTMLElement {
    const section = document.createElement('div');
    section.className = 'settings-center__category';

    const title = document.createElement('h3');
    title.className = 'settings-center__category-title';
    title.textContent = category;

    const content = document.createElement('div');
    content.className = 'settings-center__category-content';

    const variables = this.manager.getVariablesByCategory(category);

    variables.forEach(variable => {
      if (this.controlFactory) {
        // Use ControlFactory to create appropriate control
        const control = this.controlFactory.createControl(variable);
        content.appendChild(control);
      } else {
        // Fallback: Create simple text display
        const item = this.createFallbackControl(variable);
        content.appendChild(item);
      }
    });

    section.appendChild(title);
    section.appendChild(content);

    return section;
  }

  /**
   * Create fallback control when ControlFactory is not available
   *
   * @private
   * @param variable - CSS Variable metadata
   * @returns HTMLElement for the fallback control
   */
  private createFallbackControl(variable: CSSVariable): HTMLElement {
    const item = document.createElement('div');
    item.className = 'settings-control';

    item.innerHTML = `
      <label class="settings-control__label">${variable.description || variable.name}</label>
      <div class="settings-control__input-wrapper">
        <input
          type="text"
          class="settings-control__input"
          value="${this.manager.getCurrentValue(variable.name)}"
          data-variable="${variable.name}"
        />
        <button
          type="button"
          class="settings-control__reset"
          data-variable="${variable.name}"
          title="Reset to default: ${variable.defaultValue}"
        >
          Reset
        </button>
      </div>
    `;

    // Add event listeners for fallback control
    const input = item.querySelector('input') as HTMLInputElement;
    const resetBtn = item.querySelector('button') as HTMLButtonElement;

    if (input) {
      input.addEventListener('input', (e) => {
        const value = (e.target as HTMLInputElement).value;
        this.manager.setValue(variable.name, value);
      });
    }

    if (resetBtn) {
      resetBtn.addEventListener('click', () => {
        this.manager.resetValue(variable.name);
        if (input) {
          input.value = this.manager.getCurrentValue(variable.name);
        }
      });
    }

    return item;
  }

  /**
   * Attach event listeners
   *
   * @private
   */
  private attachEventListeners(): void {
    // Close button
    const closeBtn = this.container?.querySelector('.settings-center__close');
    closeBtn?.addEventListener('click', () => this.close());

    // Overlay click
    const overlay = this.container?.querySelector('.settings-center__overlay');
    overlay?.addEventListener('click', () => this.close());

    // Save button
    const saveBtn = this.container?.querySelector('.settings-center__save');
    saveBtn?.addEventListener('click', async () => {
      try {
        await this.manager.save();
        this.showNotification('Settings saved successfully!', 'success');
      } catch (error) {
        console.error('Failed to save settings:', error);
        this.showNotification('Failed to save settings', 'error');
      }
    });

    // Reset button
    const resetBtn = this.container?.querySelector('.settings-center__reset');
    resetBtn?.addEventListener('click', () => {
      if (confirm('Reset all CSS variables to defaults?')) {
        this.manager.resetAll();
        this.refresh();
        this.showNotification('All settings reset to defaults', 'success');
      }
    });

    // Escape key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && this.isOpen) {
        this.close();
      }
    });
  }

  /**
   * Toggle settings center open/closed
   */
  public toggle(): void {
    this.isOpen ? this.close() : this.open();
  }

  /**
   * Open settings center
   */
  public open(): void {
    if (!this.container) return;

    this.container.classList.add('settings-center--open');
    this.container.setAttribute('aria-hidden', 'false');
    this.isOpen = true;
    document.body.style.overflow = 'hidden';

    // Update all control values to reflect current state
    this.refreshValues();
  }

  /**
   * Close settings center
   */
  public close(): void {
    if (!this.container) return;

    this.container.classList.remove('settings-center--open');
    this.container.setAttribute('aria-hidden', 'true');
    this.isOpen = false;
    document.body.style.overflow = '';
  }

  /**
   * Refresh all controls (re-render)
   *
   * @private
   */
  private refresh(): void {
    const content = this.container?.querySelector('.settings-center__content') as HTMLElement;
    if (content) {
      content.innerHTML = '';
      this.renderCategories();
    }
  }

  /**
   * Refresh control values without re-rendering
   *
   * @private
   */
  private refreshValues(): void {
    const inputs = this.container?.querySelectorAll('input[data-variable]');
    inputs?.forEach((input) => {
      const varName = (input as HTMLInputElement).dataset.variable;
      if (varName) {
        (input as HTMLInputElement).value = this.manager.getCurrentValue(varName);
      }
    });
  }

  /**
   * Show notification message
   *
   * @private
   * @param message - Message to display
   * @param type - Notification type (success, error, info)
   */
  private showNotification(message: string, type: 'success' | 'error' | 'info' = 'info'): void {
    const toast = document.createElement('div');
    toast.className = `settings-center__toast settings-center__toast--${type}`;
    toast.textContent = message;
    toast.setAttribute('role', 'status');
    toast.setAttribute('aria-live', 'polite');

    document.body.appendChild(toast);

    // Trigger animation
    setTimeout(() => toast.classList.add('settings-center__toast--visible'), 10);

    // Remove after 3 seconds
    setTimeout(() => {
      toast.classList.remove('settings-center__toast--visible');
      setTimeout(() => toast.remove(), 300);
    }, 3000);
  }

  /**
   * Destroy the settings center
   */
  public destroy(): void {
    this.container?.remove();
    this.container = null;
    this.isOpen = false;
    document.body.style.overflow = '';
  }

  /**
   * Check if settings center is open
   *
   * @returns Boolean indicating open state
   */
  public isOpened(): boolean {
    return this.isOpen;
  }
}
