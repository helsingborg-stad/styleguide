class Policy {
    constructor() {
        this.parentElement = null;
    }

    setListener({ form, inputs, checkboxHandler, checkboxGroups }) {
        this.parentElement = form.querySelector('.js-policy-acceptance');
        if (this.parentElement) {
            this.parentElement.querySelector('.c-option__checkbox--hidden-box').addEventListener('change', () => {
                this.parentElement.querySelector('.c-option [type="checkbox"]:checked') ? this.parentElement.querySelector('.c-option__checkbox--label-text').classList.remove('u-color__text--danger') : '';
            })
        }
    }

    validatePolicy(form) {
        
        if (this.parentElement) {
            let checked = this.parentElement.querySelector('.c-option [type="checkbox"]:checked') ? true : false;
            if (!checked) {
                this.parentElement.querySelector('.c-option__checkbox--label-text').classList.add('u-color__text--danger');
            }
            return this.parentElement.querySelector('.c-option [type="checkbox"]:checked') ? true : false;
        }
    }
}
export default Policy;