class Collapse {
    constructor(form) {
        if (!form) return;
        this.collapseSections = form.querySelectorAll('.mod-form-collapse');
        this.setListener();
    }

    setListener() { 
        [...this.collapseSections].forEach(collapseButton => {
            this.collapse(collapseButton);
            
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