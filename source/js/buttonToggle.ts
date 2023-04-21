export default class ButtonToggle {
    private labelAttr: string;
    private iconAttr: string;
    private toggles: Element[];

    constructor() {
        this.labelAttr = 'data-toggle-label';
        this.iconAttr = 'data-toggle-icon';
        this.toggles = [];

        this.init();
    }

    private init(): void {
        this.toggles = Array.from(document.querySelectorAll(`[${this.labelAttr}], [${this.iconAttr}]`));

        this.toggles.forEach((toggle: Element) => {
            toggle.addEventListener(
                'click',
                this.handleToggleClick.bind(this, toggle)
            );
        });
    }

    private handleToggleClick(toggle: Element, event: MouseEvent): void {
        const labelAttrVal: string | null = toggle.hasAttribute(this.labelAttr) ? toggle.getAttribute(this.labelAttr) : null;
        const iconAttrVal: string | null = toggle.hasAttribute(this.iconAttr) ? toggle.getAttribute(this.iconAttr) : null;

        if (labelAttrVal) {
            const labelEl: Element | null = toggle.querySelector('[class*="c-button__label-text"]');

            if (labelEl) {
                const currentLabel: string = labelEl.innerHTML.trim();
                labelEl.innerHTML = labelAttrVal;
                toggle.setAttribute(this.labelAttr, currentLabel);
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
}
