export default class Menu {
    constructor() {
        this.TRIGGER = 'js-menu-trigger';
        this.DART = 'js-menu-dart';
        this.TARGET = 'js-menu-target';
        this.EXPANDID = 'data-load-submenu';

        this.getSubitem();
    }

    applyMenu() {
        //Find navbars
        let navbar = document.querySelectorAll(".c-navbar");

        navbar.forEach((element) => {
            this.findTriggers(element)
        })
    }

    findTriggers(element) {
        //Find triggers
        const triggers = element.querySelectorAll(`[${this.TRIGGER}]`);

        triggers.forEach((trigger) => {
            let toggleClass = trigger.getAttribute(this.TRIGGER);
            let target = trigger.getAttribute(this.DART);

            trigger.addEventListener('click', (event) => {
                const targets = document.querySelectorAll(`[${this.TARGET}="${target}"]`);

                targets.forEach((target) => {
                    target.classList.toggle(toggleClass);
                })
            });
        });
    }

    getSubitem(root) {
        let IDS = root ? root.querySelectorAll(`[${this.EXPANDID}]`) : document.querySelectorAll(`[${this.EXPANDID}]`)

        IDS.forEach((id) => {
            id.addEventListener('click', (event) => {
                if (!id.hasAttribute("data-isAppended-subitem")) {
                    let subID = id.getAttribute(this.EXPANDID);
                    id.setAttribute('data-isAppended-subitem', '');

                    this.findItems([], subID)
                }
            });
        });
    }

    fetchJSONFile(path, callback) {
        let httpRequest = new XMLHttpRequest();
        httpRequest.onreadystatechange = (result) => {
            console.log(result)
            if (httpRequest.readyState === 4 || httpRequest.readyState === 0) {
                if (httpRequest.status === 200) {
                    console.log(httpRequest.responseText)
                    let data = JSON.parse(httpRequest.responseText);
                    if (callback) callback(data);
                    return data;
                }
            }
        };
        httpRequest.open('GET', path, true);
        httpRequest.send(); 
    }
    
    //Find item in JSON
    findItems(data, find) {
        if (data.length > 0) {
            return Object.keys(data).some((k) => {

                if (data[k].id === find) {
                    this.appendItems(data[k]['list'], data[k]['id']);
    
                    return; // return on direct found
                }
    
                if (Array.isArray(data[k].list)) {
                    return this.findItems(data[k].list, find); // return result of nested search
                }
            });
        } else {
            this.fetchJSONFile('/assets/data/nav.json', (data) => {
                this.findItems(data, find)
            });
        }
    }

    //Appends nav item
    appendItems(list, id) {
        let target = document.querySelector(`[data-append-submenu="${id}"]`);

        list.forEach((item) => {
            let subItem = this.buildDOM(item)
            target.appendChild(subItem)
            this.getSubitem(subItem);
            this.findTriggers(subItem)
        });
    }

    //Builds nav item
    buildDOM(item) {
        const uniqID = Math.random().toString(36).substr(2, 9);

        let newEl = document.createElement("div");
        newEl.className = "c-navbar__item";

        //Build link element
        let newLink = document.createElement("a");
        newLink.appendChild(document.createTextNode(item.name))
        newLink.href = item.href

        newEl.appendChild(newLink);

        if (item.list) {
            //Build toggle elements
            let newTgl = document.createElement("div");
            newTgl.className = "c-navbar__toggle";

            let newBtn = document.createElement("button");
            newBtn.className = "c-btn c-btn__icon";

            newBtn.setAttribute('js-menu-trigger', 'c-navbar__subitem--expanded');
            newBtn.setAttribute('js-menu-dart', uniqID);
            newBtn.setAttribute('data-load-submenu', item.id);

            let newLbl = document.createElement("span");
            newLbl.className = "c-btn__label";

            let newIcon = document.createElement("i");
            newIcon.className = "c-icon c-icon--color-primary c-icon--size-lg c-icon--menu";

            //Append Icon elemetns
            newLbl.appendChild(newIcon);
            newBtn.appendChild(newLbl);
            newTgl.appendChild(newBtn);

            //Append element
            newEl.appendChild(newTgl);

            let newSubItem = document.createElement("div");
            newSubItem.className = "c-navbar__subitem"
            newSubItem.setAttribute('js-menu-target', uniqID);
            newSubItem.setAttribute('data-append-submenu', item.id);

            newEl.appendChild(newSubItem);
        }

        return newEl;
    }
}