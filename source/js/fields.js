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
        this.setupFormValidate();
        this.fileInputOnChange();
    }

    createHiddenInput(visibileInput, filesMax, numberOfInputs, form) {
        const hiddenInput = visibileInput.cloneNode(true);

        hiddenInput.setAttribute('style', 'display:none');
        hiddenInput.setAttribute('js-field-fileinput', '');
        visibileInput.parentNode.insertBefore(hiddenInput, visibileInput.nextSibling);
        visibileInput.value = '';

        form.addEventListener('submit', (event) => {
            visibileInput.remove();
        });

        return hiddenInput;
    }

    createNotice(type, text, icon) {
        const notice = document.createElement('div');
        notice.classList.add('c-notice');
        notice.classList.add('c-notice--' + type);

        const noticeIcon = document.createElement('span');
        noticeIcon.classList.add('c-notice__icon')

        const iconItem = document.createElement('i');
        iconItem.classList.add('c-icon');
        iconItem.classList.add('c-icon--size-md');
        iconItem.classList.add('material-icons');
        iconItem.innerText = icon;

        noticeIcon.appendChild(iconItem);
        notice.appendChild(noticeIcon);

        notice.innerText = text;

        return notice;
    }

    /**
      * File input - List files to upload
      */
    fileInputOnChange() {

        const self = this;

        const fileInputs = document.querySelectorAll('.c-fileinput__input');
        const noticeText = (typeof formbuilder !== 'undefined') && formbuilder.files_max_exceeded ? formbuilder.files_max_exceeded : 'Max number of files exceeded';
        const notice = this.createNotice('danger', noticeText, 'report');

        fileInputs.forEach(input => {

            const dataTransfer = new DataTransfer();
            const filesMax = input.parentNode.getAttribute('filesmax') ? parseInt(input.parentNode.getAttribute('filesmax')) : -1;
			
            let countFilesUploaded = 0;
			
            if (input.hasAttribute('multiple')) {
                input.removeAttribute('multiple');
            }
            if (input.parentNode.hasAttribute('data-image-preview')) {
                this.setupImageDrop(input);
                this.setupImageReset(input);
            }
            input.addEventListener('change', function (e) {

                const targetElement = e.target;
                const parentElement = targetElement.parentNode;
                const currentFile = targetElement.files[0] || null;

                const maxFileSize = parentElement.hasAttribute('data-max-file-size') ? parseInt(parentElement.getAttribute('data-max-file-size')) : 0;
                const maxWidth = parentElement.hasAttribute('data-max-width') ? parseInt(parentElement.getAttribute('data-max-width')) : 0;
                const maxHeight = parentElement.hasAttribute('data-max-height') ? parseInt(parentElement.getAttribute('data-max-height')) : 0;

                // Validate file size, width, and height
                const validateFilesPromises = [];
                for (let i = 0; i < targetElement.files.length; i++) {
                    const file = targetElement.files[i];
                    validateFilesPromises.push(self.validateFile(file, maxFileSize, maxWidth, maxHeight));
                }

                Promise.all(validateFilesPromises)
                    .then(file => {
                        file.forEach(theFile => {
                            if (theFile instanceof Error) {
                                input.setCustomValidity(theFile);
                                input.reportValidity();
                            } else {
                                dataTransfer.items.add(theFile);
                            }
                        });
                    })
                    .catch(e => {
                        input.setCustomValidity(e);
                        input.reportValidity();
                    })
                    .finally(() => {

                        ++countFilesUploaded;
                        let uploadedFiles = Object.keys(dataTransfer.items).map((key) => [Number(key), dataTransfer.items[key].getAsFile()]);

                        const fileNameContainer = this.closest('.c-fileinput--area');
                        const form = input.closest('form');
                        const hasImagePreview = parentElement.hasAttribute('data-image-preview');

                        let hiddenInput;
                        if (!hasImagePreview) {
                            hiddenInput = self.createHiddenInput(input, filesMax, 0, form);
                        }

                        if ( filesMax != -1 && countFilesUploaded >= filesMax) {
                            input.setAttribute('disabled', 'true');
                        } else if (input.hasAttribute('disabled')) {
                            input.removeAttribute('disabled');
                        }

                        if (hasImagePreview) {
                            const imagePreviewId = parentElement.getAttribute('data-image-preview');
                            const imagePreviewElement = document.getElementById(imagePreviewId);
                            const imgElement = imagePreviewElement.querySelector('.c-imageinput__image');
                            const previewLabel = imagePreviewElement.querySelector('span');
                            const objectUrl = URL.createObjectURL(currentFile);

                            imgElement.style.backgroundImage = `url(${objectUrl})`;
                            imgElement.classList.remove('is-empty');

                            var image = new Image();
                            image.src = objectUrl;
                            image.onload = function () {
                                var height = this.height;
                                var width = this.width;
                                previewLabel.innerText = `${currentFile.name}, ${width}*${height}, ${self.returnFileSize(currentFile.size)}`;
                            };
                        }

                        if (filesMax == -1 || countFilesUploaded <= filesMax) {
                            const fileSize = self.returnFileSize(currentFile.size);

                            const list = fileNameContainer.querySelector('.js-form-file-input');
                            const template = list.querySelector('template');
                            template.content.querySelector('.js-file-input-name').innerHTML = currentFile.name;
                            template.content.querySelector('.js-file-input-size').innerHTML = ` (${fileSize})`;

                            const clone = template.content.cloneNode(true);
                            list.appendChild(clone);
                            list.classList.remove('u-display--none');

                            list
                                .querySelector('li:last-child')
                                .querySelector('.c-fileinput__remove-file')
                                .addEventListener('click', (clickedEl) => {

                                    if (!hasImagePreview) {
                                        hiddenInput.remove();
                                    }

                                    const currentListItem = clickedEl.target.parentElement;
                                    currentListItem.classList.add('u-border');

                                    uploadedFiles.forEach((item, index) => {
                                        if (index == uploadedFiles.length - 1) {
                                            uploadedFiles.splice(index, 1);
                                            currentListItem.remove();
                                            --countFilesUploaded;
                                        }
                                    })

                                    if (countFilesUploaded <= filesMax) {
                                        notice.remove();

                                        if (input.hasAttribute('disabled')) {
                                            input.removeAttribute('disabled');
                                        }
                                    }
                            })
                        }
                });
            });
        });
    }

    setupImageDrop(formInput) {
        const imagePreviewId = formInput.parentNode.getAttribute('data-image-preview');
        const imagePreviewArea = document.getElementById(imagePreviewId);
        if (imagePreviewArea) {
            imagePreviewArea.addEventListener('click', (e) => {
                e.stopPropagation();
                e.preventDefault();
                formInput.click();
            });
            imagePreviewArea.addEventListener('dragover', (e) => {
                e.stopPropagation();
                e.preventDefault();
                e.dataTransfer.dropEffect = 'copy';
            });
            imagePreviewArea.addEventListener('drop', (e) => {
                e.stopPropagation();
                e.preventDefault();
                formInput.files = e.dataTransfer.files;
                formInput.dispatchEvent(new Event('change'));
            });
        }
    }

    setupImageReset(formInput) {
        const imagePreviewId = formInput.parentNode.getAttribute('data-image-preview');
        const imagePreviewArea = document.getElementById(imagePreviewId);
        if (imagePreviewArea) {
            formInput.form.addEventListener('reset', function (e) {
                const imgElement = imagePreviewArea.querySelector('.c-imageinput__image');
                const previewLabel = imagePreviewArea.querySelector('span');
                imgElement.style.backgroundImage = '';
                previewLabel.innerText = '';
                imgElement.classList.add('is-empty');
            });
        }
    }

    /**
     * FileSize
     * @param number
     * @returns {string}
     */
    returnFileSize(number) {
        if (number < 1024) {
            return number + ' bytes';
        } else if (number >= 1024 && number < 1048576) {
            return (number / 1024).toFixed(1) + ' KB';
        } else if (number >= 1048576) {
            return (number / 1048576).toFixed(1) + ' MB';
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
        const self = this;
        const forms = document.querySelectorAll('.js-form-validation');
        forms.forEach(form => {
			const inputs = form.querySelectorAll('input, textarea, select');
			const submitButton = form.querySelector('[type="submit"]');
            const checkboxGroups = form.querySelectorAll('.checkbox-group-required');
            
            inputs.forEach(input => {
                if(input.hasAttribute('data-validation-message')) {
                    this.getFieldWrapper(input).querySelector('.c-field__error').setAttribute('aria-label', input.getAttribute('data-validation-message'));
                    this.getFieldWrapper(input).querySelector('.c-field__error-message').innerHTML = input.getAttribute('data-validation-message');

                } else {
                    if (this.getFieldWrapper(input).querySelector('.c-field__error')) {
                        this.getFieldWrapper(input).querySelector('.c-field__error').remove();
                    }
                }

                input.addEventListener('keyup', () => {
                    if (this.getFieldWrapper(input).classList.contains('is-invalid') || this.getFieldWrapper(input).classList.contains('is-valid')) {
                        self.validateInput(input);
                    }
                })
            });

            form.querySelectorAll('.checkbox-group-required').forEach(checkboxGroup => {
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

            // Validate fields on change
            ['focusout', 'change'].forEach(function(e) {
                inputs.forEach(input => {
                    input.addEventListener(e, () => {
                        self.validateInput(input) 
                    });
                });
            });

            form.addEventListener('invalid', (e) => {
                e.preventDefault();
                console.log(e.sourceElement);
            }, true);

            submitButton.addEventListener('click', (e) => {
                let containsInvalid = [];

                inputs.forEach(input => {
                    containsInvalid.push(this.validateInput(input, true));
                });

                containsInvalid.push(this.validateCheckboxes(checkboxGroups));

                if(containsInvalid.includes(false)) {
                   this.classToggle(form, 'is-invalid', 'is-valid');

                   this.validateCheckboxes(checkboxGroups);

                   [...form.querySelectorAll('.c-form__notice-failed')].forEach(element => {
                       element.setAttribute('aria-hidden', false);
                   });

                   [...form.querySelectorAll('.c-form__notice-success')].forEach(element => {
                       element.setAttribute('aria-hidden', true);
                   });
                }
            });

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

                if (!emptyForm || !this.validateCheckboxes(checkboxGroups)) {
					e.preventDefault();
                    this.classToggle(form, 'is-invalid', 'is-valid');
				} else {
					submitButton.innerHTML = formbuilder.sending;
                    this.classToggle(form, 'is-valid', 'is-invalid');
				}

                [...form.querySelectorAll('.c-form__notice-failed')].forEach(element => {
                    element.setAttribute('aria-hidden', true);
                }); 

                [...form.querySelectorAll('.c-form__notice-success')].forEach(element => {
                    element.setAttribute('aria-hidden', false);
                }); 
            }); 
        });
    }

    validateCheckboxes(checkboxGroups) {
        let hasChecked = [];
        checkboxGroups.forEach(group => {
            let validation = group.querySelector('[js-required]').getAttribute('checked') ? true : false;
            hasChecked.push(validation);
            if(!validation) { 
                group.querySelector('.c-field__label').classList.add('u-color__text--danger');

            } else {
                group.querySelector('.c-field__label').classList.remove('u-color__text--danger');
            }
        })
        
        return hasChecked.includes(false) ? false : true;
    }
    
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
  
    getImageDimensions(src) {
        return new Promise((resolve, reject) => {
            var image = new Image();
            image.onload = () => resolve({ width: image.width, height: image.height })
            image.onerror = reject
            image.src = src
        })
    }

    /**
     * 
     * @param {File} file 
     * @param {number} maxFileSize 
     * @param {number} maxWidth 
     * @param {number} maxHeight 
     * @returns {Promise<File|Error>}
     */
    validateFile(file, maxFileSize, maxWidth = 0, maxHeight = 0) {
        return new Promise((resolve, reject) => {
            return this.checkFileSize(file, maxFileSize)
                .then(() => this.checkImageDimensions(file, maxWidth, maxHeight))
                .then(() => resolve(file))
                .catch(reject);
        });
    }

    checkFileSize(file, maxFileSize) {
        return new Promise((resolve, reject) => {
            const fileSize = file.size / 1000; // Bytes to Kilobytes

            if (maxFileSize && fileSize > maxFileSize) {
                return reject(new Error('File size is too big. Maximum allowed file size is ' + maxFileSize + 'kb'));
            }
            resolve();
        });
    }

    checkImageDimensions(file, maxWidth, maxHeight) {
        return new Promise((resolve, reject) => {
            if (file['type'].split('/')[0] === 'image' && (maxWidth || maxHeight)) {
                const src = URL.createObjectURL(file);
                this.getImageDimensions(src).then(dimensions => {
                    if ((maxWidth && dimensions.width > maxWidth) || (maxHeight && dimensions.height > maxHeight)) {
                        return reject(new Error('Image dimensions are too big.'));
                    }
                    resolve();
                });
            } else {
                resolve();
            }
        });
    }
}

export default Fields;
