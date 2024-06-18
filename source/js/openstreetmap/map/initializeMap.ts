import L, { Layer, Map as LeafletMap, Marker, MarkerClusterGroup } from 'leaflet';

class InitializeOsm {
    constructor(private container: HTMLElement) {
    }

    public start(): [LeafletMap, MarkerClusterGroup] {
        const id = this.container.getAttribute('data-js-map-id') ?? "";

        const map = L.map(`openstreetmap__map-${id}`, {
            scrollWheelZoom: false,
            keyboard: false,
        });

        const markers = L.markerClusterGroup({
            maxClusterRadius: 50,
        });

        return [map as LeafletMap, markers as MarkerClusterGroup];
    }
}

export default InitializeOsm;