import { FilterableElementComponent, FilterSelects } from "./selectFilterInterface";

class SelectFilter {
    selectContainerId: string;
    filterableElementComponents: Array<FilterableElementComponent> = [];
    filterSelects: FilterSelects = {};

    constructor(private selectContainer: HTMLElement) {
        this.selectContainerId = selectContainer.getAttribute('data-js-filter-select-container') as string;

        const selectFilterElements = this.getSelectFilterElements();
        
        if (selectFilterElements.length) {
            this.trySetfilterSelectComponent(selectFilterElements);
            this.listenForSelectChanges();
            this.handleFilterableElements();
            this.observeAddedFilterableElements();
        }
    }

    private trySetfilterSelectComponent(selectFilterElements: NodeListOf<HTMLElement>): void {
        [...selectFilterElements].forEach((select) => {
            if (select.hasAttribute('data-js-filter-select')) {
                const attr = select.getAttribute('data-js-filter-select') as string;
                if (!this.filterSelects[attr]) {
                    this.filterSelects[attr] = {
                        selects: [select],
                        selected: []
                    };
                } else {
                    this.filterSelects[attr].selects.push(select);
                }
            }
        });
    }

    private listenForSelectChanges(): void {
        Object.keys(this.filterSelects).forEach((key) => {
            this.filterSelects[key].selects.forEach((select) => {
                select.addEventListener('change', (e) => {
                    this.updateSelected(key);
                    this.filterFilterableElements();
                });
            });
        });
    }

    private filterFilterableElements(): void {
        this.filterableElementComponents.forEach((filterableElementComponent: FilterableElementComponent) => {
            let showElement = [true];
            for (const key in this.filterSelects) {
               if (this.filterSelects[key].selected.length > 0) {
                    showElement.push(this.filterSelects[key].selected.some((selected) => {
                        return filterableElementComponent['filterProperties'][key].includes(selected);
                    }));
               } else {
                    showElement.push(true);
               }
            }

            this.toggleHideElement(filterableElementComponent.element, showElement.includes(false));
        });
    }

    private toggleHideElement(element: HTMLElement, hide: boolean): void {
        if (hide) {
            element.classList.add('u-display--none');
        } else {
            element.classList.remove('u-display--none');
        }
    }

    private updateSelected(key: string): void {
        let selected = [] as Array<string>;

        this.filterSelects[key].selects.forEach((select) => {
            const selectedOptions = select.querySelectorAll('option:checked');
            [...selectedOptions].forEach((option: Element) => {
                selected.push((option as HTMLOptionElement).value);
            });
        });

        this.filterSelects[key].selected = selected;
    }

    private getSelectFilterElements(): NodeListOf<HTMLElement> {
        return document.querySelectorAll(`[data-js-filter-select-target="${this.selectContainerId}"]`);
    }

    private handleFilterableElements() {
       [...this.selectContainer.querySelectorAll('[data-js-filter-item]')].forEach((element: Element) => {
            this.setFilterableElementComponent(element as HTMLElement);
       });
    }

    private setFilterableElementComponent(element: HTMLElement) {
        let filterableElementComponent = {} as FilterableElementComponent;
        filterableElementComponent['element'] = element;
        filterableElementComponent['filterProperties'] = {};

        for (const key in this.filterSelects) {
            filterableElementComponent['filterProperties'][key] = [];
            if (element.getAttribute(key)) {
                filterableElementComponent['filterProperties'][key] = (element.getAttribute(key) as string).split(',');
            }
        }

        this.filterableElementComponents.push(filterableElementComponent);
    }

    private observeAddedFilterableElements(): void {
        const observer = new MutationObserver((mutationsList) => {
            for (const mutation of mutationsList) {
                if (mutation.type === 'childList' && mutation.addedNodes.length) {
                    mutation.addedNodes.forEach((node) => {
                        if (node instanceof HTMLElement && node.hasAttribute('data-js-filter-item')) {
                            this.setFilterableElementComponent(node);
                        }
                    });
                }
            }
        });
    
        observer.observe(this.selectContainer, {
            childList: true,
            subtree: true
        });
    }
}


export function initializeSelectFilter(): void {
    document.querySelectorAll('[data-js-filter-select-container]').forEach((selectContainer) => {
        new SelectFilter(selectContainer as HTMLElement);
    });
}