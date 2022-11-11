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
				this.setupImageReset(formInput);
			}
			formInput.addEventListener('change', function (e) {

				const targetElement = e.target;
				const parentElement = targetElement.parentNode;

				const currentFile = formInput.files[0] || null;

				const maxFileSize = parentElement.hasAttribute('data-max-file-size') ? parseInt(parentElement.getAttribute('data-max-file-size')) : 0;
				const maxWidth = parentElement.hasAttribute('data-max-width') ? parseInt(parentElement.getAttribute('data-max-width')) : 0;
				const maxHeight = parentElement.hasAttribute('data-max-height') ? parseInt(parentElement.getAttribute('data-max-height')) : 0;
				const dataTransfer = new DataTransfer();

				// Validate file size, width, and height
				const validateFilesPromises = [];
				for (let i = 0; i < targetElement.files.length; i++) {
					const file = targetElement.files[i];
					validateFilesPromises.push(self.validateFile(file, maxFileSize, maxWidth, maxHeight));
				}

				Promise.all(validateFilesPromises).then(files => {
					files.forEach(file => {
						if (file instanceof Error) {
							formInput.setCustomValidity(file);
							formInput.reportValidity();
						} else {
							dataTransfer.items.add(file)
						}
					});
				}).catch(e => {
					formInput.setCustomValidity(e);
					formInput.reportValidity();
				}).finally(() => {

					if (currentFile) {

						const fileNameContainer = this.closest('.c-fileinput--area'); 

						const form = formInput.closest('form');
						const filesMax = form.querySelector('.c-fileinput--area').getAttribute('filesMax');
						const hasImagePreview = parentElement.hasAttribute('data-image-preview');

						let hiddenInput;
						if (!hasImagePreview) {
							hiddenInput = self.createHiddenInput(formInput, filesMax, 0, form);
						}
						const addedFiles = form.querySelectorAll('input[js-field-fileinput]').length;

						if (addedFiles >= filesMax) {
							formInput.setAttribute('disabled', 'true')
						} else if (formInput.hasAttribute('disabled')) {
							formInput.removeAttribute('disabled')
						}

						if (hasImagePreview) {
							const imagePreviewId = parentElement.getAttribute('data-image-preview');
							const imagePreviewElement = document.getElementById(imagePreviewId);
							const imgElement = imagePreviewElement.querySelector('.c-imageinput__image');
							const previewLabel = imagePreviewElement.querySelector('span');
							const objectUrl = URL.createObjectURL(currentFile);

							imgElement.style.backgroundImage = "url('" + objectUrl + "')";
							imgElement.classList.remove('is-empty');

							var image = new Image();
							image.src = objectUrl;
							image.onload = function () {
								var height = this.height;
								var width = this.width;
								previewLabel.innerText = `${currentFile.name}, ${width}*${height}, ${self.returnFileSize(currentFile.size)}`;
							};
						}

						if (addedFiles <= filesMax) {

							const el = document.createElement('ul');
							el.classList.add('u-margin__top--1', 'u-padding--1');

							const fileSize = self.returnFileSize(currentFile.size);

							el.innerHTML = '<li><i class="c-icon c-icon--size-sm material-icons">' +
								'attach_file</i><span class="u-strong">' + currentFile.name + '</span> <span class="">(' + fileSize + ')</span>  <i class="c-fileinput__remove-file c-icon c-icon--size-md material-icons u-position--absolute">delete</i></li>';

							el.querySelector('.c-fileinput__remove-file').addEventListener('click', () => {
								if (!hasImagePreview) {
									hiddenInput.remove();
								}
								el.remove();

								if (addedFiles <= filesMax) {
									notice.remove()

									if (formInput.hasAttribute('disabled')) {
										formInput.removeAttribute('disabled')
									}
								}
							})

							fileNameContainer.appendChild(el);
						}

					}

				});
			});
		}
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

			inputs.forEach(input => {
				if (input.hasAttribute('data-validation-message')) {
					this.getFieldWrapper(input).querySelector('.c-field__error').innerHTML = input.getAttribute('data-validation-message');

					input.addEventListener('keyup', () => {
						if (this.getFieldWrapper(input).classList.contains('is-invalid') || this.getFieldWrapper(input).classList.contains('is-valid')) {
							self.validateInput(input);
						}
					})
				}
			});

			// Validate fields on change
			['focusout', 'change'].forEach(function (e) {
				inputs.forEach(input => {
					input.addEventListener(e, () => self.validateInput(input));
				});
			});

            //General validation errors
            form.addEventListener('invalid', (e) => {
                form.classList.add('is-invalid');
                form.classList.remove('is-valid');

                
                [...form.querySelectorAll('.c-form__notice-failed')].forEach(element => {
                    element.setAttribute('aria-hidden', false);
                }); 

                [...form.querySelectorAll('.c-form__notice-success')].forEach(element => {
                    element.setAttribute('aria-hidden', true);
                }); 

            }, true);

            form.addEventListener('submit', (e) => {
                form.classList.add('is-valid');
                form.classList.remove('is-invalid');

                [...form.querySelectorAll('.c-form__notice-failed')].forEach(element => {
                    element.setAttribute('aria-hidden', true);
                }); 

                [...form.querySelectorAll('.c-form__notice-success')].forEach(element => {
                    element.setAttribute('aria-hidden', false);
                }); 
            }); 
        });
    }

	classToggle(firstElement, addClass, removeClass, secondElement, ariaHidden) {
		!firstElement.classList.contains(addClass) ? firstElement.classList.add(addClass) : '';
		firstElement.classList.remove(removeClass);

		if (ariaHidden) {
			firstElement.setAttribute('aria-hidden', 'false');
			secondElement ? secondElement.setAttribute('aria-hidden', 'true') : '';
		}

		if (secondElement) {
			!secondElement.classList.contains(removeClass) ? secondElement.classList.add(removeClass) : '';
			secondElement.classList.remove(addClass);
		}
	}

	validateInput(input) {
		if (input.value.length > 0) {
			if (input.checkValidity()) {
				this.classToggle(this.getFieldWrapper(input), 'is-valid', 'is-invalid');
			} else {
				this.classToggle(this.getFieldWrapper(input), 'is-invalid', 'is-valid');
			}
		} else {
			this.getFieldWrapper(input).classList.remove('is-valid', 'is-invalid');
		}
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
