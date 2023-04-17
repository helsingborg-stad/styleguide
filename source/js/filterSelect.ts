class FilterSelect {
    constructor() {
        this.setListeners();
    }

    setListeners() {
        const selects = [...document.querySelectorAll('.c-filterselect')];
        
        selects.forEach((select => {
            const hiddenSelect = select.querySelector('.c-filterselect__select select') as HTMLSelectElement;
            const expandButton = select.querySelector('.c-filterselect__expand-button');
            const options = select.querySelectorAll('.c-filterselect__option');
            const container = select.querySelector('.c-filterselect__checked-items');

            if(!hiddenSelect || !container || !options || !expandButton) {
                return;
            }

            if (hiddenSelect.querySelector("option[selected]")) {
                this.handlePreselected(hiddenSelect, options, expandButton, container, select);
            }

            document.addEventListener('click', (e) => {
                if(!select.contains(e.target as Node)) {
                    select.classList.remove('is-active');
                }
            });

            expandButton.addEventListener('click', (e) => {
                select.classList.toggle('is-active');
            });

            options.forEach((option) => {
               option.addEventListener('click', () => {

                   const optionAttr = option.getAttribute('js-select-value');

                    if(option.classList.contains('is-checked')) {
                        option.classList.remove('is-checked');
                        this.removeTemplate(optionAttr, container);
                        this.handleHiddenSelect(optionAttr, hiddenSelect, false);
                    } else {
                        option.classList.add('is-checked');
                        this.addTemplate(option, optionAttr, container, hiddenSelect, select);
                        this.handleHiddenSelect(optionAttr, hiddenSelect, true);
                    }

                    this.handlePlaceholderVisibility(select);
               })
            });
        }));
    }

    handlePlaceholderVisibility(select: Element) {
        if(this.hasSelectedOptions(select)) {
            this.hidePlaceholder(select);
        } else {
            this.showPlaceholder(select);
        }
    }

    hasSelectedOptions(container: Element) {
        return container.querySelectorAll('.is-checked').length > 0;
    }

    handleHiddenSelect(optionAttr: string | null, hiddenSelect: HTMLSelectElement, condition: boolean) {
        for(let i = 0; i < hiddenSelect.options.length; i++) {
            const option = hiddenSelect.options[i];
            
            if(option.value == optionAttr) {
                option.selected = condition;
                return;
            }
        }
    }

    handlePreselected(hiddenSelect: HTMLSelectElement, options: NodeListOf<Element>, expandButton: Element, container: Element, select: Element) {
        const preselected = [...hiddenSelect.querySelectorAll('option[selected]')]
        .map(option => option.getAttribute('value'))
        .filter(value => value !== null) as string[];

        options.forEach(option => {
            const optionAttr = option.getAttribute('js-select-value');
            if (optionAttr !== null && preselected.includes(optionAttr)) {
                this.addTemplate(option, optionAttr, container, hiddenSelect, select);
                container.querySelector('.c-filterselect__placeholder')?.remove();
                option.classList.add('is-checked');
            }
        });
    }

    showPlaceholder(container: Element) {
        const placeholderElement = container.querySelector('.c-filterselect__placeholder');
        if(placeholderElement) placeholderElement.classList.remove('u-display--none');
    }

    hidePlaceholder(container: Element) {
        const placeholderElement = container.querySelector('.c-filterselect__placeholder');
        if(placeholderElement) placeholderElement.classList.add('u-display--none');
    }

    addTemplate(option: Element, optionAttr: string | null, container: Element, hiddenSelect: HTMLSelectElement, select: Element) {
        const template = container.querySelector('template');
        const label = option.querySelector('.c-filterselect__option-label')?.innerHTML;

        
        if(!template || !optionAttr || !label) {
            return;
        }

        let clone = template.content.cloneNode(true);
        let temp = (clone as HTMLElement).querySelector('.c-filterselect__checked-item');
        
        if(!temp) {
            return;
        }

        temp.innerHTML = temp.innerHTML.replace('{OPTION_LABEL}', label);
        temp.setAttribute('js-select-value', optionAttr);
        container.appendChild(clone);
        const element = container.querySelector('.c-filterselect__checked-item:last-child');

        element?.addEventListener('click', (e) => {
            e.stopPropagation();
            element.remove();
            this.handleHiddenSelect(optionAttr, hiddenSelect, false);
            option.classList.remove('is-checked');
            
            this.handlePlaceholderVisibility(select)
        });
    }

    removeTemplate(optionAttr: string | null, container: Element) {
        container.querySelector(`[js-select-value="${optionAttr}"]`)?.remove();
    }
}

export default FilterSelect;