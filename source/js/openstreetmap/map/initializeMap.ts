import L, { Map as LeafletMap, Marker } from 'leaflet';
class InitializeOsm {
    constructor(private container: HTMLElement) {}

    public create(): [LeafletMap, Marker[]] {
        const id = this.container.getAttribute('data-js-map-id') ?? "";
        const map = L.map(`openstreetmap__map-${id}`, {
            scrollWheelZoom: false,
            keyboard: false,
            attributionControl: false,
        });
        const markers: Marker[] = [];
        return [map as LeafletMap, markers];
    }
}

export default InitializeOsm;