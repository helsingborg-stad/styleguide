class PreviewCreator {
    createPreview(file: File): HTMLElement|null {
        const fileType = file.type || 'unknown';
        const url = URL.createObjectURL(file);

        if (fileType.startsWith('image/')) {
            return this.createImagePreview(url);
        } else if (fileType.startsWith('video/')) {
            return this.createVideoPreview(url);
        } else if (fileType.startsWith('audio/')) {
            return this.createAudioPreview(url);
        } else if (fileType === 'application/pdf') {
            return this.createPdfPreview(url);
        } else {
            return null;
        }
    }

    private createImagePreview(url: string): HTMLElement {
        const image = document.createElement('img');
        image.src = url;

        return image;
    }

    private createVideoPreview(url: string): HTMLElement {
        const video = document.createElement('video');
        video.src = url;
        video.controls = true;

        return video;
    }

    private createAudioPreview(url: string): HTMLElement {
        const audio = document.createElement('audio');
        audio.src = url;
        audio.controls = true;

        return audio;
    }

    private createPdfPreview(url: string): HTMLElement {
        const pdfFrame = document.createElement('iframe');
        pdfFrame.src = url;
        pdfFrame.style.width = '100%';
        pdfFrame.style.height = '100%';
        pdfFrame.style.border = 'none';

        return pdfFrame;
    }
}

export default PreviewCreator;