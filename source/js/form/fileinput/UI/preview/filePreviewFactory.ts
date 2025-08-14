import { FileInputController } from "../../controller";
import FileIdCreator from "../helper/fileIdCreator";
import FileNameFormatter from "../helper/fileNameFormatter";
import FileSizeFormatter from "../helper/fileSizeFormatter";
import FilePreviewCardRenderer from "./filePreviewCardRenderer";
import FilePreviewListRenderer from "./filePreviewListRenderer";
import PreviewCreator from "./previewCreator";

type CommonRendererConstructor = ConstructorParameters<typeof FilePreviewListRenderer>;

class FilePreviewFactory {
    public static createFilePreviewRenderer(
        controller: FileInputController,
        fileInput: HTMLElement,
        listArea: HTMLElement,
        previewTemplate: HTMLTemplateElement
    ): FilePreviewRenderer {
        const params: CommonRendererConstructor = [
            listArea,
            previewTemplate,
            controller,
            new FileNameFormatter(),
            new FileSizeFormatter(),
            new FileIdCreator()
        ]

        if (!!fileInput.dataset.jsFilePreview) {
            return new FilePreviewCardRenderer(...params, new PreviewCreator());
        }

        return new FilePreviewListRenderer(...params);
    }
}

export default FilePreviewFactory;