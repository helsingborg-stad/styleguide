import L, { Layer, Map as LeafletMap, Marker, MarkerClusterGroup } from 'leaflet';

class AddEndpointPosts {
    constructor(private container: HTMLElement, map: LeafletMap, markers: MarkerClusterGroup) {
        this.listenForPostsAdded();
    }

    private listenForPostsAdded() {
        this.container.addEventListener('postsAdded', (e: Event) => {
            const customEvent = e as CustomEvent;
            console.log(customEvent.detail)
            if (customEvent.detail && customEvent.detail.length > 0) {
            }
        });
    }
}

export default AddEndpointPosts;