import { FileInputController } from "../../controller";
import FileIdCreator from "../helper/fileIdCreator";
import FileNameFormatter from "../helper/fileNameFormatter";
import FileSizeFormatter from "../helper/fileSizeFormatter";

class FilePreviewCardRenderer implements FilePreviewRenderer {
    constructor(
        private listArea: HTMLElement,
        private itemTemplate: HTMLTemplateElement,
        private controller: FileInputController,
        private fileNameFormatter: FileNameFormatter,
        private fileSizeFormatter: FileSizeFormatter,
        private fileIdCreator: FileIdCreator
    ) {
    }

    add(file: File): void {
        // Implementation for rendering the file preview card
        // This will use the controller, dropzone, listArea, and template to create the preview
    }

    remove(file: File): void {
        // Implementation for removing the file preview card
        // This will use the controller to find and remove the file from the list
    }
}

export default FilePreviewCardRenderer;