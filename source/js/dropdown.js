class Dropdown {

    constructor() {
        this.DROPDOWNLISTVISIBLE = 'c-dropdown__list--visible';
        this.onResize();
    }

    /**
     * Set Valid Targets
     */
    setValidTargets() {
        let dropdowns = document.getElementsByClassName('c-dropdown--on-click');

        for (let dropdown of dropdowns) {

            let dropDownList = dropdown.getElementsByClassName('c-dropdown__list')[0];
            let dropdownButton = dropdown.getElementsByTagName('button')[0];
            let buttonLabel = dropdownButton.getElementsByClassName('c-button__label-text')[0];
            let buttonIcon = dropdownButton.getElementsByTagName('i')[0];
            let validTargets = [dropDownList, dropdownButton, buttonLabel, buttonIcon];
            let isOut = this.isInViewport(dropDownList);

            (isOut.left) ?
                dropDownList.classList.add('c-dropdown__auto--position-left') :
                dropDownList.classList.remove('c-dropdown__auto--position-left');

            (isOut.right) ?
                dropDownList.classList.add('c-dropdown__auto--position-right') :
                dropDownList.classList.remove('c-dropdown__auto--position-right');

            (isOut.bottom) ?
                dropDownList.classList.add('c-dropdown__auto--position-bottom') :
                dropDownList.classList.remove('c-dropdown__auto--position-bottom');

            this.toggle(validTargets, dropDownList);
        }
    }

    /**
     * Resize - Run check
     */
    onResize() {
        const self = this;
        console.log(12);
        window.addEventListener('resize', function () {
            self.setValidTargets();
        });
    }


    /**
     * Toogle dropdown on and of
     * @param validTargets
     * @param dropDownList
     */
    //toggle(validTargets, dropDownList, offsetPositionClass) {
    toggle(validTargets, dropDownList) {

        document.addEventListener('click', (event) => {

            let target = event.target;
            if ((validTargets.includes(target)) && !dropDownList.classList.contains(this.DROPDOWNLISTVISIBLE)) {
                dropDownList.classList.add(this.DROPDOWNLISTVISIBLE);
            } else {
                dropDownList.classList.remove(this.DROPDOWNLISTVISIBLE);
            }
        })
    }

    /**
     * Checking Element bounderies
     * @param element
     * @returns {{}}
     */
    isInViewport(element) {
        let bounding = element.getBoundingClientRect();
        let out = {};

        out.top = bounding.top < 0;
        out.left = bounding.left < 0;
        out.bottom = bounding.bottom > (window.innerHeight || document.documentElement.clientHeight);
        out.right = bounding.right > (window.innerWidth || document.documentElement.clientWidth);
        out.any = out.top || out.left || out.bottom || out.right;
        out.all = out.top && out.left && out.bottom && out.right;

        return out;
    }
}

export default Dropdown;