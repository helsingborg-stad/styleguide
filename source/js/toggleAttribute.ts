interface AttributeToggleValues {
    a: string;
    b: string;
}

class ToggleAttribute {
    private values: AttributeToggleValues|false;
    private toggleAttribute: string;
    private currentValue: string|false = false;

    constructor(
        private element: HTMLElement, 
        attribute: string|false, 
        values: string[]
    ) {
        this.values = this.getValues(values);
        this.toggleAttribute = this.getToggleAttribute(attribute);
        this.checkInitialState();
        this.currentValue = this.getCurrentValue();
        this.setListener();
    }

    private setListener() {
        this.element.addEventListener('click', () => {
            this.toggle();
        });
    }

    private getCurrentValue(): string|false {
        return this.element.getAttribute(this.toggleAttribute) || false;
    }

    private toggle() {
        // if (this.)
    }

    private checkInitialState() {
        if (!this.element.hasAttribute(this.toggleAttribute) && this.values) {
            this.element.setAttribute(this.toggleAttribute, this.values.a);
        }
    }

    private getToggleAttribute(attribute: string|false): string {
        return attribute ? attribute : 'data-js-toggle-attribute';
    }

    private getValues(values: string[]): AttributeToggleValues|false {
        let attributeToggleValues: AttributeToggleValues|false = false;

        if (values.length === 2) {
            attributeToggleValues = {
                a: values[0],
                b: values[1]
            }
        } else if (values.length === 1) {
            attributeToggleValues = {
                a: '',
                b: values[0]
            }
        }

        return attributeToggleValues;
    }
}

export function initializeToggleAttributes() {

    document.querySelectorAll('[data-js-toggle-attribute]').forEach(element => {
        const attributeValues = element.getAttribute('data-js-toggle-attribute-values')?.split(',') || [];
        const toggleAttribute = element.getAttribute('data-js-toggle-attribute') || false;

        new ToggleAttribute(element as HTMLElement, toggleAttribute, attributeValues);
    });
}