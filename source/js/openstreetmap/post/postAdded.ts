import L, { Layer, Map as LeafletMap, Marker, MarkerClusterGroup } from 'leaflet';
import AddMarkersFromLocations from '../map/addMarkersFromLocation';
import { getElementJSONLocation, getMarkerDataFromElement } from '../helpers/osmHelpers';

class PostAdded {
    constructor(
        private container: HTMLElement, 
        private map: LeafletMap, 
        private markers: MarkerClusterGroup, 
        private addMarkersFromLocationInstance: AddMarkersFromLocations
    ) {
        this.listenForPostAdded();
    }

    private listenForPostAdded() {
        this.container.addEventListener('postAdded', (e: Event) => {
            const customEvent = e as CustomEvent;
            const locationElement = customEvent.detail.querySelector('[data-js-map-location]');
            if (locationElement) {
                const markerData = getMarkerDataFromElement(locationElement);
                this.addMarkersFromLocationInstance.add([markerData]);
            }
        });
    }
}

export default PostAdded;