/**
 * Control Renderers for Design Token Types
 *
 * Factory that creates the appropriate HTML input element(s) for each
 * token type: color, range, select, font.
 */

export interface TokenSetting {
  variable: string
  label: string
  description?: string
  type: 'color' | 'range' | 'select' | 'font'
  default: string
  unit?: string
  min?: number
  max?: number
  step?: number
  options?: Array<{ value: string; label: string }>
  locked?: boolean
  contrast?: string | string[]
  notes?: string
}

export type ChangeCallback = (variable: string, value: string) => void

/**
 * Creates a control row for a single token setting.
 * Returns the root element for the control.
 */
export function createControl(
  setting: TokenSetting,
  currentValue: string,
  onChange: ChangeCallback
): HTMLElement {
  const row = document.createElement('div')
  row.className = 'db-control'
  if (setting.locked) {
    row.classList.add('db-control--locked')
  }
  row.dataset.variable = setting.variable

  // Label
  const label = document.createElement('label')
  label.className = 'db-control__label'
  label.textContent = setting.label
  row.appendChild(label)

  // Description
  if (setting.description) {
    const desc = document.createElement('span')
    desc.className = 'db-control__description'
    desc.textContent = setting.description
    row.appendChild(desc)
  }

  // Variable name display
  const varName = document.createElement('code')
  varName.className = 'db-control__variable'
  varName.textContent = setting.variable
  row.appendChild(varName)

  // Control element
  const controlWrap = document.createElement('div')
  controlWrap.className = 'db-control__input'

  switch (setting.type) {
    case 'color':
      buildColorControl(controlWrap, setting, currentValue, onChange)
      break
    case 'range':
      buildRangeControl(controlWrap, setting, currentValue, onChange)
      break
    case 'select':
      buildSelectControl(controlWrap, setting, currentValue, onChange)
      break
    case 'font':
      buildFontControl(controlWrap, setting, currentValue, onChange)
      break
  }

  row.appendChild(controlWrap)

  // Reset button (not for locked tokens)
  if (!setting.locked) {
    const resetBtn = document.createElement('button')
    resetBtn.className = 'db-control__reset'
    resetBtn.type = 'button'
    resetBtn.title = `Reset to ${setting.default}`
    resetBtn.textContent = 'Reset'
    resetBtn.addEventListener('click', () => {
      onChange(setting.variable, '')
      updateControlValue(row, setting.default, setting)
    })
    row.appendChild(resetBtn)
  }

  return row
}

/**
 * Updates the control's displayed value without triggering change events.
 */
function updateControlValue(row: HTMLElement, value: string, setting: TokenSetting): void {
  switch (setting.type) {
    case 'color': {
      const colorInput = row.querySelector<HTMLInputElement>('input[type="color"]')
      const textInput = row.querySelector<HTMLInputElement>('input[type="text"]')
      if (colorInput) colorInput.value = toHex(value)
      if (textInput) textInput.value = value
      const swatch = row.querySelector<HTMLElement>('.db-control__swatch')
      if (swatch) swatch.style.backgroundColor = value
      break
    }
    case 'range': {
      const rangeInput = row.querySelector<HTMLInputElement>('input[type="range"]')
      const display = row.querySelector<HTMLElement>('.db-control__value-display')
      const numVal = parseFloat(value)
      if (rangeInput && !isNaN(numVal)) rangeInput.value = String(numVal)
      if (display) display.textContent = value
      break
    }
    case 'select': {
      const select = row.querySelector<HTMLSelectElement>('select')
      if (select) select.value = value
      break
    }
    case 'font': {
      const input = row.querySelector<HTMLInputElement>('input[type="text"]')
      if (input) input.value = value
      break
    }
  }
}

// --- Color ---

function buildColorControl(
  wrap: HTMLElement,
  setting: TokenSetting,
  currentValue: string,
  onChange: ChangeCallback
): void {
  const isLocked = setting.locked === true

  // Color swatch preview
  const swatch = document.createElement('div')
  swatch.className = 'db-control__swatch'
  swatch.style.backgroundColor = currentValue
  wrap.appendChild(swatch)

  // Native color picker (hex only)
  const colorInput = document.createElement('input')
  colorInput.type = 'color'
  colorInput.value = toHex(currentValue)
  colorInput.disabled = isLocked
  wrap.appendChild(colorInput)

  // Text input for rgba/hex values
  const textInput = document.createElement('input')
  textInput.type = 'text'
  textInput.className = 'db-control__text'
  textInput.value = currentValue
  textInput.disabled = isLocked
  textInput.placeholder = setting.default
  wrap.appendChild(textInput)

  if (!isLocked) {
    colorInput.addEventListener('input', () => {
      textInput.value = colorInput.value
      swatch.style.backgroundColor = colorInput.value
      onChange(setting.variable, colorInput.value)
    })

    textInput.addEventListener('change', () => {
      swatch.style.backgroundColor = textInput.value
      colorInput.value = toHex(textInput.value)
      onChange(setting.variable, textInput.value)
    })
  }
}

// --- Range ---

function buildRangeControl(
  wrap: HTMLElement,
  setting: TokenSetting,
  currentValue: string,
  onChange: ChangeCallback
): void {
  const isLocked = setting.locked === true
  const numVal = parseFloat(currentValue)
  const unit = setting.unit || ''

  const rangeInput = document.createElement('input')
  rangeInput.type = 'range'
  rangeInput.disabled = isLocked
  if (setting.min !== undefined) rangeInput.min = String(setting.min)
  if (setting.max !== undefined) rangeInput.max = String(setting.max)
  if (setting.step !== undefined) rangeInput.step = String(setting.step)
  rangeInput.value = isNaN(numVal) ? '0' : String(numVal)
  wrap.appendChild(rangeInput)

  const display = document.createElement('span')
  display.className = 'db-control__value-display'
  display.textContent = currentValue
  wrap.appendChild(display)

  if (!isLocked) {
    rangeInput.addEventListener('input', () => {
      const val = unit ? `${rangeInput.value}${unit}` : rangeInput.value
      display.textContent = val
      onChange(setting.variable, val)
    })
  }
}

// --- Select ---

function buildSelectControl(
  wrap: HTMLElement,
  setting: TokenSetting,
  currentValue: string,
  onChange: ChangeCallback
): void {
  const isLocked = setting.locked === true

  const select = document.createElement('select')
  select.disabled = isLocked

  for (const opt of setting.options || []) {
    const option = document.createElement('option')
    option.value = opt.value
    option.textContent = opt.label
    if (opt.value === currentValue) option.selected = true
    select.appendChild(option)
  }

  wrap.appendChild(select)

  if (!isLocked) {
    select.addEventListener('change', () => {
      onChange(setting.variable, select.value)
    })
  }
}

// --- Font ---

function buildFontControl(
  wrap: HTMLElement,
  setting: TokenSetting,
  currentValue: string,
  onChange: ChangeCallback
): void {
  const isLocked = setting.locked === true

  const input = document.createElement('input')
  input.type = 'text'
  input.className = 'db-control__text db-control__text--font'
  input.value = currentValue
  input.disabled = isLocked
  input.placeholder = setting.default
  wrap.appendChild(input)

  // Font preview
  const preview = document.createElement('span')
  preview.className = 'db-control__font-preview'
  preview.textContent = 'The quick brown fox'
  preview.style.fontFamily = currentValue
  wrap.appendChild(preview)

  if (!isLocked) {
    input.addEventListener('change', () => {
      preview.style.fontFamily = input.value
      onChange(setting.variable, input.value)
    })
  }
}

// --- Contrast Pair ---

/**
 * Creates a 3-column contrast pair row:
 * Col 1: Base color control
 * Col 2: Contrast color control
 * Col 3: Preview box showing the combination
 */
export function createContrastPair(
  base: TokenSetting,
  contrast: TokenSetting,
  baseValue: string,
  contrastValue: string,
  onChange: ChangeCallback
): HTMLElement {
  const row = document.createElement('div')
  row.className = 'db-pair'

  // --- Col 1: Base ---
  const baseCol = document.createElement('div')
  baseCol.className = 'db-pair__col'
  baseCol.appendChild(buildPairColorCell(base, baseValue, onChange, (val) => {
    preview.style.backgroundColor = val
  }))
  row.appendChild(baseCol)

  // --- Col 2: Contrast ---
  const contrastCol = document.createElement('div')
  contrastCol.className = 'db-pair__col'
  contrastCol.appendChild(buildPairColorCell(contrast, contrastValue, onChange, (val) => {
    preview.style.color = val
  }))
  row.appendChild(contrastCol)

  // --- Col 3: Preview ---
  const previewCol = document.createElement('div')
  previewCol.className = 'db-pair__preview-col'
  const preview = document.createElement('div')
  preview.className = 'db-pair__preview'
  preview.style.backgroundColor = baseValue
  preview.style.color = contrastValue
  preview.innerHTML = '<span class="db-pair__preview-lg">Aa</span><span class="db-pair__preview-sm">The quick brown fox jumps over the lazy dog</span>'
  previewCol.appendChild(preview)
  row.appendChild(previewCol)

  return row
}

/**
 * Builds a single color cell within a contrast pair column.
 * Compact: label, variable, swatch+picker+text, reset.
 */
function buildPairColorCell(
  setting: TokenSetting,
  currentValue: string,
  onChange: ChangeCallback,
  onPreviewUpdate: (val: string) => void
): HTMLElement {
  const cell = document.createElement('div')
  cell.className = 'db-pair__cell'
  cell.dataset.variable = setting.variable

  const label = document.createElement('label')
  label.className = 'db-pair__label'
  label.textContent = setting.label
  cell.appendChild(label)

  const varName = document.createElement('code')
  varName.className = 'db-pair__variable'
  varName.textContent = setting.variable
  cell.appendChild(varName)

  const inputRow = document.createElement('div')
  inputRow.className = 'db-pair__inputs'

  // Swatch
  const swatch = document.createElement('div')
  swatch.className = 'db-control__swatch'
  swatch.style.backgroundColor = currentValue
  inputRow.appendChild(swatch)

  // Color picker
  const colorInput = document.createElement('input')
  colorInput.type = 'color'
  colorInput.value = toHex(currentValue)
  inputRow.appendChild(colorInput)

  // Text input
  const textInput = document.createElement('input')
  textInput.type = 'text'
  textInput.className = 'db-control__text'
  textInput.value = currentValue
  textInput.placeholder = setting.default
  inputRow.appendChild(textInput)

  colorInput.addEventListener('input', () => {
    textInput.value = colorInput.value
    swatch.style.backgroundColor = colorInput.value
    onPreviewUpdate(colorInput.value)
    onChange(setting.variable, colorInput.value)
  })

  textInput.addEventListener('change', () => {
    swatch.style.backgroundColor = textInput.value
    colorInput.value = toHex(textInput.value)
    onPreviewUpdate(textInput.value)
    onChange(setting.variable, textInput.value)
  })

  cell.appendChild(inputRow)

  // Reset
  const resetBtn = document.createElement('button')
  resetBtn.className = 'db-control__reset'
  resetBtn.type = 'button'
  resetBtn.title = `Reset to ${setting.default}`
  resetBtn.textContent = 'Reset'
  resetBtn.addEventListener('click', () => {
    onChange(setting.variable, '')
    colorInput.value = toHex(setting.default)
    textInput.value = setting.default
    swatch.style.backgroundColor = setting.default
    onPreviewUpdate(setting.default)
  })
  cell.appendChild(resetBtn)

  return cell
}

// --- Swatch Band ---

/**
 * Creates a compact swatch band for a group of color tokens.
 * Groups settings by common variable prefix and renders each group
 * as a horizontal strip of color swatches.
 */
export function createSwatchBand(settings: TokenSetting[]): HTMLElement {
  const container = document.createElement('div')
  container.className = 'db-swatch-band'

  // Group by prefix: --color--black-*, --color--white-*, --color--gray-*
  const groups = new Map<string, TokenSetting[]>()
  for (const setting of settings) {
    // Extract group name: "--color--black-10" → "Black"
    const match = setting.variable.match(/^--color--(\w+)-\d+$/)
    const groupKey = match ? match[1] : 'other'
    if (!groups.has(groupKey)) groups.set(groupKey, [])
    groups.get(groupKey)!.push(setting)
  }

  for (const [groupKey, groupSettings] of groups) {
    const row = document.createElement('div')
    row.className = 'db-swatch-band__row'

    // Variable name pattern: --color--black-[%]
    const varLabel = document.createElement('code')
    varLabel.className = 'db-swatch-band__var'
    varLabel.textContent = `--color--${groupKey}-[%]`
    row.appendChild(varLabel)

    const strip = document.createElement('div')
    strip.className = 'db-swatch-band__strip'

    for (const setting of groupSettings) {
      const swatch = document.createElement('div')
      swatch.className = 'db-swatch-band__swatch'
      swatch.style.backgroundColor = setting.default

      // Extract percentage for tooltip: "--color--black-40" → "40%"
      const pctMatch = setting.variable.match(/-(\d+)$/)
      const pct = pctMatch ? `${pctMatch[1]}` : ''
      swatch.title = `${setting.variable}\n${setting.default}`

      const pctLabel = document.createElement('span')
      pctLabel.className = 'db-swatch-band__pct'
      pctLabel.textContent = pct

      swatch.appendChild(pctLabel)
      strip.appendChild(swatch)
    }

    row.appendChild(strip)
    container.appendChild(row)
  }

  return container
}

// --- Helpers ---

/**
 * Best-effort conversion to hex for the native color picker.
 * Falls back to #000000 for rgba/complex values.
 */
function toHex(color: string): string {
  if (/^#[0-9a-f]{6}$/i.test(color)) return color
  if (/^#[0-9a-f]{3}$/i.test(color)) {
    return '#' + color[1] + color[1] + color[2] + color[2] + color[3] + color[3]
  }

  // Try parsing via a temporary element
  const temp = document.createElement('div')
  temp.style.color = color
  document.body.appendChild(temp)
  const computed = getComputedStyle(temp).color
  document.body.removeChild(temp)

  const match = computed.match(/rgb\((\d+),\s*(\d+),\s*(\d+)\)/)
  if (match) {
    const r = parseInt(match[1]).toString(16).padStart(2, '0')
    const g = parseInt(match[2]).toString(16).padStart(2, '0')
    const b = parseInt(match[3]).toString(16).padStart(2, '0')
    return `#${r}${g}${b}`
  }

  return '#000000'
}
