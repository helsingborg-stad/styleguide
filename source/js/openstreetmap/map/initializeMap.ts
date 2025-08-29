import L, { Map as LeafletMap, MarkerClusterGroup } from 'leaflet';
import { addMarkerClusterToLeaflet } from 'leaflet.markercluster.factory.init';
class InitializeOsm {
    private leaflet: typeof L;

    constructor(private container: HTMLElement) {
        this.leaflet = addMarkerClusterToLeaflet(L);
    }

    public create(): [LeafletMap, MarkerClusterGroup] {
        const id = this.container.getAttribute('data-js-map-id') ?? "";

        const map = this.leaflet.map(`openstreetmap__map-${id}`, {
            scrollWheelZoom: false,
            keyboard: false,
            attributionControl: false,
        });

        const markers = this.leaflet.markerClusterGroup({
            showCoverageOnHover: false,
            removeOutsideVisibleBounds: true,
            maxClusterRadius: 50,
        });

        return [map as LeafletMap, markers as MarkerClusterGroup];
    }
}

export default InitializeOsm;