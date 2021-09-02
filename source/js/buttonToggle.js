export default class buttonToggle {
    constructor() {
        this.LABEL = 'data-toggle-label';
        this.ICON = 'data-toggle-icon';

        this.init();
    }

    init() {
        const toggles = document.querySelectorAll(`[${this.LABEL}]`, `[${this.ICON}]`);

        toggles.forEach(toggle => {
            toggle.addEventListener('click', (event) => {
                if(toggle.getAttribute(this.LABEL)) {
                    let currentLabel = toggle.querySelector('[class*="c-button__label-text"]').innerHTML;

                    toggle.querySelector('[class*="c-button__label-text"]').innerHTML = toggle.getAttribute(this.LABEL);
                    toggle.setAttribute(this.LABEL, currentLabel);
                }

                if(toggle.getAttribute(this.ICON)) {
                    let currentIcon = toggle.querySelector('[class*="c-icon"]').innerHTML;

                    toggle.querySelector('[class*="c-icon"]').innerHTML = toggle.getAttribute(this.ICON);
                    toggle.setAttribute(this.ICON, currentIcon);
                }
            });
        });
    }
}