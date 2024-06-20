import L, { Layer, Map as LeafletMap, Marker, MarkerClusterGroup } from 'leaflet';

class AddEndpointPosts {
    constructor(private container: HTMLElement, map: LeafletMap, markers: MarkerClusterGroup) {
        const sidebar = this.container.querySelector('[data-js-pagination-container]');
        console.log(sidebar);
        if (sidebar) {
            this.listenForPostsAdded(sidebar as HTMLElement);
        }
    }

    private listenForPostsAdded(sidebar: HTMLElement) {
        this.container.addEventListener('postsAdded', (e: Event) => {
            const customEvent = e as CustomEvent;
            console.log(customEvent.detail)
            if (customEvent.detail && customEvent.detail.length > 0) {
                sidebar.innerHTML = customEvent.detail.join('');
            }
        });
    }
}

export default AddEndpointPosts;