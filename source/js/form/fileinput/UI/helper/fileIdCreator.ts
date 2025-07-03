class FileIdCreator {
    /**
     * Create a unique ID for the file based on its properties.
     * This is used to identify files in the list.
     * 
     * @param file  File
     * @returns string
     */
    public create(file: File): string {
        const fileSignature = `${file.name}-${file.size}-${file.type}-${file.lastModified}`;
        return this.simpleHash(fileSignature);
    }

    /**
     * Generate a simple hash from the input string.
     * 
     * @param input string
     * @returns string
     */
    private simpleHash(input: string): string {
        let hash = 0;
        for (let i = 0; i < input.length; i++) {
            const char = input.charCodeAt(i);
            hash = (hash << 5) - hash + char;
            hash |= 0;
        }
        return hash.toString(16);
    }
}

export default FileIdCreator;