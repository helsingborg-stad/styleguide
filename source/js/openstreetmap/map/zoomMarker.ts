import L, { Layer, Map as LeafletMap, Marker } from 'leaflet';

class ZoomMarker {
    constructor(private map: LeafletMap, private markers: Marker[]) {
    }

    public zoom(marker: Marker) {
        this.map.flyTo(marker.getLatLng(), 16, {
            animate: true,
            duration: 1
        });

        setTimeout(function () {
            marker.openPopup();
        }, 1200);
    }
}

export default ZoomMarker;