export default class ToggleClasses {
    constructor() {
        this.SINGLE = 'js-toggle-single';
        this.MULTI = 'js-toggle-multi';
        this.CONTAINER = 'js-toggle-container';
        this.TRIGGER = 'js-toggle-trigger';
        this.SELF = 'js-toggle-self';
    }

    toggleSingles(container, trigger) {
        const singles = container.querySelectorAll(`[${this.SINGLE}]`);
        console.log(singles);
        singles.forEach((element) => {
            element.classList.toggle(element.getAttribute(this.SINGLE))
            let ariaPressed = element.getAttribute('aria-pressed');
            if((ariaPressed !== null && ariaPressed.length === 0) || ariaPressed === 'false' && element === trigger){
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
        const selves = document.querySelectorAll(`[${this.SELF}]`);
        selves.forEach((self) => {
            self.addEventListener('click', (event) => {
                console.log('test')
                let ariaPressed = self.getAttribute('aria-pressed');
                if((ariaPressed !== null && ariaPressed.length === 0) || ariaPressed === 'false'){
                    self.setAttribute('aria-pressed', 'true');
                }else {
                    self.setAttribute('aria-pressed', 'false');
                }
                });
        });
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