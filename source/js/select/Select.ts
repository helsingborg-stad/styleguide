export enum SelectElementSelector {
	selectElementAttribute = 'data-js-select-element',
	maxSelectionsAttribute = 'data-js-select-max',
	selectClearAttribute = 'data-js-select-clear',
	selectDropdownElementAttribute = 'data-js-dropdown-element',
	selectDropdownOptionElementAttribte = 'data-js-dropdown-option',
	selectPlaceholderElementAttribte = 'data-js-placeholder',
	actionOverlayElementAttribute = 'data-js-select-action-overlay',
	activeOptionCssClass = 'is-selected',
	emptySelectCssClass = 'is-empty',
}

export class Select {
	private element: HTMLElement;
	private selectElement: HTMLSelectElement;
	private dropdownElement: HTMLElement;
	private actionOverlayElement: HTMLElement;
	private dropdownOptionElements: NodeListOf<HTMLElement>;

	constructor(element: HTMLElement) {
		this.element = element
		this.selectElement = this.getSelectElement();
		this.dropdownElement = this.getDropdownElement();
		this.actionOverlayElement = this.getActionOverlayElement();
		this.dropdownOptionElements = this.getDropdownOptionElements();

		this.setupEventListeners();
	}

	setupEventListeners() {
		const clearButton = this.element.querySelector(`[${SelectElementSelector.selectClearAttribute}]`);
		
		this.selectElement.addEventListener('change', () => this.disableMultiSelectOptionsWhenMaxSelectionsReached())
		this.selectElement.addEventListener('change', () => this.commaSeparateSelectedValuesInMultiSelect());
		this.selectElement.addEventListener('change', () => this.updateClearButtonVisibilityState());
		this.actionOverlayElement.addEventListener('keydown', (event) => this.openDropdownOnSpacebar(event));
		this.dropdownOptionElements.forEach(element => element.addEventListener('keydown', (event) => this.selectOptionOnDropdownOptionElementKeyDown(event)))
		clearButton?.addEventListener('click', () => this.setSingleSelectValue(null));

		this.runFunctionsRequiredForInitialization();
	}

	selectOptionOnDropdownOptionElementKeyDown(event: KeyboardEvent): any {
		if (event.key === 'Enter' || event.key === ' ') {
			event.preventDefault();
			(event.target as HTMLElement).click();
		}
	}

	openDropdownOnSpacebar(event: KeyboardEvent): any {
		if( event.key === ' ') {
			event.preventDefault();
			this.actionOverlayElement.click()
		}
	}

	runFunctionsRequiredForInitialization() {
		this.disableMultiSelectOptionsWhenMaxSelectionsReached()
		this.updateSelectedItemsOnClick();
		this.updateVisualRepresentation();
		this.setIsEmptyState();
		this.setPlaceHolderAriaState();
		this.updateClearButtonVisibilityState()
		this.commaSeparateSelectedValuesInMultiSelect();
		this.disableMultiSelectOptionsWhenMaxSelectionsReached();
	}

	disableMultiSelectOptionsWhenMaxSelectionsReached() {

		if (!this.isMultiSelect()) return;

		const limitReached = this.maxSelectionsReached();
		const optionElements = this.selectElement.querySelectorAll<HTMLOptionElement>('option');

		optionElements.forEach((optionElement) => {
			const disabled = limitReached && !optionElement.selected;
			const optionListElementSelector = `[${SelectElementSelector.selectDropdownOptionElementAttribte}="${optionElement.value}"]`;
			const optionListElement = this.dropdownElement.querySelector<HTMLElement>(optionListElementSelector);

			optionElement.disabled = disabled
			optionListElement?.setAttribute('aria-disabled', disabled ? 'true' : 'false')
		})
	}



	commaSeparateSelectedValuesInMultiSelect() {
		if (!this.isMultiSelect()) return;

		const optionElements = this.selectElement.querySelectorAll<HTMLOptionElement>('option:checked');
		const suffix = ', ';

		optionElements.forEach((optionElement, key) => {
			const optionLabel = optionElement.textContent || '';
			const optionLabelWithoutComma = optionLabel.replace(/(,\s?)$/gm, '').trim();

			optionElement.textContent = key === optionElements.length - 1
				? optionLabelWithoutComma
				: `${optionLabelWithoutComma}${suffix}`
		})
	}

	updateSelectedItemsOnClick(): void {
		const visualOptionsList = this.getVisualOptionsList();
		if (visualOptionsList.length) {
			visualOptionsList.forEach((optionElement) => {
				optionElement.addEventListener('click', () => {
					const newValue: string | null = optionElement.getAttribute(SelectElementSelector.selectDropdownOptionElementAttribte);

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

	updateClearButtonVisibilityState() {
		const clearButton = this.element.querySelector(`[${SelectElementSelector.selectClearAttribute}]`);
		if (!clearButton) return;

		if (this.selectElement.value === '') {
			clearButton?.setAttribute('aria-hidden', 'true');
		} else {
			clearButton?.setAttribute('aria-hidden', 'false');
		}
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
			const option = this.dropdownElement.querySelector(`[${SelectElementSelector.selectDropdownOptionElementAttribte}="${value}"]`);
			if (option instanceof HTMLElement) {
				option.classList.add(SelectElementSelector.activeOptionCssClass);
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
		const maxSelections = this.selectElement.getAttribute(SelectElementSelector.maxSelectionsAttribute);
		return maxSelections ? parseInt(maxSelections) : 0;
	}

	selectOption(value: string): void {
		const option = this.getOptionElementByValue(value)
		if (option) {
			option.selected = true;
			option.setAttribute('selected', 'selected');
			this.dispatchSelectChangeEvent();
		}
	}

	deSelectOption(value: string): void {
		const option = this.getOptionElementByValue(value)
		if (option) {
			option.selected = false;
			option.removeAttribute('selected');
			this.dispatchSelectChangeEvent();
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

	dispatchSelectChangeEvent() {
		this.selectElement.dispatchEvent(new Event('change'));
	}

	setSingleSelectValue(newValue: string | null) {
		const placeholderElement = this.element.querySelector(`[${SelectElementSelector.selectPlaceholderElementAttribte}]`);
		if (placeholderElement instanceof HTMLElement) {
			placeholderElement.innerText = newValue || '';
		}
		this.selectElement.value = newValue || '';
		this.dispatchSelectChangeEvent();
		this.setPlaceHolderAriaState();
		this.setIsEmptyState();
	}

	setIsEmptyState() {

		if (this.selectElement.value === '') {
			this.element.classList.add(SelectElementSelector.emptySelectCssClass);
		} else {
			this.element.classList.remove(SelectElementSelector.emptySelectCssClass);
		}
	}

	setPlaceHolderAriaState() {
		const placeholderElement = this.element.querySelector(`[${SelectElementSelector.selectPlaceholderElementAttribte}]`);
		if (placeholderElement instanceof HTMLElement) {
			if (this.element.classList.contains(SelectElementSelector.emptySelectCssClass)) {
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
					const option = this.dropdownElement.querySelector(`[${SelectElementSelector.selectDropdownOptionElementAttribte}="${value}"]`);
					if (option instanceof HTMLElement) {
						option.classList.add(SelectElementSelector.activeOptionCssClass);
						option.setAttribute('aria-selected', 'true');
					}
				})
			}
		});
	}

	resetDropdownElement(dropdownElement: HTMLElement) {
		const options = dropdownElement.querySelectorAll(`[${SelectElementSelector.selectDropdownOptionElementAttribte}]`);
		if (options.length) {
			options.forEach((option) => {
				option.classList.remove(SelectElementSelector.activeOptionCssClass);
				option.setAttribute('aria-selected', 'false');
			});
		}
	}

	getSelectedValues(): string[] {
		return this.isMultiSelect()
			? Array.from(this.selectElement.selectedOptions).map((option) => option.value)
			: [this.selectElement.value];
	}

	getVisualOptionsList(): NodeListOf<HTMLElement> {
		return this.dropdownElement.querySelectorAll(`[${SelectElementSelector.selectDropdownOptionElementAttribte}]`);
	}

	getSelectElement(): HTMLSelectElement {
		return this.element.querySelector(`[${SelectElementSelector.selectElementAttribute}]`) as HTMLSelectElement;
	}

	isMultiSelect(): boolean {
		return this.selectElement.hasAttribute('multiple');
	}

	getDropdownElement(): HTMLElement {
		return this.element.querySelector(`[${SelectElementSelector.selectDropdownElementAttribute}]`) as HTMLElement;
	}
	
	getActionOverlayElement(): HTMLElement {
		return this.element.querySelector(`[${SelectElementSelector.actionOverlayElementAttribute}]`) as HTMLElement;
	}

	getDropdownOptionElements(): any {
		return this.element.querySelectorAll(`[${SelectElementSelector.selectDropdownOptionElementAttribte}]`);
	}
}
