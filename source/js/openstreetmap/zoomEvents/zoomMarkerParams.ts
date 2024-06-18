import L, { Layer, Map as LeafletMap, Marker, MarkerClusterGroup } from 'leaflet';
import { getCoordinatesFromURLSearchParams } from '../helpers/osmHelpers';
import { zoomToMarker } from '../map/zoomToMarker';

class ZoomMarkerParams {
    constructor(private container: HTMLElement, private markers: MarkerClusterGroup) {
        const params = getCoordinatesFromURLSearchParams();
        
        if (params) {
            this.zoom(params);
        }
    }

    private zoom(params: { lat: string, lng: string }) {
        this.markers.getLayers().forEach(layer => {
            if (layer instanceof Marker) {
                const marker = layer as Marker;
                const latLng = marker.getLatLng();
                if (latLng && latLng.lat.toString() == params.lat && latLng.lng.toString() == params.lng) {
                    zoomToMarker(marker, this.container);
                }
            }
        });
    }
}

export default ZoomMarkerParams;