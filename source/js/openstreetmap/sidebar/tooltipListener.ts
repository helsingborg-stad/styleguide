import { Map as LeafletMap, MarkerClusterGroup } from 'leaflet';

class TooltipListener {
    constructor(private container: HTMLElement, private map: LeafletMap, private markers: MarkerClusterGroup) {
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