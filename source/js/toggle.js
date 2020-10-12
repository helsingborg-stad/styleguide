export default class ToggleClasses {
    constructor() {
        this.TRIGGER = 'js-toggle-trigger';
        this.ITEM = 'js-toggle-item';
        this.CLASS = 'js-toggle-class';
        this.GROUP = 'js-toggle-group';
        this.PRESSED = 'aria-pressed';
        this.observeTriggers();
    }

    togglePressedTrigger (pressedTriggerId, groupId, pressedTrigger) {
        let query = `[${this.ITEM}="${pressedTriggerId}"]`;
        let item = document.querySelector(query);
        let toggleClass = item.getAttribute(this.CLASS);
        let ariaPressed = pressedTrigger.getAttribute(this.PRESSED);

        item.classList.toggle(toggleClass);

        if(ariaPressed) this.toggleAriaPressed(ariaPressed, pressedTrigger);

        if(groupId) this.toggleIdleGroupMembers(groupId, pressedTriggerId, toggleClass);
    }

    toggleIdleGroupMembers (groupId, pressedTriggerId, toggleClass) {
        let query = `[${this.GROUP}="${groupId}"][${this.TRIGGER}]:not([${this.TRIGGER}="${pressedTriggerId}"])`
        let idleTriggers = document.querySelectorAll(query);

        idleTriggers.forEach((idleTrigger=>{
            this.removeClassFromTriggeredItem(idleTrigger, toggleClass);

            let ariaPressed = idleTrigger.getAttribute(this.PRESSED);

            if(ariaPressed) this.toggleAriaPressed(ariaPressed, idleTrigger, true);
        }));
    }

    removeClassFromTriggeredItem (idleTrigger, toggleClass) {
        let id = idleTrigger.getAttribute(this.TRIGGER);
        let triggeredItem = document.querySelector(`[${this.ITEM}="${id}"]`);

        triggeredItem.classList.remove(toggleClass);
    }

    toggleAriaPressed (ariaPressed, element, idle = false) {
        if(ariaPressed === 'false' && !idle){
            element.setAttribute(this.PRESSED, 'true');
        }else{
            element.setAttribute(this.PRESSED, 'false');
        }
    }

    applyToggle (event = null) {
        let triggers = document.querySelectorAll(`[${this.TRIGGER}]`);

        if(event) {
            let newTriggers = []
            event.forEach((record)=>{
                record.addedNodes.forEach((node) =>{
                    if(node.getAttribute && node.getAttribute('js-toggle-trigger')) {
                        newTriggers.push(node);
                    }
                })
            })
            triggers = newTriggers;
        }

        triggers.forEach( (trigger)=>{
            trigger.addEventListener('click', (event) => {
                let triggerId = trigger.getAttribute(this.TRIGGER);
                let groupId = trigger.getAttribute(this.GROUP);
                
                this.togglePressedTrigger(triggerId, groupId, trigger);
            });
        })
    }

    observeTriggers(){
        
        const container = document.documentElement || document.body;
        const observerOptions = {
            childList: true,
            subtree: true,
        };
 
        const observer = new MutationObserver((event) => {
            this.applyToggle(event);
        });
        
        observer.observe(container, observerOptions);    
    }
}