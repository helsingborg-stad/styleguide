import { Map as LeafletMap, Marker } from 'leaflet';

class TooltipListener {

    constructor(private container: HTMLElement, private map: LeafletMap, private markers: Marker[]) {
        this.container = container;
        this.map = map;
        this.markers = markers;
        this.popupOpened();
    }
    private popupOpened() {
        const popup = this.container.querySelector('.leaflet-popup-pane');
        popup?.addEventListener('click', (e) => {
            const shouldOpenPost = (e.target as HTMLElement).getAttribute('data-js-osm-id');
            if (!shouldOpenPost) return;
            const post = this.container.querySelector(`#${shouldOpenPost}`);
            if (post) {
                (post as HTMLElement).click();
            }
        });
    }
}

export default TooltipListener;