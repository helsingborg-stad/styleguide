function setIconName(icon: HTMLElement) {
    const iconName = icon.getAttribute('material-symbol');
    if (iconName) {
        icon.innerHTML += iconName;
    }
}

export function initializeMaterialSymbols(loadedFonts: Promise<string[]>): void {
    loadedFonts.then(fonts => {
        if (fonts.includes('Material Symbols Outlined')) {
            observer();

            document.querySelectorAll('[material-symbol]').forEach((icon) => {
                setIconName(icon as HTMLElement);
            });
        }
    })
}

function observer() {
    const observer = new MutationObserver((mutationsList, observer) => {
        for (const mutation of mutationsList) {
            if (mutation.type === 'childList') {
                mutation.addedNodes.forEach((node) => {
                    if (node instanceof HTMLElement) {
                        const icons = node.querySelectorAll('[material-symbol]');
                        icons.forEach((icon) => {
                            setIconName(icon as HTMLElement);
                        });
                    }
                });
            }
        }
    });

    observer.observe(document.body, { childList: true, subtree: true });
}
