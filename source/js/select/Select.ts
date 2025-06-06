export enum SelectElementSelector {
	selectElementAttribute = 'data-js-select-element',
	maxSelectionsAttribute = 'data-js-select-max',
	selectClearAttribute = 'data-js-select-clear',
	selectDropdownElementAttribute = 'data-js-dropdown-element',
	selectDropdownOptionElementAttribute = 'data-js-dropdown-option',
	actionOverlayElementAttribute = 'data-js-select-action-overlay',
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
	private optionTemplate: HTMLTemplateElement;
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
		this.placeholderText = this.element.querySelector(`[${SelectElementSelector.placeholderAttribute}]`)?.getAttribute(SelectElementSelector.placeholderAttribute) || "";
		this.optionTemplate = this.element.querySelector('template') as HTMLTemplateElement;

		this.setupEventListeners();
	}

	setupEventListeners() {
		this.setupOptionsObserver();
		this.selectElement.addEventListener('focusin', () => this.triggerDropdown());
		this.element.addEventListener('focusout', (e) => this.triggerBlurEvent(e));
		this.selectElement.addEventListener('change', () => this.disableMultiSelectOptionsWhenMaxSelectionsReached())
		this.selectElement.addEventListener('change', () => this.updatePlaceholderText());
		this.selectElement.addEventListener('change', () => this.updateClearButtonVisibilityState());
		this.selectElement.addEventListener('change', () => this.closeSingleSelectDropdown());
		this.actionOverlayElement.addEventListener('keydown', (event) => this.openDropdownOnSpacebar(event));
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

	closeSingleSelectDropdown() : void {
		if(!this.isMultiSelect()) {
			const element = this.element.classList;
			if(element.contains('is-open')) {
				element.remove('is-open');
			}
		}
	}

	selectOptionOnElementClick(optionElement: HTMLElement) {
		const newValue: string | null = optionElement.getAttribute(SelectElementSelector.selectDropdownOptionElementAttribute);

		if (newValue === null) {
			return
		}

		if (this.isMultiSelect()) {
			this.setMultiSelectValue(newValue);
		} else {
			this.setSingleSelectValue(newValue);
		}
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
		this.updateSelectedItemsListeners();
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

	// This function is used to trigger the dropdown the label is clicked
	private triggerDropdown() {
		this.actionOverlayElement.click();
		this.actionOverlayElement.focus();
  }
	// This method is used to trigger the blur event on the select element when the focus is moved outside of it
	private triggerBlurEvent(e: FocusEvent) {
		const relatedTarget = e.relatedTarget as HTMLElement | null;

		if (!relatedTarget || !this.element.contains(relatedTarget)) {
			this.selectElement.dispatchEvent(new Event('blur'));
		}
	}

	disableMultiSelectOptionsWhenMaxSelectionsReached() {

		if (!this.isMultiSelect()) return;

		const limitReached = this.maxSelectionsReached();
		const optionElements = this.selectElement.querySelectorAll<HTMLOptionElement>('option');

		optionElements.forEach((optionElement) => {
			const disabled = limitReached && !optionElement.selected;
			const optionListElementSelector = `[${SelectElementSelector.selectDropdownOptionElementAttribute}="${optionElement.value}"]`;
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

	updateSelectedItemsListeners(updatedVisualOptionsList: NodeListOf<Element> | false = false): void {
		const visualOptionsList = updatedVisualOptionsList ? updatedVisualOptionsList : this.getVisualOptionsList();
		if (visualOptionsList.length) {
			visualOptionsList.forEach((optionElement) => {
				optionElement.addEventListener('click', () => this.selectOptionOnElementClick(optionElement as HTMLElement));

				optionElement.addEventListener('keydown', (event) => this.selectOptionOnDropdownOptionElementKeyDown(event as KeyboardEvent));
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
			const option = this.dropdownElement.querySelector(`[${SelectElementSelector.selectDropdownOptionElementAttribute}="${value}"]`);
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
					const option = this.dropdownElement.querySelector(`[${SelectElementSelector.selectDropdownOptionElementAttribute}="${value}"]`);
					if (option instanceof HTMLElement) {
						option.classList.add(SelectElementSelector.activeOptionCssClass);
						option.setAttribute('aria-selected', 'true');
					}
				})
			}
		});
	}

	resetDropdownElement(dropdownElement: HTMLElement) {
		const options = dropdownElement.querySelectorAll(`[${SelectElementSelector.selectDropdownOptionElementAttribute}]`);
		if (options.length) {
			options.forEach((option) => {
				option.classList.remove(SelectElementSelector.activeOptionCssClass);
				option.setAttribute('aria-selected', 'false');
			});
		}
	}

	setupOptionsObserver() {
		const observerOptions = {
			childList: true,
			subtree: true,
		};
		
		let options: HTMLOptionElement[] = [];
		const optionsObserver = new MutationObserver((mutations) => {
			mutations.forEach((mutation) => {
				if (mutation.type === 'childList') {
					mutation.addedNodes.forEach((node) => {
						if (node instanceof HTMLOptionElement) {
							if (node.value) {
								options.push(node);
							}
						}
					});
				}
			});
			this.addNewOptionsToList(options);
			options = [];
		});
	
		optionsObserver.observe(this.selectElement, observerOptions);
	}

	addNewOptionsToList(options: HTMLOptionElement[]) {
		options.forEach(option => {
			const optionTemplateClone = this.optionTemplate.content.cloneNode(true) as DocumentFragment;
			const dropdownOptionElement = optionTemplateClone.querySelector('.c-select__option') as HTMLElement;
			if (!dropdownOptionElement || !optionTemplateClone) return;
			dropdownOptionElement.dataset.jsDropdownOption = option.value;
			dropdownOptionElement.classList.add('is-fetched');
	
			const optionLabelElement = optionTemplateClone.querySelector('.c-select__option-label');
			if (optionLabelElement) {
				optionLabelElement.textContent = option.textContent;
			}
	
			this.dropdownElement.appendChild(optionTemplateClone);
		});

		this.updateSelectedItemsListeners(this.getUpdatedVisualOptionsList());
	}

	getUpdatedVisualOptionsList() {
		return this.dropdownElement.querySelectorAll(`[${SelectElementSelector.selectDropdownOptionElementAttribute}].is-fetched`) ?? false;
	}

	getSelectedValues(): string[] {
		return this.isMultiSelect()
			? Array.from(this.selectElement.selectedOptions).map((option) => option.value)
			: [this.selectElement.value];
	}

	getVisualOptionsList(): NodeListOf<HTMLElement> {
		return this.dropdownElement.querySelectorAll(`[${SelectElementSelector.selectDropdownOptionElementAttribute}]`);
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
		return this.element.querySelectorAll(`[${SelectElementSelector.selectDropdownOptionElementAttribute}]`);
	}
}
