import Checkbox from "./form/checkbox";
import Collapse from "./form/collapse";
import Policy from "./form/policy";
import Conditions from "./form/conditions";

class Fields {

    constructor(form) {
        if (!form) return;
        this.form = form;
        this.inputs = form.querySelectorAll('input, textarea, select');
        this.checkboxGroups = form.querySelectorAll('.checkbox-group-required');
        
        this.setupFormValidate(form);
    }

    setupFormValidate() {
        const params = this.initialize();

        /* Checks if the form is empty at start (disabled submit button) */
        const formEmpty = new CustomEvent('formEmpty', {});
        this.checkEmpty();

        this.form.addEventListener('change', (e) => {
            this.form.dispatchEvent(formEmpty);
        });

        this.inputs.forEach(input => {
            if (input.hasAttribute('data-validation-message')) {
                this.getFieldWrapper(input).querySelector('.c-field__error').setAttribute('aria-label', input.getAttribute('data-validation-message'));
                this.getFieldWrapper(input).querySelector('.c-field__error-message').innerHTML = input.getAttribute('data-validation-message');

            } else {
                if (this.getFieldWrapper(input).querySelector('.c-field__error')) {
                    this.getFieldWrapper(input).querySelector('.c-field__error').remove();
                }
            }

            if (input.closest('.c-select--multiselect')) {
                let multiSelect = input.closest('.c-select--multiselect');
                multiSelect.querySelector('.c-select__options').addEventListener('click', (e) => {
                    this.form.dispatchEvent(formEmpty);
                })
            }
        });
        this.setValidationListeners(params);
    }

    checkFormRequirements(form) {
        if (form.querySelector('[type="submit"]') === null) {
            console.error('Form must have a submit button.', form)
            return false;
        }

        return true;
    }

    initialize() {
        const checkboxHandler = new Checkbox(this.checkboxGroups);
        const collapseHandler = new Collapse(this.form);
        const policyHandler = new Policy(this.form);
        const conditionsHandler = new Conditions(this.form);

        return { checkboxHandler, policyHandler }
    }


    setValidationListeners(params) {
        this.keyup();
        this.focusout();
        this.click(params);
        this.submit(params);

        this.form.addEventListener('formEmpty', () => {
            this.checkEmpty();
        });
    }

    /* Handle validation */
    validateInput(input, submitCheck = false) {
        let valueLength = input.value ? input.value.length : 0;

        if (input.hasAttribute('js-no-validation') || 
            input.type === 'checkbox' || 
            input.type === 'radio'
        ) {
            return;
        }

        if (['date', 'week', 'month', 'time'].indexOf(input.type) != -1) {
            valueLength = 1;
        }

        if (valueLength > 0 || submitCheck) {
            if (input.hasAttribute('required')) {
                if (input.checkValidity()) {
                    this.handleValid(input);
                    return true;

                } else {
                    this.handleInvalid(input);
                    return false;
                }
            }
        } else {
            this.handleNotFilled(input);
            return false;
        }

    }

    handleValid(input) {
        this.classToggle(this.getFieldWrapper(input), 'is-valid', 'is-invalid');
        this.getFieldWrapper(input).querySelector('.c-field__error') ? this.getFieldWrapper(input).querySelector('.c-field__error').setAttribute('aria-hidden', true) : '';
    }

    handleInvalid(input) {
        this.classToggle(this.getFieldWrapper(input), 'is-invalid', 'is-valid');
        this.getFieldWrapper(input).querySelector('.c-field__error') ? this.getFieldWrapper(input).querySelector('.c-field__error').setAttribute('aria-hidden', false) : '';
    }

    handleNotFilled(input) {
        this.getFieldWrapper(input).classList.remove('is-valid', 'is-invalid');
        this.getFieldWrapper(input).querySelector('.c-field__error') ? this.getFieldWrapper(input).querySelector('.c-field__error').setAttribute('aria-hidden', true) : '';
    }

    classToggle(element, addClass, removeClass) {
        !element.classList.contains(addClass) ? element.classList.add(addClass) : '';
        element.classList.remove(removeClass);
    }

    getFieldWrapper(input) {
        var fieldWrapper = input;
        do {
            if (fieldWrapper.parentNode !== document.body) {
                fieldWrapper = fieldWrapper.parentNode;
            } else {
                return input;
            }
        } while (!fieldWrapper.matches('.c-field, .c-option, .c-select'));

        return fieldWrapper;
    }

    /*  Listeners  */
    keyup() {
        this.inputs.forEach(input => {
            input.addEventListener('keyup', () => {
                if (this.getFieldWrapper(input).classList.contains('is-invalid') || this.getFieldWrapper(input).classList.contains('is-valid')) {
                    this.validateInput(input);
                }

                this.checkEmpty();
            })
        })
    }

    focusout() {
        ['focusout', 'change'].forEach((e) => {
            [...this.inputs].forEach(input => {
                input.addEventListener(e, () => {
                    this.validateInput(input);
                    this.checkEmpty();
                });
            });
        });
    }

    click({ checkboxHandler, policyHandler }) {
        const submitButton = this.form.querySelector('[type="submit"]');
        if (submitButton) {
            submitButton.addEventListener('click', (e) => {
                let containsInvalid = [];

                this.inputs.forEach(input => {
                    containsInvalid.push(this.validateInput(input, true));
                });

                containsInvalid.push(policyHandler.validatePolicy());
                containsInvalid.push(checkboxHandler.validateCheckboxes(this.checkboxGroups));
                if (containsInvalid.includes(false)) {
                    this.classToggle(this.form, 'is-invalid', 'is-valid');

                    checkboxHandler.validateCheckboxes(this.checkboxGroups);

                    [...this.form.querySelectorAll('.c-form__notice-failed')].forEach(element => {
                        element.setAttribute('aria-hidden', false);
                    });

                    [...this.form.querySelectorAll('.c-form__notice-success')].forEach(element => {
                        element.setAttribute('aria-hidden', true);
                    });
                }
            });
        }
    }

    checkEmpty() {
        let emptyForm = false;
        let attatchedFiles = false;
        let checkInputs = [];
        let submitButton = this.form.querySelector('[type="submit"]');

        this.form.querySelectorAll('input[js-field-fileinput]') ? (this.form.querySelectorAll('input[js-field-fileinput]').length > 0 ? attatchedFiles = true : false) : attatchedFiles = false;

        this.inputs.forEach(input => {
            if (emptyForm) return;
            if (input?.type && (input?.type === 'radio' || input?.type === 'checkbox')) {
                checkInputs.push(input);
                return;
            }
            if (!input.classList.contains('js-no-validation')) {
                if (input.getAttribute('type') !== 'hidden') {
                    (input.value.length > 0 || attatchedFiles) ? emptyForm = true : '';
                }
            }
            this.validateInput(input);
        });

        if (!emptyForm && checkInputs.length > 0) {
            checkInputs.forEach(input => {
                if (input.checked && !emptyForm) {
                    emptyForm = true;
                }
            })
        }
        if (submitButton) {
            !emptyForm ? submitButton.disabled = true : submitButton.disabled = false;
        }
        
        return emptyForm;
    }

    submit({ checkboxHandler, policyHandler }) {
        let submitButton = this.form.querySelector('[type="submit"]');

        this.form.addEventListener('submit', (e) => {
            if (!checkboxHandler.validateCheckboxes(this.checkboxGroups)) {
                e.preventDefault();
                this.classToggle(this.form, 'is-invalid', 'is-valid');
            } else {
                this.classToggle(this.form, 'is-valid', 'is-invalid');
                if (typeof formbuilder !== 'undefined') {
                    submitButton ? submitButton.innerHTML = formbuilder.sending : '';
                }
            }

            [...this.form.querySelectorAll('.c-form__notice-failed')].forEach(element => {
                element.setAttribute('aria-hidden', true);
            });

            [...this.form.querySelectorAll('.c-form__notice-success')].forEach(element => {
                element.setAttribute('aria-hidden', false);
            });
        });
    }

}

export function initializeForms() {
    const forms = document.querySelectorAll('.js-form-validation');
    [...forms].forEach(form => {
        new Fields(form);
    });
}

export default Fields;
