export function removeClusterGroupTabIndex(container: HTMLElement) {
    const observe = () => {
        const mapContainer = container.querySelector('.c-openstreetmap__map');
        const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                if (mutation.type === 'childList') {
                    mutation.addedNodes.forEach((addedNode) => {
                        if (
                            addedNode instanceof HTMLElement &&
                            (addedNode.classList?.contains('c-openstreetmap__icon') ||
                                addedNode.classList?.contains('marker-cluster'))
                        ) {
                            addedNode.setAttribute('tabindex', '-1');
                        }
                    });
                }
            });
        });
        if (!mapContainer) return;
        observer.observe(mapContainer, { childList: true, subtree: true });
    };

    observe();
}
