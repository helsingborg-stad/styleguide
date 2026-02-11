/**
 * Storage Adapters for Design Token Overrides
 *
 * Pluggable storage interface. Default: localStorage.
 * Future: JsonExportAdapter for file download/upload.
 */

export const STORAGE_KEY = 'design-tokens-overrides'

export interface StorageAdapter {
  load(): Record<string, string>
  save(overrides: Record<string, string>): void
  clear(): void
}

export class LocalStorageAdapter implements StorageAdapter {
  private key: string

  constructor(key: string = STORAGE_KEY) {
    this.key = key
  }

  load(): Record<string, string> {
    try {
      const raw = localStorage.getItem(this.key)
      return raw ? JSON.parse(raw) : {}
    } catch {
      return {}
    }
  }

  save(overrides: Record<string, string>): void {
    const filtered: Record<string, string> = {}
    for (const [k, v] of Object.entries(overrides)) {
      if (v !== undefined && v !== null && v !== '') {
        filtered[k] = v
      }
    }
    if (Object.keys(filtered).length === 0) {
      localStorage.removeItem(this.key)
    } else {
      localStorage.setItem(this.key, JSON.stringify(filtered))
    }
  }

  clear(): void {
    localStorage.removeItem(this.key)
  }
}
