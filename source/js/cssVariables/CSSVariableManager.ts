/**
 * CSS Variable Manager
 *
 * Core class for managing CSS variables. Handles:
 * - Loading metadata from JSON
 * - Reading/writing CSS variables to/from DOM
 * - Persisting user preferences via connector
 * - Providing query methods for variables
 */

import type { CSSVariablesData, CSSVariable, UserConfig } from './types';
import type { ConfigConnector } from './connectors/ConfigConnector';

export class CSSVariableManager {
  private variablesData: CSSVariablesData | null = null;
  private connector: ConfigConnector;
  private userConfig: UserConfig = {};
  private initialized: boolean = false;

  /**
   * Constructor
   *
   * @param connector - Configuration connector for persistence
   */
  constructor(connector: ConfigConnector) {
    this.connector = connector;
  }

  /**
   * Initialize the manager
   * - Loads CSS variables metadata from JSON
   * - Loads user config from connector
   * - Applies user config to DOM
   *
   * @returns Promise resolving when initialization is complete
   */
  public async initialize(): Promise<void> {
    if (this.initialized) {
      console.warn('CSSVariableManager already initialized');
      return;
    }

    try {
      // Load CSS variables metadata
      await this.loadMetadata();

      // Load user config from connector
      if (this.connector.isAvailable()) {
        this.userConfig = await this.connector.read();
        this.applyUserConfig();
      } else {
        console.warn('Connector not available, user config will not persist');
      }

      this.initialized = true;
    } catch (error) {
      console.error('Failed to initialize CSSVariableManager:', error);
      throw error;
    }
  }

  /**
   * Load CSS variables metadata from JSON file
   *
   * @private
   * @returns Promise resolving when metadata is loaded
   */
  private async loadMetadata(): Promise<void> {
    try {
      // Try relative path first
      let response = await fetch('/dist/data/css-variables.json');

      // If relative path fails, try absolute path
      if (!response.ok) {
        response = await fetch('/dist/data/css-variables.json');
      }

      if (!response.ok) {
        throw new Error(`Failed to load metadata: ${response.status} ${response.statusText}`);
      }

      this.variablesData = await response.json();

      if (!this.variablesData || !this.variablesData.variables) {
        throw new Error('Invalid metadata format');
      }
    } catch (error) {
      console.error('Failed to load CSS variables metadata:', error);
      throw error;
    }
  }

  /**
   * Get all CSS variables
   *
   * @returns Array of all CSS variables
   */
  public getVariables(): CSSVariable[] {
    return this.variablesData?.variables || [];
  }

  /**
   * Get all categories
   *
   * @returns Array of category names
   */
  public getCategories(): string[] {
    return this.variablesData?.categories || [];
  }

  /**
   * Get variables by category
   *
   * @param category - Category name
   * @returns Array of variables in the category
   */
  public getVariablesByCategory(category: string): CSSVariable[] {
    return this.getVariables().filter(v => v.category === category);
  }

  /**
   * Get a single variable by name
   *
   * @param variableName - CSS variable name (e.g., --color--primary)
   * @returns Variable metadata or undefined
   */
  public getVariable(variableName: string): CSSVariable | undefined {
    return this.getVariables().find(v => v.name === variableName);
  }

  /**
   * Get current value of a CSS variable from the DOM
   * Uses window.getComputedStyle to read the actual computed value
   *
   * @param variableName - CSS variable name (e.g., --color--primary)
   * @returns Current value or empty string if not found
   */
  public getCurrentValue(variableName: string): string {
    try {
      const value = getComputedStyle(document.documentElement)
        .getPropertyValue(variableName)
        .trim();

      return value;
    } catch (error) {
      console.error(`Failed to get current value for ${variableName}:`, error);
      return '';
    }
  }

  /**
   * Get user's custom value for a CSS variable
   * Returns undefined if user hasn't customized this variable
   *
   * @param variableName - CSS variable name (e.g., --color--primary)
   * @returns Custom value or undefined
   */
  public getUserValue(variableName: string): string | undefined {
    return this.userConfig[variableName];
  }

  /**
   * Check if a variable has been customized by the user
   *
   * @param variableName - CSS variable name (e.g., --color--primary)
   * @returns Boolean indicating if variable is customized
   */
  public isCustomized(variableName: string): boolean {
    return variableName in this.userConfig;
  }

  /**
   * Set a CSS variable value
   * Updates both the DOM and user config
   *
   * @param variableName - CSS variable name (e.g., --color--primary)
   * @param value - New value
   */
  public setValue(variableName: string, value: string): void {
    try {
      // Update DOM
      document.documentElement.style.setProperty(variableName, value);

      // Update user config
      this.userConfig[variableName] = value;
    } catch (error) {
      console.error(`Failed to set value for ${variableName}:`, error);
      throw error;
    }
  }

  /**
   * Reset a CSS variable to its default value
   * Removes the custom value and removes it from the DOM
   *
   * @param variableName - CSS variable name (e.g., --color--primary)
   */
  public resetValue(variableName: string): void {
    try {
      // Remove from DOM (will revert to default from CSS)
      document.documentElement.style.removeProperty(variableName);

      // Remove from user config
      delete this.userConfig[variableName];
    } catch (error) {
      console.error(`Failed to reset value for ${variableName}:`, error);
      throw error;
    }
  }

  /**
   * Reset all CSS variables to defaults
   * Clears all customizations
   */
  public resetAll(): void {
    try {
      // Remove all custom properties from DOM
      Object.keys(this.userConfig).forEach(varName => {
        document.documentElement.style.removeProperty(varName);
      });

      // Clear user config
      this.userConfig = {};
    } catch (error) {
      console.error('Failed to reset all values:', error);
      throw error;
    }
  }

  /**
   * Save current user config to connector
   *
   * @returns Promise resolving when save is complete
   */
  public async save(): Promise<void> {
    if (!this.connector.isAvailable()) {
      throw new Error('Connector not available, cannot save config');
    }

    try {
      await this.connector.write(this.userConfig);
    } catch (error) {
      console.error('Failed to save user config:', error);
      throw error;
    }
  }

  /**
   * Apply user config to DOM
   * Called during initialization to restore saved state
   *
   * @private
   */
  private applyUserConfig(): void {
    Object.entries(this.userConfig).forEach(([name, value]) => {
      try {
        document.documentElement.style.setProperty(name, value);
      } catch (error) {
        console.error(`Failed to apply user config for ${name}:`, error);
      }
    });
  }

  /**
   * Get user config as plain object
   * Useful for export/debugging
   *
   * @returns Copy of user config
   */
  public getUserConfig(): UserConfig {
    return { ...this.userConfig };
  }

  /**
   * Import user config
   * Replaces current config with provided config
   *
   * @param config - User config to import
   */
  public importUserConfig(config: UserConfig): void {
    // Reset current config
    this.resetAll();

    // Apply new config
    this.userConfig = { ...config };
    this.applyUserConfig();
  }

  /**
   * Get metadata generation timestamp
   *
   * @returns ISO timestamp or undefined
   */
  public getGeneratedAt(): string | undefined {
    return this.variablesData?.generatedAt;
  }

  /**
   * Check if manager is initialized
   *
   * @returns Boolean indicating initialization status
   */
  public isInitialized(): boolean {
    return this.initialized;
  }
}
