/**
 * Storage Adapters for Design Token Overrides
 *
 * Pluggable storage interface. Default: localStorage.
 * Future: JsonExportAdapter for file download/upload.
 */

export const STORAGE_KEY = 'design-tokens-overrides'
export const PRESETS_KEY = 'design-tokens-presets'
export const ACTIVE_PRESET_KEY = 'design-tokens-active-preset'

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

export class PresetManager {
  private presetsKey: string
  private activeKey: string

  constructor(
    presetsKey: string = PRESETS_KEY,
    activeKey: string = ACTIVE_PRESET_KEY
  ) {
    this.presetsKey = presetsKey
    this.activeKey = activeKey
  }

  loadAll(): Record<string, Record<string, string>> {
    try {
      const raw = localStorage.getItem(this.presetsKey)
      return raw ? JSON.parse(raw) : {}
    } catch {
      return {}
    }
  }

  save(name: string, overrides: Record<string, string>): void {
    const all = this.loadAll()
    all[name] = { ...overrides }
    localStorage.setItem(this.presetsKey, JSON.stringify(all))
  }

  delete(name: string): void {
    const all = this.loadAll()
    delete all[name]
    if (Object.keys(all).length === 0) {
      localStorage.removeItem(this.presetsKey)
    } else {
      localStorage.setItem(this.presetsKey, JSON.stringify(all))
    }
    if (this.getActive() === name) {
      this.clearActive()
    }
  }

  getActive(): string | null {
    return localStorage.getItem(this.activeKey)
  }

  setActive(name: string): void {
    localStorage.setItem(this.activeKey, name)
  }

  clearActive(): void {
    localStorage.removeItem(this.activeKey)
  }

  names(): string[] {
    return Object.keys(this.loadAll()).sort()
  }
}
