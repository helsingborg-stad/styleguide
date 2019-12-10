export default class ToggleClasses {
    constructor() {
        this.TRIGGER = 'js-toggle-trigger';
        this.ITEM = 'js-toggle-item';
        this.CLASS = 'js-toggle-class';
        this.GROUP = 'js-toggle-group';
        this.PRESSED = 'aria-pressed';
      }

    toggle(currentTriggerId, groupId, currentTrigger) {
        const items = document.querySelectorAll(`[${this.ITEM}]`);
        
        items.forEach((item) => {
            let itemId = item.getAttribute(this.ITEM);
            let itemGroupId = item.getAttribute(this.GROUP);
            
            if(itemId === currentTriggerId){
                item.classList.toggle(item.getAttribute(this.CLASS))
                let ariaPressed = currentTrigger.getAttribute(this.PRESSED);
                if((ariaPressed !== null && ariaPressed.length === 0) || ariaPressed === 'false'){
                    currentTrigger.setAttribute(this.PRESSED, 'true');
                }else {
                    currentTrigger.setAttribute(this.PRESSED, 'false');
                }
            }

            if(groupId && itemGroupId === groupId && itemId !== currentTriggerId){
                item.classList.remove(item.getAttribute(this.CLASS))
            }

            this.toggleTriggers(currentTrigger, currentTriggerId);
        });
    }

    toggleTriggers(currentTrigger, currentTriggerId){
        
        const triggers = document.querySelectorAll(`[${this.TRIGGER}]`);
        triggers.forEach((trigger)=>{
            let ariaPressed = trigger.getAttribute(this.PRESSED);
            let triggerId = trigger.getAttribute(this.TRIGGER);
            let currentToggleGroup = currentTrigger.getAttribute(this.GROUP);
            let toggleGroup = trigger.getAttribute(this.GROUP);
            if(ariaPressed && triggerId !== currentTriggerId && toggleGroup === currentToggleGroup){
                trigger.setAttribute(this.PRESSED, 'false');
            }
        });
    }

    applyToggle(){
        const triggers = document.querySelectorAll(`[${this.TRIGGER}]`);

        triggers.forEach( (trigger)=>{
            trigger.addEventListener('click', (event) => {
                let triggerId = trigger.getAttribute(this.TRIGGER);
                let groupId = trigger.getAttribute(this.GROUP);
                this.toggle(triggerId, groupId, trigger);
            });
        })

    }
}