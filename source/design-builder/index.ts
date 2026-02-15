/**
 * Design Builder — Token Settings Panel
 *
 * Entry point for the design builder page.
 * Reads design-tokens.json from the page, renders controls,
 * and manages live preview + storage.
 */

import { LocalStorageAdapter, PresetManager, type StorageAdapter } from './storage'
import { createControl, createContrastPair, createSwatchBand, type TokenSetting } from './controls'

interface TokenCategory {
  id: string
  label: string
  description?: string
  present?: 'swatch'
  settings: TokenSetting[]
}

interface TokenData {
  name: string
  version: string
  categories: TokenCategory[]
}

class DesignBuilder {
  private container: HTMLElement
  private storage: StorageAdapter
  private tokens: TokenData
  private overrides: Record<string, string>
  private saveTimeout: ReturnType<typeof setTimeout> | null = null
  private presetManager: PresetManager
  private presetBar: HTMLElement | null = null

  constructor(container: HTMLElement, tokens: TokenData, storage: StorageAdapter) {
    this.container = container
    this.tokens = tokens
    this.storage = storage
    this.presetManager = new PresetManager()
    this.overrides = storage.load()

    this.render()
    this.applyAll()
  }

  private render(): void {
    // Header
    const header = document.createElement('div')
    header.className = 'db-header'
    header.innerHTML = `
      <h1 class="db-header__title">Design Builder</h1>
      <p class="db-header__subtitle">${this.tokens.name} v${this.tokens.version}</p>
      <div class="db-header__actions">
        <button type="button" class="c-button c-button--sm c-button__outlined c-button__outlined--default" data-action="export">
          <span class="c-button__label"><span class="c-button__label-text">Export JSON</span></span>
        </button>
        <button type="button" class="c-button c-button--sm c-button__outlined c-button__outlined--primary" data-action="reset">
          <span class="c-button__label"><span class="c-button__label-text">Reset All</span></span>
        </button>
      </div>
    `
    this.container.appendChild(header)

    // Bind header actions
    header.querySelector('[data-action="export"]')?.addEventListener('click', () => this.exportJson())
    header.querySelector('[data-action="reset"]')?.addEventListener('click', () => this.resetAll())

    // Preset bar
    this.presetBar = this.renderPresetBar()
    this.container.appendChild(this.presetBar)

    // Categories
    const categoriesWrap = document.createElement('div')
    categoriesWrap.className = 'db-categories'

    for (const category of this.tokens.categories) {
      categoriesWrap.appendChild(this.renderCategory(category))
    }

    this.container.appendChild(categoriesWrap)
  }

  private renderCategory(category: TokenCategory): HTMLElement {
    const section = document.createElement('section')
    section.className = 'db-category'
    section.dataset.categoryId = category.id

    // Category header (collapsible)
    const header = document.createElement('div')
    header.className = 'db-category__header'
    header.innerHTML = `
      <h2 class="db-category__title">${category.label}</h2>
      ${category.description ? `<p class="db-category__description">${category.description}</p>` : ''}
      <span class="db-category__toggle material-symbols-outlined">expand_more</span>
    `
    section.appendChild(header)

    // Category body
    const body = document.createElement('div')
    body.className = 'db-category__body'

    if (category.present === 'swatch') {
      body.appendChild(createSwatchBand(category.settings))
    } else {
      // Build lookup and track which settings are contrast targets
      const settingsMap = new Map<string, TokenSetting>()
      const contrastVars = new Set<string>()
      for (const s of category.settings) {
        settingsMap.set(s.variable, s)
        if (s.contrast) {
          const refs = Array.isArray(s.contrast) ? s.contrast : [s.contrast]
          refs.forEach(v => contrastVars.add(v))
        }
      }

      for (const setting of category.settings) {
        // Skip tokens already rendered as part of a contrast pair
        if (contrastVars.has(setting.variable)) continue

        if (setting.contrast) {
          // Collect all contrast settings for this base
          const refs = Array.isArray(setting.contrast) ? setting.contrast : [setting.contrast]
          const contrasts: { setting: TokenSetting; value: string }[] = []
          for (const contrastVar of refs) {
            const contrastSetting = settingsMap.get(contrastVar)
            if (contrastSetting) {
              contrasts.push({
                setting: contrastSetting,
                value: this.overrides[contrastVar] || contrastSetting.default,
              })
            }
          }
          if (contrasts.length > 0) {
            const baseVal = this.overrides[setting.variable] || setting.default
            body.appendChild(createContrastPair(
              setting, contrasts, baseVal,
              (variable, value) => {
                const allSettings = [setting, ...contrasts.map(c => c.setting)]
                const def = allSettings.find(s => s.variable === variable)?.default || ''
                this.handleChange(variable, value, def)
              }
            ))
          }
        } else {
          // Regular control
          const currentValue = this.overrides[setting.variable] || setting.default
          const control = createControl(setting, currentValue, (variable, value) => {
            this.handleChange(variable, value, setting.default)
          })
          body.appendChild(control)
        }
      }
    }

    section.appendChild(body)

    // Toggle collapse
    header.addEventListener('click', () => {
      section.classList.toggle('db-category--collapsed')
    })

    return section
  }

  private handleChange(variable: string, value: string, defaultValue: string): void {
    // If value matches default or is empty, remove the override
    if (!value || value === defaultValue) {
      delete this.overrides[variable]
    } else {
      this.overrides[variable] = value
    }

    // Apply to :root immediately
    if (value && value !== defaultValue) {
      document.documentElement.style.setProperty(variable, value)
    } else {
      document.documentElement.style.removeProperty(variable)
    }

    // Debounced save
    this.debounceSave()

    // Manual edit deactivates preset
    this.presetManager.clearActive()
    this.refreshPresetBar()
  }

  private debounceSave(): void {
    if (this.saveTimeout) clearTimeout(this.saveTimeout)
    this.saveTimeout = setTimeout(() => {
      this.storage.save(this.overrides)
    }, 300)
  }

  private applyAll(): void {
    for (const [prop, value] of Object.entries(this.overrides)) {
      document.documentElement.style.setProperty(prop, value)
    }
  }

  private resetAll(): void {
    if (!confirm('Reset all tokens to their default values? This clears all customizations.')) {
      return
    }

    // Remove all overrides from :root
    for (const prop of Object.keys(this.overrides)) {
      document.documentElement.style.removeProperty(prop)
    }

    this.overrides = {}
    this.storage.clear()
    this.presetManager.clearActive()

    // Re-render
    this.container.innerHTML = ''
    this.render()
  }

  private exportJson(): void {
    const data = JSON.stringify(this.overrides, null, 2)
    const blob = new Blob([data], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'design-tokens-overrides.json'
    a.click()
    URL.revokeObjectURL(url)
  }

  // --- Preset Management ---

  private renderPresetBar(): HTMLElement {
    const bar = document.createElement('div')
    bar.className = 'db-presets'

    const list = document.createElement('div')
    list.className = 'db-presets__list'

    const activeName = this.presetManager.getActive()
    const names = this.presetManager.names()

    for (const name of names) {
      list.appendChild(this.createPresetChip(name, name === activeName))
    }

    bar.appendChild(list)

    const saveBtn = document.createElement('button')
    saveBtn.type = 'button'
    saveBtn.className = 'db-presets__save'
    saveBtn.innerHTML = '<span class="material-symbols-outlined">save</span> Save'
    saveBtn.addEventListener('click', () => this.savePreset())
    bar.appendChild(saveBtn)

    return bar
  }

  private createPresetChip(name: string, isActive: boolean): HTMLElement {
    const chip = document.createElement('button')
    chip.type = 'button'
    chip.className = 'db-presets__chip'
    if (isActive) chip.classList.add('db-presets__chip--active')

    const label = document.createElement('span')
    label.className = 'db-presets__chip-label'
    label.textContent = name
    chip.appendChild(label)

    const del = document.createElement('span')
    del.className = 'db-presets__chip-delete'
    del.textContent = '\u00d7'
    del.title = `Delete "${name}"`
    del.addEventListener('click', (e) => {
      e.stopPropagation()
      this.deletePreset(name)
    })
    chip.appendChild(del)

    chip.addEventListener('click', () => this.loadPreset(name))

    return chip
  }

  private savePreset(): void {
    const name = prompt('Preset name:')
    if (!name || !name.trim()) return

    const trimmed = name.trim()
    const existing = this.presetManager.names()
    if (existing.includes(trimmed)) {
      if (!confirm(`A preset named "${trimmed}" already exists. Overwrite it?`)) {
        return
      }
    }

    this.presetManager.save(trimmed, this.overrides)
    this.presetManager.setActive(trimmed)
    this.refreshPresetBar()
  }

  private loadPreset(name: string): void {
    const all = this.presetManager.loadAll()
    const presetOverrides = all[name]
    if (!presetOverrides) return

    // Remove current overrides from :root
    for (const prop of Object.keys(this.overrides)) {
      document.documentElement.style.removeProperty(prop)
    }

    // Replace overrides and apply
    this.overrides = { ...presetOverrides }
    this.applyAll()
    this.storage.save(this.overrides)
    this.presetManager.setActive(name)

    // Re-render controls with new values
    this.container.innerHTML = ''
    this.render()
  }

  private deletePreset(name: string): void {
    if (!confirm(`Delete preset "${name}"?`)) return
    this.presetManager.delete(name)
    this.refreshPresetBar()
  }

  private refreshPresetBar(): void {
    if (!this.presetBar) return
    const newBar = this.renderPresetBar()
    this.presetBar.replaceWith(newBar)
    this.presetBar = newBar
  }
}

// --- Draggable Divider ---

const SPLIT_STORAGE_KEY = 'design-builder-split'
const MIN_SPLIT = 20
const MAX_SPLIT = 80

function initDivider(): void {
  const layout = document.querySelector<HTMLElement>('.db-layout')
  const divider = document.querySelector<HTMLElement>('[data-db-divider]')
  if (!layout || !divider) return

  // Restore saved ratio
  const saved = localStorage.getItem(SPLIT_STORAGE_KEY)
  if (saved) {
    const ratio = parseFloat(saved)
    if (ratio >= MIN_SPLIT && ratio <= MAX_SPLIT) {
      layout.style.setProperty('--db-split', `${ratio}%`)
    }
  }

  const onPointerMove = (e: PointerEvent) => {
    const rect = layout.getBoundingClientRect()
    let ratio = ((e.clientX - rect.left) / rect.width) * 100
    ratio = Math.max(MIN_SPLIT, Math.min(MAX_SPLIT, ratio))
    layout.style.setProperty('--db-split', `${ratio}%`)
  }

  const onPointerUp = (e: PointerEvent) => {
    divider.classList.remove('is-dragging')
    document.body.style.userSelect = ''
    document.body.style.cursor = ''
    divider.releasePointerCapture(e.pointerId)
    divider.removeEventListener('pointermove', onPointerMove)
    divider.removeEventListener('pointerup', onPointerUp)

    // Persist
    const current = layout.style.getPropertyValue('--db-split')
    if (current) {
      localStorage.setItem(SPLIT_STORAGE_KEY, parseFloat(current).toString())
    }
  }

  divider.addEventListener('pointerdown', (e: PointerEvent) => {
    e.preventDefault()
    divider.classList.add('is-dragging')
    document.body.style.userSelect = 'none'
    document.body.style.cursor = 'col-resize'
    divider.setPointerCapture(e.pointerId)
    divider.addEventListener('pointermove', onPointerMove)
    divider.addEventListener('pointerup', onPointerUp)
  })
}

// --- Init ---

function init(): void {
  const container = document.querySelector<HTMLElement>('[data-design-builder]')
  if (!container) return

  const tokensAttr = container.getAttribute('data-tokens')
  if (!tokensAttr) {
    container.textContent = 'Error: No token data found.'
    return
  }

  let tokens: TokenData
  try {
    tokens = JSON.parse(tokensAttr)
  } catch {
    container.textContent = 'Error: Invalid token data.'
    return
  }

  const storage = new LocalStorageAdapter()
  new DesignBuilder(container, tokens, storage)

  initDivider()
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init)
} else {
  init()
}
