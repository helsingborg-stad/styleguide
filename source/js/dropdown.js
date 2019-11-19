import DropdownVisibility from './dropdownVisibility';
let dropdownVisibilityInstance = new DropdownVisibility;

class Dropdown{

    toggleDropdown(){
        let dropdowns = document.getElementsByClassName('c-dropdown--on-click');


        for (let dropdown of dropdowns) {

            let dropDownList = dropdown.getElementsByClassName('c-dropdown__list')[0];
            let dropdownButton = dropdown.getElementsByTagName('button')[0];
            let buttonLabel = dropdownButton.getElementsByClassName('c-btn__label-text')[0];
            let buttonIcon = dropdownButton.getElementsByTagName('i')[0];
            
            let validTargets = [dropDownList, dropdownButton, buttonLabel, buttonIcon]
        

            dropdownVisibilityInstance.toggle(validTargets, dropDownList);
        }
        
    }

}

export default Dropdown;