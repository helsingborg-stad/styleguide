import FileInput from "./form/fileInput";
import Checkbox from "./form/checkbox";

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
        //this.formValidationEventListerners();
        this.setupFormValidate();

        this.fileInput = new FileInput();
    }

    formValidationEventListerners() {
        const self = this;
        const inputs = document.querySelectorAll('input[required], textarea[required], select[required]');

        for (const formInput of inputs) {
            if (formInput.form?.classList.contains('js-form-validation')) {
                continue;
            }
            let inputId = formInput.getAttribute('id');

            // On Click event listener - Setting data
            document.getElementById(inputId).addEventListener('click', function (e) {
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

    setupFormValidate() {
        const forms = document.querySelectorAll('.js-form-validation');
        const checkboxHandler = new Checkbox();
        
        forms.forEach(form => {
            const inputs = form.querySelectorAll('input, textarea, select');
            const checkboxGroups = form.querySelectorAll('.checkbox-group-required');
            const params = {form, inputs, checkboxHandler, checkboxGroups};

            inputs.forEach(input => {
                if(input.hasAttribute('data-validation-message')) {
                    this.getFieldWrapper(input).querySelector('.c-field__error').setAttribute('aria-label', input.getAttribute('data-validation-message'));
                    this.getFieldWrapper(input).querySelector('.c-field__error-message').innerHTML = input.getAttribute('data-validation-message');

                } else {
                    if (this.getFieldWrapper(input).querySelector('.c-field__error')) {
                        this.getFieldWrapper(input).querySelector('.c-field__error').remove();
                    }
                }
            });
            checkboxHandler.setListener(checkboxGroups);
            this.keyup(params);
            this.focusout(params);
            this.click(params);
            this.submit(params);
        });
    }
    
    /* Handle validation */
    validateInput(input, submitCheck = false) {
        let valueLength = input.value ? input.value.length : 0; 

        if(input.type === 'checkbox') {
            return;
        } 
        
        if (['date', 'week', 'month', 'time'].indexOf(input.type) != -1) {
            valueLength = 1;
        }

        if (valueLength > 0 || submitCheck) {
            if(input.hasAttribute('required')) {
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
            if(fieldWrapper.parentNode !== document.body) {
                fieldWrapper = fieldWrapper.parentNode;
            } else {
                return input;
            }
        } while(!fieldWrapper.matches('.c-field, .c-option, .c-select'));

        return fieldWrapper;    
    }

    /*  Listeners  */
    keyup({ form, inputs, checkboxHandler, checkboxGroups }) {
        inputs.forEach(input => {
            input.addEventListener('keyup', () => {
                if (this.getFieldWrapper(input).classList.contains('is-invalid') || this.getFieldWrapper(input).classList.contains('is-valid')) {
                    this.validateInput(input);
                }
            })
        })
    }

    focusout({ form, inputs, checkboxHandler, checkboxGroups }) {
        const self = this;
        ['focusout', 'change'].forEach(function (e) {
            inputs.forEach(input => {
                input.addEventListener(e, () => {
                    self.validateInput(input)
                });
            });
        });
    }

    click({ form, inputs, checkboxHandler, checkboxGroups }) {
        const submitButton = form.querySelector('[type="submit"]');

        submitButton.addEventListener('click', (e) => {
            let containsInvalid = [];

            inputs.forEach(input => {
                containsInvalid.push(this.validateInput(input, true));
            });

            containsInvalid.push(checkboxHandler.validateCheckboxes(checkboxGroups));

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

    submit({ form, inputs, checkboxHandler, checkboxGroups }) {
        form.addEventListener('submit', (e) => {
            let emptyForm = false;
            let attatchedFiles = false;

            form.querySelectorAll('input[js-field-fileinput]') ? (form.querySelectorAll('input[js-field-fileinput]').length > 0 ? attatchedFiles = true : false) : attatchedFiles = false;

            inputs.forEach(input => {
                if (!input.classList.contains('js-no-validation')) {
                    if (input.getAttribute('type') !== 'hidden') {
                        (input.value.length > 0 || attatchedFiles) ? emptyForm = true : '';
                    }
                }
                this.validateInput(input);
            });

            if (!emptyForm || !checkboxHandler.validateCheckboxes(checkboxGroups)) {
                e.preventDefault();
                this.classToggle(form, 'is-invalid', 'is-valid');
            } else {
                submitButton ? submitButton.innerHTML = formbuilder.sending : '';
                this.classToggle(form, 'is-valid', 'is-invalid');
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
