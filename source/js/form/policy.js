class Policy {
    constructor() {

    }

    setListener({ form, inputs, checkboxHandler, checkboxGroups }) {
        const parentElement = form.querySelector('.js-policy-acceptance');
        if(parentElement) {
            const checkbox = parentElement.querySelector('.c-option__checkbox--hidden-box');
            checkbox.addEventListener('change', () => {
                parentElement.querySelector('.c-option [type="checkbox"]:checked') ? parentElement.querySelector('.c-option__checkbox--label-text').classList.remove('u-color__text--danger') : '';
            })  
        } 
    }

    validatePolicy(form) {
        const parentElement = form.querySelector('.js-policy-acceptance');

        if(parentElement) {
            let checked = parentElement.querySelector('.c-option [type="checkbox"]:checked') ? true : false;
            if(!checked) {
                parentElement.querySelector('.c-option__checkbox--label-text').classList.add('u-color__text--danger');
            }
            return parentElement.querySelector('.c-option [type="checkbox"]:checked') ? true : false;
        }
    }
}
export default Policy;