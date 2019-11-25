class Dropdown{

    constructor(){
        this.DROPDOWNLISTVISIBLE = 'c-dropdown__list--visible';
    }

    setValidTargets(){
        let dropdowns = document.getElementsByClassName('c-dropdown--on-click');


        for (let dropdown of dropdowns) {

            let dropDownList = dropdown.getElementsByClassName('c-dropdown__list')[0];
            let dropdownButton = dropdown.getElementsByTagName('button')[0];
            let buttonLabel = dropdownButton.getElementsByClassName('c-button__label-text')[0];
            let buttonIcon = dropdownButton.getElementsByTagName('i')[0];
            let validTargets = [dropDownList, dropdownButton, buttonLabel, buttonIcon]
        
            this.toggle(validTargets, dropDownList);
        }
        
    }

    toggle(validTargets, dropDownList){
        document.addEventListener('click', (event) => {
            let target = event.target; 
            if((validTargets.includes(target))  && !dropDownList.classList.contains(this.DROPDOWNLISTVISIBLE)){
                dropDownList.classList.add(this.DROPDOWNLISTVISIBLE);
            }else{
                dropDownList.classList.remove(this.DROPDOWNLISTVISIBLE);
            }
        })   
    }

}

export default Dropdown;