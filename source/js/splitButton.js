class SplitButton{
    constructor(){
        this.SPLIT = 'js-split'
        this.DROPDOWNLISTVISIBLE = 'c-dropdown__list--visible'
    }

    syncSplitButton(){
        const splitButtons = document.querySelectorAll(`[${this.SPLIT}]`);


        splitButtons.forEach((splitButton)=> {
            let buttons = splitButton.getElementsByClassName('c-btn');
            let actionButton = buttons[0];
            let dropDownButton = buttons[1];
            let icon = splitButton.getElementsByClassName('c-icon')[0];
            let dropDownList = splitButton.getElementsByClassName('c-dropdown__list')[0];
            let listItems = dropDownList.getElementsByTagName('li');
            
            document.addEventListener('click', (event) => {
                let target = event.target;            
                if((target === dropDownButton || target === icon)  && !dropDownList.classList.contains(this.DROPDOWNLISTVISIBLE)){
                    dropDownList.classList.add(this.DROPDOWNLISTVISIBLE);
                }else{
                    dropDownList.classList.remove(this.DROPDOWNLISTVISIBLE);
                }
            })

            for(let item of listItems){
                item.addEventListener('click', () => {
                    actionButton.innerText = item.innerText;
                }) 
            }   
        });
        
        
    }
}

export default SplitButton;