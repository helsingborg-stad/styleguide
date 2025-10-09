import L, { Layer, Map as LeafletMap, Marker } from 'leaflet';

export function zoomToMarker(marker: Marker | undefined, map: LeafletMap | undefined = undefined, markers: Marker[] | undefined = undefined) {
    if (marker && (marker as any).__parent) {

        if (map && markers) {
            markers.forEach((m) => {
                if (m === marker) {
                    console.log("runs");
                    map.flyTo(marker.getLatLng(), 16, {
                        animate: true,
                        duration: 1
                    });
                }
            });
        }

        setTimeout(function () {
            marker.openPopup();
        }, 300);
    }
}