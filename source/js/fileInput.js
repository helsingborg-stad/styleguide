class FileInput {
    constructor() {

        this.fileInputOnChange();
    }

    fileInputOnChange() {

        const self = this;

        const fileInputs = document.querySelectorAll('.c-fileinput__input');

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

                        if (filesMax != -1 && countFilesUploaded >= filesMax) {
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

    getImageDimensions(src) {
        return new Promise((resolve, reject) => {
            var image = new Image();
            image.onload = () => resolve({ width: image.width, height: image.height })
            image.onerror = reject
            image.src = src
        })
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

export default FileInput;