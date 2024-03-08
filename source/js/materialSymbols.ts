export function initializeMaterialSymbols() {
    document.querySelectorAll('[material-symbol]').forEach((icon) => {
        const iconName = icon.getAttribute('material-symbol');
        if (iconName) {
            icon.innerHTML = iconName;
        }
    });
}