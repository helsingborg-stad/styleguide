export function getLoadedFonts(): Promise<string[]> {
    return new Promise(resolve => {
        document.fonts.ready.then(fontFaces => {
            const loadedFonts: string[] = [];
            fontFaces.forEach(fontFace => {
                loadedFonts.push(fontFace.family);
            });
            resolve(loadedFonts);
        });
    });
}
