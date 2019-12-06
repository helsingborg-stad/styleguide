export default class ToggleClasses {
    constructor() {
        this.TRIGGER = 'js-toggle-trigger';
        this.ITEM = 'js-toggle-item';
        this.CLASS = 'js-toggle-class';
        this.GROUP = 'js-toggle-group';
      }

    toggleItems(triggerId, groupId) {
        const items = document.querySelectorAll(`[${this.ITEM}]`);
        items.forEach((item) => {
            let itemId = item.getAttribute(this.ITEM);
            let itemGroupId = item.getAttribute(this.GROUP);
            
            if(itemId === triggerId){
                item.classList.toggle(item.getAttribute(this.CLASS))
                let ariaPressed = item.getAttribute('aria-pressed');
                if((ariaPressed !== null && ariaPressed.length === 0) || ariaPressed === 'false'){
                    item.setAttribute('aria-pressed', 'true');
                }else {
                    item.setAttribute('aria-pressed', 'false');
                }
            }

            if(groupId && itemGroupId === groupId && itemId !== triggerId){
                item.classList.remove(item.getAttribute(this.CLASS))
            }
        });
    }

    applyToggle(){
        const triggers = document.querySelectorAll(`[${this.TRIGGER}]`);

        triggers.forEach( (trigger)=>{
            trigger.addEventListener('click', (event) => {
                let triggerId = trigger.getAttribute(this.TRIGGER);
                let groupId = trigger.getAttribute(this.GROUP);
                this.toggleItems(triggerId, groupId);
            });
        })

    }
}