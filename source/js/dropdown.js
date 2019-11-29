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
            let offsetPositionClass = (!this.isInViewport(dropDownList)) ? true : false;

            this.toggle(validTargets, dropDownList, offsetPositionClass);
        }

    }

    /**
     * Toogle dropdown on and of
     * @param validTargets
     * @param dropDownList
     */
    toggle(validTargets, dropDownList, offsetPositionClass) {
        document.addEventListener('click', (event) => {
            let target = event.target;

            if (!dropDownList.classList.contains('c-dropdown__auto--position-right') && offsetPositionClass) {
                dropDownList.classList.add('c-dropdown__auto--position-right');
            }

            if (dropDownList.classList.contains('c-dropdown__auto--position-right') && !offsetPositionClass) {
                dropDownList.classList.remove('c-dropdown__auto--position-right');
            }

            if ((validTargets.includes(target)) && !dropDownList.classList.contains(this.DROPDOWNLISTVISIBLE)) {
                dropDownList.classList.add(this.DROPDOWNLISTVISIBLE);
            } else {
                dropDownList.classList.remove(this.DROPDOWNLISTVISIBLE);
            }
        })
    }


    /**
     * Resize - Run check
     */
    onResize() {
        const self = this;
        window.addEventListener('resize', function () {
            self.setValidTargets();
        });
    }

    /**
     * Checking Bounding Client - if dropdown is to close to screen edge
     * @param element
     * @returns {boolean|boolean}
     */
    isInViewport(element) {
        let bounding = element.getBoundingClientRect();
        return (
            bounding.top >= 0 && bounding.left >= 0 &&
            bounding.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
            bounding.right <= (window.innerWidth || document.documentElement.clientWidth)
        );
    };
}

export default Dropdown;