/**
 * File Connector
 *
 * Implementation of ConfigConnector using file-based storage.
 * This is a placeholder for future implementation.
 *
 * Potential use case:
 * - Store CSS variable configs as JSON files on the server
 * - Allow users to download/upload config files
 * - Useful for sharing configurations between users
 */

import { ConfigConnector } from './ConfigConnector';
import type { UserConfig } from '../types';

export class FileConnector extends ConfigConnector {
  private apiEndpoint: string;

  /**
   * Constructor
   *
   * @param apiEndpoint - API endpoint for file operations
   * @param storageKey - Optional custom storage key (filename)
   */
  constructor(apiEndpoint: string, storageKey?: string) {
    super();

    this.apiEndpoint = apiEndpoint;

    if (storageKey) {
      this.storageKey = storageKey;
    }
  }

  /**
   * Check if file connector is available
   * TODO: Implement availability check (test API endpoint)
   */
  public isAvailable(): boolean {
    // TODO: Implement with API health check
    return false;
  }

  /**
   * Read user configuration from file
   * TODO: Implement with fetch() to API endpoint
   */
  public async read(): Promise<UserConfig> {
    // TODO: Implement
    // Example:
    // const response = await fetch(`${this.apiEndpoint}/config/${this.storageKey}`);
    // return await response.json();

    throw new Error('FileConnector not yet implemented');
  }

  /**
   * Write user configuration to file
   * TODO: Implement with POST/PUT to API endpoint
   */
  public async write(config: UserConfig): Promise<void> {
    // TODO: Implement
    // Example:
    // await fetch(`${this.apiEndpoint}/config/${this.storageKey}`, {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify(config),
    // });

    throw new Error('FileConnector not yet implemented');
  }

  /**
   * Reset configuration by deleting file
   * TODO: Implement with DELETE to API endpoint
   */
  public async reset(): Promise<void> {
    // TODO: Implement
    // Example:
    // await fetch(`${this.apiEndpoint}/config/${this.storageKey}`, {
    //   method: 'DELETE',
    // });

    throw new Error('FileConnector not yet implemented');
  }
}
