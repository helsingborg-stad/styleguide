export function initializeMaterialSymbols() {
    fontHasBeenLoaded().then((isLoaded) => {
        if (isLoaded) {
            document.querySelectorAll('[material-symbol]').forEach((icon) => {
                const iconName = icon.getAttribute('material-symbol');
                if (iconName) {
                    icon.innerHTML = iconName;
                }
            });
        }
    });
}

function fontHasBeenLoaded(): Promise<boolean> {
    return new Promise(resolve => {
        document.fonts.ready.then(fontFaces => {
            let fontLoaded = false;
            fontFaces.forEach(fontFace => {
                if (fontFace.family === 'Material Symbols Outlined') {
                    fontLoaded = true;
                }
            });
            resolve(fontLoaded);
        });
    });
}