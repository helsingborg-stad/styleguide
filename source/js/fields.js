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
        const inputs = document.querySelectorAll('.c-fileinput__input');
        const noticeText = (typeof formbuilder !== 'undefined') && formbuilder.files_max_exceeded ? formbuilder.files_max_exceeded : 'Max number of files exceeded';
        const notice = this.createNotice('danger', noticeText, 'report');

        // Removing multiple attribute as this JS will handle that for the browser
        inputs.forEach(input => {
            if (input.hasAttribute('multiple')) {
                input.removeAttribute('multiple');
            }
        });

        for (const formInput of inputs) {
            if (formInput.parentNode.hasAttribute('data-image-preview')) {
                this.setupImageDrop(formInput);
            }
            formInput.addEventListener('change', function (e) {
                const parentElement = e.target.parentNode;

                if (e.target.files && e.target.files[0]) {
                    const fileNameContainer = this.closest('div').querySelector('ul');
                    const clone = e.target.cloneNode(false);
                    const form = formInput.closest('form');
                    const filesMax = form.querySelector('.c-fileinput--area').getAttribute('filesMax');
                    const hiddenInput = self.createHiddenInput(formInput, filesMax, 0, form);
                    const addedFiles = form.querySelectorAll('input[js-field-fileinput]').length;

                    if (addedFiles == filesMax) {
                        formInput.setAttribute('disabled', 'true')
                    } else if (formInput.hasAttribute('disabled')) {
                        formInput.removeAttribute('disabled')
                    }

                    if (parentElement.hasAttribute('data-image-preview')) {
                        const imagePreviewId = parentElement.getAttribute('data-image-preview');
                        const imagePreviewElement = document.getElementById(imagePreviewId);
                        const imgElement = imagePreviewElement.querySelector('img');
                        const previewLabel = imagePreviewElement.querySelector('span');
                        imgElement.src = URL.createObjectURL(clone.files[0]);
                        imgElement.classList.remove('u-visibility--hidden');

                        var image = new Image();
                        image.src = URL.createObjectURL(clone.files[0]);
                        image.onload = function () {
                            var height = this.height;
                            var width = this.width;
                            previewLabel.innerText = `${clone.files[0].name}, ${width}*${height}, ${self.returnFileSize(clone.files[0].size)}`;
                            imagePreviewElement.querySelector('.c-imageinput__image').style = `height: ${height}px;`;
                        };
                    }

                    for (let int = 0; int < filesMax; int++) {
                        const createListElement = document.createElement('li');
                        const listElement = fileNameContainer.appendChild(createListElement);
                        const fileSize = self.returnFileSize(clone.files[int].size);
                        listElement.innerHTML = '<i class="c-icon c-icon--size-sm material-icons">' +
                            'attach_file</i><span class="c-icon__label c-icon__label--size"> ' + fileSize + ', </span> <span class="c-icon__label"><b>' + clone.files[int].name + '</b></span> <i class="c-icon c-fileinput__remove-file c-icon--size-lg  material-icons">delete</i>';

                        listElement.querySelector('.c-fileinput__remove-file').addEventListener('click', () => {
                            hiddenInput.remove();
                            listElement.remove();

                            if (addedFiles <= filesMax) {
                                notice.remove()

                                if (formInput.hasAttribute('disabled')) {
                                    formInput.removeAttribute('disabled')
                                }
                            }
                        })
                    }
                }
            });
        }
    }

    setupImageDrop(formInput) {
        const imagePreviewId = formInput.parentNode.getAttribute('data-image-preview');
        const imagePreviewArea = document.getElementById(imagePreviewId);
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