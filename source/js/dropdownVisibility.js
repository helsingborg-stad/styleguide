class DropdownVisibility{
    constructor(){
        this.DROPDOWNLISTVISIBLE = 'c-dropdown__list--visible'
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

export default DropdownVisibility;