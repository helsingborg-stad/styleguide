export default class ToggleClasses {
    constructor() {
        this.SINGLE = 'js-toggle-single';
        this.MULTI = 'js-toggle-multi';
        this.CONTAINER = 'js-toggle-container';
        this.TRIGGER = 'js-toggle-trigger';
    }

    toggleSingles(container, trigger) {
        const singles = container.querySelectorAll(`[${this.SINGLE}]`);

        singles.forEach((element) => {
            element.classList.toggle(element.getAttribute(this.SINGLE))
            let ariaPressed = element.getAttribute('aria-pressed');
            if(ariaPressed.length === 0 || ariaPressed === 'false' && element === trigger){
                element.setAttribute('aria-pressed', 'true');
            }else {
                element.setAttribute('aria-pressed', 'false');
            }
        });
    }

    toggleMulti(container) {
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
                trigger.addEventListener('click', (event) => {
                    let triggerId = trigger.getAttribute(this.TRIGGER);
                    this.toggleMulti(container);
                    this.toggleSingles(container, trigger);
                });
            });

        });
    }
}