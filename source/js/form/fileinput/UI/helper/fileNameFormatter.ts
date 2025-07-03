class FileNameFormatter {
    /**
     * Format file name to a more readable format.
     * This includes replacing underscores and dashes with spaces,
     * and capitalizing the first letter of each word.
     * @param file string
     * @returns 
     */
    public format(file: string): string {
        // Split file into name and extension
        const lastDot = file.lastIndexOf('.');
        const namePart = lastDot !== -1 ? file.substring(0, lastDot) : file;
        const extension = lastDot !== -1 ? file.substring(lastDot) : '';

        // Replace underscores and dashes with spaces
        const cleanName = namePart.replace(/[_-]/g, ' ');

        // Normalize and capitalize each word
        const titleCased = cleanName
            .normalize('NFC') // Normalize combining characters
            .replace(/\p{L}+/gu, (word) =>
                word.charAt(0).toLocaleUpperCase() + word.slice(1)
            );

        return titleCased + extension;
    }
}

export default FileNameFormatter;