export default class Menu {
    constructor() {
        this.TRIGGER = 'js-menu-trigger';
        this.DART = 'js-menu-dart';
        this.TARGET = 'js-menu-target';
        this.EXPANDID = 'data-load-submenu';

        this.elm = '';

        this.getSubitem();
        this.getNavbar();
    }

    /**
     * Finds each navbar in the document.
     * 
     * Finds each navbar in the document and then sends it for further handling
     */
    getNavbar() {
        const navbar = document.querySelectorAll(".c-navbar");

        navbar.forEach((element) => {
            this.addTriggers(element)
        })
    }

    /**
     * Adds event listeners to the link items.
     * 
     * @param {*} element   The navbar element to add triggers to
     */
    addTriggers(element) {
        const triggers = element.querySelectorAll(`[${this.TRIGGER}]`);

        triggers.forEach((trigger) => {
            const toggleClass = trigger.getAttribute(this.TRIGGER);
            const targetId = trigger.getAttribute(this.DART);

            trigger.addEventListener('click', (event) => {
                const targets = document.querySelectorAll(`[${this.TARGET}="${targetId}"]`);

                targets.forEach((target) => {
                    target.classList.toggle(toggleClass);
                })
            });
        });
    }

    /**
     * Looks if a nav items has children.
     * 
     * First looks if nav items has children, if it does then it add and event listener to the toggle button
     * 
     * @param {*} root  The container to look inside, cna be a single nav item or the root navbar
     */
    getSubitem(root) {
        const IDS = root ? root.querySelectorAll(`[${this.EXPANDID}]`) : document.querySelectorAll(`[${this.EXPANDID}]`)

        IDS.forEach((id) => {
            id.addEventListener('click', (event) => {
                event.preventDefault();
                id.toggleAttribute("is-open");

                if (!id.hasAttribute("data-isAppended-subitem")) {
                    id.setAttribute('data-isAppended-subitem', '');
                    this.findItems([], id.getAttribute(this.EXPANDID))
                }
            });
        });
    }

    /**
     * Fetches JSON data
     * 
     * @param {*} path  Path to json file
     * @param {*} find  What id to look for
     */
     fetchJSONFile(path, find) {
        const httpRequest = new XMLHttpRequest();
        httpRequest.onreadystatechange = () => {
            if (httpRequest.readyState === 4 || httpRequest.readyState === 0) {
                if (httpRequest.status === 200) {
                    const data = JSON.parse(httpRequest.responseText);

                    this.findItems(data, find)
                    return data;
                }
            }

            return 0;
        };
        httpRequest.open('GET', path, true);
        httpRequest.send(); 
    }
    
    /**
     * Looks for a specific nav item
     * @param {*} data Data to search through
     * @param {*} find What id to look for
     */
    findItems(data, find) {
        if (data.length > 0) {
            return Object.keys(data).some((k) => {
                if (data[k].id === find) {
                    this.appendItems(data[k].list, data[k].id);
    
                    return 0; // return on direct found
                }
    
                if (Array.isArray(data[k].list)) {
                    return this.findItems(data[k].list, find); // return result of nested search
                }

                return 0;

            });
        }

        // Data is empty. fetch from JSON file
        this.fetchJSONFile('/assets/data/nav.json', find);
        
        return 0;
    }

    /**
     * Appends each child item to the parent item.
     * 
     * @param {*} list  List of items to be appended
     * @param {*} id    Identifier for which element to append to.
     */
    appendItems(list, id) {
        const target = document.querySelector(`[data-append-submenu="${id}"]`);

        list.forEach((item) => {
            this.buildDOM(item)
            target.appendChild(this.elm)
            this.getSubitem(this.elm);
            this.addTriggers(this.elm)
        });
    }

    /**
     * Builds a nav item dom object 
     * 
     * @param {*} item The item data to build the element based on
     */
    buildDOM(item) {
        const uniqID = Math.random().toString(36).substr(2, 9);

        const newLink = document.createElement("a");
        newLink.href = item.href

        const newEl = document.createElement("div");
        newEl.className = "c-navbar__item";

        // Build link element
        const newSpan = document.createElement("span");
        newSpan.appendChild(document.createTextNode(item.name))
        
        newEl.appendChild(newSpan);

        if (item.list) {
            // Item has children
            // Build toggle elements
            const newTgl = document.createElement("div");
            newTgl.className = "c-navbar__toggle";

            const newBtn = document.createElement("button");
            newBtn.className = "c-button c-button__icon";

            newBtn.setAttribute('js-menu-trigger', 'c-navbar__subitem--expanded');
            newBtn.setAttribute('js-menu-dart', uniqID);
            newBtn.setAttribute('data-load-submenu', item.id);

            const newLbl = document.createElement("span");
            newLbl.className = "c-btn__label";

            const newIcon = document.createElement("i");
            newIcon.className = "c-icon c-icon--color-primary c-icon--size-md material-icons";
            newIcon.appendChild(document.createTextNode("expand_more"))

            // Append Icon elemetns
            newLbl.appendChild(newIcon);
            newBtn.appendChild(newLbl);
            newTgl.appendChild(newBtn);

            // Append element
            newEl.appendChild(newTgl);

            const newSubItem = document.createElement("div");
            newSubItem.className = "c-navbar__subitem"
            newSubItem.setAttribute('js-menu-target', uniqID);
            newSubItem.setAttribute('data-append-submenu', item.id);

            newEl.appendChild(newSubItem);
        }

        newLink.appendChild(newEl)

        this.elm = newLink;
    }
}