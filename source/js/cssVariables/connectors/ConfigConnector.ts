/**
 * Config Connector Abstract Base Class
 *
 * Abstract base class for configuration connectors using the Strategy pattern.
 * Allows different storage backends (localStorage, file, database) to be
 * swapped without changing the core logic.
 */

import type { UserConfig } from '../types';

export abstract class ConfigConnector {
  /**
   * Storage key for configuration data
   * Can be overridden by subclasses
   */
  protected storageKey: string = 'helsingborg-styleguide-css-vars';

  /**
   * Read user configuration from storage
   *
   * @returns Promise resolving to user config object
   */
  abstract read(): Promise<UserConfig>;

  /**
   * Write user configuration to storage
   *
   * @param config - User configuration object to save
   * @returns Promise resolving when write is complete
   */
  abstract write(config: UserConfig): Promise<void>;

  /**
   * Reset configuration (clear all custom values)
   *
   * @returns Promise resolving when reset is complete
   */
  abstract reset(): Promise<void>;

  /**
   * Check if connector is available and working
   *
   * @returns Boolean indicating availability
   */
  abstract isAvailable(): boolean;

  /**
   * Get the storage key
   *
   * @returns Current storage key
   */
  public getStorageKey(): string {
    return this.storageKey;
  }

  /**
   * Set a custom storage key
   *
   * @param key - New storage key
   */
  public setStorageKey(key: string): void {
    this.storageKey = key;
  }
}
