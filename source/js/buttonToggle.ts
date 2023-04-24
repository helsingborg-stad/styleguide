export default class ButtonToggle {
    private labelAttr: string;
    private iconAttr: string;
    private toggles: Element[];

    constructor() {
        this.labelAttr = 'data-toggle-label';
        this.iconAttr = 'data-toggle-icon';
        this.toggles = [];

        this.init();
        this.setupMutationObserver();
    }

    private init(): void {
        this.toggles = Array.from(document.querySelectorAll(`[${this.labelAttr}], [${this.iconAttr}]`));

        this.toggles.forEach((toggle: Element) => {
            toggle.addEventListener(
                'click',
                (event: Event) => this.handleToggleClick(toggle, event)
            );
        });
    }

    private handleToggleClick = (toggle: Element, event: Event): void => {
        const labelAttrVal: string | null = toggle.hasAttribute(this.labelAttr) ? toggle.getAttribute(this.labelAttr) : null;
        const iconAttrVal: string | null = toggle.hasAttribute(this.iconAttr) ? toggle.getAttribute(this.iconAttr) : null;

        if (labelAttrVal) {
            const labelEl: Element | null = toggle.querySelector('[class*="c-button__label-text"]');

            if (labelEl) {
                const currentLabel: string = labelEl.innerHTML.trim();
                labelEl.innerHTML = labelAttrVal;
                toggle.setAttribute(this.labelAttr, currentLabel);
                toggle.setAttribute('aria-label', labelAttrVal); 
            }
        }

        if (iconAttrVal) {
            const iconEl: Element | null = toggle.querySelector('[class*="c-icon"] > span');

            if (iconEl) {
                const currentIcon: string = iconEl.innerHTML.trim();
                iconEl.innerHTML = iconAttrVal;
                toggle.setAttribute(this.iconAttr, currentIcon);
            }
        }
    }

    private setupMutationObserver(): void {
        const observer = new MutationObserver((mutationsList) => {
            for (const mutation of mutationsList) {
                if (mutation.type === 'childList') {
                    const addedNodes: Node[] = Array.from(mutation.addedNodes);
                    const toggles: Element[] = addedNodes.reduce((acc: Element[], node: Node) => {
                        if (node instanceof HTMLElement) {
                            return [...acc, ...Array.from(node.querySelectorAll(`[${this.labelAttr}], [${this.iconAttr}]`))];
                        } else {
                            return acc;
                        }
                    }, []);
                    toggles.forEach((toggle: Element) => {
                        toggle.addEventListener(
                            'click',
                            (event: Event) => this.handleToggleClick(toggle, event)
                        );
                    });
                    this.toggles = [...this.toggles, ...toggles];
                }
            }
        });
        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    }
}
