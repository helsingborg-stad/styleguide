class Checkbox {
    constructor(checkboxGroups){
        checkboxGroups && this.setListener(checkboxGroups);
    }

    setListener(checkboxGroups) {
        checkboxGroups.forEach(checkboxGroup => {
            const checkboxes = checkboxGroup.querySelectorAll('.c-option__checkbox--hidden-box');
            let validationElement = checkboxGroup.querySelector('.js-checkbox-valid');

            checkboxes.forEach(checkbox => {
                checkbox.addEventListener('change', () => {
                    let validator = checkboxGroup.querySelectorAll('.c-option [type="checkbox"]:checked');
                    if (validator.length > 0) {
                        validationElement.setAttribute('checked', true);
                        checkboxGroup.querySelector('.c-field__label').classList.remove('u-color__text--danger');
                    } else {
                        validationElement.removeAttribute('checked');
                    }
                })
            })
        });
    }

    validateCheckboxes(checkboxGroups) {

        let hasChecked = [];
        checkboxGroups.forEach(group => {
            let input = group.querySelector('[js-required]');
            let validation = input.getAttribute('checked') ? true : false;

            if (input.hasAttribute('js-no-validation')) {
                validation = true;
            }
            
            hasChecked.push(validation);
            if (!validation) {
                group.querySelector('.c-field__label').classList.add('u-color__text--danger');

            } else {
                group.querySelector('.c-field__label').classList.remove('u-color__text--danger');
            }
        })

        return hasChecked.includes(false) ? false : true;
    }
}
export default Checkbox;