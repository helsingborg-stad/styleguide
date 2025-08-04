import Notice from "./notice";

export class FileInputDropzone {
    private dragCounter = 0;
    private invalidFilesClass = 'invalid-files';

    constructor(
        private dropzone: HTMLElement,
        private noticeHandler: Notice,
        private input: HTMLInputElement
    ) {
        this.registerEvents();
    }

    /**
     * Register drag and drop events on the dropzone
     */
    private registerEvents() {
        ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(event => {
            this.dropzone.addEventListener(event, (e) => e.preventDefault());
        });

        this.dropzone.addEventListener('dragenter', () => {
            this.dragCounter++;
            this.setDragging(true);
        });

        this.dropzone.addEventListener('dragleave', () => {
            this.dragCounter--;
            if (this.dragCounter <= 0) {
                this.setDragging(false);
            }
        });

        this.dropzone.addEventListener('drop', (e) => {
            this.dragCounter = 0;
            this.setDragging(false);
            this.handleDrop(e);
        });
    }

    /**
     * Set the dragging state of the dropzone
     * @param isDragging 
     */
    private setDragging(isDragging: boolean) {
        this.dropzone.classList.toggle('is-dragging', isDragging);
    }

    /**
     * Handle the drop event
     * @param event 
     */
    private handleDrop(event: DragEvent) {
        if (!event.dataTransfer?.files.length) {
            return;
        }

        //If input (this.input) is full, prevent drop.
        const fileCount = this.input.files ? this.input.files.length : 0;
        const maxFiles = this.input.hasAttribute('multiple') ? Infinity : 1;
        if (fileCount >= maxFiles) {
            event.preventDefault();
            return;
        }


        const droppedFiles = Array.from(event.dataTransfer.files);

        const [validFiles, invalidFiles] = this.filterAcceptedFiles(droppedFiles);
        this.noticeHandler.hideNotice(); // Hide previous notice
        if (invalidFiles.length) {
            this.dropzone.classList.add(this.invalidFilesClass);
            this.handleInvalidFiles(invalidFiles);
        } else {
            this.dropzone.classList.remove(this.invalidFilesClass);
        }

        if (!validFiles.length) return;

        const finalFiles = this.limitFilesByMultiple(validFiles);

        const dataTransfer = new DataTransfer();
        finalFiles.forEach(file => dataTransfer.items.add(file));
        this.input.files = dataTransfer.files;

        const eventChange = new Event('change', { bubbles: true });
        this.input.dispatchEvent(eventChange);
    }

    private handleInvalidFiles(files: File[]) {
        this.noticeHandler.showNotice(files);
    }

    private filterAcceptedFiles(files: File[]): [File[], File[]] {
        const acceptAttr = this.input.accept;
        if (!acceptAttr) return [files, []];

        const acceptedTypes = acceptAttr
            .split(',')
            .map(type => type.trim().toLowerCase());

        const validFiles: File[] = [];
        const invalidFiles: File[] = [];

        files.forEach(file => {
            const fileType = file.type.toLowerCase();
            const fileExt = '.' + file.name.split('.').pop()?.toLowerCase();

            const isValid = acceptedTypes.some(accept => {
                if (accept.startsWith('.')) return fileExt === accept;
                if (accept.endsWith('/*')) return fileType.startsWith(accept.replace('/*', ''));
                return fileType === accept;
            });

            if (isValid) {
                validFiles.push(file);
            } else {
                invalidFiles.push(file);
            }
        });

        return [validFiles, invalidFiles];
    }

    /**
     * Limit the number of files to be uploaded
     * @param files 
     * @returns 
     */
    private limitFilesByMultiple(files: File[]): File[] {
        return this.input.hasAttribute('multiple') ? files : files.slice(0, 1);
    }
}