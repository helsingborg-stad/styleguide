class Fields {
    
    constructor() {                
        this.form = document.getElementsByTagName('form')[0];
        this.formElement = null;
        this.formElementType = null;
        this.formElementPattern = null;
        this.formElementRequired = null;
        this.formElementDataInvalid = null;
        this.formElementDataInvalid = null;
        
        this.formValidationEventListerners();
        this.fileInputOnChange();
    }

    createHiddenInput(visibileInput, filesMax, numberOfInputs, form) {
        const hiddenInput = visibileInput.cloneNode(true);

        if(numberOfInputs == filesMax || visibileInput.files.length >= filesMax) {
            visibileInput.setAttribute('disabled', 'true')
        }
        
        hiddenInput.setAttribute('style', 'display:none');
        visibileInput.parentNode.insertBefore(hiddenInput, visibileInput.nextSibling);
        visibileInput.value = '';                    

        form.addEventListener('submit', (event) => {
            visibileInput.remove();                
        });

        return hiddenInput;
    }
    
    
    /**
     * File input - List files to upload
     */
    fileInputOnChange() {
        
        const self = this;
        const inputs = document.querySelectorAll('.c-fileinput__input');
        
        for (const formInput of inputs) {
            
            formInput.addEventListener('change', function (e) {
                if (e.target.files && e.target.files[0]) {                    
                    const findContainer = this.closest('div').querySelector('ul');
                    const fileNameContainer = findContainer.getAttribute('id');
                    const clone = e.target.cloneNode(false);
                    const form = formInput.closest('form');
                    const numberOfInputs = form.querySelector('.c-fileinput--area').querySelectorAll('.c-fileinput__input[style="display:none"').length;
                    const filesMax = form.querySelector('.c-fileinput--area').getAttribute('filesMax');
                    const hiddenInput = self.createHiddenInput(formInput, filesMax, numberOfInputs, form);

                    for (let int = 0; int < Math.abs(filesMax - numberOfInputs); int++) {
                        const createListElement = document.createElement('li');
                        const listelement = document.getElementById(fileNameContainer).appendChild(createListElement);
                        const fileSize = self.returnFileSize(clone.files[int].size);
                        listelement.innerHTML = '<i class="c-icon c-icon--size-sm material-icons">' +
                        'attach_file</i><span class="c-icon__label c-icon__label--size"> '+fileSize +', </span> <span class="c-icon__label"><b>' + clone.files[int].name + '</b></span> <i class="c-icon c-fileinput__remove-file c-icon--size-lg  material-icons">delete</i>';

                        listelement.querySelector('.c-fileinput__remove-file').addEventListener('click', () => {
                            hiddenInput.remove();
                            listelement.remove();

                            if(numberOfInputs < filesMax) {
                                formInput.removeAttribute('disabled')
                            }
                        })
                    }
                }
            });
        }
    }
    
    /**
     * FileSize
     * @param number
     * @returns {string}
     */
    returnFileSize(number) {
        if(number < 1024) {
            return number + ' bytes';
        } else if(number >= 1024 && number < 1048576) {
            return (number/1024).toFixed(1) + ' KB';
        } else if(number >= 1048576) {
            return (number/1048576).toFixed(1) + ' MB';
        }
    }
    
    /**
     * A simple input validation matcing input value with value
     * Listerners Click and change
     */
    formValidationEventListerners() {
        
        const self = this;
        const inputs = document.querySelectorAll('input[required], textarea[required], select[required]');
        
        for (const formInput of inputs) {
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
}

export default Fields;