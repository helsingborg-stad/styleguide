/**
 * LocalStorage Connector
 *
 * Implementation of ConfigConnector using browser localStorage API.
 * Follows the pattern from dismissableNotices.ts for consistency.
 */

import { ConfigConnector } from './ConfigConnector';
import type { UserConfig } from '../types';

export class LocalStorageConnector extends ConfigConnector {
  private storage: Storage;

  /**
   * Constructor
   *
   * @param storageKey - Optional custom storage key
   */
  constructor(storageKey?: string) {
    super();

    if (storageKey) {
      this.storageKey = storageKey;
    }

    this.storage = localStorage;
  }

  /**
   * Check if localStorage is available
   *
   * @returns Boolean indicating if localStorage is accessible
   */
  public isAvailable(): boolean {
    try {
      const test = '__storage_test__';
      this.storage.setItem(test, test);
      this.storage.removeItem(test);
      return true;
    } catch (e) {
      console.warn('localStorage is not available:', e);
      return false;
    }
  }

  /**
   * Read user configuration from localStorage
   *
   * @returns Promise resolving to user config object
   */
  public async read(): Promise<UserConfig> {
    try {
      const data = this.storage.getItem(this.storageKey);

      if (!data) {
        return {};
      }

      const parsed = JSON.parse(data);

      // Validate that it's an object
      if (typeof parsed !== 'object' || parsed === null || Array.isArray(parsed)) {
        console.warn('Invalid data format in localStorage, returning empty config');
        return {};
      }

      return parsed;
    } catch (e) {
      console.error('Failed to read from localStorage:', e);
      return {};
    }
  }

  /**
   * Write user configuration to localStorage
   *
   * @param config - User configuration object to save
   * @returns Promise resolving when write is complete
   */
  public async write(config: UserConfig): Promise<void> {
    try {
      const serialized = JSON.stringify(config);
      this.storage.setItem(this.storageKey, serialized);
    } catch (e) {
      console.error('Failed to write to localStorage:', e);
      throw new Error('Failed to save configuration to localStorage');
    }
  }

  /**
   * Reset configuration by removing from localStorage
   *
   * @returns Promise resolving when reset is complete
   */
  public async reset(): Promise<void> {
    try {
      this.storage.removeItem(this.storageKey);
    } catch (e) {
      console.error('Failed to reset localStorage:', e);
      throw new Error('Failed to reset configuration');
    }
  }

  /**
   * Get current config size in bytes
   *
   * @returns Size in bytes or -1 if not available
   */
  public getSize(): number {
    try {
      const data = this.storage.getItem(this.storageKey);
      return data ? new Blob([data]).size : 0;
    } catch (e) {
      return -1;
    }
  }

  /**
   * Check if storage is nearly full (> 90% of 5MB quota)
   *
   * @returns Boolean indicating if storage is nearly full
   */
  public isNearlyFull(): boolean {
    try {
      // Estimate localStorage size (5MB typical limit)
      const QUOTA = 5 * 1024 * 1024; // 5MB
      let totalSize = 0;

      for (let i = 0; i < this.storage.length; i++) {
        const key = this.storage.key(i);
        if (key) {
          const value = this.storage.getItem(key);
          if (value) {
            totalSize += key.length + value.length;
          }
        }
      }

      return totalSize > (QUOTA * 0.9);
    } catch (e) {
      return false;
    }
  }
}
