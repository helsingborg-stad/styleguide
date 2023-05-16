export class selectOption {
  private readonly selectComponentElementAttribute      = 'data-js-select-component'; //Add to main div of component
  private readonly selectElementAttribute               = 'data-js-select-element';   //Add to the real select dom-element
  private readonly selectDropdownElementAttribute       = 'data-js-dropdown-element'; //Add to visual (fake) representation of dropdown
  private readonly selectDropdownOptionElementAttribte  = 'data-js-dropdown-option';  //Add to each visual (fake) representation of option
  private readonly selectPlaceholderElementAttribte     = 'data-js-placeholder';      //Add to the placeholder element
  private readonly selectIsOpenClassElementAttribute    = 'data-js-toggle-class';
  private readonly activeOptionCssClass                 = 'is-selected'; 
  private readonly emptySelectCssClass                  = 'is-empty';

  constructor() {
    this.init();
    this.observe();
  }

  private init() {
    const initElements = document.querySelectorAll(`[${this.selectComponentElementAttribute}]`);
    if(initElements.length) {
      initElements.forEach((element) => {
        this.bind(element); 
      });
    }
  }

  private bind(element: Element): void {
    if(element instanceof HTMLElement) {
      const isRequired      = this.isRequired(element as HTMLElement);
      const isMultiselect   = this.isMultiselect(element as HTMLElement);
      const selectElement   = this.getSelectElement(element as HTMLElement); 
      const dropdownElement = this.getDropdownElement(element as HTMLElement); 

      this.updateSelectedItemsOnClick(
        element as HTMLElement,
        selectElement as HTMLSelectElement, 
        dropdownElement as HTMLElement,
        isMultiselect as boolean
      );

      this.updateVisualRepresentation(
        selectElement as HTMLSelectElement, 
        dropdownElement as HTMLElement
      );

      this.setIsEmptyState(
        element as HTMLElement,
        selectElement as HTMLSelectElement,
      );

      this.setPlaceHolderAriaState(
        element as HTMLElement,
        selectElement as HTMLSelectElement,
      ); 
    }
  }

  private updateSelectedItemsOnClick(element: HTMLElement, selectElement: HTMLSelectElement, dropdownElement: HTMLElement, isMultiselect: boolean) : void {
    const visualOptionsList = dropdownElement.querySelectorAll(`[${this.selectDropdownOptionElementAttribte}]`);
    if (visualOptionsList.length) {
      visualOptionsList.forEach((optionElement) => {
        optionElement.addEventListener('click', () => {
          const newValue: string | null = optionElement.getAttribute(this.selectDropdownOptionElementAttribte);
          if(!isMultiselect) {
            this.setSingleSelectValue(element, selectElement, newValue); 
          } else {
            this.setMultiSelectValue(selectElement, newValue); 
          }
        });
      });
    }
  }

  private setMultiSelectValue(selectElement: HTMLSelectElement, updatedValue: string | null) {

    if (typeof updatedValue === 'string') {
      const previousSelectedValues = this.getSelectedValues(selectElement);

      //Get previous state
      let valueArray = new Array();
      if (previousSelectedValues.length) {
        valueArray = previousSelectedValues.map((element) => {
          if (element instanceof HTMLElement) {
            return element.value;
          }
        });
      }

      //Add or remove value
      let index = valueArray.indexOf(updatedValue);
      if (index === -1) {
        valueArray.push(updatedValue);
      } else {
        valueArray.splice(index, 1);
      }
      
      //Select the options
      for (let i = 0; i < selectElement.options.length; i++) {
        const option = selectElement.options[i];
        this.selectOption(
          option, 
          valueArray.includes(option.value)
        ); 
      }
      selectElement.dispatchEvent(
        new Event('change')
      );
    }
  }

  private setSingleSelectValue(element: HTMLElement, selectElement: HTMLSelectElement, newValue: string | null) {
    if (typeof newValue === 'string') {
      selectElement.value = newValue;
      this.closeDropdown(element, 100); //Delay to increase usability
    }
    selectElement.dispatchEvent(
      new Event('change')
    );
  }

  public selectOption(option: HTMLOptionElement, selected: boolean): void {
    if (selected) {
      option.selected = true;
      option.setAttribute('selected','selected'); 
    } else {
      option.selected = false;
      option.removeAttribute('selected'); 
    }
  }

  private closeDropdown(element: HTMLElement, delay: number = 0) {
    const isOpenClass = element.getAttribute(this.selectIsOpenClassElementAttribute); 
    if(typeof isOpenClass === 'string') {
      setTimeout(() => {
        element.classList.remove(isOpenClass); 
      }, delay);
    }
  }

  private setIsEmptyState(element: HTMLElement, selectElement: HTMLSelectElement) {
    selectElement.addEventListener('change', (event: Event) => {
      const selectedElements = this.getSelectedValues(selectElement);
      if(selectedElements.length) {
        element.classList.remove(this.emptySelectCssClass); 
      } else {
        element.classList.add(this.emptySelectCssClass); 
      }
    }); 
  }

  private setPlaceHolderAriaState(element: HTMLElement, selectElement: HTMLSelectElement) {
    selectElement.addEventListener('change', (event: Event) => {
      const selectedElements    = this.getSelectedValues(selectElement);
      const placeholderElement  = element.querySelector(`[${this.selectPlaceholderElementAttribte}]`);
      
      if(placeholderElement instanceof HTMLElement) {
        if(selectedElements.length) {
          placeholderElement.setAttribute('aria-hidden', 'true');
        } else {
          placeholderElement.setAttribute('aria-hidden', 'false');
        }
      }
    }); 
  }

  private updateVisualRepresentation(selectElement: HTMLSelectElement, dropdownElement: HTMLElement) : void {
    selectElement.addEventListener("change", (event: Event) => {

      this.resetDropdownElement(dropdownElement); 

      const selectedValues = this.getSelectedValues(selectElement);
      if(selectedValues.length) {
        selectedValues.forEach((element) => {
          if(element instanceof HTMLElement) {
            const selectedValue = element.getAttribute('value');
            if (typeof selectedValue === "string") {
              const option = dropdownElement.querySelector(`[${this.selectDropdownOptionElementAttribte}="${selectedValue}"]`);
              if(option instanceof HTMLElement) {
                option.classList.add(this.activeOptionCssClass); 
                option.setAttribute('aria-selected', 'true'); 
              }
            }
          }
        })
      }
    });
  }

  private resetDropdownElement(dropdownElement: HTMLElement) {
    const visualOptionsList = dropdownElement.querySelectorAll(`[${this.selectDropdownOptionElementAttribte}]`);
    if (visualOptionsList.length) {
      visualOptionsList.forEach((optionElement) => {
        optionElement.classList.remove(this.activeOptionCssClass); 
        optionElement.setAttribute('aria-selected', 'false'); 
      })
    }
  }

  private getSelectedValues(selectElement: HTMLSelectElement) {
    return Array.from(selectElement.options).filter(function (option) {
      return option.selected;
    });
  }

  private getSelectElement(element: HTMLElement): HTMLSelectElement {
    return element.querySelector(`[${this.selectElementAttribute}]`) as HTMLSelectElement;
  }

  private getDropdownElement(element: HTMLElement): HTMLElement {
    return element.querySelector(`[${this.selectDropdownElementAttribute}]`) as HTMLElement;
  }

  private isRequired(element: HTMLElement): boolean {
    return element.getAttribute('data-js-is-required') === 'true';
  }

  private isMultiselect(element: HTMLElement): boolean {
    return element.getAttribute('data-js-select-type') === 'multiple';
  }

  private observe(): void {
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
              this.bind(node); 
            }
          });
        }
      });
    });

    observer.observe(container, observerOptions);
  }
}
