export default class Menu {
    constructor() {
        this.TRIGGER = 'js-menu-trigger';
        this.DART = 'js-menu-dart';
        this.TARGET = 'js-menu-target';
    }
    
    applyMenu() {
        const triggers = document.querySelectorAll(`[${this.TRIGGER}]`);
        triggers.forEach((trigger) => {
            let toggleClass = trigger.getAttribute(this.TRIGGER);
            let target = trigger.getAttribute(this.DART);

            trigger.addEventListener('click', (event) => {
                console.log(`[${this.TARGET}=${target}]`);
                const targets = document.querySelectorAll(`[${this.TARGET}="${target}"]`);
                console.log(targets)
                targets.forEach((target) => {
                    target.classList.toggle(toggleClass);
                })
            });
        });
    }
}