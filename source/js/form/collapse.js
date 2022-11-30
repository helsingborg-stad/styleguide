class Collapse {
    constructor() {
        this.init();
    }

    init() {        
        document.querySelectorAll('.mod-form-collapse').forEach(collapseButton => {
            this.collapse(collapseButton);
        });
    }

    setListener({ form, inputs, checkboxHandler, checkboxGroups }) {
        form.querySelectorAll('.mod-form-collapse').forEach(collapseButton => {
            collapseButton.addEventListener('click', () => {
                this.collapse(collapseButton);
            })
        });
    }

    collapse(collapseButton = false) {
        let element = collapseButton.nextElementSibling;
        console.log(element);
            do {
                element.classList.toggle('u-display--none');
                console.log(element.nextElementSibling ? true : false);
                element = element.nextElementSibling ? element.nextElementSibling : false;
            }
            while (element ? element.classList.contains('mod-form-field') :false);
    }
}

export default Collapse;