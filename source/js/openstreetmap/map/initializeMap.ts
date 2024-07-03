import L, { Layer, Map as LeafletMap, Marker, MarkerClusterGroup } from 'leaflet';
import 'leaflet.markercluster';
class InitializeOsm {
    constructor(private container: HTMLElement) {
    }

    public create(): [LeafletMap, MarkerClusterGroup] {
        const id = this.container.getAttribute('data-js-map-id') ?? "";
        
        const map = L.map(`openstreetmap__map-${id}`, {
            scrollWheelZoom: false,
            keyboard: false,
            attributionControl: false,
        });

        const markers = L.markerClusterGroup({
            showCoverageOnHover: false,
            removeOutsideVisibleBounds: true,
            maxClusterRadius: 50,
        });

        L.control.attribution({
            position: 'topleft'
        }).addTo(map);

        return [map as LeafletMap, markers as MarkerClusterGroup];
    }
}

export default InitializeOsm;