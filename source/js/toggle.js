export default class ToggleClasses {
    constructor() {
        this.SINGLE = 'js-toggle-single';
        this.MULTI = 'js-toggle-multi';
        this.CONTAINER = 'js-toggle-container';
        this.TRIGGER = 'js-toggle-trigger';
    }

    toggleSingles(container, triggerId) {
        const singles = container.querySelectorAll(`[${this.SINGLE}]`);
        singles.forEach((element) => {
            element.classList.toggle(element.getAttribute(this.SINGLE))
        });
    }

    toggleMulti(container, triggerId) {
        const multies = container.querySelectorAll(`[${this.MULTI}]`);
        multies.forEach((multi)=>{
            const children = multi.children;
            for(let child in children){
                children[child].classList.toggle(multi.getAttribute(this.MULTI))
            }
        });
    }

    applyToggle() {
        const containers = document.querySelectorAll(`[${this.CONTAINER}]`);
        containers.forEach((container) => {
            const triggers = container.querySelectorAll(`[${this.TRIGGER}]`);
            triggers.forEach((trigger) => {
                trigger.addEventListener('click', () => {
                    let triggerId = trigger.getAttribute(this.TRIGGER);
                    this.toggleMulti(container, triggerId);
                    this.toggleSingles(container, triggerId);
                });
            });

        });
    }
}