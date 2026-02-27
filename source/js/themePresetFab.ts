const STORAGE_KEY = 'design-tokens-overrides'
const ACTIVE_PRESET_KEY = 'design-tokens-active-preset'

type ThemeTokens = Record<string, string>

type ThemePresetDefinition = {
  id: string
  name: string
  path: string
}

type ThemePreset = ThemePresetDefinition & {
  tokens: ThemeTokens
}

const presetDefinitions: ThemePresetDefinition[] = [
  { id: 'dark', name: 'Dark Ember', path: '/source/themes/dark.json' },
  { id: 'nordic-dawn', name: 'Nordic Dawn', path: '/source/themes/nordic-dawn.json' },
  { id: 'forest-mist', name: 'Forest Mist', path: '/source/themes/forest-mist.json' },
  { id: 'sunset-clay', name: 'Sunset Clay', path: '/source/themes/sunset-clay.json' },
  { id: 'ocean-ink', name: 'Ocean Ink', path: '/source/themes/ocean-ink.json' },
  { id: 'aurora-light', name: 'Aurora Light', path: '/source/themes/aurora-light.json' },
  { id: 'high-contrast', name: 'High Contrast A11y', path: '/source/themes/high-contrast.json' },
]

function parseStoredOverrides(): ThemeTokens {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) {
      return {}
    }

    const parsed = JSON.parse(raw)
    if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) {
      return {}
    }

    return Object.entries(parsed).reduce((result, [key, value]) => {
      if (typeof key === 'string' && typeof value === 'string') {
        result[key] = value
      }

      return result
    }, {} as ThemeTokens)
  } catch {
    return {}
  }
}

function clearOverrides(overrides: ThemeTokens): void {
  for (const variable of Object.keys(overrides)) {
    document.documentElement.style.removeProperty(variable)
  }
}

function applyOverrides(overrides: ThemeTokens): void {
  for (const [variable, value] of Object.entries(overrides)) {
    document.documentElement.style.setProperty(variable, value)
  }
}

function saveOverrides(overrides: ThemeTokens): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(overrides))
  localStorage.removeItem(ACTIVE_PRESET_KEY)
}

function hasSameTokens(a: ThemeTokens, b: ThemeTokens): boolean {
  const aKeys = Object.keys(a)
  const bKeys = Object.keys(b)

  if (aKeys.length !== bKeys.length) {
    return false
  }

  return aKeys.every((key) => a[key] === b[key])
}

function createPresetButton(preset: ThemePreset): HTMLButtonElement {
  const button = document.createElement('button')
  button.type = 'button'
  button.className = 'c-button c-button--sm c-button__filled c-button__filled--secondary d-theme-presets__button u-margin--0'
  button.dataset.themePresetId = preset.id

  const label = document.createElement('span')
  label.className = 'c-button__label'

  const labelText = document.createElement('span')
  labelText.className = 'c-button__label-text'
  labelText.textContent = preset.name

  label.appendChild(labelText)
  button.appendChild(label)

  return button
}

function updateActiveButton(buttons: HTMLButtonElement[], activeId: string | null): void {
  buttons.forEach((button) => {
    const isActive = activeId !== null && button.dataset.themePresetId === activeId

    button.classList.toggle('is-active', isActive)
  })
}

async function loadPreset(definition: ThemePresetDefinition): Promise<ThemePreset | null> {
  try {
    const response = await fetch(definition.path, { cache: 'no-store' })
    if (!response.ok) {
      return null
    }

    const payload = await response.json()

    if (!payload || typeof payload !== 'object' || Array.isArray(payload)) {
      return null
    }

    const tokens: ThemeTokens = {}
    for (const [key, value] of Object.entries(payload)) {
      if (typeof key === 'string' && typeof value === 'string') {
        tokens[key] = value
      }
    }

    return {
      ...definition,
      tokens,
    }
  } catch {
    return null
  }
}

function closePanel(fabRoot: HTMLElement): void {
  const panel = fabRoot.querySelector<HTMLElement>('.c-fab__panel')
  if (panel) {
    panel.classList.remove('c-fab__panel--open')
  }
}

async function initThemePresetFab(): Promise<void> {
  const fabRoot = document.querySelector<HTMLElement>('[data-theme-presets-fab]')
  if (!fabRoot) {
    return
  }

  const list = fabRoot.querySelector<HTMLElement>('[data-theme-presets-list]')
  if (!list) {
    return
  }

  const loadedPresets = (await Promise.all(presetDefinitions.map(loadPreset))).filter((preset): preset is ThemePreset => preset !== null)

  if (loadedPresets.length === 0) {
    list.innerHTML = '<p class="c-typography c-typography__variant--body">No themes available.</p>'
    return
  }

  list.innerHTML = ''

  const storedOverrides = parseStoredOverrides()
  const initialActivePreset = loadedPresets.find((preset) => hasSameTokens(preset.tokens, storedOverrides))?.id ?? null

  const buttons = loadedPresets.map((preset) => {
    const button = createPresetButton(preset)

    button.addEventListener('click', () => {
      const currentOverrides = parseStoredOverrides()
      clearOverrides(currentOverrides)
      applyOverrides(preset.tokens)
      saveOverrides(preset.tokens)
      updateActiveButton(buttons, preset.id)
      closePanel(fabRoot)
    })

    list.appendChild(button)
    return button
  })

  updateActiveButton(buttons, initialActivePreset)
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    void initThemePresetFab()
  })
} else {
  void initThemePresetFab()
}
