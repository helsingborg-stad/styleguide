import FileInput from "./form/fileInput";
import Checkbox from "./form/checkbox";
import Collapse from "./form/collapse";
import Policy from "./form/policy";
import Conditions from "./form/conditions";

class Fields {

    constructor() {
        this.form = document.getElementsByTagName('form')[0];
        this.formElement = null;
        this.formElementType = null;
        this.formElementPattern = null;
        this.formElementRequired = null;
        this.formElementDataInvalid = null;
        this.formElementDataInvalid = null;
        /* Is this doing anything that we need? */
        this.formValidationEventListerners();
        this.setupFormValidate();
    }

    formValidationEventListerners() {
        const self = this;
        const inputs = document.querySelectorAll('input[required], textarea[required], select[required]');

        for (const formInput of inputs) {
            if (formInput.form?.classList.contains('js-form-validation')) {
                continue;
            }
            const inputId = formInput.getAttribute('id');
            const input = document.getElementById(inputId);

            if (!inputId || !input) return;

            // On Click event listener - Setting data
            input.addEventListener('click', function (e) {
                self.formElement = this;

                self.formElementType = (self.formElement.getAttribute('type')) ?
                    self.formElement.getAttribute('type') : null;

                self.formElementPattern = (self.formElement.getAttribute('pattern')) ?
                    self.formElement.getAttribute('pattern') : null;

                self.formElementRequired = (self.formElement.getAttribute('data-required')) ?
                    self.formElement.getAttribute('pattern') : null;

                self.formElementDataInvalidMessage = (self.formElement.getAttribute('data-invalid-message')) ?
                    self.formElement.getAttribute('data-invalid-message') : '';

            });

            // On Change event listener
            document.getElementById(inputId).addEventListener('change', function (element) {
                self.validateFormField(element);
            });
        }
    }


    /**
     * Validate Form fields by pattern
     * @param element
     */
    validateFormField(element) {

        if (!('remove' in Element.prototype)) {
            Element.prototype.remove = function () {
                if (this.parentNode) {
                    this.parentNode.removeChild(this);
                }
            };
        }
        this.formElement.classList.remove('invalid');
        this.formElement.classList.remove('valid');

        // If Require is on
        if (this.formElementRequired) {
            let valid = false;
            if (this.formElementPattern) {
                valid = (this.formElement.value.match(this.formElementPattern)) ? true : false;
            } else {
                valid = true;
            }

            const id = this.formElement.getAttribute('id');
            if (!valid && !this.formElement.checkValidity()) {
                this.formElement.classList.add('invalid');

                if (this.formElementDataInvalidMessage) {
                    const errorMessage = document.getElementById('error_' + id + '_message');
                    errorMessage.classList.add('error');
                    errorMessage.getElementsByClassName("errorText")[0].innerHTML = this.formElementDataInvalidMessage;
                }

            } else {
                document.getElementById('error_' + id + '_message').classList.remove('error');
                this.formElement.className = "valid";
            }
        }
    }

    checkFormRequirements(form) {
        if (form.querySelector('[type="submit"]') === null) {
            console.error('Form must have a submit button.', form)
            return false;
        }

        return true;
    }

    setupFormValidate() {
        const forms = document.querySelectorAll('.js-form-validation');
        const checkboxHandler = new Checkbox();
        const collapseHandler = new Collapse();
        const policyHandler = new Policy();
        const fileinputHandler = new FileInput();

        const formEmpty = new CustomEvent('formEmpty', {});

        forms.forEach(form => {
            
            if (!this.checkFormRequirements(form)) {
                return
            }

            const inputs = form.querySelectorAll('input, textarea, select');
            const checkboxGroups = form.querySelectorAll('.checkbox-group-required');
            const params = { form, inputs, checkboxGroups, checkboxHandler, policyHandler, fileinputHandler };
            this.checkEmpty(inputs, form);

            form.addEventListener('change', (e) => {
                form.dispatchEvent(formEmpty);
            });

            inputs.forEach(input => {
                if (input.hasAttribute('data-validation-message')) {
                    this.getFieldWrapper(input).querySelector('.c-field__error').setAttribute('aria-label', input.getAttribute('data-validation-message'));
                    this.getFieldWrapper(input).querySelector('.c-field__error-message').innerHTML = input.getAttribute('data-validation-message');

                } else {
                    if (this.getFieldWrapper(input).querySelector('.c-field__error')) {
                        this.getFieldWrapper(input).querySelector('.c-field__error').remove();
                    }
                }

                if (input.closest('.c-filterselect')) {
                    let filterSelect = input.closest('.c-filterselect');
                    filterSelect.querySelector('.c-filterselect__options').addEventListener('click', (e) => {
                        form.dispatchEvent(formEmpty);
                    })
                }
            });
            const conditionsHandler = new Conditions(params);
            policyHandler.setListener(params?.form);
            collapseHandler.setListener(params?.form);
            checkboxHandler.setListener(params?.checkboxGroups);
            this.keyup(params.inputs);
            this.focusout(params.inputs);
            this.click(params, policyHandler);
            this.submit(params);

            form.addEventListener('formEmpty', () => {
                this.checkEmpty(inputs, form);
            });
        });
    }

    /* Handle validation */
    validateInput(input, submitCheck = false) {
        let valueLength = input.value ? input.value.length : 0;

        if (input.hasAttribute('js-no-validation')) {
            return;
        }

        if (input.type === 'checkbox' || input.type === 'radio') {
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
    keyup(inputs) {
        inputs.forEach(input => {
            input.addEventListener('keyup', () => {
                if (this.getFieldWrapper(input).classList.contains('is-invalid') || this.getFieldWrapper(input).classList.contains('is-valid')) {
                    this.validateInput(input);
                }
            })
        })
    }

    focusout(inputs) {
        const self = this;
        ['focusout', 'change'].forEach(function (e) {
            inputs.forEach(input => {
                input.addEventListener(e, () => {
                    self.validateInput(input)
                });
            });
        });
    }

    click({ form, inputs, checkboxGroups, checkboxHandler, policyHandler, fileinputHandler }) {
        const submitButton = form.querySelector('[type="submit"]');
        if (submitButton) {
            submitButton.addEventListener('click', (e) => {
                let containsInvalid = [];

                inputs.forEach(input => {
                    containsInvalid.push(this.validateInput(input, true));
                });

                containsInvalid.push(policyHandler.validatePolicy());
                containsInvalid.push(checkboxHandler.validateCheckboxes(checkboxGroups));
                containsInvalid.push(fileinputHandler.validateFileinputs(form));

                if (containsInvalid.includes(false)) {
                    this.classToggle(form, 'is-invalid', 'is-valid');

                    checkboxHandler.validateCheckboxes(checkboxGroups);


                    [...form.querySelectorAll('.c-form__notice-failed')].forEach(element => {
                        element.setAttribute('aria-hidden', false);
                    });

                    [...form.querySelectorAll('.c-form__notice-success')].forEach(element => {
                        element.setAttribute('aria-hidden', true);
                    });
                }
            });
        }
    }

    checkEmpty(inputs, form) {
        let emptyForm = false;
        let attatchedFiles = false;
        let checkInputs = [];
        let submitButton = form.querySelector('[type="submit"]');

        form.querySelectorAll('input[js-field-fileinput]') ? (form.querySelectorAll('input[js-field-fileinput]').length > 0 ? attatchedFiles = true : false) : attatchedFiles = false;

        inputs.forEach(input => {
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

        !emptyForm ? submitButton.disabled = true : submitButton.disabled = false;
        return emptyForm;
    }

    submit({ form, inputs, checkboxGroups, checkboxHandler, policyHandler, fileinputHandler }) {
        let submitButton = form.querySelector('[type="submit"]');

        form.addEventListener('submit', (e) => {
            if (!checkboxHandler.validateCheckboxes(checkboxGroups) || !fileinputHandler.validateFileinputs(form)) {
                e.preventDefault();
                this.classToggle(form, 'is-invalid', 'is-valid');
            } else {
                this.classToggle(form, 'is-valid', 'is-invalid');
                if (typeof formbuilder !== 'undefined') {
                    submitButton ? submitButton.innerHTML = formbuilder.sending : '';
                }
            }

            [...form.querySelectorAll('.c-form__notice-failed')].forEach(element => {
                element.setAttribute('aria-hidden', true);
            });

            [...form.querySelectorAll('.c-form__notice-success')].forEach(element => {
                element.setAttribute('aria-hidden', false);
            });
        });
    }

}

export default Fields;
