class SplitButton{
    constructor(){
        this.SPLIT = 'js-split';
        this.DROPDOWNLISTVISIBLE = 'c-dropdown__list--visible';
    }

    syncSplitButton(){
        const splitButtons = document.querySelectorAll(`[${this.SPLIT}]`);


        splitButtons.forEach((splitButton)=> {
            let buttons = splitButton.getElementsByClassName('c-button');
            let actionButton = buttons[0];
            let dropDownList = splitButton.getElementsByClassName('c-dropdown__list')[0];
            let listItems = dropDownList.getElementsByTagName('li');

            for(let item of listItems){
                item.addEventListener('click', () => {
                    actionButton.innerText = item.innerText;
                }) 
            }   
        });
        
        
    }
}

export default SplitButton;