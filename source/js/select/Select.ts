export class Select {
	private readonly selectElementAttribute = 'data-js-select-element';
	private readonly maxSelectionsAttribute = 'data-js-select-max';
	public static selectClearAttribute = 'data-js-select-clear';
	private readonly selectDropdownElementAttribute = 'data-js-dropdown-element';
	private readonly selectDropdownOptionElementAttribte = 'data-js-dropdown-option';
	private readonly selectPlaceholderElementAttribte = 'data-js-placeholder';
	private readonly selectIsOpenClassElementAttribute = 'data-js-toggle-class';
	private readonly activeOptionCssClass = 'is-selected';
	private readonly emptySelectCssClass = 'is-empty';
	private element: HTMLElement;
	private selectElement: HTMLSelectElement;
	private dropdownElement: HTMLElement;

	constructor(element: HTMLElement) {
		this.element = element
		this.selectElement = this.getSelectElement(element);
		this.dropdownElement = this.getDropdownElement(element);

		this.updateSelectedItemsOnClick();
		this.updateVisualRepresentation();
		this.setIsEmptyState();
		this.setPlaceHolderAriaState();
		this.setupClearButton();
	}

	updateSelectedItemsOnClick(): void {
		const visualOptionsList = this.getVisualOptionsList();
		if (visualOptionsList.length) {
			visualOptionsList.forEach((optionElement) => {
				optionElement.addEventListener('click', () => {
					const newValue: string | null = optionElement.getAttribute(this.selectDropdownOptionElementAttribte);

					if (newValue === null) {
						return
					}

					if (this.isMultiSelect()) {
						this.setMultiSelectValue(newValue);
					} else {
						this.setSingleSelectValue(newValue);
					}
				});
			});
		}
	}

	setupClearButton(): void {
		const clearButton = this.element.querySelector(`[${Select.selectClearAttribute}]`);
		
		if (clearButton instanceof HTMLElement) {
			clearButton.setAttribute('aria-hidden', this.selectElement.value === '' ? 'true' : 'false');
			this.handleClearButtonVisibilityState()
			clearButton.addEventListener('click', () => {
				this.setSingleSelectValue(null);
			});
		}
	}
	
	handleClearButtonVisibilityState() {
		this.selectElement.addEventListener('change', () => {
			
			const clearButton = this.element.querySelector(`[${Select.selectClearAttribute}]`);

			if (this.selectElement.value === '') {
				clearButton?.setAttribute('aria-hidden', 'true');
			} else {
				clearButton?.setAttribute('aria-hidden', 'false');
			}
		});
	}

	setMultiSelectValue(newValue: string) {
		const selectedValues = this.getSelectedValues();

		if (selectedValues.includes(newValue)) {
			selectedValues.splice(selectedValues.indexOf(newValue), 1);
			this.deSelectOption(newValue);
		} else if (!this.maxSelectionsReached()) {
			selectedValues.push(newValue);
			this.selectOption(newValue);
		}

		selectedValues.forEach((value) => {
			const option = this.dropdownElement.querySelector(`[${this.selectDropdownOptionElementAttribte}="${value}"]`);
			if (option instanceof HTMLElement) {
				option.classList.add(this.activeOptionCssClass);
				option.setAttribute('aria-selected', 'true');
			}
		})

		this.setPlaceHolderAriaState();
		this.setIsEmptyState();
	}

	maxSelectionsReached(): boolean {
		const maxSelections = this.getMaxSelections();
		return maxSelections > 0 && this.getSelectedValues().length >= maxSelections;
	}

	getMaxSelections(): number {
		const maxSelections = this.selectElement.getAttribute(this.maxSelectionsAttribute);
		return maxSelections ? parseInt(maxSelections) : 0;
	}

	selectOption(value: string): void {
		const option = this.getOptionElementByValue(value)
		if (option && !option.selected) {
			option.selected = true;
			option.setAttribute('selected', 'selected');
			this.dispactSelectChangeEvent();
		}
	}

	deSelectOption(value: string): void {
		const option = this.getOptionElementByValue(value)
		if (option && option.selected) {
			option.selected = false;
			option.removeAttribute('selected');
			this.dispactSelectChangeEvent();
		}
	}

	getOptionElementByValue(value: string) {
		for (let i = 0; i < this.selectElement.options.length; i++) {
			const option = this.selectElement.options[i];
			if (option.value === value) {
				return option;
			}
		}
	}

	dispactSelectChangeEvent() {
		this.selectElement.dispatchEvent(new Event('change'));
	}

	setSingleSelectValue(newValue: string | null) {
		const placeholderElement = this.element.querySelector(`[${this.selectPlaceholderElementAttribte}]`);
		if (placeholderElement instanceof HTMLElement) {
			placeholderElement.innerText = newValue || '';
		}
		this.selectElement.value = newValue || '';
		this.dispactSelectChangeEvent();
		this.setPlaceHolderAriaState();
		this.setIsEmptyState();
	}

	setIsEmptyState() {
		const placeholderElement = this.element.querySelector(`[${this.selectPlaceholderElementAttribte}]`);
		if (placeholderElement instanceof HTMLElement) {
			if (this.selectElement.value === '') {
				placeholderElement.classList.add(this.emptySelectCssClass);
			} else {
				placeholderElement.classList.remove(this.emptySelectCssClass);
			}
		}
	}

	setPlaceHolderAriaState() {
		const placeholderElement = this.element.querySelector(`[${this.selectPlaceholderElementAttribte}]`);
		if (placeholderElement instanceof HTMLElement) {
			if (this.selectElement.value === '') {
				placeholderElement.setAttribute('aria-hidden', 'false');
			} else {
				placeholderElement.setAttribute('aria-hidden', 'true');
			}
		}
	}

	updateVisualRepresentation(): void {
		this.selectElement.addEventListener("change", () => {

			this.resetDropdownElement(this.dropdownElement);

			const selectedValues = this.getSelectedValues();
			if (selectedValues.length) {
				selectedValues.forEach((value) => {
					const option = this.dropdownElement.querySelector(`[${this.selectDropdownOptionElementAttribte}="${value}"]`);
					if (option instanceof HTMLElement) {
						option.classList.add(this.activeOptionCssClass);
						option.setAttribute('aria-selected', 'true');
					}
				})
			}
		});
	}

	getSelectedValues(): string[] {

		if (this.isMultiSelect()) {
			return Array.from(this.selectElement.selectedOptions).map((option) => option.value);
		}

		return [this.selectElement.value];
	}

	resetDropdownElement(dropdownElement: HTMLElement) {
		const options = dropdownElement.querySelectorAll(`[${this.selectDropdownOptionElementAttribte}]`);
		if (options.length) {
			options.forEach((option) => {
				option.classList.remove(this.activeOptionCssClass);
				option.setAttribute('aria-selected', 'false');
			});
		}
	}

	getVisualOptionsList(): NodeListOf<HTMLElement> {
		return this.dropdownElement.querySelectorAll(`[${this.selectDropdownOptionElementAttribte}]`);
	}

	getSelectElement(element: HTMLElement): HTMLSelectElement {
		return element.querySelector(`[${this.selectElementAttribute}]`) as HTMLSelectElement;
	}

	isMultiSelect(): boolean {
		return this.selectElement.hasAttribute('multiple');
	}

	getDropdownElement(element: HTMLElement): HTMLElement {
		return element.querySelector(`[${this.selectDropdownElementAttribute}]`) as HTMLElement;
	}
}


export class SelectComponentObserver {

	private readonly selectComponentElementAttribute = 'data-js-select-component'; //Add to main div of component

	constructor() {
		const container = document.documentElement || document.body;
		container.querySelectorAll(`[${this.selectComponentElementAttribute}]`).forEach((element) => {
			new Select(element as HTMLElement);
		})
	}

	observe(): void {
		const container = document.documentElement || document.body;
		const observerOptions = {
			childList: true,
			subtree: true
		};

		const observer = new MutationObserver((mutations) => {
			mutations.forEach((mutation) => {
				if (mutation.type === "childList") {
					mutation.addedNodes.forEach((node) => {
						if (node instanceof HTMLElement && node.hasAttribute(`[${this.selectComponentElementAttribute}]`)) {
							new Select(node);
						}
					});
				}
			});
		});

		observer.observe(container, observerOptions);
	}
}
