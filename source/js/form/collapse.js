class Collapse {
    constructor() {
        this.init();
    }

    init() {        
        document.querySelectorAll('.mod-form-collapse').forEach(collapseButton => {
            this.collapse(collapseButton);
        });
    }

    setListener({ form, inputs, checkboxGroups, checkboxHandler, policyHandler, fileinputHandler }) {
        form.querySelectorAll('.mod-form-collapse').forEach(collapseButton => {
            collapseButton.addEventListener('click', () => {
                this.collapse(collapseButton);
            })
        });
    }

    collapse(collapseButton = false) {
        let element = collapseButton.nextElementSibling;

            do {
                element.classList.toggle('u-display--none');
                element = element.nextElementSibling ? element.nextElementSibling : false;
            }
            while (element ? element.classList.contains('mod-form-field') :false);
    }
}

export default Collapse;