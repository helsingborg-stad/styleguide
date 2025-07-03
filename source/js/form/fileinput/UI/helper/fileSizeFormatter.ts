class FileSizeFormatter {
    /**
     * Format file size to a human-readable format.
     * This includes converting bytes to KB, MB, or GB as appropriate.
     * @param size number
     * @returns string
     */
    public format(size: number): string {
        const kb = 1024;
        const mb = kb * 1024;
        const gb = mb * 1024;

        if (size >= gb) {
            return `${(size / gb).toFixed(2)} GB`;
        }
        if (size >= mb) {
            return `${(size / mb).toFixed(2)} MB`;
        }
        if (size >= kb) {
            return `${(size / kb).toFixed(2)} KB`;
        }

        return `${size} B`;
    }
}

export default FileSizeFormatter;