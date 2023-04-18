class FilterSelect {

    element: Element
    selectElement: HTMLSelectElement
    expandButton: Element
    options: NodeListOf<Element>
    container: Element

    constructor(element: Element) {
        this.element = element
        this.selectElement = this.element.querySelector('.c-filterselect__select select') as HTMLSelectElement
        this.expandButton = this.tryAssignElement('.c-filterselect__expand-button')
        this.options = this.element.querySelectorAll('.c-filterselect__option');
        this.container = this.tryAssignElement('.c-filterselect__checked-items')

        this.handlePreselected();
        this.setupEventListeners()
    }

    tryAssignElement(selector: string): Element {
        const element = this.element.querySelector(selector)
        if (element !== null) return element
        throw new Error(`Element ${selector} not found`)
    }

    setupEventListeners() {
        this.expandButton.addEventListener('click', () => this.clickExpandButtonCallback());
        document.addEventListener('click', e => this.clickAwayCallback(e));

        this.options.forEach((option) => {
            option.addEventListener('click', () => this.optionClickEventCallback(option));
        });
    }

    optionClickEventCallback(option: Element) {
        option.classList.contains('is-checked')
            ? this.deselectOption(option)
            : this.selectOption(option)
    }

    selectOption(option: Element) {
        const optionValue = option.getAttribute('js-select-value')
        option.classList.add('is-checked');
        this.addTemplate(option);
        this.updateHiddenSelectValue(optionValue, true);
        this.handlePlaceholderVisibility();
    }

    deselectOption(option: Element) {
        const optionValue = option.getAttribute('js-select-value')
        option.classList.remove('is-checked');
        this.removeTemplate(optionValue);
        this.updateHiddenSelectValue(optionValue, false);
        this.handlePlaceholderVisibility();
    }

    clickExpandButtonCallback() {
        this.element.classList.toggle('is-active');
    }

    clickAwayCallback(e: MouseEvent) {
        if (!this.element.contains(e.target as Node)) {
            this.element.classList.remove('is-active');
        }
    }

    handlePlaceholderVisibility() {
        this.hasSelectedOptions()
            ? this.hidePlaceholder()
            : this.showPlaceholder()
    }

    hasSelectedOptions() {
        return this.selectElement.selectedOptions.length > 0;
    }

    updateHiddenSelectValue(optionValue: string | null, condition: boolean) {
        for (const option of this.selectElement.options) {
            if (option.value == optionValue) {
                option.selected = condition;
            }
        }
    }

    handlePreselected() {
        const preSelectedValues = this.getPreSelectedValues()

        this.options.forEach(option => {
            const optionAttr = option.getAttribute('js-select-value');
            if (optionAttr !== null && preSelectedValues.includes(optionAttr)) {
                this.selectOption(option);
            }
        });
    }

    getPreSelectedValues(): string[] {
        return Array.from(this.selectElement.selectedOptions)
            .filter(option => option.value !== null)
            .map(option => option.value);
    }

    showPlaceholder() {
        const placeholderElement = this.element.querySelector('.c-filterselect__placeholder');
        if (placeholderElement) placeholderElement.classList.remove('u-display--none');
    }

    hidePlaceholder() {
        const placeholderElement = this.element.querySelector('.c-filterselect__placeholder');
        if (placeholderElement) placeholderElement.classList.add('u-display--none');
    }

    addTemplate(option: Element) {
        const optionAttr = option.getAttribute('js-select-value');
        const template = this.container.querySelector('template');
        const label = option.querySelector('.c-filterselect__option-label')?.innerHTML;

        if (!template || !optionAttr || !label) {
            return;
        }

        let clone = template.content.cloneNode(true);
        let temp = (clone as HTMLElement).querySelector('.c-filterselect__checked-item');

        if (!temp) {
            return;
        }

        temp.innerHTML = temp.innerHTML.replace('{OPTION_LABEL}', label);
        temp.setAttribute('js-select-value', optionAttr);
        this.container.appendChild(clone);
        const checkedItemElement = this.container.querySelector('.c-filterselect__checked-item:last-child');

        checkedItemElement?.addEventListener('click', (e) => {
            e.stopPropagation();
            checkedItemElement.remove();
            this.updateHiddenSelectValue(optionAttr, false);
            option.classList.remove('is-checked');
            this.handlePlaceholderVisibility()
        });
    }

    removeTemplate(optionAttr: string | null) {
        this.container.querySelector(`[js-select-value="${optionAttr}"]`)?.remove();
    }
}

export function initializeFilterSelectComponents() {
    const componentElements = [...document.querySelectorAll('.c-filterselect')];

    componentElements.forEach((element) => {
        new FilterSelect(element);
    })

}

export default FilterSelect;