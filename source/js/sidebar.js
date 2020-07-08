require("regenerator-runtime");

export default class Sidebar {
    constructor() {
        this.ATTR = "js-sidebar";
        this.EXPAND = "c-sidebar__item--is-expanded";
        this.EXPANDABLE = "c-sidebar__subcontainer";
        this.TOGGLEDITEMS = 'toggled';
        this.ACTIVEITEMS = 'active'
        this.ACTIVE = "item-active";
        this.TRIGGER = "js-sidebar-trigger";
        this.SUBCONTAINER = "c-sidebar__subcontainer";
        this.TOGGLE = "c-sidebar__toggle";
        this.TOGGLE_TRIGGER = "js-toggle-trigger";
        this.TOGGLE_ITEM = "js-toggle-item";
        this.ITEM = "c-sidebar__item";
        
        const dynamicSidebar = document.querySelector('.c-sidebar[child-items-url]');

        if(dynamicSidebar){
            this.URL = dynamicSidebar.getAttribute('child-items-url');
        }

        if(!localStorage.getItem(this.TOGGLEDITEMS)){
            localStorage.setItem(this.TOGGLEDITEMS, JSON.stringify({items: []}));
        }
        
        if(!localStorage.getItem(this.ACTIVEITEMS)){
            localStorage.setItem(this.ACTIVEITEMS, JSON.stringify({items: []}));
        }

    }

    /**
     * Finds all sidebars and applies appropriate classes and attributes on load
     * @return {void}
     */
    applySidebar() {
        const sb = document.querySelector(`[${this.ATTR}]`);

        if (sb) {
            const activeItems = sb.querySelectorAll(`[${this.ACTIVE}="true"]`);

            if (activeItems.length > 0) {
                activeItems.forEach(item => {
                    this.expandItem(item, sb);
                    this.expandCurrentItem(item);
                });
            }
            
            
            this.addTriggers(sb);
            if(this.URL){
                this.loadState();
                this.addItemTriggers();
            }
        }
    }

    /**
     * Expand current item
     * @param {Object} item The current item to expand
     */
    expandItem(item, sb) {
        if (item.closest(`.${this.SUBCONTAINER}`)) {
            const id = this.getToggleId(item)
                
            const toggle = sb.querySelector(`[${this.TOGGLE_TRIGGER}="${id}"]`)

            toggle.setAttribute('aria-pressed', true);

            this.addExpandClass(item);
            this.expandItem(toggle, sb)
        }
    }

    /**
     * @param  {} item Item to recieve ID from
     * @param  {} ID The attribute ID
     */
    getToggleId(item) {
        return item.closest(`.${this.SUBCONTAINER}`)
            .getAttribute(this.TOGGLE_ITEM);
    }
    
    /**
     * @param  {} item Item that is relevant to exppand item
     */
    addExpandClass(item) {
        item.closest(`.${this.SUBCONTAINER}`).classList.add(this.EXPAND);
    }

    /**
     * Expand current item
     * @param {Object} item The current item to expand
     */
    expandCurrentItem(item) {
        const parent = item.closest(`.${this.ITEM}`);
        if (parent.querySelector(`.${this.SUBCONTAINER}`)) {
            parent.querySelector(`.${this.SUBCONTAINER}`).classList.add(this.EXPAND);
            parent.querySelector(`.${this.TOGGLE}`).setAttribute('aria-pressed', true);
        }
    }

    /**
     * Adds listeners to buttons
     * @param {Object} sb The sidebar
     */
    addTriggers(sb) {
        const sbTriggers = document.querySelectorAll(`[${this.TRIGGER}]`);

        sbTriggers.forEach(btn => {
            btn.addEventListener('click', e => {
                sb.classList.toggle(`${this.COLLAPSED}`);
            });
        });
    }

    async loadState() {
        const toggledItems = this.constructor.getItems(this.TOGGLEDITEMS).items;

        if(toggledItems.length > 0) {

            await toggledItems.reduce( async (previousPromise, nextItem) => {
                await previousPromise;
    
                const children = await this.appendChildren(nextItem);  
                const parent = document.querySelector(`[aria-label='${nextItem}']`).parentElement;
                const newChildren = parent.appendChild(children);
                
                this.constructor.toggleAriaPressed(document.querySelector(`[aria-label='${nextItem}']`));
                this.addItemTriggers();
    
                return previousPromise.then(() => {
                    return newChildren;
                });
    
            }, Promise.resolve());
    
            this.markLinkAsActive();
        }
    }

    static toggleAriaPressed(element) {
        const ariaPressed = element.getAttribute('aria-pressed');

        if(ariaPressed === 'true'){
            element.setAttribute('aria-pressed', 'false');
        }else{
            element.setAttribute('aria-pressed', 'true');
        }
    }

    addLinkTrigger(link) {
        link.addEventListener('click', (event) => {
            const linkID = link.id;
            
            this.constructor.removeAllStoredItems(this.ACTIVEITEMS);
            this.storeItem(linkID, this.ACTIVEITEMS);
        });
    }

    markLinkAsActive() {
        const activeItems = this.constructor.getItems(this.ACTIVEITEMS).items;

        if(activeItems.length > 0) {
            const activeLinkID = this.constructor.getItems(this.ACTIVEITEMS).items[0];
            const activeLink = document.getElementById(activeLinkID);
            
            activeLink.setAttribute(this.ACTIVE, 'true');
        }
    }

    addItemTriggers() {
        const sb = document.querySelector('.c-sidebar[child-items-url]');
        
        if(sb) {
            
            this.URL = sb.getAttribute('child-items-url');
            const sbTriggers = document.getElementsByClassName('c-sidebar__toggle');
            
            sbTriggers.forEach((trigger) => {
                const hasEventAttached = trigger.getAttribute('toggleEvent');
             
                if(!hasEventAttached){
                    trigger.setAttribute('toggleEvent', 'true');
                    trigger.addEventListener('click', (e) => {
    
                        this.constructor.toggleAriaPressed(trigger);
                        const label = e.currentTarget.getAttribute('aria-label');
                        const parentID = label.toLowerCase() + label.substring(1);
                        const parent = document.querySelector(`[aria-label='${parentID}']`).parentElement;
    
                        this.appendChildren(parentID, e.target.parentElement).then((children) => {
    
                            if(!this.isAlreadyStored(parentID)) {
                                parent.appendChild(children);
                                this.storeItem(parentID, this.TOGGLEDITEMS);
                                this.addItemTriggers();
                            }else{
                                this.constructor.removeToggledElement(parentID);
                                this.removeToggledItem(parentID);
                            }

                            this.markLinkAsActive();
    
                        });
                    });
                } 
            });
           
        }
        
    }
    
    getChildren(parentID) {
        
        return fetch(`${this.URL  }?parentID=${  parentID}`)
        .then((response) => {
            return response.json();
        })
        .then((data) => {
            return data;
        });
    }
    
     appendChildren(parentID) {
         return this.getChildren(parentID).then((children) => {
            
            const subContainer = document.createElement('div');
            subContainer.setAttribute('subContainerID', parentID);
            subContainer.classList.add('c-sidebar__subcontainer');
            
            let linkIndex = 0;
            children.forEach( (child) => {
                const childItem = document.createElement('div');
                childItem.classList.add('c-sidebar__item');
                const link = document.createElement('a');
                link.href = child.href;
                link.classList.add('c-sidebar__link');
                link.text = child.post_title;
                link.setAttribute('item-active', 'false');
                link.id = `${parentID  }-${  linkIndex}`;
                linkIndex += 1;

                this.addLinkTrigger(link, parentID);
                
                childItem.appendChild(link);

                if(Object.keys(child.children).length > 0) {
                    
                    const bar = document.createElement('div');
                    bar.classList.add('bar');

                    const toggle = document.createElement('div');
                    toggle.classList.add('c-sidebar__toggle');
                    toggle.appendChild(bar);
                    toggle.appendChild(bar.cloneNode(true));
                    toggle.setAttribute('aria-label', child.ID);

                    childItem.appendChild(toggle);  
                }
                
                subContainer.appendChild(childItem);

            });
            
            subContainer.classList.add('c-sidebar__item--is-expanded');
            
            return subContainer;
        });

    }
    
    
    
    isAlreadyStored(newItem) {
        const storedItems = this.constructor.getItems(this.TOGGLEDITEMS);
        if(storedItems && storedItems.items){
            for(let i = 0; i < storedItems.items.length ; i += 1){
                if(storedItems.items[i] === newItem) {
                    return true;
                }
            };
        }
        return false;
    }
    
    storeItem(item, itemState) {
        const items = this.constructor.getItems(itemState);
        
        items.items.push(item);
        localStorage.setItem(itemState, JSON.stringify(items));
    }
    
    removeToggledItem(item){
        const toggledItems = this.constructor.getItems(this.TOGGLEDITEMS);
        const index = toggledItems.items.indexOf(item);
        
        if (index > -1) {
            toggledItems.items.splice(index, 1);
        }
        
        localStorage.setItem(this.TOGGLEDITEMS, JSON.stringify(toggledItems));
    }

    static removeAllStoredItems(itemState) {
        localStorage.setItem(itemState, JSON.stringify({items: []}));
    }

    static getItems(itemState) {
        const items = localStorage.getItem(itemState);

        return JSON.parse(items);
    }
    
    static removeToggledElement(label) {
        const element = document.querySelector(`[subContainerID='${label}']`);
        if(element){
            element.parentNode.removeChild(element);
        }
    }
}