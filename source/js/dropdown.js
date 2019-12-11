class Dropdown {

    constructor() {

        this.DROPDOWN_LIST_VISIBLE = 'c-dropdown__list--visible';
        this.AUTO_POSITION_LEFT = 'c-dropdown__auto--position-left';
        this.AUTO_POSITION_RIGHT = 'c-dropdown__auto--position-right';

        //this.onResize();
    }

    /**
     * Set Valid Targets and fire toogle
     */
    setValidTargets() {

        const dropdowns = document.getElementsByClassName('c-dropdown--on-click');

        for (let dropdown of dropdowns) {

            let dropDownList = (dropdown.getElementsByClassName('c-dropdown__list')[0]) ?
                dropdown.getElementsByClassName('c-dropdown__list')[0] : '';

            let dropdownButton = (dropdown.getElementsByTagName('button')[0]) ?
                dropdown.getElementsByTagName('button')[0] : '';

            let buttonLabel = (dropdownButton.getElementsByClassName('c-button__label-text')[0]) ?
                dropdownButton.getElementsByClassName('c-button__label-text')[0] : '';

            let buttonIcon = (dropdownButton.getElementsByTagName('i')[0]) ?
                dropdownButton.getElementsByTagName('i')[0] : '';

            let validTargets = [dropDownList, dropdownButton, buttonLabel, buttonIcon];

            this.toggle(validTargets, dropDownList);
        }
    }

    /**
     * Set outbound position
     * @param dropDownList
     */
    setOutBound(dropDownList) {

        let isOutOfBound = this.isInViewport(dropDownList);

        (isOutOfBound.left) ? dropDownList.classList.add(this.AUTO_POSITION_LEFT) :
            dropDownList.classList.remove(this.AUTO_POSITION_LEFT);

        (isOutOfBound.right) ? dropDownList.classList.add(this.AUTO_POSITION_RIGHT) :
            dropDownList.classList.remove(this.AUTO_POSITION_RIGHT);
    }

    /**
     * Toogle dropdown on and of
     * @param validTargets
     * @param dropDownList
     */
    toggle(validTargets, dropDownList) {

        this.setOutBound(dropDownList);

        document.addEventListener('click', (event) => {
            let target = event.target;
            if (validTargets.includes(target) && !dropDownList.classList.contains(this.DROPDOWN_LIST_VISIBLE)) {
                console.log(validTargets.includes(target));
                dropDownList.classList.add(this.DROPDOWN_LIST_VISIBLE);
            } else {
                dropDownList.classList.remove(this.DROPDOWN_LIST_VISIBLE);
            }
        });
    }

    /**
     * Resize - Run check
     */
    onResize() {

        const self = this;
        window.addEventListener('resize', () => {
            self.setValidTargets();
        });
    }

    /**
     * Checking Element bounderies
     * @param element
     * @returns {{}}
     */
    isInViewport(element) {

        const bounding = element.getBoundingClientRect();
        const clientScreen = (window.innerWidth || document.documentElement.clientWidth);

        let out = {};

        out.top = bounding.top < 0;
        out.left = bounding.left < 0;
        out.bottom = bounding.bottom > (window.innerHeight || document.documentElement.clientHeight);
        out.right = (bounding.right + 20) > clientScreen;
        out.any = out.top || out.left || out.bottom || out.right;
        out.all = out.top && out.left && out.bottom && out.right;

        return out;
    }
}

export default Dropdown;