class FileInput {
    constructor(form) {
        if (!form) return;

        this.form = form;
        this.initFileInputs();
    }

    initFileInputs() {
        const fileInputs = this.form.querySelectorAll('[data-js-file="input"]');
        fileInputs.forEach((input) => this.setupInput(input));
    }

    setupInput(input) {
        const parent = input.closest('.c-fileinput--area') || input.parentNode;
        const filesMax = parseInt(parent.getAttribute('filesmax')) || -1;
        const maxFileSize = parseInt(parent.getAttribute('data-max-file-size')) || 0;
        const maxWidth = parseInt(parent.getAttribute('data-max-width')) || 0;
        const maxHeight = parseInt(parent.getAttribute('data-max-height')) || 0;
        const hasImagePreview = parent.hasAttribute('data-image-preview');

        if (input.hasAttribute('multiple')) input.removeAttribute('multiple');

        const dataTransfer = new DataTransfer();
        let uploadedCount = 0;

        const updatePreview = (file) => {
            const previewId = parent.getAttribute('data-image-preview');
            const previewEl = document.getElementById(previewId);
            if (!previewEl) return;

            const objectUrl = URL.createObjectURL(file);
            const img = previewEl.querySelector('.c-imageinput__image');
            const label = previewEl.querySelector('span');

            img.style.backgroundImage = `url(${objectUrl})`;
            img.classList.remove('is-empty');

            const tempImg = new Image();
            tempImg.src = objectUrl;
            tempImg.onload = () => {
                label.textContent = `${file.name}, ${tempImg.width}×${tempImg.height}, ${this.returnFileSize(file.size)}`;
            };
        };

        const addToList = (file) => {
            const list = parent.querySelector('[data-js-file="list"]');
            const template = parent.querySelector('template').content.querySelector('ul').cloneNode(true);

            template.querySelector('[data-js-file="input-name"]').textContent = file.name;
            template.querySelector('[data-js-file="input-size"]').textContent = ` (${this.returnFileSize(file.size)})`;

            const listItem = template.querySelector('[data-js-file="listitem"]');
            listItem.querySelector('[data-js-file="remove"]').addEventListener('click', () => {
                listItem.remove();
                uploadedCount--;
                input.removeAttribute('disabled');
            });

            list.appendChild(template);
            list.classList.remove('u-display--none');
        };

        const handleFiles = async (files) => {
            for (const file of files) {
                try {
                    await this.validateFile(file, maxFileSize, maxWidth, maxHeight);
                    dataTransfer.items.add(file);
                    if (hasImagePreview) updatePreview(file);
                    addToList(file);

                    uploadedCount++;
                    if (filesMax !== -1 && uploadedCount >= filesMax) {
                        input.setAttribute('disabled', 'true');
                        break;
                    }
                } catch (err) {
                    input.setCustomValidity(err.message);
                    input.reportValidity();
                }
            }
        };

        // 🔁 Input change (from click-based file selection)
        input.addEventListener('change', (e) => {
            const files = Array.from(e.target.files);
            parent.querySelector('[data-js-file="label"]').classList.remove('u-color__text--danger');
            handleFiles(files);
        });

        // 🖱 Setup click-to-trigger from preview
        if (hasImagePreview) {
            const previewEl = document.getElementById(parent.getAttribute('data-image-preview'));
            previewEl?.addEventListener('click', (e) => {
                e.preventDefault();
                input.click();
            });

            // 🧼 Reset image preview on form reset
            input.form?.addEventListener('reset', () => {
                const img = previewEl.querySelector('.c-imageinput__image');
                const label = previewEl.querySelector('span');
                img.style.backgroundImage = '';
                label.textContent = '';
                img.classList.add('is-empty');
            });

            // 📥 Handle file drop
            previewEl?.addEventListener('dragover', (e) => {
                e.preventDefault();
                e.dataTransfer.dropEffect = 'copy';
            });

            previewEl?.addEventListener('drop', (e) => {
                e.preventDefault();
                const droppedFiles = Array.from(e.dataTransfer.files);
                handleFiles(droppedFiles);
            });
        }
    }

    validateFile(file, maxFileSize, maxWidth, maxHeight) {
        return new Promise((resolve, reject) => {
            if (maxFileSize && file.size / 1000 > maxFileSize) {
                return reject(new Error(`File too large. Max: ${maxFileSize}kb`));
            }

            if (file.type.startsWith('image') && (maxWidth || maxHeight)) {
                const img = new Image();
                const objectUrl = URL.createObjectURL(file);
                img.src = objectUrl;
                img.onload = () => {
                    if ((maxWidth && img.width > maxWidth) || (maxHeight && img.height > maxHeight)) {
                        reject(new Error(`Image too large. Max: ${maxWidth}x${maxHeight}`));
                    } else {
                        resolve(file);
                    }
                };
                img.onerror = reject;
            } else {
                resolve(file);
            }
        });
    }

    returnFileSize(bytes) {
        if (bytes < 1024) return `${bytes} bytes`;
        if (bytes < 1048576) return `${(bytes / 1024).toFixed(1)} KB`;
        return `${(bytes / 1048576).toFixed(1)} MB`;
    }

    validateFileinputs(form, inputs) {
        let allValid = true;
        form.querySelectorAll('.c-fileinput').forEach(fileupload => {
            const requiredInput = fileupload.querySelector('input[required]');
            if (!requiredInput) return;

            const hasFile = fileupload.querySelector('li') !== null;
            const label = fileupload.querySelector('.c-fileinput__label');
            label.classList.toggle('u-color__text--danger', !hasFile);
            if (!hasFile) allValid = false;
        });
        return allValid;
    }
}