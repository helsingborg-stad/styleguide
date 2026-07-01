class SplitButton{
    constructor(){
        this.SPLIT = 'js-split';
        this.DROPDOWNLISTVISIBLE = 'c-dropdown__list--visible';
    }

    syncSplitButton(){
        const splitButtons = document.querySelectorAll(`[${this.SPLIT}]`);


        splitButtons.forEach((splitButton)=> {
            const buttons = splitButton.getElementsByClassName('c-button');
            const actionButton = buttons[0];
            const dropDownList = splitButton.getElementsByClassName('c-dropdown__list')[0];
            const listItems = dropDownList.getElementsByTagName('li');

            for(const item of listItems){
                item.addEventListener('click', () => {
                    actionButton.innerText = item.innerText;
                }) 
            }   
        });
        
        
    }
}

export default SplitButton;