/**
 * Component Editor
 *
 * Standalone script that can be included on any page.
 * Scans for [data-component] elements, marks them as editable,
 * and shows a sidebar form for per-element CSS token overrides.
 *
 * Token overrides are written as inline CSS custom properties
 * directly on the element: --c-{type}--{token}
 * and persisted to localStorage under "design-component-overrides".
 */

const COMPONENT_OVERRIDES_KEY = 'design-component-overrides'

interface ComponentConfig {
	type: string
	tokens: string[]
}

class ComponentEditor {
	private panel: HTMLElement

	constructor() {
		this.panel = this.buildPanel()
		document.body.appendChild(this.panel)
		this.scan()
		document.addEventListener('click', () => this.closePanel())
	}

	// --- Scan ---

	private scan(): void {
		const elements = document.querySelectorAll<HTMLElement>('[data-component]')
		const allOverrides = this.loadAllOverrides()

		let index = 0
		for (const el of elements) {
			let config: ComponentConfig
			try {
				config = JSON.parse(el.dataset.component ?? '{}') as ComponentConfig
			} catch {
				index++
				continue
			}

			if (config.type && Array.isArray(config.tokens)) {
				const storageKey = `${config.type}-${index}`

				// Restore saved overrides onto the element
				const saved = allOverrides[storageKey]
				if (saved) {
					for (const [prop, val] of Object.entries(saved)) {
						el.style.setProperty(prop, val)
					}
				}

				el.classList.add('ce-editable')
				el.addEventListener('click', (e) => {
					e.stopPropagation()
					this.openPanel(el, config, storageKey)
				})
			}

			index++
		}
	}

	// --- Panel ---

	private buildPanel(): HTMLElement {
		const panel = document.createElement('div')
		panel.className = 'ce-panel'
		panel.setAttribute('hidden', '')
		panel.addEventListener('click', (e) => e.stopPropagation())
		return panel
	}

	private openPanel(el: HTMLElement, config: ComponentConfig, storageKey: string): void {
		for (const e of document.querySelectorAll<HTMLElement>('.ce-selected')) {
			e.classList.remove('ce-selected')
		}
		el.classList.add('ce-selected')

		const overrides = { ...this.loadOverrides(storageKey) }

		this.panel.innerHTML = ''

		// Header
		const header = document.createElement('div')
		header.className = 'ce-panel__header'
		header.innerHTML = `<span class="ce-panel__type">${config.type}</span>`

		const closeBtn = document.createElement('button')
		closeBtn.type = 'button'
		closeBtn.className = 'ce-panel__close material-symbols-outlined'
		closeBtn.textContent = 'close'
		closeBtn.addEventListener('click', () => this.closePanel())
		header.appendChild(closeBtn)
		this.panel.appendChild(header)

		// Fields
		const fields = document.createElement('div')
		fields.className = 'ce-panel__fields'

		for (const token of config.tokens) {
			fields.appendChild(this.buildField(el, config.type, token, overrides, storageKey))
		}

		this.panel.appendChild(fields)
		this.panel.removeAttribute('hidden')
	}

	private buildField(
		el: HTMLElement,
		type: string,
		token: string,
		overrides: Record<string, string>,
		storageKey: string,
	): HTMLElement {
		const varName = `--c-${type}--${token}`
		const defaultValue = `var(--${token})`
		const currentValue = overrides[varName] ?? ''
		const isColor = token.includes('color')

		const field = document.createElement('div')
		field.className = 'ce-field'

		const label = document.createElement('label')
		label.className = 'ce-field__label'
		label.textContent = token

		const code = document.createElement('code')
		code.className = 'ce-field__var'
		code.textContent = varName

		const inputRow = document.createElement('div')
		inputRow.className = 'ce-field__inputs'

		const applyValue = (value: string) => {
			const trimmed = value.trim()
			if (!trimmed || trimmed === defaultValue) {
				delete overrides[varName]
				el.style.removeProperty(varName)
			} else {
				overrides[varName] = trimmed
				el.style.setProperty(varName, trimmed)
			}
			this.saveOverrides(storageKey, overrides)
		}

		if (isColor) {
			const colorInput = document.createElement('input')
			colorInput.type = 'color'
			colorInput.className = 'ce-field__color'
			try { colorInput.value = currentValue || '#000000' } catch { colorInput.value = '#000000' }

			const textInput = document.createElement('input')
			textInput.type = 'text'
			textInput.className = 'ce-field__text'
			textInput.value = currentValue
			textInput.placeholder = defaultValue

			colorInput.addEventListener('input', () => {
				textInput.value = colorInput.value
				applyValue(colorInput.value)
			})
			textInput.addEventListener('change', () => {
				try { colorInput.value = textInput.value } catch { /* ignore */ }
				applyValue(textInput.value)
			})

			inputRow.appendChild(colorInput)
			inputRow.appendChild(textInput)
		} else {
			const textInput = document.createElement('input')
			textInput.type = 'text'
			textInput.className = 'ce-field__text'
			textInput.value = currentValue
			textInput.placeholder = defaultValue
			textInput.addEventListener('change', () => applyValue(textInput.value))
			inputRow.appendChild(textInput)
		}

		const resetBtn = document.createElement('button')
		resetBtn.type = 'button'
		resetBtn.className = 'ce-field__reset'
		resetBtn.textContent = 'Reset'
		resetBtn.addEventListener('click', () => {
			applyValue('')
			const config = this.parseConfig(el)
			if (config) this.openPanel(el, config, storageKey)
		})
		inputRow.appendChild(resetBtn)

		field.appendChild(label)
		field.appendChild(code)
		field.appendChild(inputRow)
		return field
	}

	private closePanel(): void {
		this.panel.setAttribute('hidden', '')
		for (const e of document.querySelectorAll<HTMLElement>('.ce-selected')) {
			e.classList.remove('ce-selected')
		}
	}

	// --- Storage ---

	private saveOverrides(storageKey: string, overrides: Record<string, string>): void {
		const all = this.loadAllOverrides()
		if (Object.keys(overrides).length === 0) {
			delete all[storageKey]
		} else {
			all[storageKey] = overrides
		}
		if (Object.keys(all).length === 0) {
			localStorage.removeItem(COMPONENT_OVERRIDES_KEY)
		} else {
			localStorage.setItem(COMPONENT_OVERRIDES_KEY, JSON.stringify(all))
		}
	}

	private loadOverrides(storageKey: string): Record<string, string> {
		return this.loadAllOverrides()[storageKey] ?? {}
	}

	private loadAllOverrides(): Record<string, Record<string, string>> {
		try {
			const raw = localStorage.getItem(COMPONENT_OVERRIDES_KEY)
			return raw ? (JSON.parse(raw) as Record<string, Record<string, string>>) : {}
		} catch {
			return {}
		}
	}

	// --- Helpers ---

	private parseConfig(el: HTMLElement): ComponentConfig | null {
		try {
			const config = JSON.parse(el.dataset.component ?? '{}') as ComponentConfig
			return config.type && Array.isArray(config.tokens) ? config : null
		} catch {
			return null
		}
	}
}

// --- Init ---

function init(): void {
	new ComponentEditor()
}

if (document.readyState === 'loading') {
	document.addEventListener('DOMContentLoaded', init)
} else {
	init()
}
