export default class ToggleClasses {
    constructor() {
        this.TRIGGER = 'data-js-toggle-trigger';
        this.ITEM = 'data-js-toggle-item';
        this.CLASS = 'data-js-toggle-class';
        this.GROUP = 'data-js-toggle-group';
        this.PRESSED = 'aria-pressed';
        this.TRIGGER_DEPRECATED = 'js-toggle-trigger';
        this.ITEM_DEPRECATED = 'js-toggle-item';
        this.CLASS_DEPRECATED = 'js-toggle-class';
        this.GROUP_DEPRECATED = 'js-toggle-group';
        this.observeTriggers();
    }

    togglePressedTrigger (pressedTriggerId, groupId, pressedTrigger) {
        let query = `[${this.ITEM}="${pressedTriggerId}"], [${this.ITEM_DEPRECATED}="${pressedTriggerId}"]`;
        let items = document.querySelectorAll(query);
        items.forEach(item => {
            let toggleClass = item.getAttribute(this.CLASS) || item.getAttribute(this.CLASS_DEPRECATED);
            let ariaPressed = pressedTrigger.getAttribute(this.PRESSED);

            item.classList.toggle(toggleClass);

            //Let aria hidden be toggked with display none
            if(toggleClass == 'u-display--none') {
                if(item.classList.contains(toggleClass)) {
                    item.setAttribute('aria-hidden', true);
                } else {
                    item.setAttribute('aria-hidden', false);
                }
            }

            if(ariaPressed) this.toggleAriaPressed(ariaPressed, pressedTrigger);

            if(groupId) this.toggleIdleGroupMembers(groupId, pressedTriggerId, toggleClass);
        }); 
    }

    toggleIdleGroupMembers (groupId, pressedTriggerId, toggleClass) {
        let query = `[${this.GROUP}="${groupId}"][${this.TRIGGER}]:not([${this.TRIGGER}="${pressedTriggerId}"]), 
        [${this.GROUP_DEPRECATED}="${groupId}"][${this.TRIGGER_DEPRECATED}]:not([${this.TRIGGER_DEPRECATED}="${pressedTriggerId}"])`;

        let idleTriggers = document.querySelectorAll(query);

        idleTriggers.forEach((idleTrigger=>{
            this.removeClassFromTriggeredItem(idleTrigger, toggleClass);

            let ariaPressed = idleTrigger.getAttribute(this.PRESSED);

            if(ariaPressed) this.toggleAriaPressed(ariaPressed, idleTrigger, true);
        }));
    }

    removeClassFromTriggeredItem (idleTrigger, toggleClass) {
        let id = idleTrigger.getAttribute(this.TRIGGER) || idleTrigger.getAttribute(this.TRIGGER_DEPRECATED);
        let triggeredItem = document.querySelector(`[${this.ITEM}="${id}"]`) || document.querySelector(`[${this.ITEM_DEPRECATED}="${id}"]`);

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
        let triggers = document.querySelectorAll(`[${this.TRIGGER}], [${this.TRIGGER_DEPRECATED}]`);

        if(event) {
            let newTriggers = []
            event.forEach((record)=>{
                record.addedNodes.forEach((node) =>{
                    if(node.getAttribute && (node.getAttribute(this.TRIGGER) || node.getAttribute(this.TRIGGER_DEPRECATED))) {
                        newTriggers.push(node);
                    }
                })
            })
            triggers = newTriggers;
        }

        triggers.forEach( (trigger)=>{
            trigger.addEventListener('click', (event) => {
                let triggerId = trigger.getAttribute(this.TRIGGER) || trigger.getAttribute(this.TRIGGER_DEPRECATED);
                let groupId = trigger.getAttribute(this.GROUP) || trigger.getAttribute(this.GROUP_DEPRECATED);
                
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