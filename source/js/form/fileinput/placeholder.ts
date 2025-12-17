import { FileInputController } from "./controller";

type FilePlaceholderData = {
    name: string;
    type: string;
    id: string;
    url: string;
    size: number;
};

declare global {
  interface Window {
    addFakeFileToInput: (fileData: FilePlaceholderData, input: HTMLInputElement) => void;
  }
}

class FilePlaceholderCreator {
    private static controllers: { [key: string]: FileInputController } = {};
    private static windowFunctionInitialized: boolean = false;

    public registerController(controller: FileInputController, input: HTMLInputElement): void {
        const key = this.getInputKey(input);

        if (!key) {
            console.error('FilePreviewStore: Input element must have an id or name attribute to register controller.');
            return;
        }

        FilePlaceholderCreator.controllers[key] = controller;
    }

    private getInputKey(input: HTMLInputElement): string | null {
        return input.id || input.name || null;
    }

    public getController(input: HTMLInputElement): FileInputController | null {
        const key = this.getInputKey(input);

        if (key && FilePlaceholderCreator.controllers[key]) {
            return FilePlaceholderCreator.controllers[key];
        }

        return null;
    }

    /**
     * Adds the global function to window object to add fake files.
     * 
     * @returns 
     */
    public async addWindowFunction() {
        if (FilePlaceholderCreator.windowFunctionInitialized) {
            return;
        }

        FilePlaceholderCreator.windowFunctionInitialized = true;

        window.addFakeFileToInput = async (fileData: FilePlaceholderData, input: HTMLInputElement) => {
            const controller = this.getController(input);
            if (!controller) {
                console.error('FilePlaceholderCreator: No controller registered for the provided input element.');
                return;
            }

            const fakeFile = new File([""], fileData.name, { type: fileData.type });
            (fakeFile as any).isPlaceholder = true;
            (fakeFile as any).id = fileData.id;
            (fakeFile as any).url = fileData.url;
            (fakeFile as any).fakeSize = fileData.size;

            controller.addFiles([fakeFile]);
        };
    }
}

export default FilePlaceholderCreator;