export enum SelectElementSelector {
	selectElementAttribute = 'data-js-select-element',
	maxSelectionsAttribute = 'data-js-select-max',
	selectClearAttribute = 'data-js-select-clear',
	selectDropdownElementAttribute = 'data-js-dropdown-element',
	selectDropdownOptionElementAttribte = 'data-js-dropdown-option',
	actionOverlayElementAttribute = 'data-js-select-action-overlay',
	preserveNativeBehaviorAttribute = 'data-select-preserve-native-behavior',
	placeholderAttribute = 'data-js-placeholder',
	activeOptionCssClass = 'is-selected',
	emptySelectCssClass = 'is-empty',
	expandLessIconCssClass = 'c-icon--expand-less',
	expandMoreIconCssClass = 'c-icon--expand-more',
}

export class Select {
	private element: HTMLElement;
	private selectElement: HTMLSelectElement;
	private dropdownElement: HTMLElement;
	private actionOverlayElement: HTMLElement;
	private dropdownOptionElements: NodeListOf<HTMLElement>;
	private clearButton: HTMLElement|null;
	private dropDownElement: HTMLElement;
	private expandLessIcon: HTMLElement;
	private expandMoreIcon: HTMLElement;
	private preserveNativeBehaviorElement: HTMLElement;
	private placeholderText: string;

	constructor(element: HTMLElement) {
		this.element = element
		this.selectElement = this.getSelectElement();
		this.dropdownElement = this.getDropdownElement();
		this.actionOverlayElement = this.getActionOverlayElement();
		this.dropdownOptionElements = this.getDropdownOptionElements();
		this.dropDownElement = this.element.querySelector(`[${SelectElementSelector.selectDropdownElementAttribute}]`) as HTMLElement;
		this.clearButton = this.element.querySelector(`[${SelectElementSelector.selectClearAttribute}]`);
		this.expandLessIcon = this.element.querySelector(`.${SelectElementSelector.expandLessIconCssClass}`) as HTMLElement;
		this.expandMoreIcon = this.element.querySelector(`.${SelectElementSelector.expandMoreIconCssClass}`) as HTMLElement;
		this.preserveNativeBehaviorElement = this.element.querySelector(`[${SelectElementSelector.preserveNativeBehaviorAttribute}]`) as HTMLElement;
		this.placeholderText = this.element.querySelector(`[${SelectElementSelector.placeholderAttribute}]`)?.getAttribute(SelectElementSelector.placeholderAttribute) || ""

		this.preserveNativeBehaviorElement.addEventListener('click', (e) => {
			this.selectElement.focus()
		})

		this.setupEventListeners();
	}

	setupEventListeners() {
		this.selectElement.addEventListener('change', () => this.disableMultiSelectOptionsWhenMaxSelectionsReached())
		this.selectElement.addEventListener('change', () => this.updatePlaceholderText());
		this.selectElement.addEventListener('change', () => this.updateClearButtonVisibilityState());
		this.actionOverlayElement.addEventListener('keydown', (event) => this.openDropdownOnSpacebar(event));
		this.dropdownOptionElements.forEach(element => element.addEventListener('keydown', (event) => this.selectOptionOnDropdownOptionElementKeyDown(event)))
		this.clearButton?.addEventListener('click', () => this.setSingleSelectValue(null));
		this.element.addEventListener('classListChange', () => this.updateDropdownAriaStateOnTopElementClassListChange());
		this.element.addEventListener('classListChange', () => this.updateExpandIconsAriaStateOnTopElementClassListChange());

		this.runFunctionsRequiredForInitialization();
	}

	updateExpandIconsAriaStateOnTopElementClassListChange(): void {
		const isOpen = this.element.classList.contains('is-open');
		this.expandMoreIcon.setAttribute('aria-hidden', Boolean(isOpen).toString());
		this.expandLessIcon.setAttribute('aria-hidden', Boolean(!isOpen).toString());
	}
	
	updateDropdownAriaStateOnTopElementClassListChange(): void {
		const isOpen = this.element.classList.contains('is-open');
		this.dropDownElement.setAttribute('aria-hidden', Boolean(!isOpen).toString());
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
		this.updateClearButtonVisibilityState()
		this.updatePlaceholderText();
		this.disableMultiSelectOptionsWhenMaxSelectionsReached();
		this.setupClassListChangeEventDispatcher();
	}

	setupClassListChangeEventDispatcher() {
		const classListChangeMutationObserver = new MutationObserver((mutations) => {
			mutations.forEach((mutation) => mutation.attributeName === 'class' && mutation.target.dispatchEvent(new Event('classListChange')));
		});

		classListChangeMutationObserver.observe(this.element, {attributes: true});
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

	updatePlaceholderText() {
		const optionElements = this.selectElement.querySelectorAll<HTMLOptionElement>('option:checked');
		const placeholderText = Array.from(optionElements).map(option => option.textContent?.trim()).join(', ');
		this.actionOverlayElement.textContent = Boolean(placeholderText) ? placeholderText : this.placeholderText; 
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
		this.selectElement.value = newValue || '';
		this.dispatchSelectChangeEvent();
		this.setIsEmptyState();
	}

	setIsEmptyState() {

		if (this.selectElement.value === '') {
			this.element.classList.add(SelectElementSelector.emptySelectCssClass);
		} else {
			this.element.classList.remove(SelectElementSelector.emptySelectCssClass);
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
