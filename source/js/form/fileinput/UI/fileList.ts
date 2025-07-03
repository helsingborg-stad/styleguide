import { FileInputController } from "../controller";

class FileList {
    constructor(
        private controller: FileInputController,
        private filePreviewRenderer: FilePreviewRenderer
    ) {
    }

    /**
     * Setup the file list UI, synchronizing with the controller.
     * This includes adding and removing files from the list.
     * 
     * @returns {void}
     */
    public init(): void {
        this.controller.onFileAdded((file) => {
            this.filePreviewRenderer.add(file);
        });

        this.controller.onFileRemoved((file) => {
            this.filePreviewRenderer.remove(file);
        });
    }
}

export default FileList;