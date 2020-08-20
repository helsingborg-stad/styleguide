export default class DynamicSidebar {
    constructor() {
        this.dynamicSidebar = document.querySelector('.c-sidebar[endpoint-children]');

        if(this.dynamicSidebar) {
            this.endpoints = {};
            this.endpoints.children = this.dynamicSidebar.getAttribute('endpoint-children');
            this.endpoints.active = this.dynamicSidebar.getAttribute('endpoint-active');
            this.pageId = document.getElementsByTagName('body')[0].getAttribute('js-page-id');
        }
    }

    /**
     * Finds all sidebars and applies appropriate classes and attributes on load
     * @return {void}
     */
    applySidebar() {
        if(this.dynamicSidebar) {
            this.addTriggers(this.dynamicSidebar.querySelectorAll('.c-sidebar__toggle'));  
            this.dynamicSidebar.querySelectorAll('.c-sidebar__subcontainer').forEach((subContainer) => {
                if(subContainer.childElementCount === 0) {
                    subContainer.parentElement.removeChild(subContainer);
                }
            })
        }
    }

    getChildren(parentId) { 
        return fetch(`${this.endpoints.children  }?pageId=${  parentId}`)
        .then((response) => {
            return response.json();
        })
        .then((data) => {
            return data;
        });
    }

    getActiveItems() {
        return fetch(`${this.endpoints.active  }?pageId=${  this.pageId}`)
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
            
            children.forEach( (child) => {
                const childItem = document.createElement('div');
                childItem.classList.add('c-sidebar__item');
                const link = document.createElement('a');
                link.href = child.href;
                link.classList.add('c-sidebar__link');
                link.text = child.label;
                link.setAttribute('item-active', 'false');
                link.id = `${child.id}`;
                
                childItem.appendChild(link);

                if(child.children) {
                    
                    const bar = document.createElement('div');
                    bar.classList.add('bar');

                    const toggle = document.createElement('div');
                    toggle.classList.add('c-sidebar__toggle');
                    toggle.appendChild(bar);
                    toggle.appendChild(bar.cloneNode(true));
                    toggle.setAttribute('aria-label', child.id);

                    childItem.appendChild(toggle);  
                }
                
                subContainer.appendChild(childItem);

            });
            
            subContainer.classList.add('c-sidebar__item--is-expanded');
            
            return subContainer;
        });
    }
    
    /**
     * Adds listeners to buttons
     * @param {Object} sb The sidebar
    */
    addTriggers(toggleTriggers) {
        this.getActiveItems().then((activeItems) =>{
            toggleTriggers.forEach((trigger) => {
                const parentId = trigger.getAttribute('aria-label');
                const parent = trigger.parentElement;

                    if(!activeItems.includes(trigger.getAttribute('aria-label'))){

                        trigger.addEventListener('click', () => {

                            const ariaPressed = (trigger.getAttribute('aria-pressed') === 'true') ? 'false' : 'true';
                            trigger.setAttribute('aria-pressed', ariaPressed);
                            
                            if (!trigger.getAttribute('aria-loaded')) {
                                this.appendChildren(parentId).then((child) => {
                                    parent.appendChild(child);
                                    trigger.setAttribute('aria-loaded', 'true');
                                    
                                    const parentSubcontainer = parent.querySelector('.c-sidebar__subcontainer');
            
                                    this.addTriggers(parentSubcontainer.querySelectorAll('.c-sidebar__toggle'));
                                });
                            }
            
                            const parentSubcontainer = parent.querySelector('.c-sidebar__subcontainer');
            
                            if(parentSubcontainer) {
                                parentSubcontainer.classList.toggle('c-sidebar__item--is-expanded');
                            }
                        });
                    }
            });
        });
    }
}