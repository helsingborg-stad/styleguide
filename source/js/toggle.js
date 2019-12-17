export default class ToggleClasses {
    constructor() {
        this.TRIGGER = 'js-toggle-trigger';
        this.ITEM = 'js-toggle-item';
        this.CLASS = 'js-toggle-class';
        this.GROUP = 'js-toggle-group';
        this.PRESSED = 'aria-pressed';
      }

    togglePressedTrigger(pressedTriggerId, groupId, pressedTrigger) {
        let query = `[${this.ITEM}="${pressedTriggerId}"]`;
        let item = document.querySelector(query);
        let toggleClass = item.getAttribute(this.CLASS);
        let ariaPressed = pressedTrigger.getAttribute(this.PRESSED);

        item.classList.toggle(toggleClass);

        if(ariaPressed) this.toggleAriaPressed(ariaPressed, pressedTrigger);

        if(groupId) this.toggleIdleGroupMembers(groupId, pressedTriggerId, toggleClass);
    }

    toggleIdleGroupMembers(groupId, pressedTriggerId, toggleClass){
        let query = `[${this.GROUP}="${groupId}"]:not([${this.TRIGGER}="${pressedTriggerId}"])`
        let idleTriggers = document.querySelectorAll(query);
        
        idleTriggers.forEach((idleTrigger=>{
            let ariaPressed = idleTrigger.getAttribute(this.PRESSED);
            console.log(idleTriggers);
            this.removeClassFromTriggeredItem(idleTrigger, toggleClass)

            if(ariaPressed) this.toggleAriaPressed(ariaPressed, idleTrigger, true);
        }));
    }

    removeClassFromTriggeredItem(idleTrigger, toggleClass){
        let id = idleTrigger.getAttribute(this.TRIGGER);
        let triggeredItem = document.querySelector(`[${this.ITEM}="${id}"]`);
        triggeredItem.classList.remove(toggleClass);
    }

    toggleAriaPressed(ariaPressed, element, idle = false){
        if(ariaPressed === 'false' && !idle){
            element.setAttribute(this.PRESSED, 'true');
        }else {
            element.setAttribute(this.PRESSED, 'false');
        }
    }

    applyToggle(){
        const triggers = document.querySelectorAll(`[${this.TRIGGER}]`);

        triggers.forEach( (trigger)=>{
            trigger.addEventListener('click', (event) => {
                let triggerId = trigger.getAttribute(this.TRIGGER);
                let groupId = trigger.getAttribute(this.GROUP);
                this.togglePressedTrigger(triggerId, groupId, trigger);
            });
        })

    }
}