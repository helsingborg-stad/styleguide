class Collapse {
    constructor() {
        this.collapse();
    }

    collapse() {        
        document.querySelectorAll('.mod-form-collapse').forEach(collapseButton => {
            let element = collapseButton.nextElementSibling;
            
            do {
                element.classList.toggle('u-display--none');
                element = element.nextElementSibling;
            }
            while (element.classList.contains('mod-form-field'));
        })
    }

    setListener({ form, inputs, checkboxHandler, checkboxGroups }) {
        form.querySelectorAll('.mod-form-collapse').forEach(collapseButton => {
            collapseButton.addEventListener('click', () => {
                this.collapse();
            })
        });
    }
}

export default Collapse;