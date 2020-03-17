class Dropdown {

    constructor() {

        this.DROPDOWN_LIST_VISIBLE = 'c-dropdown__list--visible';
        this.AUTO_POSITION_LEFT = 'c-dropdown__auto--position-left';
        this.AUTO_POSITION_RIGHT = 'c-dropdown__auto--position-right';
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

            let buttonLabelReverse = (dropdownButton.getElementsByClassName('c-button__label-text--reverse')[0]) ?
                dropdownButton.getElementsByClassName('c-button__label-text--reverse')[0] : '';

            let buttonIcon = (dropdownButton.getElementsByTagName('i')[0]) ?
                dropdownButton.getElementsByTagName('i')[0] : '';

            let validTargets = [dropDownList, dropdownButton, buttonLabel, buttonIcon, buttonLabelReverse];

            this.toggle(validTargets, dropDownList);
        }
    }



    /**
     * Toogle dropdown on and of
     * @param validTargets
     * @param dropDownList
     */
    toggle(validTargets, dropDownList) {

        
        document.addEventListener('click', (event) => {
            let target = event.target;
            if (validTargets.includes(target) && !dropDownList.classList.contains(this.DROPDOWN_LIST_VISIBLE)) {
                dropDownList.classList.add(this.DROPDOWN_LIST_VISIBLE);
                const boundingRect = dropDownList.getBoundingClientRect();

                if(boundingRect.left < 0){
                    dropDownList.classList.remove('c-dropdown__list--left');
                    dropDownList.classList.add('c-dropdown__list--right');
                }else if(boundingRect.right < 0){
                    dropDownList.classList.remove('c-dropdown__list--right');
                    dropDownList.classList.add('c-dropdown__list--left');
                }else if(boundingRect.top < 0){
                    dropDownList.classList.remove('c-dropdown__list--top');
                    dropDownList.classList.add('c-dropdown__list--bottom'); 
                }else if(boundingRect.bottom < 0){
                    dropDownList.classList.remove('c-dropdown__list--bottom');
                    dropDownList.classList.add('c-dropdown__list--top');
                }

            } else {
                dropDownList.classList.remove(this.DROPDOWN_LIST_VISIBLE);
            }
        });
    }
}

export default Dropdown;